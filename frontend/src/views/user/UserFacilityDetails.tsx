import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Heart,
  Users,
  Award,
  Clock,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserCalendar } from '../../components/user/UserCalendar';
import { UserSlotSelector } from '../../components/user/UserSlotSelector';
import { TimeSlot } from '../../types/user.types';

export const UserFacilityDetails: React.FC = () => {
  const {
    facilities,
    selectedFacilityId,
    clubs,
    timeSlots,
    favoriteFacilityIds,
    toggleFavoriteFacility,
    startBooking,
    updateBookingWizard,
    setActiveView,
  } = useUserStore();

  const facility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];
  const club = clubs.find((c) => c.id === facility.clubId) || clubs[0];
  const isFavorite = favoriteFacilityIds.includes(facility.id);

  const [activeTab, setActiveTab] = useState<'overview' | 'availability' | 'pricing' | 'rules'>('availability');
  const [selectedDate, setSelectedDate] = useState('14 Oct 2025');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(timeSlots[1]); // Default to 12:00 PM matching step 4 image

  const handleBookNow = () => {
    updateBookingWizard({
      clubId: facility.clubId,
      facilityId: facility.id,
      date: selectedDate,
      slot: selectedSlot,
      step: 5, // Jump directly to Review Booking in the flow
    });
    startBooking(facility.clubId, facility.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Step indicator matching step 4 in reference image */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => setActiveView('facilities')} className="hover:text-blue-600">
          Facilities
        </button>
        <span>/</span>
        <button onClick={() => setActiveView('club-details')} className="hover:text-blue-600">
          {club.name}
        </button>
        <span>/</span>
        <span className="font-bold text-slate-900">{facility.name}</span>
        <span className="ml-auto text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          Step 4 • Facility Availability
        </span>
      </div>

      {/* Main Banner matching step 4 in reference image */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl min-h-[300px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src={facility.image}
          alt={facility.name}
          className="absolute inset-0 w-full h-full object-cover opacity-65 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Favorite Button */}
        <div className="absolute top-5 right-5 z-10">
          <button
            onClick={() => toggleFavoriteFacility(facility.id)}
            className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 shadow-md transition-all active:scale-95"
            title={isFavorite ? 'Saved' : 'Save'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Facility Info on Banner */}
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full shadow-md">
            {facility.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {facility.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 font-semibold drop-shadow">
            {facility.type}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>{club.name} • {club.city}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded text-white font-bold border border-white/10">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{facility.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs matching step 4 in reference image */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-4">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'availability', label: 'Availability Calendar' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'rules', label: 'Rules & Guidelines' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">About this Facility</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {facility.description}
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {facility.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4 h-fit">
            <div className="text-sm font-bold text-slate-900">Standard Rate</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">₹{facility.pricingPerHour}</span>
              <span className="text-xs text-slate-500">/ hour</span>
            </div>
            <button
              onClick={() => setActiveTab('availability')}
              className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Check Available Slots
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABILITY & BOOKING matching step 4 in reference image */}
      {activeTab === 'availability' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
          {/* Left: Date Carousel & Slot Selector */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            {/* Step 4 Date Selection `< 14 Oct 2025 >` */}
            <UserCalendar selectedDate={selectedDate} onSelectDate={(d) => setSelectedDate(d)} />

            {/* Step 4 Slots: Morning, Afternoon, Evening */}
            <UserSlotSelector
              slots={timeSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(s) => setSelectedSlot(s)}
            />
          </div>

          {/* Right: Booking Summary & Book Now Button matching step 4 in reference image */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-24">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Selected Reservation
              </h4>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Club</span>
                  <span className="font-bold text-slate-900">{club.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Facility</span>
                  <span className="font-bold text-slate-900">{facility.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="font-bold text-blue-600">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot</span>
                  <span className="font-bold text-slate-900">
                    {selectedSlot ? selectedSlot.time : 'Select a slot'}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-100 text-sm">
                  <span className="font-bold text-slate-800">Total Price</span>
                  <span className="font-black text-slate-900 text-base">
                    ₹{selectedSlot ? selectedSlot.price : facility.pricingPerHour}
                  </span>
                </div>
              </div>

              {/* Book Now Button matching step 4 in reference image */}
              <button
                type="button"
                onClick={handleBookNow}
                disabled={!selectedSlot}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Book Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Free cancellation up to 4 hours before the booking time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING */}
      {activeTab === 'pricing' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-2xl space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900">Hourly Tariff Structure</h3>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span>Morning Peak Slots (6 AM - 10 AM)</span>
              <span className="font-bold text-slate-900">₹{facility.pricingPerHour} / hr</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span>Afternoon Non-Peak Slots (11 AM - 4 PM)</span>
              <span className="font-bold text-slate-900">₹{facility.pricingPerHour - 50} / hr</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span>Evening Floodlight Slots (4 PM - 10 PM)</span>
              <span className="font-bold text-slate-900">₹{facility.pricingPerHour + 100} / hr</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RULES */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 max-w-2xl space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900">Court Rules & Guidelines</h3>
          <ul className="space-y-2.5 text-xs text-slate-600">
            {facility.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
