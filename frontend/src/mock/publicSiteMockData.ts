import type {
  DayAvailability, DayOfWeek, PublicClubInfo, PublicPlan, PublicProduct,
} from "@/types/publicSite.types";

/* ============================================================
   Club info
   ============================================================ */

export const CLUB_INFO: PublicClubInfo = {
  name: "The Champions Club",
  tagline: "Tennis, Padel, Cricket & Badminton — one home for sport.",
  address: "S.G. Highway, Ahmedabad, Gujarat 380054",
  sports: ["Tennis", "Padel", "Cricket", "Badminton"],
  hours: { open: "06:00", close: "22:00" },
  phone: "+91 79 4000 1234",
  email: "hello@championsclub.in",
};

/* ============================================================
   Plans & pricing
   ============================================================ */

export const PLANS: PublicPlan[] = [
  {
    tier: "Gold",
    tagline: "Full access, best rates.",
    monthlyPrice: 6000,
    annualPrice: 60000,        // 2 months free
    highlights: [
      "Unlimited court bookings",
      "50% off court rates",
      "30% off at the pro shop",
      "20% off at the bar & cafeteria",
      "Priority slot reservations",
      "Free guest passes (2 per month)",
    ],
    courtDiscount: 50,
    shopDiscount: 30,
    barDiscount: 20,
    popular: true,
    note: "Best for regular players and families.",
  },
  {
    tier: "Silver",
    tagline: "Standard access, great value.",
    monthlyPrice: 4500,
    annualPrice: 45000,
    highlights: [
      "Up to 12 bookings per month",
      "25% off court rates",
      "15% off at the pro shop",
      "10% off at the bar & cafeteria",
      "Access to all sports",
    ],
    courtDiscount: 25,
    shopDiscount: 15,
    barDiscount: 10,
    note: "Best for casual players.",
  },
  {
    tier: "Junior",
    tagline: "For players under 18.",
    monthlyPrice: 2400,
    annualPrice: 24000,
    highlights: [
      "Unlimited junior-category bookings",
      "60% off court rates",
      "20% off at the pro shop",
      "Coaching clinics included",
      "Weekend tournaments",
    ],
    courtDiscount: 60,
    shopDiscount: 20,
    barDiscount: 0,
    note: "Proof of age required at signup.",
  },
];

/* ============================================================
   Weekly availability (public calendar)
   ============================================================ */

/** Slot times the club runs — every 30 minutes, 6am to 10pm. */
function slotTimes(): string[] {
  const out: string[] = [];
  for (let h = 6; h < 22; h++) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
}

/** Next 7 days starting today. */
function next7Days(): { day: DayOfWeek; date: string }[] {
  const days: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const out: { day: DayOfWeek; date: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      day: days[d.getDay()],
      date: d.toISOString().slice(0, 10),
    });
  }
  return out;
}

/** Mock: 5 courts total, some booked per slot in a deterministic pattern. */
function availabilityForDay(date: string, dayIdx: number): DayAvailability {
  const times = slotTimes();
  const totalCount = 5;
  const slots = times.map((time, i) => {
    // Peak hours: 6–10pm on weekdays; morning+evening on weekends.
    const hour = Number(time.split(":")[0]);
    const isPeak = hour >= 18 && hour < 22;
    const isWeekend = dayIdx === 0 || dayIdx === 6;

    // Deterministic pseudo-random busy factor
    const seed = (dayIdx * 17 + i * 7) % 11;
    let booked = 0;
    if (isPeak) booked = 3 + (seed % 3);       // 3–5 booked
    else if (isWeekend) booked = 1 + (seed % 3); // 1–3 booked
    else booked = seed % 2;                     // 0–1 booked

    booked = Math.min(booked, totalCount);
    return {
      time,
      freeCount: totalCount - booked,
      totalCount,
    };
  });

  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIdx] as DayOfWeek, date, slots };
}

export function getWeeklyAvailability(): DayAvailability[] {
  return next7Days().map((d, i) => availabilityForDay(d.date, new Date(d.date).getDay()));
}

/* ============================================================
   Shop preview
   ============================================================ */

export const SHOP_PRODUCTS: PublicProduct[] = [
  {
    id: "p1", name: "Pro Tennis Racket — Carbon Series",
    category: "Rackets", basePrice: 8500, brand: "Wilson",
    description: "Lightweight carbon frame with enhanced spin control.",
    stock: 12, sport: "Tennis",
  },
  {
    id: "p2", name: "Padel Racket — Control Pro",
    category: "Rackets", basePrice: 12500, brand: "Head",
    description: "Balanced power and control for intermediate players.",
    stock: 6, sport: "Padel",
  },
  {
    id: "p3", name: "Cricket Bat — English Willow Grade 2",
    category: "Rackets", basePrice: 9500, brand: "SG",
    description: "Hand-picked willow, ideal for club-level play.",
    stock: 4, sport: "Cricket",
  },
  {
    id: "p4", name: "Tennis Balls — Championship 3-Pack",
    category: "Balls", basePrice: 550, brand: "Slazenger",
    description: "Tournament-grade balls with consistent bounce.",
    stock: 48, sport: "Tennis",
  },
  {
    id: "p5", name: "Badminton Shuttlecocks — Feather Pro (12)",
    category: "Balls", basePrice: 1200, brand: "Yonex",
    description: "Tournament feather shuttles, durable flight.",
    stock: 30, sport: "Badminton",
  },
  {
    id: "p6", name: "Court Shoes — All-Surface Grips",
    category: "Shoes", basePrice: 6500, brand: "Adidas",
    description: "Non-marking sole, ideal for indoor & outdoor courts.",
    stock: 9, sport: "Tennis",
  },
  {
    id: "p7", name: "Badminton Shoes — Lightweight Trainer",
    category: "Shoes", basePrice: 4200, brand: "Yonex",
    description: "Cushioned heel, quick side-to-side movement.",
    stock: 15, sport: "Badminton",
  },
  {
    id: "p8", name: "Overgrip Tape — 3-Pack",
    category: "Accessories", basePrice: 450, brand: "Tourna",
    description: "Absorbent, anti-slip overgrip for sweaty hands.",
    stock: 60,
  },
  {
    id: "p9", name: "Wristbands — Moisture-Wicking Pair",
    category: "Accessories", basePrice: 380,
    description: "Soft cotton blend, machine washable.",
    stock: 80,
  },
  {
    id: "p10", name: "Club Polo T-Shirt — Navy",
    category: "Apparel", basePrice: 1800,
    description: "Breathable dry-fit polo with embroidered club crest.",
    stock: 24,
  },
  {
    id: "p11", name: "Performance Shorts — Black",
    category: "Apparel", basePrice: 1500,
    description: "4-way stretch, zip pockets.",
    stock: 0,   // sold out — tests the UI
  },
  {
    id: "p12", name: "Cap — Classic Club Logo",
    category: "Apparel", basePrice: 900,
    description: "Adjustable snapback, sun protection.",
    stock: 40,
  },
];

/* ============================================================
   Helpers
   ============================================================ */

export const SPORTS_LIST = ["Tennis", "Padel", "Cricket", "Badminton"] as const;

export const PRODUCT_CATEGORIES = [
  "Rackets", "Balls", "Shoes", "Accessories", "Apparel",
] as const;