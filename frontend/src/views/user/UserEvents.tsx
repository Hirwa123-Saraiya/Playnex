import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Filter, Search } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserEventCard } from '../../components/user/UserEventCard';

export const UserEvents: React.FC = () => {
  const { events, clubs } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Tournament', 'Fitness', 'Social', 'Workshop'];

  const filteredEvents = events.filter((e) => {
    const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.clubName.toLowerCase().includes(search.toLowerCase()) ||
      e.clubCity.toLowerCase().includes(search.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
          <Trophy className="w-4 h-4" />
          <span>Tournaments & Activities</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Club Events & Championships
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Participate in city tennis opens, weekend padel leagues, corporate squash invitationals, and wellness retreats across partner clubs.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tournament, championship, or club..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((evt) => (
          <UserEventCard key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
};
