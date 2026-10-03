'use client';

import React from 'react';
import { useClub } from '../context/ClubContext';
import {
  CreditCard,
  Check,
  Plus,
  Shield,
  Star,
  Users,
  Award,
} from 'lucide-react';

export const ClubMembership: React.FC = () => {
  const { selectedBranch } = useClub();

  const plans = [
    {
      id: 'plan_gold',
      name: 'Gold Tier (All-Access)',
      badge: 'Most Popular',
      price: '₹ 85,000',
      period: 'per year',
      membersEnrolled: 640,
      features: [
        'Unrestricted Tennis & Badminton court booking',
        'Olympic Swimming Pool & Gym access',
        '15% Flat Discount at The Terrace Bistro & Bar',
        'Priority registration for all club tournaments',
        'Up to 4 family add-on sub-accounts',
        'Complimentary locker & kit room allotment',
      ],
      color: 'border-amber-400 bg-amber-50/10',
      btnColor: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    {
      id: 'plan_silver',
      name: 'Silver Tier (Standard)',
      badge: 'Club Essential',
      price: '₹ 45,000',
      period: 'per year',
      membersEnrolled: 380,
      features: [
        'Full Racquet Sports court access (Peak & Off-peak)',
        '10% Flat Discount at Restaurant & Bar',
        'Access to Swimming pool on weekdays',
        'Guest pass privileges (2 per month)',
        'Discounted tournament entry passes',
      ],
      color: 'border-slate-300 bg-white',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    {
      id: 'plan_junior',
      name: 'Junior Tier (Under 18)',
      badge: 'Youth Development',
      price: '₹ 20,000',
      period: 'per year',
      membersEnrolled: 225,
      features: [
        'Dedicated youth academy coaching slots',
        'Off-peak court access (3 PM - 6 PM)',
        'Junior tournament circuit participation',
        'Equipment discounts at the Club Pro Shop',
        'Parent / guardian clubhouse entry privileges',
      ],
      color: 'border-blue-300 bg-blue-50/10',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Membership Plans & Tiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure subscription tiers, discount entitlements and pricing matrices for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`rounded-2xl p-6 border-2 shadow-sm flex flex-col justify-between relative ${p.color}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                  {p.badge}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {p.membersEnrolled} Members
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 mt-4">{p.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{p.price}</span>
                <span className="text-xs font-medium text-slate-500">{p.period}</span>
              </div>

              <div className="mt-6 space-y-2.5">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Plan Entitlements:
                </p>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80">
              <button
                className={`w-full py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs ${p.btnColor}`}
              >
                Edit Plan & Discounts
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
