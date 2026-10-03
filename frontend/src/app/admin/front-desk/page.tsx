"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  WalkieTalkie,
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
  {
    id: "MEM-001",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    membership: "Premium",
  },
  {
    id: "MEM-002",
    name: "Priya Shah",
    email: "priya@example.com",
    phone: "+91 98765 12345",
    membership: "Gold",
  },
  {
    id: "MEM-003",
    name: "Arjun Patel",
    email: "arjun@example.com",
    phone: "+91 98250 45678",
    membership: "Premium",
  },
  {
    id: "MEM-004",
    name: "Karan Shah",
    email: "karan@example.com",
    phone: "+91 99090 11223",
    membership: "Standard",
  },
];

const COURTS: Court[] = [
  {
    id: "COURT-001",
    name: "Court 01",
    sport: "Badminton",
    price: 600,
  },
  {
    id: "COURT-002",
    name: "Court 02",
    sport: "Badminton",
    price: 600,
  },
  {
    id: "COURT-003",
    name: "Court 03",
    sport: "Tennis",
    price: 1000,
  },
  {
    id: "COURT-004",
    name: "Court 04",
    sport: "Squash",
    price: 800,
  },
];

const BOOKINGS: Booking[] = [
  {
    id: "BOOK-001",
    court: "Court 01",
    sport: "Badminton",
    customer: "Rahul Mehta",
    type: "MEMBER",
    start: "09:00",
    end: "10:00",
    status: "CHECKED IN",
  },
  {
    id: "BOOK-002",
    court: "Court 01",
    sport: "Badminton",
    customer: "Walk-in Guest",
    type: "GUEST",
    start: "11:00",
    end: "12:00",
    status: "BOOKED",
  },
  {
    id: "BOOK-003",
    court: "Court 02",
    sport: "Badminton",
    customer: "Priya Shah",
    type: "MEMBER",
    start: "10:00",
    end: "11:00",
    status: "BOOKED",
  },
  {
    id: "BOOK-004",
    court: "Court 03",
    sport: "Tennis",
    customer: "Walk-in Guest",
    type: "GUEST",
    start: "12:00",
    end: "13:00",
    status: "BOOKED",
  },
];

