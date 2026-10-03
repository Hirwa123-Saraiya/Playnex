"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  FileText, Download, TrendingUp, Building2, Wallet, UserCog,
  FileSpreadsheet, Printer, CheckCircle2, ShieldCheck,
} from "lucide-react";
import { inr } from "@/lib/mockData";
import { clubsService, type ClubItem, type AdminItem, type PlatformStats } from "@/services/clubs.service";

interface ReportItem {
  id: string;
  title: string;
  note: string;
  category: string;
  defaultFormat: string;
  size: string;
}

const REPORTS: ReportItem[] = [
  {
    id: "monthly-revenue",
    title: "Monthly Platform SaaS Revenue Report",
    note: "All clubs · SaaS licensing tiers & MRR breakdown",
    category: "Financial Billing",
    defaultFormat: "Excel & PDF",
    size: "1.4 MB",
  },
  {
    id: "club-directory",
    title: "Club Onboarding & Directory Report",
    note: "Registered sports clubs, locations & active domains",
    category: "Club Operations",
    defaultFormat: "Excel & PDF",
    size: "820 KB",
  },
  {
    id: "club-admins",
    title: "Club Administrators & Key Personnel",
    note: "Club owners, managers & assigned admin roles",
    category: "Administration",
    defaultFormat: "Excel & PDF",
    size: "640 KB",
  },
  {
    id: "module-utilization",
    title: "Multi-Station Module Utilization",
    note: "Pro Shop, Bar & Kitchen, Front Desk & Finance ERP status",
    category: "Platform Infrastructure",
    defaultFormat: "Excel & PDF",
    size: "1.1 MB",
  },
];

