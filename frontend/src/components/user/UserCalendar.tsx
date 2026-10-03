import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const UserCalendar: React.FC<UserCalendarProps> = ({ selectedDate, onSelectDate }) => {
  // Generate 14 selectable days starting from 14 Oct 2025 for realistic demo
  const sampleDates = [
    { dayName: 'Tue', dayNum: '14', fullDate: '14 Oct 2025', isAvailable: true },
    { dayName: 'Wed', dayNum: '15', fullDate: '15 Oct 2025', isAvailable: true },
    { dayName: 'Thu', dayNum: '16', fullDate: '16 Oct 2025', isAvailable: true },
    { dayName: 'Fri', dayNum: '17', fullDate: '17 Oct 2025', isAvailable: true },
    { dayName: 'Sat', dayNum: '18', fullDate: '18 Oct 2025', isAvailable: true },
    { dayName: 'Sun', dayNum: '19', fullDate: '19 Oct 2025', isAvailable: true },
    { dayName: 'Mon', dayNum: '20', fullDate: '20 Oct 2025', isAvailable: true },
    { dayName: 'Tue', dayNum: '21', fullDate: '21 Oct 2025', isAvailable: true },
    { dayName: 'Wed', dayNum: '22', fullDate: '22 Oct 2025', isAvailable: true },
    { dayName: 'Thu', dayNum: '23', fullDate: '23 Oct 2025', isAvailable: true },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Select Booking Date</span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            {selectedDate}
          </span>
        </h4>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onSelectDate(sampleDates[0].fullDate)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            title="Previous Days"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectDate(sampleDates[4].fullDate)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
            title="Next Days"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sampleDates.map((item) => {
          const isSelected = selectedDate === item.fullDate;
          return (
            <button
              key={item.fullDate}
              onClick={() => onSelectDate(item.fullDate)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-3 px-2 rounded-2xl border transition-all shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {item.dayName}
              </span>
              <span className="text-lg font-black tracking-tight mt-0.5">
                {item.dayNum}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
