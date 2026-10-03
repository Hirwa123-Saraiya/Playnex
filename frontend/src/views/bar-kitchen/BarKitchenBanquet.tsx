import React, { useState } from 'react';
import {
  PartyPopper,
  Calendar,
  Users,
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  UtensilsCrossed,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';

export const BarKitchenBanquet: React.FC = () => {
  const { banquets } = useBarKitchenStore();
  const [selectedEvent, setSelectedEvent] = useState(banquets[0]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Banquet & Event Catering Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Grand ballroom reservations, tournament buffets, corporate dining, and custom multi-course menus.
          </p>
        </div>

        <button
          onClick={() => alert('New Banquet Booking contract opened.')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Book Banquet Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Events List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
            Confirmed & Upcoming Banquets
          </h3>
          <div className="space-y-3">
            {banquets.map((b) => {
              const isSelected = selectedEvent.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedEvent(b)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      {b.packageType}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 mt-2">{b.eventName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Client: {b.clientName}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                    <div>Date: <strong>{b.eventDate}</strong></div>
                    <div>Guests: <strong>{b.guestCount} Pax</strong></div>
                    <div>Rate: <strong>₹{b.ratePerPax} / Pax</strong></div>
                    <div className="text-emerald-700 font-bold">Rev: ₹{b.estimatedRevenue.toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Event Details & Banquet Course Menu (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {selectedEvent.eventNumber} • {selectedEvent.hallName}
              </span>
              <h2 className="text-xl font-black text-slate-900">{selectedEvent.eventName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Client: {selectedEvent.clientName} ({selectedEvent.clientPhone})
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
              {selectedEvent.status}
            </span>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Estimated Revenue</span>
              <span className="text-base font-black text-slate-900">
                ₹{selectedEvent.estimatedRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block text-[10px]">Food & Ops Cost</span>
              <span className="text-base font-black text-slate-900">
                ₹{selectedEvent.estimatedCost.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-emerald-700 block text-[10px] font-bold">Advance Deposit</span>
              <span className="text-base font-black text-emerald-700">
                ₹{selectedEvent.advancePaid.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Multi-Course Event Menu */}
          <div>
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Catering Course Blueprint
            </h4>
            <div className="space-y-3">
              {selectedEvent.menuCourses.map((c, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
                  <span className="text-xs font-black text-blue-700 block mb-1">
                    {c.course}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.items.map((item, i) => (
                      <span
                        key={i}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-xl shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
