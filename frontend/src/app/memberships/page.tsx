"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MembershipHero from "@/components/memberships/MembershipHero";
import MembershipCard from "@/components/memberships/MembershipCard";
import ComparisonTable from "@/components/memberships/ComparisonTable";
import MembershipFAQ from "@/components/memberships/MembershipFAQ";
import { MEMBERSHIP_PLANS } from "@/data/membershipData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MembershipsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        <MembershipHero billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEMBERSHIP_PLANS.map((plan) => (
              <MembershipCard key={plan.id} plan={plan} billingCycle={billingCycle} />
            ))}
          </div>
        </section>

        <ComparisonTable />
        <MembershipFAQ />

        <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to elevate your game at Playnex Sports Club?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join today and start booking prime courts immediately with member privileges.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base hover:from-emerald-400 hover:to-teal-400 transition shadow-xl shadow-emerald-500/25"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}