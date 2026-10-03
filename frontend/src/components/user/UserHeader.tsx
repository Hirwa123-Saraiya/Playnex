import React, { useState } from 'react';
import {
  Search,
  Bell,
  Heart,
  User as UserIcon,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserHeader: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isGuest,
    currentUser,
    notifications,
    toggleNotificationPanel,
    favoriteClubIds,
    favoriteFacilityIds,
    favoriteEventIds,
    openGuestModal,
    logout,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    setPortalMode,
  } = useUserStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const totalFavoritesCount =
    favoriteClubIds.length + favoriteFacilityIds.length + favoriteEventIds.length;

  const cities = ['All', 'Ahmedabad', 'Vadodara', 'Surat', 'Mumbai', 'Bengaluru', 'Delhi NCR'];

  const navLinks = [
    { label: 'Explore Clubs', view: 'clubs' as const },
    { label: 'Facilities', view: 'facilities' as const },
    { label: 'Memberships', view: 'memberships' as const },
    { label: 'Events', view: 'events' as const },
    { label: 'My Bookings', view: 'bookings' as const },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-line shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ---------- LEFT: Brand + City ---------- */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue flex items-center justify-center text-white shadow-sm shadow-blue/30 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-lg tracking-tight">P</span>
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-navy leading-none">
                    PLAYNEX
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blueSoft text-blue leading-none">
                    USER
                  </span>
                </div>
                <p className="text-[9px] text-muted font-semibold tracking-wider uppercase mt-0.5">
                  Sports Club Network
                </p>
              </div>
            </button>

            <div className="h-8 w-px bg-line hidden md:block" />

            {/* City Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-blueSoft hover:bg-blueSoft/70 text-navy text-xs font-semibold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-blue" />
                <span className="whitespace-nowrap">
                  {selectedCity === 'All' ? 'All Cities' : selectedCity}
                </span>
                <ChevronDown className="w-3 h-3 text-muted" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-popover border border-line py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-muted uppercase tracking-wider">
                    Select City
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blueSoft hover:text-blue ${
                        selectedCity === city
                          ? 'font-bold text-blue bg-blueSoft/50'
                          : 'text-text'
                      }`}
                    >
                      <span>{city === 'All' ? 'All Cities' : city}</span>
                      {selectedCity === city && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ---------- CENTER: Nav ---------- */}
          <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => setActiveView(link.view)}
                  className={`px-3 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue bg-blueSoft'
                      : 'text-text hover:text-navy hover:bg-blueSoft/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ---------- RIGHT: Search + Icons + Auth ---------- */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search */}
            <div className="relative hidden xl:block w-52 mr-1">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clubs, tennis..."
                className="h-9 w-full pl-9 pr-3 bg-blueSoft/60 hover:bg-blueSoft focus:bg-white text-xs rounded-lg border border-line focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10 transition-all text-text placeholder:text-muted"
              />
            </div>

            {/* Favorites */}
            <button
              onClick={() => setActiveView('favorites')}
              className={`relative grid place-items-center w-9 h-9 rounded-lg transition-colors ${
                activeView === 'favorites'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-muted hover:text-rose-600 hover:bg-blueSoft'
              }`}
              title="Saved"
            >
              <Heart className="w-[18px] h-[18px]" />
              {totalFavoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalFavoritesCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={toggleNotificationPanel}
              className="relative grid place-items-center w-9 h-9 rounded-lg text-muted hover:text-blue hover:bg-blueSoft transition-colors"
              title="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue rounded-full ring-2 ring-white" />
              )}
            </button>

            <div className="h-6 w-px bg-line mx-1" />

            {/* Auth */}
            {isGuest ? (
              <button
                onClick={() => openGuestModal()}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-bold bg-blue text-white hover:bg-blueHover transition-colors shadow-sm shadow-blue/25 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-blueSoft transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-blue text-white text-[11px] font-bold flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:block text-xs font-bold text-navy leading-none max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-popover border border-line py-2 z-50">
                    <div className="px-4 py-2 border-b border-line">
                      <p className="text-xs font-bold text-navy">{currentUser.name}</p>
                      <p className="text-[11px] text-muted truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => { setActiveView('profile'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-text hover:bg-blueSoft hover:text-blue flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile
                      </button>
                      <button
                        onClick={() => { setActiveView('bookings'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-text hover:bg-blueSoft hover:text-blue flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" /> My Bookings
                      </button>
                      <button
                        onClick={() => { setActiveView('memberships'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-text hover:bg-blueSoft hover:text-blue flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" /> Memberships
                      </button>
                      <button
                        onClick={() => { setActiveView('payments'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-text hover:bg-blueSoft hover:text-blue flex items-center gap-2"
                      >
                        <Layers className="w-4 h-4" /> Payments & Invoices
                      </button>
                      <button
                        onClick={() => { setActiveView('reviews'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-text hover:bg-blueSoft hover:text-blue flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> My Reviews
                      </button>
                    </div>

                    <div className="border-t border-line pt-1">
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid place-items-center w-9 h-9 rounded-lg text-navy hover:bg-blueSoft lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-line bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center gap-2 bg-blueSoft/60 p-2 rounded-lg border border-line">
            <Search className="w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sports, clubs..."
              className="bg-transparent text-xs w-full focus:outline-none text-text placeholder:text-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPortalMode('club-owner')}
              className="px-3 py-2 rounded-lg bg-navy text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-blueAlt" /> Club Owner
            </button>
            <button
              onClick={() => { isGuest ? openGuestModal() : logout(); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg border border-line text-xs font-semibold text-navy"
            >
              {isGuest ? 'Sign In' : 'Sign Out'}
            </button>
          </div>

          <div className="space-y-0.5 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => { setActiveView(link.view); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeView === link.view
                    ? 'bg-blueSoft text-blue'
                    : 'text-text hover:bg-blueSoft/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};



// import React, { useState } from 'react';
// import {
//   Search,
//   Bell,
//   Heart,
//   User as UserIcon,
//   MapPin,
//   Calendar,
//   Layers,
//   ChevronDown,
//   Menu,
//   X,
//   Sparkles,
//   ShieldCheck,
//   LogOut,
//   LogIn,
//   SlidersHorizontal,
// } from 'lucide-react';
// import { useUserStore } from '../../store/userStore';

// export const UserHeader: React.FC = () => {
//   const {
//     activeView,
//     setActiveView,
//     isGuest,
//     currentUser,
//     notifications,
//     toggleNotificationPanel,
//     favoriteClubIds,
//     favoriteFacilityIds,
//     favoriteEventIds,
//     openGuestModal,
//     logout,
//     loginAsUser,
//     selectedCity,
//     setSelectedCity,
//     searchQuery,
//     setSearchQuery,
//     portalMode,
//     setPortalMode,
//   } = useUserStore();

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

//   const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
//   const totalFavoritesCount = favoriteClubIds.length + favoriteFacilityIds.length + favoriteEventIds.length;

//   const cities = ['All', 'Ahmedabad', 'Vadodara', 'Surat', 'Mumbai', 'Bengaluru', 'Delhi NCR'];

//   const navLinks = [
//     { label: 'Explore Clubs', view: 'clubs' as const },
//     { label: 'Facilities', view: 'facilities' as const },
//     { label: 'Memberships', view: 'memberships' as const },
//     { label: 'Events & Tournaments', view: 'events' as const },
//     { label: 'My Bookings', view: 'bookings' as const },
//   ];

//   return (
//     <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
//       {/* Top micro announcement bar */}
//       <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white text-xs py-1.5 px-4 hidden md:block">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border border-blue-400/30 flex items-center gap-1">
//               <Sparkles className="w-2.5 h-2.5" /> MULTI-CLUB PLATFORM
//             </span>
//             <span className="text-slate-200">
//               One Account. Multiple Clubs. Book sports & wellness across 6 cities with instant confirmation.
//             </span>
//           </div>
//           <div className="flex items-center gap-4 text-slate-300">
//             {/* Quick Switch to Club Owner Portal */}
//             <button
//               onClick={() => setPortalMode('club-owner')}
//               className="text-xs text-blue-300 hover:text-white flex items-center gap-1 transition-colors font-medium bg-white/10 px-2 py-0.5 rounded-md hover:bg-white/20"
//               title="Switch to Club Management Portal"
//             >
//               <Layers className="w-3 h-3 text-blue-400" />
//               Switch to Club Owner Portal
//             </button>
//             <div className="h-3 w-px bg-slate-700" />
//             <span className="text-xs text-slate-400">24/7 Concierge: 1800-PLAYNEX</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Header Container */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
//           {/* Logo & Brand */}
//           <div className="flex items-center gap-6">
//             <button
//               onClick={() => setActiveView('home')}
//               className="flex items-center gap-2.5 group text-left focus:outline-none"
//             >
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
//                 <span className="font-extrabold text-xl tracking-tight">P</span>
//               </div>
//               <div>
//                 <div className="flex items-center gap-1.5">
//                   <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
//                     PLAYNEX
//                   </span>
//                   <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
//                     USER
//                   </span>
//                 </div>
//                 <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
//                   Sports Club Network
//                 </p>
//               </div>
//             </button>

//             {/* City Selector Pill */}
//             <div className="relative hidden lg:block">
//               <button
//                 onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
//               >
//                 <MapPin className="w-3.5 h-3.5 text-blue-600" />
//                 <span>{selectedCity === 'All' ? 'All Cities' : selectedCity}</span>
//                 <ChevronDown className="w-3 h-3 text-slate-400" />
//               </button>

//               {cityDropdownOpen && (
//                 <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
//                   <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
//                     Select City
//                   </div>
//                   {cities.map((city) => (
//                     <button
//                       key={city}
//                       onClick={() => {
//                         setSelectedCity(city);
//                         setCityDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 hover:text-blue-600 transition-colors ${
//                         selectedCity === city ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
//                       }`}
//                     >
//                       <span>{city === 'All' ? 'All Cities' : city}</span>
//                       {selectedCity === city && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Desktop Navigation Links */}
//           <nav className="hidden md:flex items-center gap-1 lg:gap-2">
//             {navLinks.map((link) => {
//               const isActive = activeView === link.view;
//               return (
//                 <button
//                   key={link.view}
//                   onClick={() => setActiveView(link.view)}
//                   className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
//                     isActive
//                       ? 'text-blue-600 bg-blue-50/80 font-bold'
//                       : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
//                   }`}
//                 >
//                   {link.label}
//                   {isActive && (
//                     <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-blue-600 rounded-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Actions & Profile */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             {/* Search Trigger */}
//             <div className="relative hidden xl:block w-48">
//               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search clubs, tennis..."
//                 className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-full border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
//               />
//             </div>

