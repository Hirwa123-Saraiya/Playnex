import React, { useState } from 'react';
import { Search, Trophy, Filter } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserFacilityCard } from '../../components/user/UserFacilityCard';

export const UserFacilities: React.FC = () => {
  const { facilities, clubs } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Tennis Court',
    'Badminton Court',
    'Swimming Pool',
    'Gym',
    'Squash Court',
    'Padel Court',
    'Restaurant',
  ];

  const filteredFacilities = facilities.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesClub = selectedClubFilter === 'All' || f.clubId === selectedClubFilter;
    const matchesSearch =
      search.trim() === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.clubName.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesClub && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Hourly Booking & Access</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Courts, Pools & Arenas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Reserve individual slots with guaranteed court readiness, high-lux floodlights, and professional coaching across all Playnex partner clubs.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility or court name (e.g. Grand Slam Tennis, Olympic Pool)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedClubFilter}
              onChange={(e) => setSelectedClubFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Sports Clubs</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900 font-black">{filteredFacilities.length}</span> facilities
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFacilities.map((facility) => (
          <UserFacilityCard key={facility.id} facility={facility} />
        ))}
      </div>
    </div>
  );
};
