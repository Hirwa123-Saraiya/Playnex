import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Download,
  RotateCcw,
  XCircle,
  ShieldCheck,
  CreditCard,
  User,
  Share2,
} from 'lucide-react';
import { Booking } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserBookingDetailsProps {
  booking: Booking;
  onClose: () => void;
}

export const UserBookingDetails: React.FC<UserBookingDetailsProps> = ({ booking, onClose }) => {
  const { cancelBooking } = useUserStore();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Reservation Pass
            </span>
            <h3 className="text-lg font-black text-slate-900">{booking.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Pass Section */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 text-center space-y-3 shadow-lg">
          <div className="w-40 h-40 bg-white p-2.5 rounded-2xl mx-auto shadow-md flex items-center justify-center">
            <img
              src={booking.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PASS'}
              alt="QR Entry Pass"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Scan at Club Turnstile</h4>
            <p className="text-[11px] text-blue-200 mt-0.5">
              Gate will automatically unlock for 1 hour session
            </p>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-400 font-medium">Facility</span>
            <span className="font-bold text-slate-900">{booking.facilityName}</span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-400 font-medium">Club & City</span>
            <span className="font-bold text-slate-900">
              {booking.clubName}, {booking.clubCity}
            </span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-400 font-medium">Date & Slot</span>
            <span className="font-bold text-slate-900">
              {booking.date} • {booking.timeSlot}
            </span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="font-bold text-blue-600">{booking.status}</span>
          </div>

          <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-400 font-medium">Payment ID</span>
            <span className="font-mono font-bold text-slate-800">{booking.paymentId}</span>
          </div>

          {booking.notes && (
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900 text-[11px]">
              <span className="font-bold block mb-0.5">Instructions:</span>
              {booking.notes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => alert(`Receipt downloaded for booking ${booking.id}`)}
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Receipt
          </button>

          {booking.status === 'Upcoming' && (
            <button
              onClick={() => {
                if (confirm(`Cancel reservation for ${booking.facilityName}?`)) {
                  cancelBooking(booking.id);
                  onClose();
                }
              }}
              className="px-4 py-2 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Reservation
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
