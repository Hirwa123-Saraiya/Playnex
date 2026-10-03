import React from 'react';
import { Sun, CloudSun, Moon, Check } from 'lucide-react';
import { TimeSlot } from '../../types/user.types';

interface UserSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const UserSlotSelector: React.FC<UserSlotSelectorProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
}) => {
  const morningSlots = slots.filter((s) => s.period === 'Morning');
  const afternoonSlots = slots.filter((s) => s.period === 'Afternoon');
  const eveningSlots = slots.filter((s) => s.period === 'Evening');

  const renderSlotGroup = (
    title: string,
    groupSlots: TimeSlot[],
    icon: React.ReactNode,
    badgeText: string
  ) => {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            {icon}
            <span>{title}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{badgeText}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {groupSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isAvailable = slot.isAvailable;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSlot(slot)}
                className={`py-2.5 px-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30'
                    : isAvailable
                    ? 'bg-white hover:border-blue-300 hover:bg-blue-50/30 text-slate-800 border-slate-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {slot.time.split(' - ')[0]}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px]">
                  <span className={isSelected ? 'text-blue-100' : 'text-slate-500'}>
                    ₹{slot.price}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1 rounded ${
                      isSelected
                        ? 'bg-blue-700 text-white'
                        : isAvailable
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isAvailable ? 'Available' : 'Booked'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSlotGroup('Morning Sessions', morningSlots, <Sun className="w-4 h-4 text-amber-500" />, '06:00 AM - 11:00 AM')}
      {renderSlotGroup('Afternoon Sessions', afternoonSlots, <CloudSun className="w-4 h-4 text-orange-500" />, '11:00 AM - 04:00 PM')}
      {renderSlotGroup('Evening Sessions (Floodlights)', eveningSlots, <Moon className="w-4 h-4 text-indigo-500" />, '04:00 PM - 10:00 PM')}
    </div>
  );
};
