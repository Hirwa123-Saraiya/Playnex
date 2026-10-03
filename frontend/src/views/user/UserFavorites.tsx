import React, { useState } from 'react';
import { Heart, Compass, Trophy, Flame } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { UserClubCard } from '../../components/user/UserClubCard';
import { UserFacilityCard } from '../../components/user/UserFacilityCard';
import { UserEventCard } from '../../components/user/UserEventCard';

export const UserFavorites: React.FC = () => {
  const {
    clubs,
    facilities,
    events,
    favoriteClubIds,
    favoriteFacilityIds,
    favoriteEventIds,
    setActiveView,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'clubs' | 'facilities' | 'events'>('clubs');

  const favClubs = clubs.filter((c) => favoriteClubIds.includes(c.id));
  const favFacilities = facilities.filter((f) => favoriteFacilityIds.includes(f.id));
  const favEvents = events.filter((e) => favoriteEventIds.includes(e.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-rose-600" />
          <span>Saved Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Favorites & Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Quick access to your preferred clubs, favorite courts, and bookmarked tournaments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'clubs' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saved Clubs ({favClubs.length})
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'facilities' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saved Courts & Facilities ({favFacilities.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Saved Events ({favEvents.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'clubs' && (
        <div>
          {favClubs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border text-slate-400 space-y-2">
              <Compass className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-xs">No saved clubs yet. Tap the heart icon on any club card.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favClubs.map((club) => (
                <UserClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'facilities' && (
        <div>
          {favFacilities.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border text-slate-400 space-y-2">
              <Flame className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-xs">No saved courts or pools yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favFacilities.map((fac) => (
                <UserFacilityCard key={fac.id} facility={fac} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <div>
          {favEvents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border text-slate-400 space-y-2">
              <Trophy className="w-10 h-10 mx-auto stroke-1" />
              <p className="text-xs">No saved tournaments or activities yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {favEvents.map((evt) => (
                <UserEventCard key={evt.id} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
