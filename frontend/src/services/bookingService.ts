import type {
  Booking, Court, CreateBookingInput, Slot,
} from "@/types/booking.types";
import { MY_BOOKINGS, COURTS, getSlotsForCourt } from "@/mock/bookingMockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

/** TODO: replace body with real fetch when backend ready. */
export async function fetchCourts(): Promise<Court[]> {
  // const res = await fetch(`${API}/courts`);
  // return res.json();
  return Promise.resolve(COURTS);
}

export async function fetchSlots(courtId: string, date: string): Promise<Slot[]> {
  // const res = await fetch(`${API}/courts/${courtId}/slots?date=${date}`);
  // return res.json();
  return Promise.resolve(getSlotsForCourt(courtId, date));
}

export async function fetchMyBookings(): Promise<Booking[]> {
  // const res = await fetch(`${API}/bookings/me`, { credentials: "include" });
  // return res.json();
  return Promise.resolve(MY_BOOKINGS);
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // const res = await fetch(`${API}/bookings`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(input),
  //   credentials: "include",
  // });
  // if (!res.ok) throw new Error(await res.text());
  // return res.json();

  // Mock:
  const court = COURTS.find((c) => c.id === input.courtId)!;
  return {
    id: `b-${Date.now()}`,
    userId: "u1",
    userName: input.walkInName ?? "Dev Joshi",
    userTier: input.walkInName ? "WalkIn" : "Gold",
    courtId: court.id,
    courtName: court.name,
    sport: court.sport,
    date: input.date,
    startTime: input.startTime,
    endTime: "",
    durationMinutes: 60,
    mode: input.mode,
    participants: input.participants ?? [],
    status: "Confirmed",
    amount: 300,
    paymentMethod: "UPI",
    createdAt: new Date().toISOString(),
  };
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<void> {
  // await fetch(`${API}/bookings/${bookingId}/cancel`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ reason }),
  //   credentials: "include",
  // });
  return Promise.resolve();
}