const STAFF: StaffMember[] = [
  {
    id: "STAFF-001",
    name: "Aarav Joshi",
    role: "FRONT DESK",
    start: "08:00",
    end: "16:00",
    active: true,
  },
  {
    id: "STAFF-002",
    name: "Neha Patel",
    role: "COACH",
    start: "10:00",
    end: "18:00",
    active: true,
  },
  {
    id: "STAFF-003",
    name: "Vikram Singh",
    role: "CLEANER",
    start: "07:00",
    end: "15:00",
    active: false,
  },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function isBookingActive(
  booking: Booking,
  time: string
): boolean {
  const bookingStart = timeToMinutes(booking.start);
  const bookingEnd = timeToMinutes(booking.end);
  const selectedTime = timeToMinutes(time);

  return (
    selectedTime >= bookingStart &&
    selectedTime < bookingEnd
  );
}

export default function FrontDeskPage() {
  const [bookingMode, setBookingMode] =
    useState<BookingMode>("MEMBER");

  const [memberSearch, setMemberSearch] =
    useState("");

  const [selectedMember, setSelectedMember] =
    useState<Member | null>(null);

  const [guestName, setGuestName] =
    useState("");

  const [guestPhone, setGuestPhone] =
    useState("");

  const [guestEmail, setGuestEmail] =
    useState("");

  const [selectedCourt, setSelectedCourt] =
    useState(COURTS[0].id);

  const [selectedTime, setSelectedTime] =
    useState("10:00");

  const [duration, setDuration] =
    useState("60");

  const [activeTab, setActiveTab] =
    useState<"TIMELINE" | "STAFF">("TIMELINE");

  const [isLoading, setIsLoading] =
    useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentCourt =
    COURTS.find(
      (court) => court.id === selectedCourt
    ) ?? COURTS[0];

  const filteredMembers = useMemo(() => {
    const search = memberSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return MEMBERS;
    }

    return MEMBERS.filter(
      (member) =>
        member.name
          .toLowerCase()
          .includes(search) ||
        member.email
          .toLowerCase()
          .includes(search) ||
        member.phone
          .toLowerCase()
          .includes(search) ||
        member.id
          .toLowerCase()
          .includes(search)
    );
  }, [memberSearch]);

  const finalPrice =
    bookingMode === "GUEST"
      ? currentCourt.price * 1.5
      : currentCourt.price;

  function showToast(
    type: "success" | "error",
    message: string
  ) {
    setToast({
      type,
      message,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 4000);
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
        showToast(
          "error",
          "Please select a member first."
        );

        return;
      }
    }

    if (bookingMode === "GUEST") {
      if (!guestName.trim()) {
        showToast(
          "error",
          "Please enter the guest name."
        );

        return;
      }

      if (!guestPhone.trim()) {
        showToast(
          "error",
          "Please enter the guest phone number."
        );

        return;
      }
    }

    setIsLoading(true);

    /*
     * FRONTEND DEMO ONLY
     *
     * Later this function will call your Node.js backend:
     *
     * POST /api/front-desk/bookings
     */

    window.setTimeout(() => {
      setIsLoading(false);

      showToast(
        "success",
        `Booking created successfully for ₹${finalPrice.toLocaleString(
          "en-IN"
        )}.`
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
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ===================================================== */}
      {/* PAGE CONTAINER */}
      {/* ===================================================== */}

      <div className="mx-auto max-w-[1800px] p-4 sm:p-6 lg:p-8">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                <ShieldCheck
                  size={25}
                  strokeWidth={2.5}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                  The Champions Club
                </p>

                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  Front Desk Command Center
                </h1>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Operator
                </p>

                <p className="text-sm font-semibold">
                  Front Desk Admin
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">

                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs font-bold text-emerald-300">
                  SYSTEM ONLINE
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* ===================================================== */}
        {/* MAIN LAYOUT */}
        {/* ===================================================== */}

        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">

          {/* ================================================= */}
          {/* LEFT — BOOKING FORM */}
          {/* ================================================= */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CalendarDays
                    size={20}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="font-bold">
                    Quick Booking
                  </h2>

                  <p className="text-xs text-slate-500">
                    Phone & walk-in reservations
                  </p>
                </div>

              </div>

            </div>

            <div className="space-y-6 p-6">

              {/* CUSTOMER TYPE */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer Type
                </label>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1">

                  <button
                    type="button"
                    onClick={() =>
                      handleModeChange("MEMBER")
                    }
                    className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                      bookingMode === "MEMBER"
                        ? "bg-emerald-500 text-slate-950"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Member
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleModeChange("GUEST")
                    }
                    className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                      bookingMode === "GUEST"
                        ? "bg-orange-500 text-white"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    Walk-In
                  </button>

                </div>

              </div>

              {/* MEMBER LOOKUP */}

              {bookingMode === "MEMBER" && (
                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Member Lookup
                  </label>

                  <div className="relative">

                    <Search
                      size={17}
                      className="absolute left-3 top-3.5 text-slate-500"
                    />

                    <input
                      value={memberSearch}
                      onChange={(event) =>
                        setMemberSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search member..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                    />

                  </div>

                  <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">

                    {filteredMembers.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No member found
                      </div>
                    ) : (
                      filteredMembers.map(
                        (member) => (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() =>
                              setSelectedMember(
                                member
                              )
                            }
                            className={`w-full border-b border-slate-800 p-3 text-left transition last:border-b-0 hover:bg-slate-900 ${
                              selectedMember?.id ===
                              member.id
                                ? "bg-emerald-500/10"
                                : ""
                            }`}
                          >

                            <div className="flex items-center justify-between">

                              <div>

                                <p className="text-sm font-bold">
                                  {member.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {member.id} •{" "}
                                  {member.membership}
                                </p>

                              </div>

                              {selectedMember?.id ===
                                member.id && (
                                <CheckCircle2
                                  size={18}
                                  className="text-emerald-400"
                                />
                              )}

                            </div>

                          </button>
                        )
                      )
                    )}

                  </div>

                </div>
              )}

              {/* SELECTED MEMBER */}

              {bookingMode === "MEMBER" &&
                selectedMember && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-bold">
                          {selectedMember.name}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {selectedMember.phone}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedMember(null)
                        }
                        className="text-slate-500 hover:text-white"
                      >
                        <X size={17} />
                      </button>

                    </div>

                  </div>
                )}

              {/* GUEST FORM */}

              {bookingMode === "GUEST" && (
                <div className="space-y-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">

                  <div className="flex gap-3">

                    <WalkieTalkie
                      size={19}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />

                    <div>
                      <p className="text-sm font-bold text-orange-300">
                        Guest Checkout
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        No member account is required.
                      </p>
                    </div>

                  </div>

                  <input
                    value={guestName}
                    onChange={(event) =>
                      setGuestName(
                        event.target.value
                      )
                    }
                    placeholder="Guest full name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-orange-500"
                  />

                  <input
                    value={guestPhone}
                    onChange={(event) =>
                      setGuestPhone(
                        event.target.value
                      )
                    }
                    placeholder="Phone number"
                    inputMode="tel"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-orange-500"
                  />

                  <input
                    value={guestEmail}
                    onChange={(event) =>
                      setGuestEmail(
                        event.target.value
                      )
                    }
                    placeholder="Email address (optional)"
                    type="email"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-orange-500"
                  />

                </div>
              )}

              {/* COURT */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Court
                </label>

                <div className="relative">

                  <select
                    value={selectedCourt}
                    onChange={(event) =>
                      setSelectedCourt(
                        event.target.value
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    {COURTS.map(
                      (court) => (
                        <option
                          key={court.id}
                          value={court.id}
                        >
                          {court.name} —{" "}
                          {court.sport}
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
                  />

                </div>

              </div>

              {/* TIME */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(event) =>
                      setSelectedTime(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Duration
                  </label>

                  <div className="relative">

                    <select
                      value={duration}
                      onChange={(event) =>
                        setDuration(
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    >
                      <option value="30">
                        30 minutes
                      </option>

                      <option value="60">
                        60 minutes
                      </option>

                      <option value="90">
                        90 minutes
                      </option>

                      <option value="120">
                        120 minutes
                      </option>
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
                    />

                  </div>

                </div>

              </div>

              {/* PRICE */}

              <div
                className={`rounded-2xl border p-5 ${
                  bookingMode === "GUEST"
                    ? "border-orange-500/30 bg-orange-500/10"
                    : "border-emerald-500/30 bg-emerald-500/10"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Price Preview
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      ₹
                      {finalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                      bookingMode === "GUEST"
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {bookingMode === "GUEST"
                      ? "1.5× Guest Rate"
                      : "Member Rate"}
                  </div>

                </div>

                {bookingMode === "GUEST" && (
                  <p className="mt-3 text-xs leading-5 text-orange-200/60">
                    Guest bookings automatically receive the configured premium rate.
                  </p>
                )}

              </div>

              {/* BOOK BUTTON */}

              <button
                type="button"
                disabled={isLoading}
                onClick={handleBooking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Creating Booking...
                  </>
                ) : (
                  <>
                    {bookingMode === "GUEST" ? (
                      <WalkieTalkie size={18} />
                    ) : (
                      <Phone size={18} />
                    )}

                    Confirm Booking
                  </>
                )}

              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-white"
              >
                Clear Form
              </button>

            </div>

          </section>

          {/* ================================================= */}
          {/* RIGHT — MANAGEMENT GRID */}
          {/* ================================================= */}

          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* RIGHT HEADER */}

            <div className="border-b border-slate-800 p-5">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Operations
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Club Management Grid
                  </h2>

                </div>

                <div className="flex rounded-xl bg-slate-950 p-1">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "TIMELINE"
                      )
                    }
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      activeTab === "TIMELINE"
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    Court Timeline
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("STAFF")
                    }
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                      activeTab === "STAFF"
                        ? "bg-slate-800 text-white"
                        : "text-slate-500 hover:text-white"
                    }`}
                  >
                    Staff Roster
                  </button>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* TIMELINE TAB */}
            {/* ================================================= */}

            {activeTab === "TIMELINE" && (
              <div className="p-5">

                {/* SUMMARY CARDS */}

                <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Total Courts
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      04
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Active Bookings
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {BOOKINGS.length}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Walk-Ins
                    </p>

                    <p className="mt-1 text-2xl font-black text-orange-400">
                      {
                        BOOKINGS.filter(
                          (booking) =>
                            booking.type ===
                            "GUEST"
                        ).length
                      }
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                    <p className="text-xs text-slate-500">
                      Checked In
                    </p>

                    <p className="mt-1 text-2xl font-black text-emerald-400">
                      {
                        BOOKINGS.filter(
                          (booking) =>
                            booking.status ===
                            "CHECKED IN"
                        ).length
                      }
                    </p>

                  </div>

                </div>

                {/* TIMELINE */}

                <div className="overflow-x-auto rounded-xl border border-slate-800">

                  <div className="min-w-[1000px]">

                    {/* TIME HEADER */}

                    <div className="grid grid-cols-[150px_repeat(10,minmax(75px,1fr))] bg-slate-950">

                      <div className="border-r border-slate-800 p-3 text-xs font-bold text-slate-500">
                        COURT
                      </div>

                      {TIME_SLOTS.map(
                        (time) => (
                          <div
                            key={time}
                            className="border-r border-slate-800 p-3 text-center text-[10px] font-bold text-slate-500"
                          >
                            {time}
                          </div>
                        )
                      )}

                      {/* COURTS */}

                      {COURTS.map(
                        (court) => (
                          <div
                            key={court.id}
                            className="contents"
                          >

                            <div className="border-r border-t border-slate-800 bg-slate-950 p-4">

                              <p className="text-sm font-bold">
                                {court.name}
                              </p>

                              <p className="mt-1 text-[10px] uppercase text-slate-600">
                                {court.sport}
                              </p>

                            </div>

                            {TIME_SLOTS.map(
                              (time) => {

                                const booking =
                                  BOOKINGS.find(
                                    (item) =>
                                      item.court ===
                                        court.name &&
                                      isBookingActive(
                                        item,
                                        time
                                      )
                                  );

                                return (
                                  <div
                                    key={`${court.id}-${time}`}
                                    className="border-r border-t border-slate-800 p-1"
                                  >

                                    {booking ? (
                                      <div
                                        className={`min-h-[72px] rounded-lg p-2 ${
                                          booking.type ===
                                          "GUEST"
                                            ? "bg-orange-500/15 ring-1 ring-inset ring-orange-500/30"
                                            : "bg-emerald-500/15 ring-1 ring-inset ring-emerald-500/30"
                                        }`}
                                      >

                                        <p
                                          className={`truncate text-[10px] font-bold ${
                                            booking.type ===
                                            "GUEST"
                                              ? "text-orange-300"
                                              : "text-emerald-300"
                                          }`}
                                        >
                                          {
                                            booking.customer
                                          }
                                        </p>

                                        <p className="mt-1 text-[9px] text-slate-500">
                                          {
                                            booking.status
                                          }
                                        </p>

                                      </div>
                                    ) : (
                                      <div className="flex min-h-[72px] items-center justify-center rounded-lg bg-slate-900/40">

                                        <span className="text-[9px] text-slate-700">
                                          OPEN
                                        </span>

                                      </div>
                                    )}

                                  </div>
                                );
                              }
                            )}

                          </div>
                        )
                      )}

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ================================================= */}
            {/* STAFF TAB */}
            {/* ================================================= */}

            {activeTab === "STAFF" && (
              <div className="p-5">

                <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Users
                        size={21}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="font-bold">
                        Today&apos;s Staff Coverage
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Live shift and front-desk availability
                      </p>

                    </div>

                  </div>

                </div>

                <div className="space-y-3">

                  {STAFF.map(
                    (staff) => (
                      <div
                        key={staff.id}
                        className={`rounded-2xl border p-5 ${
                          staff.active
                            ? "border-emerald-500/20 bg-emerald-500/5"
                            : "border-slate-800 bg-slate-950"
                        }`}
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                          <div className="flex items-center gap-4">

                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                staff.active
                                  ? "bg-emerald-500 text-slate-950"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              <UserRound
                                size={21}
                              />
                            </div>

                            <div>

                              <div className="flex items-center gap-2">

                                <p className="font-bold">
                                  {staff.name}
                                </p>

                                {staff.active && (
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase text-emerald-400">

                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                                    Active

                                  </span>
                                )}

                              </div>

                              <p className="mt-1 text-xs text-slate-500">
                                {staff.role}
                              </p>

                            </div>

                          </div>

                          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">

                            <Clock3
                              size={15}
                              className="text-slate-500"
                            />

                            <span className="text-sm font-semibold text-slate-300">
                              {staff.start} —{" "}
                              {staff.end}
                            </span>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

          </section>

        </div>

        {/* ===================================================== */}
        {/* SECURITY FOOTER */}
        {/* ===================================================== */}

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={17}
              className="text-emerald-400"
            />

            <p className="text-xs text-slate-500">
              Front-desk operations are protected by authenticated operator access.
            </p>

          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">

            <span>
              Audit Logging
            </span>

            <span>
              •
            </span>

            <span>
              Secure Booking
            </span>

            <span>
              •
            </span>

            <span>
              Live Operations
            </span>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* TOAST */}
      {/* ===================================================== */}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-40px)] max-w-md">

          <div
            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-950"
                : "border-red-500/30 bg-red-950"
            }`}
          >

            {toast.type === "success" ? (
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
            ) : (
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />
            )}

            <p className="flex-1 text-sm font-medium">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() =>
                setToast(null)
              }
              className="text-slate-500 hover:text-white"
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