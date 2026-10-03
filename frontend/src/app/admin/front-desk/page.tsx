"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

type BookingMode = "MEMBER" | "GUEST";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
};

type Court = {
  id: string;
  name: string;
  sport: string;
  price: number;
};

type Booking = {
  id: string;
  court: string;
  sport: string;
  customer: string;
  type: "MEMBER" | "GUEST";
  start: string;
  end: string;
  status: "BOOKED" | "CHECKED IN";
};

type StaffMember = {
  id: string;
  name: string;
  role: "FRONT DESK" | "COACH" | "CLEANER";
  start: string;
  end: string;
  active: boolean;
};

const MEMBERS: Member[] = [
  { id: "MEM-001", name: "Rahul Mehta", email: "rahul@example.com", phone: "+91 98765 43210", membership: "Premium" },
  { id: "MEM-002", name: "Priya Shah",  email: "priya@example.com", phone: "+91 98765 12345", membership: "Gold" },
  { id: "MEM-003", name: "Arjun Patel", email: "arjun@example.com", phone: "+91 98250 45678", membership: "Premium" },
  { id: "MEM-004", name: "Karan Shah",  email: "karan@example.com", phone: "+91 99090 11223", membership: "Standard" },
];

const COURTS: Court[] = [
  { id: "COURT-001", name: "Court 01", sport: "Badminton", price: 600 },
  { id: "COURT-002", name: "Court 02", sport: "Badminton", price: 600 },
  { id: "COURT-003", name: "Court 03", sport: "Tennis",    price: 1000 },
  { id: "COURT-004", name: "Court 04", sport: "Squash",    price: 800 },
];

const BOOKINGS: Booking[] = [
  { id: "BOOK-001", court: "Court 01", sport: "Badminton", customer: "Rahul Mehta",    type: "MEMBER", start: "09:00", end: "10:00", status: "CHECKED IN" },
  { id: "BOOK-002", court: "Court 01", sport: "Badminton", customer: "Walk-in Guest",  type: "GUEST",  start: "11:00", end: "12:00", status: "BOOKED" },
  { id: "BOOK-003", court: "Court 02", sport: "Badminton", customer: "Priya Shah",     type: "MEMBER", start: "10:00", end: "11:00", status: "BOOKED" },
  { id: "BOOK-004", court: "Court 03", sport: "Tennis",    customer: "Walk-in Guest",  type: "GUEST",  start: "12:00", end: "13:00", status: "BOOKED" },
];

const STAFF: StaffMember[] = [
  { id: "STAFF-001", name: "Aarav Joshi",  role: "FRONT DESK", start: "08:00", end: "16:00", active: true  },
  { id: "STAFF-002", name: "Neha Patel",   role: "COACH",      start: "10:00", end: "18:00", active: true  },
  { id: "STAFF-003", name: "Vikram Singh", role: "CLEANER",    start: "07:00", end: "15:00", active: false },
];

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function isBookingActive(booking: Booking, time: string): boolean {
  const bookingStart = timeToMinutes(booking.start);
  const bookingEnd = timeToMinutes(booking.end);
  const selectedTime = timeToMinutes(time);
  return selectedTime >= bookingStart && selectedTime < bookingEnd;
}

export default function FrontDeskPage() {
  const [bookingMode, setBookingMode] = useState<BookingMode>("MEMBER");
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(COURTS[0].id);
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [duration, setDuration] = useState("60");
  const [activeTab, setActiveTab] = useState<"TIMELINE" | "STAFF">("TIMELINE");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const currentCourt = COURTS.find((court) => court.id === selectedCourt) ?? COURTS[0];

  const filteredMembers = useMemo(() => {
    const search = memberSearch.trim().toLowerCase();
    if (!search) return MEMBERS;
    return MEMBERS.filter(
      (member) =>
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.phone.toLowerCase().includes(search) ||
        member.id.toLowerCase().includes(search)
    );
  }, [memberSearch]);

  const finalPrice =
    bookingMode === "GUEST" ? currentCourt.price * 1.5 : currentCourt.price;

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  function handleModeChange(mode: BookingMode) {
    setBookingMode(mode);
    setSelectedMember(null);
    setMemberSearch("");
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
  }

  function handleBooking() {
    if (bookingMode === "MEMBER") {
      if (!selectedMember) {
        showToast("error", "Please select a member first.");
        return;
      }
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
    window.setTimeout(() => {
      setIsLoading(false);
      showToast(
        "success",
        `Booking created successfully for ₹${finalPrice.toLocaleString("en-IN")}.`
      );
    }, 1000);
  }

  function resetForm() {
    setSelectedMember(null);
    setMemberSearch("");
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
                    {filteredMembers.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted">No member found</div>
                    ) : (
                      filteredMembers.map((member) => (
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
                                {member.id} • {member.membership}
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
                      <p className="truncate text-sm font-bold text-navy">
                        {selectedMember.name}
                      </p>
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
                    className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-text outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                  >
                    {COURTS.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name} — {court.sport}
                      </option>
                    ))}
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
                disabled={isLoading}
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
                  <h2 className="mt-1 text-xl font-bold text-navy">
                    Club Management Grid
                  </h2>
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
                {/* SUMMARY CARDS */}
                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Total Courts</p>
                    <p className="mt-1 text-2xl font-black text-navy">04</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Active Bookings</p>
                    <p className="mt-1 text-2xl font-black text-navy">{BOOKINGS.length}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Walk-Ins</p>
                    <p className="mt-1 text-2xl font-black text-amber-600">
                      {BOOKINGS.filter((b) => b.type === "GUEST").length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-4">
                    <p className="text-xs text-muted">Checked In</p>
                    <p className="mt-1 text-2xl font-black text-emerald-600">
                      {BOOKINGS.filter((b) => b.status === "CHECKED IN").length}
                    </p>
                  </div>
                </div>

                {/* TIMELINE GRID */}
                <div className="overflow-x-auto rounded-xl border border-line">
                  <div className="min-w-[1000px]">
                    {/* TIME HEADER */}
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

                      {/* COURT ROWS */}
                      {COURTS.map((court) => (
                        <div key={court.id} className="contents">
                          <div className="border-r border-t border-line bg-white p-4">
                            <p className="text-sm font-bold text-navy">{court.name}</p>
                            <p className="mt-1 text-[10px] uppercase text-muted">
                              {court.sport}
                            </p>
                          </div>

                          {TIME_SLOTS.map((time) => {
                            const booking = BOOKINGS.find(
                              (item) =>
                                item.court === court.name &&
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
                                      {booking.status}
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

                <div className="space-y-3">
                  {STAFF.map((staff) => (
                    <div
                      key={staff.id}
                      className={`rounded-2xl border p-5 ${
                        staff.active
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-line bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                              staff.active
                                ? "bg-emerald-500 text-white"
                                : "bg-page text-muted"
                            }`}
                          >
                            <UserRound size={21} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-navy">{staff.name}</p>
                              {staff.active && (
                                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase text-emerald-700">
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted">{staff.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-line bg-page px-4 py-3">
                          <Clock3 size={15} className="text-muted" />
                          <span className="text-sm font-semibold text-navy">
                            {staff.start} — {staff.end}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* SECURITY FOOTER */}
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
              toast.type === "success"
                ? "border-emerald-200 bg-white"
                : "border-rose-200 bg-white"
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