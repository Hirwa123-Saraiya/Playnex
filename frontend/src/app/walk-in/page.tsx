"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Check,
  UserRound,
  Users,
} from "lucide-react";

type Sport = {
  id: string;
  name: string;
  icon: string;
  price: number;
};

type Court = {
  id: string;
  name: string;
  sport: string;
  location: string;
};

const SPORTS: Sport[] = [
  { id: "badminton", name: "Badminton", icon: "🏸", price: 600 },
  { id: "tennis", name: "Tennis", icon: "🎾", price: 1000 },
  { id: "football", name: "Football", icon: "⚽", price: 1200 },
  { id: "basketball", name: "Basketball", icon: "🏀", price: 900 },
];

const COURTS: Court[] = [
  { id: "badminton-1", name: "Badminton Court 01", sport: "badminton", location: "Indoor Arena" },
  { id: "badminton-2", name: "Badminton Court 02", sport: "badminton", location: "Indoor Arena" },
  { id: "tennis-1", name: "Tennis Court 01", sport: "tennis", location: "Outdoor Zone" },
  { id: "football-1", name: "Football Ground", sport: "football", location: "Main Ground" },
  { id: "basketball-1", name: "Basketball Court", sport: "basketball", location: "Sports Block" },
];

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM",
];

export default function WalkInBookingPage() {
  const [selectedSport, setSelectedSport] = useState("badminton");
  const [selectedCourt, setSelectedCourt] = useState("badminton-1");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSport = useMemo(() => {
    return SPORTS.find((sport) => sport.id === selectedSport) ?? SPORTS[0];
  }, [selectedSport]);

  const availableCourts = useMemo(() => {
    return COURTS.filter((court) => court.sport === selectedSport);
  }, [selectedSport]);

  const currentCourt = useMemo(() => {
    return COURTS.find((court) => court.id === selectedCourt) ?? availableCourts[0];
  }, [selectedCourt, availableCourts]);

  const guestMultiplier = 1.5;
  const basePrice = currentSport.price;
  const finalPrice = Math.round(basePrice * guestMultiplier * (Number(duration) / 60) * 100) / 100;

  function handleSportChange(sportId: string) {
    setSelectedSport(sportId);
    const firstCourt = COURTS.find((court) => court.sport === sportId);
    if (firstCourt) setSelectedCourt(firstCourt.id);
    setSelectedTime("");
    setError("");
  }

  function handleConfirmBooking() {
    setError("");
    if (!guestName.trim()) return setError("Please enter the guest's full name.");
    if (!guestPhone.trim()) return setError("Please enter the guest's phone number.");
    if (!selectedDate) return setError("Please select a booking date.");
    if (!selectedTime) return setError("Please select a booking time.");
    if (!selectedCourt) return setError("Please select a court.");

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsConfirmed(true);
    }, 1000);
  }

  /* ============================================================
     Success screen
     ============================================================ */
  if (isConfirmed) {
    return (
      <main className="min-h-screen bg-page px-4 py-8 text-text sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-line bg-white p-8 text-center shadow-card sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={30} strokeWidth={3} />
              </div>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue">
              Booking Confirmed
            </p>
            <h1 className="mt-2 text-3xl font-black text-navy">
              Your court is reserved!
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
              The walk-in booking has been successfully created. The guest can use the
              booking reference at the front desk.
            </p>

            <div className="mt-8 rounded-2xl border border-line bg-page p-5 text-left">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <span className="text-xs text-muted">Booking Reference</span>
                <span className="font-mono text-sm font-bold text-blue">
                  WLK-2026-00128
                </span>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted">Guest</span>
                  <span className="text-sm font-semibold text-navy">{guestName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted">Sport</span>
                  <span className="text-sm font-semibold text-navy">
                    {currentSport.icon} {currentSport.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted">Court</span>
                  <span className="text-right text-sm font-semibold text-navy">
                    {currentCourt?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted">Date</span>
                  <span className="text-sm font-semibold text-navy">{selectedDate}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-muted">Time</span>
                  <span className="text-sm font-semibold text-navy">{selectedTime}</span>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-4">
                  <span className="text-sm font-bold text-text">
                    Total Paid ({paymentMethod.toUpperCase()})
                  </span>
                  <span className="text-sm font-black text-blue">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsConfirmed(false)}
              className="mt-8 w-full rounded-xl bg-blue py-3 text-sm font-bold text-white transition-all hover:bg-blueHover"
            >
              Book Another Court
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     Main booking form
     ============================================================ */
  return (
    <main className="min-h-screen bg-page px-4 py-8 text-text sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
          Front-Desk Walk-In Booking
        </h1>
        <p className="mt-2 text-sm text-muted">
          Reserve slots for walk-in players with auto-applied premium walk-in rates.
        </p>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ---------- Left column ---------- */}
          <div className="space-y-6 lg:col-span-2">
            {/* Guest Contact */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy">
                <UserRound size={18} className="text-blue" />
                Guest Contact Profile
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Guest Player Name"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text transition-colors focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Mobile Contact"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text transition-colors focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
                  />
                </div>
              </div>
            </div>

            {/* Sports */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy">
                <Users size={18} className="text-blue" />
                Select Sport Category
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SPORTS.map((sport) => {
                  const active = selectedSport === sport.id;
                  return (
                    <button
                      key={sport.id}
                      onClick={() => handleSportChange(sport.id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-bold transition-all ${
                        active
                          ? "border-blue bg-blueSoft text-blue"
                          : "border-line bg-white text-muted hover:border-blue/40 hover:text-navy"
                      }`}
                    >
                      <span className="text-2xl">{sport.icon}</span>
                      {sport.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Court */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy">
                <CalendarDays size={18} className="text-blue" />
                Date &amp; Court Setup
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text transition-colors focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted">
                    Available Courts
                  </label>
                  <select
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-text transition-colors focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
                  >
                    {availableCourts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name} ({court.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted">
                  Available Shift Slots
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_SLOTS.map((time) => {
                    const active = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-blue bg-blue text-white font-bold"
                            : "border-line bg-white text-text hover:border-blue/40 hover:text-navy"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Right column: checkout ---------- */}
          <div className="space-y-6">
            <div className="sticky top-6 rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="mb-4 text-lg font-bold text-navy">Summary &amp; Billings</h2>

              <div className="space-y-4 rounded-xl border border-line bg-page p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Base Membership Rate</span>
                  <span className="font-semibold text-text">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Premium Guest Surge</span>
                  <span className="font-semibold text-amber-600">x1.5 Rate</span>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-sm">
                  <span className="font-bold text-text">Total Calculation</span>
                  <span className="text-xl font-black text-blue">₹{finalPrice}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted">
                  Front-Desk Payment Mode
                </label>
                <div className="space-y-2">
                  {["cash", "card", "upi"].map((method) => {
                    const active = paymentMethod === method;
                    return (
                      <label
                        key={method}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm font-semibold capitalize transition-all ${
                          active
                            ? "border-blue bg-blueSoft text-blue"
                            : "border-line bg-white text-muted hover:border-blue/40 hover:text-navy"
                        }`}
                      >
                        <span className="flex items-center gap-2">{method}</span>
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={active}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-blue"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue py-4 text-base font-black text-white shadow-md shadow-blue/20 transition-all hover:bg-blueHover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Processing Fields..." : "Commit Walk-In Reservation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}