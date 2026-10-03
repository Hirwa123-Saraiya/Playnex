import React from 'react';
import { Search, MapPin, SlidersHorizontal, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserClubCard } from '../../components/user/UserClubCard';

export const UserClubs: React.FC = () => {
  const {
    clubs,
    selectedCity,
    setSelectedCity,
    selectedSport,
    setSelectedSport,
    filterMembershipOnly,
    setFilterMembershipOnly,
    searchQuery,
    setSearchQuery,
    resetFilters,
  } = useUserStore();

  const cities = ['All', 'Ahmedabad', 'Vadodara', 'Surat', 'Mumbai', 'Bengaluru', 'Delhi NCR'];
  const sports = ['All', 'Tennis', 'Badminton', 'Swimming', 'Squash', 'Gym & Fitness', 'Padel'];

  // Filter logic
  const filteredClubs = clubs.filter((club) => {
    const matchesCity = selectedCity === 'All' || club.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSport = selectedSport === 'All' || club.sports.includes(selectedSport);
    const matchesMembership = !filterMembershipOnly || club.membershipAvailable;
    const matchesQuery =
      searchQuery.trim() === '' ||
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.sports.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesSport && matchesMembership && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Title matching step 2 in reference image */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Step 2 • Multi-Club Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Browse Verified Sports Clubs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          One account gives you access to premier athletic clubs, Olympic pools, and racket sports arenas across India. Select any club to view available courts, memberships, and events.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input matching step 2 in reference image */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs by name, sport, or location (e.g. Sunrise, Padel, Ahmedabad)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 shrink-0 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={filterMembershipOnly}
              onChange={(e) => setFilterMembershipOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>Open Memberships Only</span>
          </label>

          {(searchQuery || selectedCity !== 'All' || selectedSport !== 'All' || filterMembershipOnly) && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* City Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Filter by City
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                  selectedCity === city
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {city === 'All' ? 'All Cities' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Sports Filter Pills */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Filter by Sport
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                  selectedSport === sport
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {sport === 'All' ? 'All Sports' : sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Count & Results */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900 font-black">{filteredClubs.length}</span> sports clubs
        </span>
      </div>

      {filteredClubs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No clubs match your current filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your city or sport filter parameters.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <UserClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </div>
  );
};
