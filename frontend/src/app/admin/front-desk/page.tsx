"use client";

import { useCallback, useEffect, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  Radio,
  X,
  Loader2,
} from "lucide-react";
import {
  frontDeskService,
  type FrontDeskBooking,
  type FrontDeskCourt,
  type FrontDeskMember,
  type FrontDeskStaff,
} from "@/services/frontDesk.service";

type BookingMode = "MEMBER" | "GUEST";
type TimelineTab = "TIMELINE" | "STAFF";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

const TODAY = new Date().toISOString().slice(0, 10);

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isBookingActive(booking: FrontDeskBooking, time: string): boolean {
  const start = timeToMinutes(booking.startTime.slice(0, 5));
  const end = timeToMinutes(booking.endTime.slice(0, 5));
  const t = timeToMinutes(time);
  return t >= start && t < end;
}

function toDisplayStatus(s: FrontDeskBooking["status"]): "BOOKED" | "CHECKED IN" | "COMPLETED" | "CANCELLED" {
  if (s === "checked_in") return "CHECKED IN";
  if (s === "completed") return "COMPLETED";
  if (s === "cancelled") return "CANCELLED";
  return "BOOKED";
}

export default function FrontDeskPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  /* ---------- Remote data ---------- */
  const [courts, setCourts] = useState<FrontDeskCourt[]>([]);
  const [bookings, setBookings] = useState<FrontDeskBooking[]>([]);
  const [staff, setStaff] = useState<FrontDeskStaff[]>([]);
  const [members, setMembers] = useState<FrontDeskMember[]>([]);

  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  /* ---------- Form state ---------- */
  const [bookingMode, setBookingMode] = useState<BookingMode>("MEMBER");
  const [memberSearch, setMemberSearch] = useState("");
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const [selectedMember, setSelectedMember] = useState<FrontDeskMember | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedCourt, setSelectedCourt] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [duration, setDuration] = useState("60");

  const [activeTab, setActiveTab] = useState<TimelineTab>("TIMELINE");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  /* ---------- Loaders ---------- */
  const loadCourts = useCallback(async () => {
    setLoadingCourts(true);
    try {
      const data = await frontDeskService.getCourts();
      setCourts(data);
      if (data.length > 0) setSelectedCourt(data[0].id);
    } finally {
      setLoadingCourts(false);
    }
  }, []);

  const loadTimeline = useCallback(async () => {
    setLoadingTimeline(true);
    try {
      const data = await frontDeskService.getTimeline(TODAY);
      setBookings(data);
    } finally {
      setLoadingTimeline(false);
    }
  }, []);

  const loadStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const data = await frontDeskService.getStaff(TODAY);
      setStaff(data);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  useEffect(() => {
    loadCourts();
    loadTimeline();
    loadStaff();
  }, [loadCourts, loadTimeline, loadStaff]);

  /* Debounced member search */
  useEffect(() => {
    if (bookingMode !== "MEMBER") return;
    const trimmed = memberSearch.trim();
    if (!trimmed) {
      setMembers([]);
      return;
    }
    setLoadingMembers(true);
    const t = setTimeout(async () => {
      try {
        const data = await frontDeskService.searchMembers(trimmed);
        setMembers(data);
      } finally {
        setLoadingMembers(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [memberSearch, bookingMode]);

  /* ---------- Derived ---------- */
  const currentCourt = courts.find((c) => c.id === selectedCourt);

  const finalPrice = useMemo(() => {
    const rate = currentCourt?.hourlyRate ?? 600;
    const multiplier = bookingMode === "GUEST" ? 1.5 : 1;
    const base = rate * multiplier;
    const dur = Number(duration) / 60;
    return Math.round(base * dur);
  }, [currentCourt, bookingMode, duration]);

  const walkInCount = bookings.filter((b) => b.type === "GUEST").length;
  const checkedInCount = bookings.filter((b) => b.status === "checked_in").length;

  /* ---------- Handlers ---------- */
  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  function handleModeChange(mode: BookingMode) {
    setBookingMode(mode);
    setSelectedMember(null);
    setMemberSearch("");
    setMembers([]);
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
  }

  async function handleBooking() {
    if (!currentCourt) {
      showToast("error", "No courts available.");
      return;
    }
    if (bookingMode === "MEMBER" && !selectedMember) {
      showToast("error", "Please select a member first.");
      return;
    }
    if (bookingMode === "GUEST") {
      if (!guestName.trim()) {
        showToast("error", "Please enter the guest name.");
        return;
      }
      if (!guestPhone.trim()) {
        showToast("error", "Please enter the guest phone number.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await frontDeskService.createWalkIn({
        courtId: currentCourt.id,
        date: TODAY,
        startTime: selectedTime,
        guestName: bookingMode === "GUEST" ? guestName.trim() : undefined,
        guestPhone: bookingMode === "GUEST" ? guestPhone.trim() : undefined,
        guestEmail: bookingMode === "GUEST" ? guestEmail.trim() || undefined : undefined,
        memberId: bookingMode === "MEMBER" ? selectedMember?.id : undefined,
        paymentMethod: "cash",
      });

      if (!res.success) {
        showToast("error", res.message || "Booking failed.");
        return;
      }

      showToast("success", `Booking created for ₹${finalPrice.toLocaleString("en-IN")}.`);
      await loadTimeline();
      resetForm();
    } catch (err: any) {
      showToast("error", err?.message || "Booking failed.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setSelectedMember(null);
    setMemberSearch("");
    setMembers([]);
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
  }

  return (
    <main className="min-h-screen bg-page text-text">
      <div className="mx-auto max-w-[1800px] p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <header className="mb-6 rounded-2xl border border-line bg-white p-5 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue text-white">
                <ShieldCheck size={25} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue">
                  The Champions Club
                </p>
                <h1 className="mt-1 text-xl font-bold text-navy sm:text-2xl">
                  Front Desk Command Center
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-line bg-blueSoft px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted">Operator</p>
                <p className="text-sm font-semibold text-navy">Front Desk Admin</p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">SYSTEM ONLINE</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">

          {/* LEFT — BOOKING FORM */}
          <section className="rounded-2xl border border-line bg-white shadow-card">
            <div className="border-b border-line p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blueSoft">
                  <CalendarDays size={20} className="text-blue" />
                </div>
                <div>
                  <h2 className="font-bold text-navy">Quick Booking</h2>
                  <p className="text-xs text-muted">Phone &amp; walk-in reservations</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">

              {/* CUSTOMER TYPE */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                  Customer Type
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-page p-1">
                  <button
                    type="button"
                    onClick={() => handleModeChange("MEMBER")}
                    className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                      bookingMode === "MEMBER"
                        ? "bg-blue text-white"
                        : "text-muted hover:bg-blueSoft hover:text-navy"
                    }`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange("GUEST")}
                    className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                      bookingMode === "GUEST"
                        ? "bg-amber-500 text-white"
                        : "text-muted hover:bg-blueSoft hover:text-navy"
                    }`}
                  >
                    Walk-In
                  </button>
                </div>
              </div>

              {/* MEMBER LOOKUP */}
              {bookingMode === "MEMBER" && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Member Lookup
                  </label>
                  <div className="relative">
                    <Search size={17} className="absolute left-3 top-3.5 text-muted" />
                    <input
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search member..."
                      className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-sm text-text outline-none transition placeholder:text-muted focus:border-blue focus:ring-2 focus:ring-blue/10"
                    />
                  </div>

                  <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-line bg-white">
                    {loadingMembers ? (
                      <div className="p-4 text-center text-xs text-muted">Searching…</div>
                    ) : members.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted">
                        {memberSearch.trim() ? "No member found" : "Type to search"}
                      </div>
                    ) : (
                      members.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedMember(member)}
                          className={`w-full border-b border-line p-3 text-left transition last:border-b-0 hover:bg-blueSoft ${
                            selectedMember?.id === member.id ? "bg-blueSoft" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-navy">{member.name}</p>
                              <p className="mt-1 text-xs text-muted">
                                {member.id} • {member.membership || member.tier || "Member"}
                              </p>
                            </div>
                            {selectedMember?.id === member.id && (
                              <CheckCircle2 size={18} className="text-blue" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SELECTED MEMBER */}
              {bookingMode === "MEMBER" && selectedMember && (
                <div className="rounded-xl border border-blue/20 bg-blueSoft p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-navy">{selectedMember.name}</p>
                      <p className="truncate text-xs text-muted">{selectedMember.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMember(null)}
                      className="text-muted hover:text-red-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>
              )}

              {/* GUEST FORM */}
              {bookingMode === "GUEST" && (
                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <Radio size={19} className="mt-0.5 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Guest Checkout</p>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        No member account is required.
                      </p>
                    </div>
                  </div>

                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Guest full name"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Phone number"
                    inputMode="tel"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email address (optional)"
                    type="email"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none placeholder:text-muted focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              )}

              {/* COURT */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                  Court
                </label>
                <div className="relative">
                  <select
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                    disabled={loadingCourts || courts.length === 0}
                    className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none focus:border-blue focus:ring-2 focus:ring-blue/10 disabled:opacity-50"
                  >
                    {loadingCourts ? (
                      <option>Loading courts…</option>
                    ) : courts.length === 0 ? (
                      <option>No courts available</option>
                    ) : (
                      courts.map((court) => (
                        <option key={court.id} value={court.id}>
                          {court.name} — {court.sport}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-3.5 text-muted"
                  />
                </div>
              </div>

              {/* TIME + DURATION */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Duration
                  </label>
                  <div className="relative">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-3.5 text-muted"
                    />
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div
                className={`rounded-2xl border p-5 ${
                  bookingMode === "GUEST"
                    ? "border-amber-200 bg-amber-50"
                    : "border-blue/20 bg-blueSoft"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">
                      Price Preview
                    </p>
                    <p className="mt-1 text-3xl font-black text-navy">
                      ₹{finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                      bookingMode === "GUEST"
                        ? "bg-amber-200 text-amber-800"
                        : "bg-blue text-white"
                    }`}
                  >
                    {bookingMode === "GUEST" ? "1.5× Guest Rate" : "Member Rate"}
                  </div>
                </div>

                {bookingMode === "GUEST" && (
                  <p className="mt-3 text-xs leading-5 text-muted">
                    Guest bookings automatically receive the configured premium rate.
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <button
                type="button"
                disabled={isLoading || !currentCourt}
                onClick={handleBooking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue px-5 py-4 text-sm font-black text-white transition hover:bg-blueHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Booking...
                  </>
                ) : (
                  <>
                    {bookingMode === "GUEST" ? <Radio size={18} /> : <Phone size={18} />}
                    Confirm Booking
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl px-4 py-2 text-xs font-semibold text-muted transition hover:text-navy"
              >
                Clear Form
              </button>
            </div>
          </section>

          {/* RIGHT — MANAGEMENT GRID */}
          <section className="min-w-0 rounded-2xl border border-line bg-white shadow-card">
            <div className="border-b border-line p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    Operations
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-navy">Club Management Grid</h2>
                </div>

                <div className="flex rounded-xl bg-page p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("TIMELINE")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      activeTab === "TIMELINE"
                        ? "bg-navy text-white"
                        : "text-muted hover:text-navy"
                    }`}
                  >
                    Court Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("STAFF")}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      activeTab === "STAFF"
                        ? "bg-navy text-white"
                        : "text-muted hover:text-navy"
                    }`}
                  >
                    Staff Roster
                  </button>
                </div>
              </div>
            </div>

            {/* TIMELINE */}
            {activeTab === "TIMELINE" && (
              <div className="p-5">
                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Total Courts</p>
                    <p className="mt-1 text-2xl font-black text-navy">{courts.length}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Active Bookings</p>
                    <p className="mt-1 text-2xl font-black text-navy">{bookings.length}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Walk-Ins</p>
                    <p className="mt-1 text-2xl font-black text-amber-600">{walkInCount}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Checked In</p>
                    <p className="mt-1 text-2xl font-black text-emerald-600">{checkedInCount}</p>
                  </div>
                </div>

                {loadingTimeline ? (
                  <div className="rounded-xl border border-line bg-white p-10 text-center text-sm text-muted">
                    Loading timeline…
                  </div>
                ) : courts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                    No courts configured for this club yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-line">
                    <div className="min-w-[1000px]">
                      <div className="grid grid-cols-[150px_repeat(10,minmax(75px,1fr))] bg-[#F4F8FD]">
                        <div className="border-r border-line p-3 text-xs font-bold text-navy">
                          COURT
                        </div>
                        {TIME_SLOTS.map((time) => (
                          <div
                            key={time}
                            className="border-r border-line p-3 text-center text-[10px] font-bold text-navy"
                          >
                            {time}
                          </div>
                        ))}

                        {courts.map((court) => (
                          <div key={court.id} className="contents">
                            <div className="border-r border-t border-line bg-white p-4">
                              <p className="text-sm font-bold text-navy">{court.name}</p>
                              <p className="mt-1 text-[10px] uppercase text-muted">
                                {court.sport}
                              </p>
                            </div>

                            {TIME_SLOTS.map((time) => {
                              const booking = bookings.find(
                                (item) =>
                                  item.courtId === court.id &&
                                  isBookingActive(item, time)
                              );

                              return (
                                <div
                                  key={`${court.id}-${time}`}
                                  className="border-r border-t border-line p-1"
                                >
                                  {booking ? (
                                    <div
                                      className={`min-h-[72px] rounded-lg p-2 ${
                                        booking.type === "GUEST"
                                          ? "bg-amber-50 ring-1 ring-inset ring-amber-200"
                                          : "bg-emerald-50 ring-1 ring-inset ring-emerald-200"
                                      }`}
                                    >
                                      <p
                                        className={`truncate text-[10px] font-bold ${
                                          booking.type === "GUEST"
                                            ? "text-amber-800"
                                            : "text-emerald-800"
                                        }`}
                                      >
                                        {booking.customer}
                                      </p>
                                      <p className="mt-1 text-[9px] text-muted">
                                        {toDisplayStatus(booking.status)}
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex min-h-[72px] items-center justify-center rounded-lg bg-page">
                                      <span className="text-[9px] text-muted">OPEN</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAFF */}
            {activeTab === "STAFF" && (
              <div className="p-5">
                <div className="mb-5 rounded-2xl border border-blue/20 bg-blueSoft p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue text-white">
                      <Users size={21} />
                    </div>
                    <div>
                      <p className="font-bold text-navy">Today&apos;s Staff Coverage</p>
                      <p className="mt-1 text-xs text-muted">
                        Live shift and front-desk availability
                      </p>
                    </div>
                  </div>
                </div>

                {loadingStaff ? (
                  <div className="rounded-xl border border-line bg-white p-10 text-center text-sm text-muted">
                    Loading staff…
                  </div>
                ) : staff.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">
                    No staff scheduled for today.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staff.map((s) => (
                      <div
                        key={s.id}
                        className={`rounded-2xl border p-5 ${
                          s.active
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-line bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                s.active
                                  ? "bg-emerald-500 text-white"
                                  : "bg-page text-muted"
                              }`}
                            >
                              <UserRound size={21} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-navy">{s.name}</p>
                                {s.active && (
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase text-emerald-700">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-muted">{s.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-4 py-3">
                            <Clock3 size={15} className="text-muted" />
                            <span className="text-sm font-semibold text-navy">
                              {s.start} — {s.end}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* FOOTER */}
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={17} className="text-blue" />
            <p className="text-xs text-muted">
              Front-desk operations are protected by authenticated operator access.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Audit Logging</span>
            <span>•</span>
            <span>Secure Booking</span>
            <span>•</span>
            <span>Live Operations</span>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-40px)] max-w-md">
          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-popover ${
              toast.type === "success" ? "border-emerald-200 bg-white" : "border-rose-200 bg-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />
            )}
            <p className="flex-1 text-sm font-medium text-text">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-muted hover:text-navy"
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}