import type { Booking, Court, Slot } from "@/types/booking.types";
import { generateStartTimes } from "@/lib/bookingRules";

export const COURTS: Court[] = [
  { id: "ct1", name: "Tennis Court A", sport: "Tennis", surface: "Clay", indoor: false, active: true },
  { id: "ct2", name: "Tennis Court B", sport: "Tennis", surface: "Hard", indoor: false, active: true },
  { id: "ct3", name: "Cricket Net 1",  sport: "Cricket", surface: "Turf", indoor: true,  active: true },
  { id: "ct4", name: "Padel Court 1",  sport: "Padel",   surface: "Glass", indoor: false, active: true },
  { id: "ct5", name: "Badminton Court",sport: "Badminton", surface: "Wood", indoor: true, active: true },
];cd D:\Playnex
git status
git branch

/**
 * Build slots for a court on a given date.
 * Real app: this comes from the API. Mock: we mark some as booked.
 */
export function getSlotsForCourt(courtId: string, date: string): Slot[] {
  const times = generateStartTimes(6, 22);
  return times.map((start, i) => {
    // Deterministic mock "booked" pattern so the UI has real-looking data
    const booked = (i + courtId.length) % 7 === 0;
    const hour = Number(start.split(":")[0]);
    return {
      id: `${courtId}-${date}-${start}`,
      courtId,
      date,
      startTime: start,
      endTime: start.replace(/(\d{2}):(\d{2})/, (_, h, m) => `${String(Number(h) + 1).padStart(2, "0")}:${m}`),
      booked,
      blocked: hour < 6 || hour >= 22,
      socialPlay: false,
    };
  });
}

export const MY_BOOKINGS: Booking[] = [
  {
    id: "b1", userId: "u1", userName: "Dev Joshi", userTier: "Gold",
    courtId: "ct1", courtName: "Tennis Court A", sport: "Tennis",
    date: "2026-10-15", startTime: "18:00", endTime: "19:00", durationMinutes: 60,
    mode: "Standard", participants: [], status: "Confirmed",
    amount: 300, paymentMethod: "UPI", createdAt: "2026-10-10T10:00:00Z",
  },
  {
    id: "b2", userId: "u1", userName: "Dev Joshi", userTier: "Gold",
    courtId: "ct4", courtName: "Padel Court 1", sport: "Padel",
    date: "2026-10-17", startTime: "19:00", endTime: "20:00", durationMinutes: 60,
    mode: "Standard", participants: [], status: "Confirmed",
    amount: 300, paymentMethod: "UPI", createdAt: "2026-10-12T14:00:00Z",
  },
  {
    id: "b3", userId: "u1", userName: "Dev Joshi", userTier: "Gold",
    courtId: "ct2", courtName: "Tennis Court B", sport: "Tennis",
    date: "2026-10-04", startTime: "20:00", endTime: "21:00", durationMinutes: 60,
    mode: "Standard", participants: [], status: "Completed",
    amount: 300, paymentMethod: "UPI", createdAt: "2026-10-01T08:00:00Z",
  },
];