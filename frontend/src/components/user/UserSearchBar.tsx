import React, { useState } from 'react';
import { Search, MapPin, Calendar, SlidersHorizontal, X } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

interface UserSearchBarProps {
  onSearchSubmit?: () => void;
  showFiltersModal?: boolean;
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({ onSearchSubmit }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    selectedSport,
    setSelectedSport,
    filterMembershipOnly,
    setFilterMembershipOnly,
    resetFilters,
  } = useUserStore();

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const cities = ['All', 'Ahmedabad', 'Vadodara', 'Surat', 'Mumbai', 'Bengaluru', 'Delhi NCR'];
  const sports = ['All', 'Tennis', 'Badminton', 'Swimming', 'Squash', 'Gym & Fitness', 'Padel'];

  return (
    <div className="w-full">
      {/* Floating Modern Pill Search Bar */}
      <div className="bg-white p-2 rounded-2xl md:rounded-full border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto">
        {/* Input 1: Club or Sport Name */}
        <div className="flex items-center gap-3 px-4 py-2 w-full md:w-auto md:flex-1">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              What sport or club?
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Sunrise Sports, Tennis, Heated Pool..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Input 2: City Selector */}
        <div className="flex items-center gap-3 px-4 py-2 w-full md:w-48">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              City
            </span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-200" />

        {/* Input 3: Sport Category */}
        <div className="flex items-center gap-3 px-4 py-2 w-full md:w-48">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Sport
            </span>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport === 'All' ? 'All Sports' : sport}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-1 md:pb-0">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="p-3 rounded-full hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200 md:border-transparent"
            title="More Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onSearchSubmit}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Search & Filter Preferences</h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">City</label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedCity === city
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Sport / Discipline</label>
                <div className="flex flex-wrap gap-2">
                  {sports.map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedSport === sport
                          ? 'bg-blue-600 text-white border-blue-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterMembershipOnly}
                    onChange={(e) => setFilterMembershipOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Show only clubs with open membership plans
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Reset All
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
