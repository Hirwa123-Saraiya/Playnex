import React from 'react';
import { Calendar, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { Facility, Club, TimeSlot } from '../../types/user.types';

interface UserBookingSummaryProps {
  club: Club;
  facility: Facility;
  date: string;
  slot: TimeSlot | null;
}

export const UserBookingSummary: React.FC<UserBookingSummaryProps> = ({
  club,
  facility,
  date,
  slot,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Booking Summary
        </h4>
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Guaranteed Slot
        </span>
      </div>

      {/* Facility & Club Card Header */}
      <div className="flex items-center gap-3.5">
        <img
          src={facility.image}
          alt={facility.name}
          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
        />
        <div>
          <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{facility.name}</h5>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>{club.name}, {club.city}</span>
          </div>
          <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded mt-1">
            {facility.category}
          </span>
        </div>
      </div>

      {/* Date & Time Slot details */}
      <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Date</span>
          </div>
          <span className="font-bold text-slate-900">{date}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Time Slot</span>
          </div>
          <span className="font-bold text-slate-900">
            {slot ? `${slot.time} (1 Hour)` : 'Select a slot'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">Slot Base Rate</span>
          <span className="text-base font-extrabold text-slate-900">
            ₹{slot ? slot.price : facility.pricingPerHour}
          </span>
        </div>
      </div>
    </div>
  );
};
