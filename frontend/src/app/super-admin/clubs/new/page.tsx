'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Trophy,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  Info,
} from 'lucide-react';
import { inr, ClubStatus } from '@/lib/mockData';
import { clubsService } from '@/services/clubs.service';

const SPORT_OPTIONS = [
  'Padel',
  'Tennis',
  'Badminton',
  'Cricket',
  'Football',
  'Pickleball',
  'Squash',
  'Swimming',
  'Multi-Sport',
];

export default function AddClubPage() {
  const router = useRouter();

  // Form State
  const [clubName, setClubName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [sport, setSport] = useState('Padel');
  const [location, setLocation] = useState('Ahmedabad, GJ');
  const [address, setAddress] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('Enterprise');
  const [status, setStatus] = useState<ClubStatus>('Active');

  // Admin Account State
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('password123');
  const [adminPhone, setAdminPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Success State
  const [createdClub, setCreatedClub] = useState<{
    id: string;
    clubName: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  } | null>(null);

  // Auto-slugify club name into subdomain
  const handleClubNameChange = (val: string) => {
    setClubName(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSubdomain(slug);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(res);
  };

  const handleCopyCredentials = () => {
    if (!createdClub) return;
    const text = `Playnex Club: ${createdClub.clubName}\nAdmin: ${createdClub.adminName}\nEmail: ${createdClub.adminEmail}\nPassword: ${createdClub.adminPassword}\nLogin: http://localhost:3000/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clubName.trim()) {
      setError('Please provide a Club Name');
      return;
    }
    if (!adminName.trim()) {
      setError('Please provide the Main Admin Name');
      return;
    }
    if (!adminEmail.trim()) {
      setError('Please provide the Main Admin Email');
      return;
    }
    if (!adminPassword || adminPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Call Backend API to create Tenant and Admin User directly in PostgreSQL
      const payload = {
        clubName: clubName.trim(),
        subdomain: subdomain.trim() || clubName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        sport,
        location: location.trim(),
        address: address.trim() || undefined,
        subscriptionPlan,
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
        adminPassword,
        adminPhone: adminPhone.trim() || undefined,
      };

      const res = await clubsService.createClub(payload);

      if (!res || !res.success || !res.data) {
        setError(res?.message || 'Failed to create club. Please check all inputs.');
        setIsSubmitting(false);
        return;
      }

      const created = res.data;

      // 2. Set success state with real database tenant and admin data
      setCreatedClub({
        id: created.id,
        clubName: created.name || clubName.trim(),
        adminName: created.admin?.name || adminName.trim(),
        adminEmail: created.admin?.email || adminEmail.trim(),
        adminPassword,
      });
    } catch (apiErr: any) {
      const errMsg =
        apiErr.response?.data?.message ||
        apiErr.message ||
        'Failed to create club. Please verify your inputs and connection.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted font-medium">
        <Link href="/super-admin/dashboard" className="hover:text-text transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={12} />
        <Link href="/super-admin/clubs" className="hover:text-text transition-colors">
          Clubs
        </Link>
        <ChevronRight size={12} />
        <span className="text-text font-semibold">Add New Club</span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-3">
            <span>Register New Sports Club</span>
            <span className="rounded-full bg-lime/40 px-3 py-1 text-xs font-semibold text-moss">
              Multi-Tenant
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Provision a new sports club tenant and create its primary administrator account.
          </p>
        </div>

        <Link
          href="/super-admin/clubs"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-text hover:bg-sand transition-colors"
        >
          <ArrowLeft size={14} /> Back to Clubs
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2.5">
          <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Success Modal / Banner */}
      {createdClub ? (
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text">Club &amp; Main Admin Created Successfully!</h2>
              <p className="text-xs text-muted">
                {createdClub.clubName} is now active and ready for operations.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-sand/70 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Main Admin Account Credentials
              </span>
              <button
                onClick={handleCopyCredentials}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-moss hover:underline"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted">Administrator Name:</span>
                <p className="font-semibold text-text mt-0.5">{createdClub.adminName}</p>
              </div>
              <div>
                <span className="text-muted">System Role:</span>
                <p className="font-semibold text-emerald-700 mt-0.5">CLUB_OWNER (Primary Admin)</p>
              </div>
              <div>
                <span className="text-muted">Login Work Email:</span>
                <p className="font-mono font-semibold text-text mt-0.5">{createdClub.adminEmail}</p>
              </div>
              <div>
                <span className="text-muted">Password:</span>
                <p className="font-mono font-semibold text-text mt-0.5">{createdClub.adminPassword}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/super-admin/clubs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-moss px-5 py-2.5 text-sm font-semibold text-white hover:bg-mossDark shadow-sm transition-colors"
            >
              <span>View All Clubs</span>
            </Link>

            <button
              onClick={() => {
                setCreatedClub(null);
                setClubName('');
                setSubdomain('');
                setAdminName('');
                setAdminEmail('');
              }}
              className="ml-auto text-xs text-muted hover:text-text font-medium underline"
            >
              Register Another Club
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1: Club Information */}
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-line pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-moss/10 text-moss">
                  <Building2 size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-text">1. Sports Club Details</h2>
                  <p className="text-xs text-muted">
                    General tenant profile, facility categorization, and location.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Club Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clubName}
                    onChange={(e) => handleClubNameChange(e.target.value)}
                    placeholder="e.g. Apex Padel Club"
                    className="h-10 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Subdomain / Slug <span className="text-muted font-normal">(Auto-generated)</span>
                  </label>
                  <div className="flex rounded-xl border border-line bg-sand overflow-hidden">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      placeholder="apex-padel"
                      className="h-10 w-full bg-white px-3 text-sm outline-none placeholder:text-muted"
                    />
                    <span className="flex items-center px-2.5 text-[11px] font-medium text-muted border-l border-line bg-sand shrink-0">
                      .playnex.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Primary Sport Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-moss transition-all"
                  >
                    {SPORT_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    City &amp; State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ahmedabad, GJ"
                    className="h-10 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Subscription Tier
                  </label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value)}
                    className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-moss transition-all"
                  >
                    <option value="Enterprise">Enterprise (Full Modules + Unlimited Staff)</option>
                    <option value="Growth">Growth (Up to 10 Courts)</option>
                    <option value="Standard">Standard (Up to 4 Courts)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Complete Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Shilaj Circle, SP Ring Road, Bodakdev"
                    className="h-10 w-full rounded-xl border border-line bg-white px-3.5 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Main Club Admin Account */}
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-line pb-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime/30 text-ink">
                  <Shield size={18} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-text">2. Main Administrator Account</h2>
                  <p className="text-xs text-muted">
                    This account will be created with the <strong className="text-emerald-700">CLUB_OWNER</strong> role and full management access.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Admin Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Kabir Mehta"
                      className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Official Admin Work Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="e.g. admin@apexpadel.com"
                      className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-text">
                      Initial Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[11px] font-semibold text-moss hover:underline"
                    >
                      Generate Random
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-10 text-sm outline-none font-mono placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1.5">
                    Admin Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="tel"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 98250 12345"
                      className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-moss focus:ring-2 focus:ring-moss/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-sand/50 p-3.5 text-xs text-muted flex items-start gap-2.5">
                <Info size={16} className="text-moss shrink-0 mt-0.5" />
                <p>
                  Upon registration, this admin will immediately be able to log in at{' '}
                  <span className="font-semibold text-text">/login</span> with these credentials and will land directly on the{' '}
                  <strong className="text-text">Club Owner Dashboard</strong>.
                </p>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href="/super-admin/clubs"
                className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-text hover:bg-sand transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-moss px-6 py-2.5 text-sm font-semibold text-white hover:bg-mossDark shadow-sm disabled:opacity-50 transition-colors"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                <span>Create Club &amp; Admin Account</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Card Preview & Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  Live Club Card Preview
                </h3>
                <span className="rounded-full bg-lime/40 px-2 py-0.5 text-[10px] font-semibold text-ink">
                  Directory View
                </span>
              </div>

              {/* Exact replica of the Clubs listing card */}
              <div className="rounded-xl border border-line bg-card p-4 transition-all shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-moss/10 text-moss">
                      <Building2 size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-semibold leading-tight text-text">
                        {clubName || 'Your Club Name'}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted">
                        {sport || 'Selected Sport'}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-lime text-ink">
                    {status}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs text-muted">
                  <MapPin size={12} />{' '}
                  <span className="truncate">{location || 'City, State'}</span>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-text border-t border-line/60 pt-2.5">
                  <User size={12} className="text-muted" />
                  <span className="text-muted">Admin:</span>
                  <span className="font-semibold truncate">
                    {adminName || 'Unassigned'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-xs">
                  <div>
                    <div className="text-[10px] text-muted">Members</div>
                    <div className="mt-0.5 text-sm font-semibold">0</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted">Today</div>
                    <div className="mt-0.5 text-sm font-semibold">0</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted">Month</div>
                    <div className="mt-0.5 text-sm font-semibold">₹ 0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Administrator Account Summary Card */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted border-b border-line pb-2.5">
                Admin Account Snapshot
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Role:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    CLUB_OWNER
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Login Email:</span>
                  <span className="font-mono text-text truncate max-w-[170px]">
                    {adminEmail || 'admin@example.com'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Password:</span>
                  <span className="font-mono text-text">
                    {adminPassword ? '••••••••' : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Plan:</span>
                  <span className="font-medium text-text">{subscriptionPlan}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