//             {/* Favorites Icon */}
//             <button
//               onClick={() => setActiveView('favorites')}
//               className={`p-2 sm:p-2.5 rounded-full relative transition-colors ${
//                 activeView === 'favorites'
//                   ? 'bg-rose-50 text-rose-600'
//                   : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
//               }`}
//               title="Saved Clubs & Facilities"
//             >
//               <Heart className="w-5 h-5" />
//               {totalFavoritesCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
//                   {totalFavoritesCount}
//                 </span>
//               )}
//             </button>

//             {/* Notification Bell */}
//             <button
//               onClick={toggleNotificationPanel}
//               className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 relative transition-colors"
//               title="Notifications"
//             >
//               <Bell className="w-5 h-5" />
//               {unreadNotifsCount > 0 && (
//                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
//               )}
//             </button>

//             {/* User Profile or Guest Auth */}
//             {isGuest ? (
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => openGuestModal()}
//                   className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/25 flex items-center gap-1.5"
//                 >
//                   <LogIn className="w-4 h-4" />
//                   <span>Sign In</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="relative">
//                 <button
//                   onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
//                   className="flex items-center gap-2 p-1.5 rounded-full sm:rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
//                 >
//                   <img
//                     src={currentUser.avatarUrl}
//                     alt={currentUser.name}
//                     className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
//                   />
//                   <div className="hidden sm:block text-left pr-1">
//                     <div className="text-xs font-bold text-slate-800 leading-tight">
//                       {currentUser.name}
//                     </div>
//                     <div className="text-[10px] text-blue-600 font-semibold leading-none">
//                       Gold Member
//                     </div>
//                   </div>
//                   <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
//                 </button>

