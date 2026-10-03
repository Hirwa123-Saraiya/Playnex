import React from 'react';
import { Calendar, Clock, MapPin, QrCode, Download, RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { Booking } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserBookingCardProps {
  booking: Booking;
  onViewDetails?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
}

export const UserBookingCard: React.FC<UserBookingCardProps> = ({
  booking,
  onViewDetails,
  onReschedule,
}) => {
  const { cancelBooking } = useUserStore();

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <img
            src={booking.facilityImage}
            alt={booking.facilityName}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500">{booking.id}</span>
              {getStatusBadge()}
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
              {booking.facilityName}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>{booking.clubName} • {booking.clubCity}</span>
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className="text-[11px] text-slate-400 block font-medium">Total Paid</span>
          <span className="text-lg font-black text-slate-900">₹{booking.totalPaid}</span>
          <span className="text-[10px] text-slate-400 block">{booking.paymentMethod}</span>
        </div>
      </div>

      {/* Date & Slot Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Date</span>
            <span className="font-semibold text-slate-800">{booking.date}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Reserved Slot</span>
            <span className="font-semibold text-slate-800">{booking.timeSlot}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {booking.qrCodeUrl && (
            <button
              onClick={() => onViewDetails && onViewDetails(booking)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-blue-50"
            >
              <QrCode className="w-3.5 h-3.5" /> Show QR Pass
            </button>
          )}
          <button
            onClick={() => {
              alert(`Receipt for booking ${booking.id} downloaded successfully.`);
            }}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-slate-100"
          >
            <Download className="w-3.5 h-3.5" /> Receipt
          </button>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'Upcoming' && (
            <>
              {onReschedule && (
                <button
                  onClick={() => onReschedule(booking)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reschedule
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
                    cancelBooking(booking.id);
                  }
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Cancel
              </button>
            </>
          )}

          <button
            onClick={() => onViewDetails && onViewDetails(booking)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