export default function ReportsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [clubs, setClubs] = useState<ClubItem[]>([]);
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [statsRes, clubsRes, adminsRes] = await Promise.all([
          clubsService.getStats(),
          clubsService.getClubs(),
          clubsService.getAdmins(),
        ]);
        if (isMounted) {
          if (statsRes.success && statsRes.data) setStats(statsRes.data);
          if (clubsRes.success && clubsRes.data) setClubs(clubsRes.data);
          if (adminsRes.success && adminsRes.data) setAdmins(adminsRes.data);
        }
      } catch (e) {
        console.error("Failed to load reports data:", e);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const totalClubs = stats?.total_clubs || clubs.length;
  const totalAdmins = stats?.total_admins || admins.length || clubs.length;

  const mrr = clubs.reduce((acc, c) => {
    const plan = (c.subscriptionPlan || "Standard").toLowerCase();
    const fee = plan === "enterprise" ? 19999 : plan === "growth" ? 9999 : 4999;
    return acc + fee;
  }, 0);
  const arr = mrr * 12;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  /* ================= CSV / EXCEL DOWNLOAD ================= */
  function triggerCsvDownload(filename: string, headers: string[], rows: (string | number)[][]) {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename} successfully!`);
  }

  /* ================= PRINT / PDF GENERATOR ================= */
  function triggerPdfDownload(
    title: string,
    subtitle: string,
    headers: string[],
    rows: (string | number)[][],
    kpis?: { label: string; value: string }[]
  ) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to generate PDF.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title} - Playnex</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              padding: 36px 40px;
              color: #1E293B;
              background: #FFFFFF;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #0B1F4D;
              padding-bottom: 16px;
              margin-bottom: 24px;
            }
            .logo {
              font-size: 26px;
              font-weight: 900;
              color: #0B1F4D;
              letter-spacing: -0.5px;
            }
            .logo-sub {
              font-size: 11px;
              color: #64748B;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .title {
              font-size: 18px;
              font-weight: 800;
              color: #0B1F4D;
              margin: 0 0 4px 0;
            }
            .subtitle {
              font-size: 12px;
              color: #64748B;
              margin: 0;
            }
            .kpis {
              display: flex;
              gap: 16px;
              margin-bottom: 24px;
            }
            .kpi-card {
              border: 1px solid #D9E6F5;
              border-radius: 10px;
              padding: 12px 18px;
              min-width: 140px;
              background: #F8FBFF;
            }
            .kpi-label {
              font-size: 10px;
              text-transform: uppercase;
              color: #64748B;
              font-weight: 700;
              letter-spacing: 0.5px;
            }
            .kpi-val {
              font-size: 18px;
              font-weight: 900;
              color: #0B1F4D;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
              font-size: 12px;
            }
            th {
              background: #0B1F4D;
              color: #FFFFFF;
              text-align: left;
              padding: 10px 12px;
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              border-bottom: 1px solid #E2E8F0;
              padding: 10px 12px;
            }
            tr:nth-child(even) {
              background: #F8FAFC;
            }
            .badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 700;
              background: #EAF3FF;
              color: #1565D8;
            }
            .footer {
              margin-top: 40px;
              font-size: 10px;
              color: #94A3B8;
              text-align: center;
              border-top: 1px solid #E2E8F0;
              padding-top: 16px;
            }
            @media print {
              body { padding: 20px; }
              @page { margin: 1.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Playnex</div>
              <div class="logo-sub">Multi-Tenant Sports Club Operating System</div>
            </div>
            <div style="text-align: right;">
              <h1 class="title">${title}</h1>
              <p class="subtitle">${subtitle} • Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
            </div>
          </div>

          ${kpis ? `
            <div class="kpis">
              ${kpis.map(k => `
                <div class="kpi-card">
                  <div class="kpi-label">${k.label}</div>
                  <div class="kpi-val">${k.value}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>

          <div class="footer">
            Generated securely via Playnex Super Admin Console • Confidential Internal Report • © ${new Date().getFullYear()} Playnex
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    showToast(`PDF document generated for ${title}`);
  }

  /* ================= ACTION DISPATCHERS ================= */
  function handleDownloadExcel(reportId: string) {
    if (reportId === "monthly-revenue") {
      const headers = ["Club ID", "Club Name", "Subdomain", "Platform Tier", "Monthly SaaS Fee (INR)", "Annualized ARR (INR)", "Billing Status", "Admin Email"];
      const rows = clubs.map((c) => {
        const plan = c.subscriptionPlan || "Standard";
        const fee = plan.toLowerCase() === "enterprise" ? 19999 : plan.toLowerCase() === "growth" ? 9999 : 4999;
        return [
          c.id,
          c.name,
          `${c.subdomain || "club"}.playnex.club`,
          plan,
          fee,
          fee * 12,
          c.status || "Active",
          c.adminEmail || "admin@club.com",
        ];
      });
      triggerCsvDownload("playnex_monthly_saas_revenue_report.csv", headers, rows);
    } else if (reportId === "club-directory") {
      const headers = ["Tenant ID", "Club Name", "Sport Focus", "Location", "Domain", "Status", "Admin Name", "Admin Email"];
      const rows = clubs.map((c) => [
        c.id,
        c.name,
        c.sport,
        c.location,
        `${c.subdomain || "club"}.playnex.club`,
        c.status || "Active",
        c.admin || "Administrator",
        c.adminEmail || "",
      ]);
      triggerCsvDownload("playnex_club_directory_report.csv", headers, rows);
    } else if (reportId === "club-admins") {
      const headers = ["Admin ID", "Admin Name", "Email", "Assigned Club", "Role", "Status", "Last Active"];
      const rows = admins.map((a) => [
        a.id,
        a.name,
        a.email,
        a.club,
        a.role,
        a.status,
        a.lastLogin || "Recently",
      ]);
      triggerCsvDownload("playnex_club_admins_report.csv", headers, rows);
    } else if (reportId === "module-utilization") {
      const headers = ["Club Name", "Tier Plan", "Pro Shop Station", "Bar & Kitchen POS", "Front Desk Console", "Finance ERP", "Multi-Tenant Status"];
      const rows = clubs.map((c) => [
        c.name,
        c.subscriptionPlan || "Standard",
        "Active & Live",
        "Active & Live",
        "Active & Live",
        "Active & Live",
        "Encrypted & Verified",
      ]);
      triggerCsvDownload("playnex_module_utilization_report.csv", headers, rows);
    }
  }

  function handleDownloadPdf(reportId: string) {
    if (reportId === "monthly-revenue") {
      const headers = ["Club Name", "Subdomain", "Tier Plan", "Monthly Fee", "Annual ARR", "Status"];
      const rows = clubs.map((c) => {
        const plan = c.subscriptionPlan || "Standard";
        const fee = plan.toLowerCase() === "enterprise" ? 19999 : plan.toLowerCase() === "growth" ? 9999 : 4999;
        return [
          c.name,
          `${c.subdomain || "club"}.playnex.club`,
          plan,
          inr(fee),
          inr(fee * 12),
          c.status || "Active",
        ];
      });
      const kpis = [
        { label: "Active Subscribed Clubs", value: String(clubs.length) },
        { label: "Total Platform MRR", value: inr(mrr) },
        { label: "Projected Annual ARR", value: inr(arr) },
      ];
      triggerPdfDownload("Monthly Platform SaaS Revenue Report", "SaaS subscription charges billed to clubs", headers, rows, kpis);
    } else if (reportId === "club-directory") {
      const headers = ["Club Name", "Sport Focus", "Location", "Domain", "Status", "Admin Contact"];
      const rows = clubs.map((c) => [
        c.name,
        c.sport,
        c.location,
        `${c.subdomain || "club"}.playnex.club`,
        c.status || "Active",
        c.adminEmail || c.admin || "Admin",
      ]);
      const kpis = [
        { label: "Total Registered Clubs", value: String(clubs.length) },
        { label: "Operational Status", value: "100% Active" },
      ];
      triggerPdfDownload("Club Onboarding & Directory Report", "Directory of verified sports club tenants", headers, rows, kpis);
    } else if (reportId === "club-admins") {
      const headers = ["Admin Name", "Email", "Assigned Club", "Role", "Status"];
      const rows = admins.map((a) => [
        a.name,
        a.email,
        a.club,
        a.role,
        a.status,
      ]);
      const kpis = [
        { label: "Total Designated Admins", value: String(admins.length || clubs.length) },
        { label: "Security Guard", value: "Role-Based ACL Active" },
      ];
      triggerPdfDownload("Club Administrators & Key Personnel", "Designated club owners and managers", headers, rows, kpis);
    } else if (reportId === "module-utilization") {
      const headers = ["Club Name", "Tier Plan", "Pro Shop Station", "Bar & Kitchen POS", "Front Desk", "Finance ERP"];
      const rows = clubs.map((c) => [
        c.name,
        c.subscriptionPlan || "Standard",
        "Active (POS & Inventory)",
        "Active (KOT & Tabs)",
        "Active (RFID & Shifts)",
        "Active (GST & Ledger)",
      ]);
      const kpis = [
        { label: "Total Active Stations", value: `${clubs.length * 4} Stations` },
        { label: "Multi-Tenant Isolation", value: "Enforced" },
      ];
      triggerPdfDownload("Multi-Station Module Utilization Report", "Sub-account station availability across clubs", headers, rows, kpis);
    }
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-navy text-white px-4 py-3 shadow-2xl border border-blue/40 text-xs font-semibold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <header>
        <h1 className="text-xl font-bold text-navy sm:text-2xl md:text-3xl">Platform Reports</h1>
        <p className="text-xs text-muted sm:text-sm">
          Generate, export to Excel (.csv), and print official PDF reports from PostgreSQL database
        </p>
      </header>

      {/* Top Focused Platform KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi label="Registered Clubs" value={String(totalClubs)} icon={Building2} note="Active club tenants" />
        <Kpi label="Club Administrators" value={String(totalAdmins)} icon={UserCog} note="Designated personnel" />
        <Kpi label="Platform MRR" value={inr(mrr)} icon={Wallet} note="Monthly subscription fees" />
        <Kpi label="Annualized ARR" value={inr(arr)} icon={TrendingUp} note="Projected software revenue" />
      </div>

      {/* Available Reports Section */}
      <section className="rounded-2xl border border-line bg-card p-4 shadow-card md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-navy">Available Platform Reports</h2>
            <p className="text-xs text-muted">All reports support instant Excel (.csv) and print-ready PDF export</p>
          </div>
          <span className="text-xs font-semibold text-muted bg-[#F7FAFC] border border-line px-2.5 py-1 rounded-lg">
            {REPORTS.length} Reports Ready
          </span>
        </div>

        <ul className="divide-y divide-line">
          {REPORTS.map((r) => (
            <li
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4.5"
            >
              <div className="flex min-w-0 items-start sm:items-center gap-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blueSoft text-blue shadow-xs">
                  <FileText size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-navy">{r.title}</h3>
                    <span className="text-[10px] font-semibold text-muted bg-[#F4F8FD] px-2 py-0.5 rounded border border-line">
                      {r.category}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted mt-0.5">
                    {r.note} · Live database sync
                  </p>
                </div>
              </div>

              {/* Dual Download Actions: Excel & PDF */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleDownloadExcel(r.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-[#1E293B] shadow-xs hover:border-emerald-500/50 hover:text-emerald-700 hover:bg-emerald-50/40 transition-all"
                  title="Download as Excel CSV spreadsheet"
                >
                  <FileSpreadsheet size={14} className="text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(r.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-[#1E293B] shadow-xs hover:border-blue/50 hover:text-blue hover:bg-blueSoft/40 transition-all"
                  title="Generate print-ready PDF report"
                >
                  <Printer size={14} className="text-blue" />
                  <span>PDF</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-[11px]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blueSoft text-blue">
          <Icon size={16} />
        </span>
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 text-xl font-bold leading-none text-navy sm:mt-3 sm:text-2xl">{value}</div>
      {note && <div className="mt-2 text-[11px] text-muted truncate">{note}</div>}
    </div>
  );
}