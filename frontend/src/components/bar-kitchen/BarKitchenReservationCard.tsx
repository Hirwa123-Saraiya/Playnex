import React from 'react';
import { Calendar, Clock, Users, Phone, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { BarKitchenReservation } from '../../types/BarKitchenTypes';

interface BarKitchenReservationCardProps {
  reservation: BarKitchenReservation;
  onCheckIn?: (res: BarKitchenReservation) => void;
  onCancel?: (res: BarKitchenReservation) => void;
}

export const BarKitchenReservationCard: React.FC<BarKitchenReservationCardProps> = ({
  reservation,
  onCheckIn,
  onCancel,
}) => {
  const getStatusBadge = (status: BarKitchenReservation['status']) => {
    switch (status) {
      case 'Reserved':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Checked In':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'No Show':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Cancelled':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{reservation.guestName}</h4>
              {reservation.type === 'VIP' && (
                <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200">
                  VIP
                </span>
              )}
            </div>
            {reservation.memberId && (
              <span className="text-xs font-semibold text-blue-600 block mt-0.5">
                {reservation.memberId}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
              reservation.status
            )}`}
          >
            {reservation.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold">{reservation.timeSlot}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
            <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="font-semibold">{reservation.pax} Guests</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Table: <strong className="text-slate-800">{reservation.assignedTableNumber || 'TBD'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl truncate">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{reservation.phone}</span>
          </div>
        </div>

        {reservation.specialRequests && (
          <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-xl border border-amber-100">
            Note: {reservation.specialRequests}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        {reservation.status === 'Reserved' && (
          <>
            {onCancel && (
              <button
                type="button"
                onClick={() => onCancel(reservation)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
            {onCheckIn && (
              <button
                type="button"
                onClick={() => onCheckIn(reservation)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Check In
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
