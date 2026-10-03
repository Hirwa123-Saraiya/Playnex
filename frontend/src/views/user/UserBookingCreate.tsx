import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  User as UserIcon,
  AlertCircle,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserCalendar } from '../../components/user/UserCalendar';
import { UserSlotSelector } from '../../components/user/UserSlotSelector';
import { UserBookingSummary } from '../../components/user/UserBookingSummary';
import { UserPaymentSummary } from '../../components/user/UserPaymentSummary';

export const UserBookingCreate: React.FC = () => {
  const {
    clubs,
    facilities,
    timeSlots,
    familyMembers,
    bookingWizard,
    updateBookingWizard,
    confirmBooking,
    setActiveView,
  } = useUserStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const selectedClub = clubs.find((c) => c.id === bookingWizard.clubId) || clubs[0];
  const clubFacilities = facilities.filter((f) => f.clubId === selectedClub.id);
  const selectedFacility =
    facilities.find((f) => f.id === bookingWizard.facilityId) ||
    clubFacilities[0] ||
    facilities[0];

  const currentStep = bookingWizard.step || 1;

  const handleNextStep = () => {
    updateBookingWizard({ step: Math.min(6, currentStep + 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    updateBookingWizard({ step: Math.max(1, currentStep - 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayAndConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const booking = confirmBooking();
      if (booking) {
        setActiveView('booking-confirmation');
      }
    }, 900);
  };

  const stepsList = [
    { num: 1, title: 'Club' },
    { num: 2, title: 'Facility' },
    { num: 3, title: 'Date' },
    { num: 4, title: 'Slot' },
    { num: 5, title: 'Review' },
    { num: 6, title: 'Payment' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wizard Progress Bar matching user flow */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Booking Step {currentStep} of 6:{' '}
            <span className="text-blue-600 font-extrabold">{stepsList[currentStep - 1]?.title}</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">Guaranteed Court Readiness</span>
        </div>

        {/* Stepper Dots / Bars */}
        <div className="grid grid-cols-6 gap-2">
          {stepsList.map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num <= currentStep) updateBookingWizard({ step: s.num });
              }}
              className={`h-2 rounded-full transition-all ${
                s.num < currentStep
                  ? 'bg-emerald-500'
                  : s.num === currentStep
                  ? 'bg-blue-600 ring-2 ring-blue-300'
                  : 'bg-slate-100'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: SELECT CLUB */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Step 1: Select Sports Club</h2>
            <p className="text-xs text-slate-500 mt-1">Choose the club where you want to reserve a facility.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubs.map((c) => {
              const isSelected = bookingWizard.clubId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    const firstFac = facilities.find((f) => f.clubId === c.id);
                    updateBookingWizard({
                      clubId: c.id,
                      facilityId: firstFac ? firstFac.id : bookingWizard.facilityId,
                    });
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <img src={c.heroImage} alt={c.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{c.city}</span>
                    </p>
                    <span className="text-[11px] font-semibold text-blue-600 mt-1 block">
                      From ₹{c.minPricePerHour}/hr
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Next: Select Facility</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT FACILITY */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Step 2: Select Facility at {selectedClub.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Pick a court, pool, or fitness studio.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clubFacilities.map((f) => {
              const isSelected = bookingWizard.facilityId === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => updateBookingWizard({ facilityId: f.id })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <img src={f.image} alt={f.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {f.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{f.name}</h4>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">₹{f.pricingPerHour} / hr</p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Next: Select Date</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Step 3: Select Date</h2>
            <p className="text-xs text-slate-500 mt-1">Choose which day you plan to play.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <UserCalendar
              selectedDate={bookingWizard.date}
              onSelectDate={(d) => updateBookingWizard({ date: d })}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Next: Select Time Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SELECT TIME SLOT */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Step 4: Select Time Slot on {bookingWizard.date}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Morning, afternoon, or floodlit evening sessions.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <UserSlotSelector
              slots={timeSlots}
              selectedSlot={bookingWizard.slot}
              onSelectSlot={(s) => updateBookingWizard({ slot: s })}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={!bookingWizard.slot}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <span>Next: Review Booking</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW BOOKING (Matching Step 5 in reference image) */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Step 5: Review Booking Details</h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your chosen club, court, date, and reservation options before payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserBookingSummary
              club={selectedClub}
              facility={selectedFacility}
              date={bookingWizard.date}
              slot={bookingWizard.slot}
            />

            {/* Additional details: Family Member & Notes */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Booking Options
              </h4>

              {/* Family member booking on behalf */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Book for Family Member (Optional)
                </label>
                <select
                  value={bookingWizard.familyMemberId || ''}
                  onChange={(e) => {
                    const fam = familyMembers.find((m) => m.id === e.target.value);
                    updateBookingWizard({
                      familyMemberId: e.target.value,
                      familyMemberName: fam ? fam.name : undefined,
                    });
                  }}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="">Myself (John Doe)</option>
                  {familyMembers.map((fam) => (
                    <option key={fam.id} value={fam.id}>
                      {fam.name} ({fam.relation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Special Notes for Club Concierge
                </label>
                <textarea
                  rows={3}
                  value={bookingWizard.notes || ''}
                  onChange={(e) => updateBookingWizard({ notes: e.target.value })}
                  placeholder="e.g. Please arrange 2 demo racquets and fresh balls at pro desk..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2 text-xs text-blue-800">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Slot is held for 10 minutes. 100% refund available up to 4 hours before session.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevStep}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PAYMENT (Matching Step 5 in reference image) */}
      {currentStep === 6 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Step 6: Confirm & Pay</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your payment method: Credit/Debit Card, UPI, Wallet, or Net Banking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <UserBookingSummary
                club={selectedClub}
                facility={selectedFacility}
                date={bookingWizard.date}
                slot={bookingWizard.slot}
              />
            </div>

            <div className="md:col-span-7">
              <UserPaymentSummary
                amount={bookingWizard.slot ? bookingWizard.slot.price : selectedFacility.pricingPerHour}
                selectedMethod={bookingWizard.paymentMethod}
                onSelectMethod={(method) => updateBookingWizard({ paymentMethod: method })}
                onPay={handlePayAndConfirm}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
