import React from 'react';
import {
  Sparkles,
  Trophy,
  ShieldCheck,
  Flame,
  ArrowRight,
  Star,
  Users,
  Calendar,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserSearchBar } from '../../components/user/UserSearchBar';
import { UserClubCard } from '../../components/user/UserClubCard';
import { UserFacilityCard } from '../../components/user/UserFacilityCard';
import { UserEventCard } from '../../components/user/UserEventCard';

export const UserHome: React.FC = () => {
  const { clubs, facilities, events, membershipPlans, setActiveView, navigateToClubDetails, startBooking } =
    useUserStore();

  const featuredClubs = clubs.slice(0, 4);
  const featuredFacilities = facilities.slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-3 sm:mt-6 shadow-2xl">
        {/* Background hero image with high aesthetic gradient overlays */}
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=85"
          alt="Playnex Sports Club Platform"
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs sm:text-sm font-semibold backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>ONE ACCOUNT • MULTIPLE CLUBS • INSTANT BOOKINGS</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white drop-shadow-md">
              Your Gateway to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                India's Finest Sports Clubs
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Book red clay tennis courts, Olympic swimming pools, glass-back squash, and luxury country club amenities across top cities—all under a single membership.
            </p>
          </div>

          {/* Floating Search Bar */}
          <div className="pt-2 max-w-4xl mx-auto">
            <UserSearchBar onSearchSubmit={() => setActiveView('clubs')} />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">50+</div>
              <div className="text-[11px] text-slate-400">Verified Clubs</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">12+</div>
              <div className="text-[11px] text-slate-400">Sports & Disciplines</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-[11px] text-slate-400">Real-Time Slots</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">4.9 ★</div>
              <div className="text-[11px] text-slate-400">Member Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Featured Clubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Premier Sports Sanctuaries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Featured Sports Clubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore handpicked Olympic-grade clubs in Ahmedabad, Vadodara, Surat, Mumbai, and Bengaluru.
            </p>
          </div>

          <button
            onClick={() => setActiveView('clubs')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 group transition-colors self-start sm:self-auto"
          >
            <span>Explore All 50+ Clubs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredClubs.map((club) => (
            <UserClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      {/* Section 2: Popular Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Instant Court & Pool Booking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Popular Facilities & Arenas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Book by the hour with guaranteed court availability, floodlights, and professional coaching.
            </p>
          </div>

          <button
            onClick={() => setActiveView('facilities')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 group transition-colors self-start sm:self-auto"
          >
            <span>Browse All Facilities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFacilities.map((facility) => (
            <UserFacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>

      {/* Section 3: Membership Offers & Multi-Club Pass */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                Multi-Club Membership Passes
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                One Digital Card. Unlimited Courts, Pools & Family Access.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Upgrade to a Playnex Gold or Family membership. Enjoy complimentary guest passes, advance slot booking privileges, and discounts at partner club restaurants and wellness spas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority slot booking 7 days ahead</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Include spouse & children</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Turnstile QR check-in</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Reciprocal multi-city privileges</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveView('memberships')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all"
                >
                  Explore Membership Plans
                </button>
                <button
                  onClick={() => setActiveView('family')}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  Manage Family Circle
                </button>
              </div>
            </div>

            {/* Visual Digital Card Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-gradient-to-tr from-amber-950 via-slate-900 to-amber-900 rounded-3xl p-6 border border-amber-600/30 shadow-2xl space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                      Gold Annual Pass
                    </span>
                    <h4 className="text-lg font-black text-white mt-1">Sunrise Sports Club</h4>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
                    PLX
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Member</div>
                  <div className="text-sm font-bold text-white">John Doe</div>
                  <div className="text-xs font-mono text-amber-300">PLX-SUN-88492</div>
                </div>

                <div className="flex justify-between items-end border-t border-white/10 pt-3">
                  <span className="text-[11px] text-emerald-400 font-bold">Active Member</span>
                  <span className="text-[11px] text-slate-400">Valid till Jan 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Upcoming Events & Tournaments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Tournaments & Socials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Upcoming Club Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compete in city tennis opens, join sound baths, or network at executive squash invitationals.
            </p>
          </div>

          <button
            onClick={() => setActiveView('events')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 group transition-colors self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <UserEventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Section 5: Member Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Trusted by 25,000+ Sports Enthusiasts
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              What Our Members Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "As an avid tennis player traveling between Ahmedabad and Mumbai, having Playnex is a lifesaver. I book red clay courts at Sunrise and sky gym at Elite under one account."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">John Doe</div>
                  <div className="text-[10px] text-slate-400">Gold Member, Sunrise Sports Club</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The family pass allows my husband to swim while my kids train at the junior badminton academy. The instant QR turnstile access means zero waiting at the reception!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Priya Sharma</div>
                  <div className="text-[10px] text-slate-400">Family Pass, Riverside Club</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Green Valley’s panoramic padel courts are world-class. Playnex makes splitting slots, booking time, and downloading invoices super frictionless."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Member"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Rahul Mehta</div>
                  <div className="text-[10px] text-slate-400">Member, Green Valley Club</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End of content */}
    </div>
  );
};
