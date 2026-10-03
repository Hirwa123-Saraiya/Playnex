export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number;
  discount: string;
  bookingLimit: string;
  bookingPriority: string;
  guestPasses: string;
  tournamentAccess: boolean;
  exclusiveEvents: boolean;
  merchandiseDiscount: string;
  annualBonus: string;
  popular?: boolean;
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "junior",
    name: "Junior",
    tagline: "Designed for young athletes & beginners",
    monthlyPrice: 799,
    annualPrice: 7999,
    discount: "5%",
    bookingLimit: "2 / week",
    bookingPriority: "Standard",
    guestPasses: "—",
    tournamentAccess: false,
    exclusiveEvents: false,
    merchandiseDiscount: "—",
    annualBonus: "Free Club T-Shirt",
    popular: false,
  },
  {
    id: "silver",
    name: "Silver",
    tagline: "Ideal for weekly recreational players",
    monthlyPrice: 1499,
    annualPrice: 14999,
    discount: "10%",
    bookingLimit: "5 / week",
    bookingPriority: "Priority (24h early)",
    guestPasses: "1 / year",
    tournamentAccess: false,
    exclusiveEvents: false,
    merchandiseDiscount: "5%",
    annualBonus: "1 Guest Pass + Free Sports Drink Package",
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    tagline: "Best for dedicated club players & enthusiasts",
    monthlyPrice: 2499,
    annualPrice: 24999,
    discount: "20%",
    bookingLimit: "High Limit (12/wk)",
    bookingPriority: "High Priority (48h early)",
    guestPasses: "4 / year",
    tournamentAccess: true,
    exclusiveEvents: false,
    merchandiseDiscount: "15%",
    annualBonus: "2 Guest Passes + Club Merchandise + Free Tournament Entry",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Ultimate access and VIP experiences",
    monthlyPrice: null,
    annualPrice: 34999,
    discount: "25%",
    bookingLimit: "Unlimited",
    bookingPriority: "Highest VIP Priority (7 days early)",
    guestPasses: "8 / year",
    tournamentAccess: true,
    exclusiveEvents: true,
    merchandiseDiscount: "25%",
    annualBonus: "Elite VIP Welcome Kit & Locker Reservation",
    popular: false,
  },
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    q: "Can I change or upgrade my membership plan later?",
    a: "Yes! You can upgrade your membership at any time from your member dashboard. The pro-rated difference will be calculated automatically."
  },
  {
    q: "What happens when my membership expires?",
    a: "Annual plans automatically send a renewal reminder 30 days before expiration. You can opt for auto-renewal to retain early renewal benefits."
  },
  {
    q: "How do court booking priorities work?",
    a: "Higher-tier members gain earlier booking windows (up to 7 days ahead for Elite), ensuring you get peak court hours without hassle."
  },
  {
    q: "How do guest passes work?",
    a: "Guest passes can be redeemed digitally through the mobile or web app when making court or facility reservations."
  },
  {
    q: "What is the Birthday discount?",
    a: "All active members receive a 20% discount coupon usable across court bookings, café, and pro-shop items during their birth month."
  }
];