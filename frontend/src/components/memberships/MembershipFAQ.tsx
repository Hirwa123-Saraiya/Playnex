"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FREQUENTLY_ASKED_QUESTIONS } from "@/data/membershipData";

export default function MembershipFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-400">Everything you need to know about joining Playnex Sports Club.</p>
        </div>

        <div className="space-y-4">
          {FREQUENTLY_ASKED_QUESTIONS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-white hover:text-emerald-400 transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}