'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Building2, Calendar, UserPlus, Tag } from 'lucide-react';
import { useClub } from '../../context/ClubContext';

export const ClubModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedBranch } = useClub();
  const [submitted, setSubmitted] = useState(false);

  if (!activeModal) return null;

  const handleClose = () => {
    setActiveModal(null);
    setSubmitted(false);
  };

  const handleFakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {activeModal === 'add-facility' && <Building2 className="w-5 h-5 text-blue-600" />}
            {activeModal === 'create-event' && <Calendar className="w-5 h-5 text-emerald-600" />}
            {activeModal === 'add-member' && <UserPlus className="w-5 h-5 text-purple-600" />}
            {activeModal === 'create-offer' && <Tag className="w-5 h-5 text-rose-600" />}
            <div>
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {activeModal.replace('-', ' ')}
              </h3>
              <p className="text-[11px] text-slate-500">
                Branch: {selectedBranch.name}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
            <h4 className="text-base font-bold text-slate-800">Saved Successfully!</h4>
            <p className="text-xs text-slate-500">Playnex database and branch state updated.</p>
          </div>
        ) : (
          <form onSubmit={handleFakeSubmit} className="py-4 space-y-4 text-xs">
            {activeModal === 'add-facility' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Squash Court 4 / Rooftop Pickleball"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                      <option>Racquet Sports</option>
                      <option>Aquatics</option>
                      <option>Fitness & Gym</option>
                      <option>Dining & Lounge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Total Capacity</label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 4"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}

            {activeModal === 'add-member' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Membership Plan</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl">
                      <option>Gold Tier (All Access)</option>
                      <option>Silver Tier (Tennis & Dining)</option>
                      <option>Junior Club Tier</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeModal === 'create-event' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Winter Badminton Open 2025"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      required
                      type="date"
                      defaultValue="2025-10-28"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Capacity</label>
                    <input
                      required
                      type="number"
                      placeholder="64"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}

            {activeModal === 'create-offer' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Title / Coupon</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. DIWALI25 (25% off Bar & Dining)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount %</label>
                    <input
                      required
                      type="number"
                      placeholder="25"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Valid Till</label>
                    <input
                      required
                      type="date"
                      defaultValue="2025-11-05"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Profile or generic fallback */}
            {['profile', 'change-password', 'preferences', 'messages'].includes(activeModal) && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Settings and configuration for Playnex Club Owner account. All multi-tenant permission rules are enforced across all branches.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800">Branch Sync Active</p>
                  <p className="text-[11px] text-slate-500">{selectedBranch.name}</p>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
              >
                Submit & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
