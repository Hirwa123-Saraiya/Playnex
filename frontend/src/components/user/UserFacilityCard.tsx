import React from 'react';
import { Star, Heart, Clock, Users, Award, ChevronRight } from 'lucide-react';
import { Facility } from '../../types/user.types';
import { useUserStore } from '../../store/userStore';

interface UserFacilityCardProps {
  facility: Facility;
}

export const UserFacilityCard: React.FC<UserFacilityCardProps> = ({ facility }) => {
  const { navigateToFacilityDetails, startBooking, favoriteFacilityIds, toggleFavoriteFacility } = useUserStore();
  const isFavorite = favoriteFacilityIds.includes(facility.id);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Facility Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteFacility(facility.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 hover:bg-white shadow-md transition-all active:scale-95"
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
          {facility.category}
        </div>

        {/* Bottom image overlay: Club Name & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-semibold text-blue-200 truncate pr-2">
            {facility.clubName}
          </span>
          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold border border-white/10 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{facility.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h4
            onClick={() => navigateToFacilityDetails(facility.id)}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1"
          >
            {facility.name}
          </h4>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {facility.type}
          </p>

          {/* Quick Specs */}
          <div className="flex items-center gap-3 mt-3 text-slate-500 text-xs">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Up to {facility.capacity} pax</span>
            </div>
            {facility.coachingAvailable && (
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>Coach Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Pricing & Booking */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Price</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-extrabold text-slate-900">₹{facility.pricingPerHour}</span>
              <span className="text-[11px] text-slate-500">/hr</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateToFacilityDetails(facility.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => startBooking(facility.clubId, facility.id)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shadow-blue-500/20 flex items-center gap-1"
            >
              <span>Book Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
