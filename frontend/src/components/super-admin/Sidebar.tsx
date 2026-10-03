"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/super-admin/dashboard" },
  { label: "Clubs", href: "/super-admin/clubs" },
  { label: "Club admins", href: "/super-admin/admins" },
  { label: "Users", href: "/super-admin/users" },
  { label: "Revenue", href: "/super-admin/revenue" },
  { label: "Settings", href: "/super-admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex gap-1 overflow-x-auto bg-[#17402B] p-5 text-[#E8EFE9] md:min-h-screen md:w-60 md:flex-col md:overflow-visible">
      <div className="mr-6 whitespace-nowrap text-xl font-bold md:mb-2">Playnex</div>
      <div className="mr-6 hidden text-xs text-[#9DB8A8] md:mb-8 md:block">Super admin</div>
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6F03C] ${
              active ? "bg-[#D6F03C] font-semibold text-[#1B2420]" : "hover:bg-white/10"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </aside>
  );
}