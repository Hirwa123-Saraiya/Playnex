"use client";

import { useMemo, useState, useEffect } from "react";
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
  Check,
  Loader2,
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
  "06:00 PM", "07:00 PM", "08:00 PM"
];

export default function WalkInBookingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

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
    if (firstCourt) {
      setSelectedCourt(firstCourt.id);
    }
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

  if (isConfirmed) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                <Check size={30} strokeWidth={3} />
              </div>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Booking Confirmed</p>
            <h1 className="mt-2 text-3xl font-black">Your court is reserved!</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              The walk-in booking has been successfully created. The guest can use the booking reference at the front desk.
            </p>
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs text-slate-500">Booking Reference</span>
                <span className="font-mono text-sm font-bold text-emerald-400">WLK-2026-00128</span>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Guest</span><span className="text-sm font-semibold">{guestName}</span></div>
                <div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Sport</span><span className="text-sm font-semibold">{currentSport.icon} {currentSport.name}</span></div>
                <div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Court</span><span className="text-right text-sm font-semibold">{currentCourt?.name}</span></div>
                <div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Date</span><span className="text-sm font-semibold">{selectedDate}</span></div>
                <div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Time</span><span className="text-sm font-semibold">{selectedTime}</span></div>
                <div className="flex justify-between gap-4 border-t border-slate-800 pt-4">
                  <span className="text-sm font-bold text-slate-400">Total Paid ({paymentMethod.toUpperCase()})</span>
                  <span className="text-sm font-black text-emerald-400">₹{finalPrice}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsConfirmed(false)} className="mt-8 w-full rounded-xl bg-slate-800 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition-all">
              Book Another Court
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Front-Desk Walk-In Booking</h1>
        <p className="mt-2 text-sm text-slate-400">Reserve slots for walk-in players with auto-applied premium walk-in rates.</p>

        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <UserRound size={18} className="text-emerald-400" /> Guest Contact Profile
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Full Name *</label>
                  <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Guest Player Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Phone Number *</label>
                  <input type="text" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Mobile Contact" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <Users size={18} className="text-emerald-400" /> Select Sport Category
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SPORTS.map((sport) => (
                  <button key={sport.id} onClick={() => handleSportChange(sport.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-bold transition-all ${selectedSport === sport.id ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}>
                    <span className="text-2xl">{sport.icon}</span>
                    {sport.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <CalendarDays size={18} className="text-emerald-400" /> Date & Court Setup
              </h2>
    
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Date</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Available Courts</label>
                  <select 
                    value={selectedCourt} 
                    onChange={(e) => setSelectedCourt(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    {availableCourts.map((court) => (
                      <option key={court.id} value={court.id}>{court.name} ({court.location})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Available Shift Slots</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_SLOTS.map((time) => (
                    <button 
                      key={time} 
                      onClick={() => setSelectedTime(time)} 
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all ${selectedTime === time ? "bg-emerald-500 border-emerald-500 text-slate-950 font-bold" : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div> {/* <-- Closes Calendar Setup Box */}
          </div> {/* <-- Closes Left Column Form Stack */}

          {/* Right Column: Checkout Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-white mb-4">Summary & Billings</h2>
              
              <div className="space-y-4 rounded-xl bg-slate-950 p-4 border border-slate-800/60">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Membership Rate</span>
                  <span className="font-semibold text-slate-300">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Premium Guest Surge</span>
                  <span className="font-semibold text-amber-400">x1.5 Rate</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
                  <span className="font-bold text-slate-400">Total Calculation</span>
                  <span className="font-black text-xl text-emerald-400">₹{finalPrice}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Front-Desk Payment Mode</label>
                <div className="space-y-2">
                  {["cash", "card", "upi"].map((method) => (
                    <label 
                      key={method} 
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold capitalize cursor-pointer transition-all ${paymentMethod === method ? "bg-emerald-500/5 border-emerald-500/40 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-800"}`}
                    >
                      <span className="flex items-center gap-2">{method}</span>
                      <input 
                        type="radio" 
                        name="payment" 
                        value={method} 
                        checked={paymentMethod === method} 
                        onChange={() => setPaymentMethod(method)} 
                        className="accent-emerald-500" 
                      />
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleConfirmBooking} 
                disabled={isLoading} 
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-black py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer"
              >
                {isLoading ? "Processing Fields..." : "Commit Walk-In Reservation"}
              </button>
            </div>
          </div> {/* <-- Closes Sidebar Column */}
        </div> {/* <-- Closes Two-Column Layout Grid */}
      </div> {/* <-- Closes Max Width Shell Container */}
    </main>
  );
}
