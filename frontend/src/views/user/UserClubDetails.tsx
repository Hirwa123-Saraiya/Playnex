import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Heart,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Utensils,
  Wine,
  Trophy,
  Dumbbell,
  Waves,
  HeartPulse,
  Calendar,
  Bed,
  CheckCircle2,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserFacilityCard } from '../../components/user/UserFacilityCard';
import { UserEventCard } from '../../components/user/UserEventCard';

export const UserClubDetails: React.FC = () => {
  const {
    clubs,
    selectedClubId,
    facilities,
    events,
    membershipPlans,
    favoriteClubIds,
    toggleFavoriteClub,
    startBooking,
    startMembershipPurchase,
    setActiveView,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'facilities' | 'events' | 'membership' | 'gallery' | 'reviews' | 'contact'
  >('overview');

  const club = clubs.find((c) => c.id === selectedClubId) || clubs[0];
  const isFavorite = favoriteClubIds.includes(club.id);

  const clubFacilities = facilities.filter((f) => f.clubId === club.id);
  const clubEvents = events.filter((e) => e.clubId === club.id);
  const clubPlans = membershipPlans.filter((p) => p.clubId === club.id);

  // Quick amenity tiles matching step 3 in reference image
  const amenityTiles = [
    { label: 'Restaurant', icon: Utensils, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Bar', icon: Wine, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { label: 'Courts', icon: Trophy, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Gym', icon: Dumbbell, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { label: 'Swimming Pool', icon: Waves, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { label: 'Spa', icon: HeartPulse, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'Events', icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { label: 'Rooms', icon: Bed, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Step indicator matching step 3 in reference image */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => setActiveView('clubs')} className="hover:text-blue-600">
          Clubs
        </button>
        <span>/</span>
        <span className="font-bold text-slate-900">{club.name}</span>
        <span className="ml-auto text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          Step 3 • Explore Club
        </span>
      </div>

      {/* Hero Image & Information Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl min-h-[360px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-10">
        <img
          src={club.heroImage}
          alt={club.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* Favorite & Membership Badge */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <button
            onClick={() => toggleFavoriteClub(club.id)}
            className="p-3 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 shadow-md transition-all active:scale-95"
            title={isFavorite ? 'Saved' : 'Save'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Club Details Overlay */}
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Playnex Partner
            </span>
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{club.rating}</span>
              <span className="text-slate-300">({club.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-200">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{club.operatingHours}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {club.name}
          </h1>

          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{club.address}</span>
          </div>
        </div>
      </div>

      {/* Tabs matching step 3 in reference image */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max pb-px">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'facilities', label: `Facilities (${clubFacilities.length})` },
              { id: 'events', label: `Events (${clubEvents.length})` },
              { id: 'membership', label: `Membership Plans (${clubPlans.length})` },
              { id: 'gallery', label: 'Gallery' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'contact', label: 'Contact' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold transition-all relative ${
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

      {/* TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Quick Amenity Tiles matching step 3 in reference image */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Club Amenities & Zones
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {amenityTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <div
                    key={tile.label}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer ${tile.color}`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-bold leading-tight">{tile.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">About {club.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {club.description}
                </p>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Available Sports & Disciplines
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {club.sports.map((sport) => (
                      <span
                        key={sport}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {club.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top facilities preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Featured Facilities</h3>
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View All ({clubFacilities.length})
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {clubFacilities.slice(0, 2).map((fac) => (
                    <UserFacilityCard key={fac.id} facility={fac} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking / Membership Callout Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-3xl shadow-xl space-y-5">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30">
                  Instant Access
                </span>
                <h4 className="text-lg font-black text-white">Book a Court or Pool Today</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Non-members and guest visitors can book select facilities starting at ₹{club.minPricePerHour}/hr.
                </p>

                <button
                  onClick={() => startBooking(club.id)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Check Availability & Book</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {clubPlans.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Club Membership Pass</span>
                  </div>
                  <h4 className="text-base font-black text-amber-950">
                    {clubPlans[0].name}
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Enjoy priority slots, unlimited pool access, and guest passes from ₹{clubPlans[0].priceMonthly}/mo.
                  </p>
                  <button
                    onClick={() => startMembershipPurchase(club.id, clubPlans[0].id)}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    View Membership Plans
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              All Facilities at {club.name}
            </h3>
            <span className="text-xs text-slate-500">{clubFacilities.length} facilities available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubFacilities.map((facility) => (
              <UserFacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Upcoming Events & Tournaments
            </h3>
            <span className="text-xs text-slate-500">{clubEvents.length} events scheduled</span>
          </div>

          {clubEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border text-center text-slate-500 text-xs">
              No public events currently scheduled for this club.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clubEvents.map((evt) => (
                <UserEventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MEMBERSHIP PLANS */}
      {activeTab === 'membership' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Membership Options</h3>
            <p className="text-xs text-slate-500">
              Select the plan that fits your personal or family lifestyle. All memberships link directly into your Playnex digital wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 hover:shadow-xl transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {plan.tier}
                    </span>
                    {plan.discountBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {plan.discountBadge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹{plan.priceAnnual}</span>
                      <span className="text-xs text-slate-400">/year</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Or ₹{plan.priceMonthly}/month</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="font-bold text-slate-800">What's included:</div>
                    {plan.includedFacilities.map((fac) => (
                      <div key={fac} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startMembershipPurchase(club.id, plan.id)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  Buy Membership Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900">Club Photo Gallery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {club.gallery.map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Member Reviews</h3>
              <p className="text-xs text-slate-500">Overall rating: {club.rating} ★ ({club.reviewsCount} verified reviews)</p>
            </div>
            <button
              onClick={() => setActiveView('reviews')}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Write a Review
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    JD
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">John Doe</h5>
                    <span className="text-[10px] text-slate-400">Verified Member</span>
                  </div>
                </div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The courts and pool are maintained to an international standard. Valet parking is swift and staff is very courteous.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CONTACT */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 max-w-2xl animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900">Club Reception & Concierge</h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{club.address}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Phone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{club.phone}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Mail className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{club.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Operating Hours: {club.operatingHours}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
