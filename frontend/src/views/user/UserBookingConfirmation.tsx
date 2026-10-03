import React from 'react';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Share2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserBookingConfirmation: React.FC = () => {
  const { lastConfirmedBooking, bookings, setActiveView, startBooking } = useUserStore();

  const booking = lastConfirmedBooking || bookings[0];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95">
        {/* Step 6 indicator matching reference image */}
        <div className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step 6 • Confirmation & QR Pass
        </div>

        {/* Green Checkmark Circle matching reference image */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-in bounce-in">
          <CheckCircle className="w-12 h-12 stroke-[2.5]" />
        </div>

        {/* Heading & Subtitle matching reference image */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Your {booking.facilityName} booking at {booking.clubName} is confirmed.
          </p>
        </div>

        {/* Confirmation Details Card matching reference image step 6 */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Booking ID</span>
            <span className="font-mono font-bold text-slate-900">{booking.id}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Club</span>
            <span className="font-bold text-slate-900">{booking.clubName}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Facility</span>
            <span className="font-bold text-slate-900">{booking.facilityName}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Date</span>
            <span className="font-bold text-slate-900">{booking.date}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Time Slot</span>
            <span className="font-bold text-slate-900">{booking.timeSlot}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Amount Paid</span>
            <span className="text-base font-black text-blue-600">₹{booking.totalPaid}</span>
          </div>
        </div>

        {/* Turnstile QR Code Ticket */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-800">Turnstile Entry Pass</p>
          <div className="w-32 h-32 mx-auto bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-center">
            <img
              src={booking.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PLAYNEX-PASS'}
              alt="Booking QR Pass"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Scan at gate turnstile • Instant Access
          </span>
        </div>

        {/* Action Buttons matching reference image step 6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setActiveView('bookings')}
            className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => startBooking()}
            className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Book Another</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
          <button
            onClick={() => alert(`Receipt downloaded for booking ${booking.id}`)}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF Receipt
          </button>
          <span>•</span>
          <button
            onClick={() => alert('Calendar invite (.ics) sent to your registered email.')}
            className="hover:text-blue-600 flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" /> Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
