import React from 'react';
import { Star, MapPin, Heart, ChevronRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { Club } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserClubCardProps {
  club: Club;
}

export const UserClubCard: React.FC<UserClubCardProps> = ({ club }) => {
  const { navigateToClubDetails, startBooking, favoriteClubIds, toggleFavoriteClub } = useUserStore();
  const isFavorite = favoriteClubIds.includes(club.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Club Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={club.heroImage}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteClub(club.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:bg-white shadow-md transition-all active:scale-95"
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Membership Available Badge */}
        {club.membershipAvailable && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
            <ShieldCheck className="w-3 h-3" />
            <span>Membership Open</span>
          </div>
        )}

        {/* City and Rating overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 text-xs font-semibold drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{club.city}</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{club.rating}</span>
            <span className="text-slate-400 text-[10px] font-normal">({club.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3
            onClick={() => navigateToClubDetails(club.id)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {club.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {club.description}
          </p>

          {/* Sports Pill List */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {club.sports.slice(0, 4).map((sport) => (
              <span
                key={sport}
                className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {sport}
              </span>
            ))}
            {club.sports.length > 4 && (
              <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md self-center">
                +{club.sports.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Facilities From</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-extrabold text-slate-900">₹{club.minPricePerHour}</span>
              <span className="text-[11px] text-slate-500 font-normal">/hr</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateToClubDetails(club.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => startBooking(club.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shadow-blue-500/20 flex items-center gap-1"
            >
              <span>Book</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
