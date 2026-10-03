import type {
  DayAvailability, PublicClubInfo, PublicPlan, PublicProduct,
  TrialBookingInput, TrialBookingResult,
} from "@/types/publicSite.types";
import {
  CLUB_INFO, PLANS, SHOP_PRODUCTS, getWeeklyAvailability,
} from "@/mock/publicSiteMockData";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

/* ============================================================
   Public
   ============================================================ */

export async function fetchClubInfo(): Promise<PublicClubInfo> {
  // const res = await fetch(`${API}/public/club`);
  // return res.json();
  return Promise.resolve(CLUB_INFO);
}

export async function fetchPlans(): Promise<PublicPlan[]> {
  // const res = await fetch(`${API}/public/plans`);
  // return res.json();
  return Promise.resolve(PLANS);
}

export async function fetchWeeklyAvailability(): Promise<DayAvailability[]> {
  // const res = await fetch(`${API}/public/availability`);
  // return res.json();
  return Promise.resolve(getWeeklyAvailability());
}

export async function fetchProducts(): Promise<PublicProduct[]> {
  // const res = await fetch(`${API}/public/shop`);
  // return res.json();
  return Promise.resolve(SHOP_PRODUCTS);
}

export async function fetchProduct(id: string): Promise<PublicProduct | null> {
  // const res = await fetch(`${API}/public/shop/${id}`);
  // if (!res.ok) return null;
  // return res.json();
  return Promise.resolve(SHOP_PRODUCTS.find((p) => p.id === id) ?? null);
}

import { submitEnquiry } from "./enquiryService";

export async function submitTrialBooking(
  input: TrialBookingInput
): Promise<TrialBookingResult> {
  const enquiry = await submitEnquiry({
    source: "TrialBooking",
    name: input.name,
    email: input.email,
    phone: input.phone,
    preferredContact: input.preferredContact,
    sportInterest: input.sport,
    planInterest: "Undecided",
    message: `Requested Free Trial for ${input.preferredDate} at ${input.preferredTime}. Note: ${input.message || "None"}`,
  });

  return {
    enquiryId: enquiry.id,
    message: "Thanks! We've received your request and our front desk will get back to you within 24 hours.",
  };
}