//                 {profileDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
//                     <div className="px-4 py-2 border-b border-slate-100">
//                       <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
//                       <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
//                       <span className="mt-1 inline-block text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
//                         Multi-Club Member
//                       </span>
//                     </div>

//                     <div className="py-1">
//                       <button
//                         onClick={() => {
//                           setActiveView('profile');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <UserIcon className="w-4 h-4" /> My Profile & Preferences
//                       </button>
//                       <button
//                         onClick={() => {
//                           setActiveView('bookings');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <Calendar className="w-4 h-4" /> My Bookings
//                       </button>
//                       <button
//                         onClick={() => {
//                           setActiveView('memberships');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <ShieldCheck className="w-4 h-4" /> Memberships & Cards
//                       </button>
//                       <button
//                         onClick={() => {
//                           setActiveView('family');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <UserIcon className="w-4 h-4" /> Family Members
//                       </button>
//                       <button
//                         onClick={() => {
//                           setActiveView('payments');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <Layers className="w-4 h-4" /> Payments & Invoices
//                       </button>
//                       <button
//                         onClick={() => {
//                           setActiveView('reviews');
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
//                       >
//                         <Sparkles className="w-4 h-4" /> My Reviews & Ratings
//                       </button>
//                     </div>

//                     <div className="border-t border-slate-100 pt-1">
//                       <button
//                         onClick={() => {
//                           logout();
//                           setProfileDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
//                       >
//                         <LogOut className="w-4 h-4" /> Sign Out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Mobile Hamburger Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
//           <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl">
//             <Search className="w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search sports, clubs, swimming..."
//               className="bg-transparent text-xs w-full focus:outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-2 pt-1">
//             <button
//               onClick={() => setPortalMode('club-owner')}
//               className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
//             >
//               <Layers className="w-3.5 h-3.5 text-blue-400" /> Club Owner
//             </button>
//             <button
//               onClick={() => {
//                 isGuest ? loginAsUser() : logout();
//                 setMobileMenuOpen(false);
//               }}
//               className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1"
//             >
//               {isGuest ? 'Sign In' : 'Sign Out'}
//             </button>
//           </div>

//           <div className="space-y-1 pt-2">
//             {navLinks.map((link) => (
//               <button
//                 key={link.view}
//                 onClick={() => {
//                   setActiveView(link.view);
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
//                   activeView === link.view ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
//                 }`}
//               >
//                 <span>{link.label}</span>
//                 {activeView === link.view && <div className="w-2 h-2 rounded-full bg-blue-600" />}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };
