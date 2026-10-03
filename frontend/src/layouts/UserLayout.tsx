import React from 'react';
import { useUserStore } from '../store/userStore';
import { UserHeader } from '../components/user/UserHeader';
import { UserFooter } from '../components/user/UserFooter';
import { UserBottomNav } from '../components/user/UserBottomNav';
import { UserNotificationPanel } from '../components/user/UserNotificationPanel';

// Views
import { UserHome } from '../views/user/UserHome';
import { UserClubs } from '../views/user/UserClubs';
import { UserClubDetails } from '../views/user/UserClubDetails';
import { UserFacilities } from '../views/user/UserFacilities';
import { UserFacilityDetails } from '../views/user/UserFacilityDetails';
import { UserBookingCreate } from '../views/user/UserBookingCreate';
import { UserBookingConfirmation } from '../views/user/UserBookingConfirmation';
import { UserBookings } from '../views/user/UserBookings';
import { UserMemberships } from '../views/user/UserMemberships';
import { UserMembershipPurchase } from '../views/user/UserMembershipPurchase';
import { UserEvents } from '../views/user/UserEvents';
import { UserEventDetails } from '../views/user/UserEventDetails';
import { UserFamilyMembers } from '../views/user/UserFamilyMembers';
import { UserProfile } from '../views/user/UserProfile';
import { UserPayments } from '../views/user/UserPayments';
import { UserReviews } from '../views/user/UserReviews';
import { UserNotifications } from '../views/user/UserNotifications';
import { UserFavorites } from '../views/user/UserFavorites';
import { UserLogin } from '../views/user/UserLogin';
import { UserRegister } from '../views/user/UserRegister';
import { UserForgotPassword } from '../views/user/UserForgotPassword';

// Club Owner Layout fallback
import { ClubLayout } from './ClubLayout';
import { X, Lock, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const UserLayout: React.FC = () => {
  const {
    activeView,
    portalMode,
    setPortalMode,
    guestAuthModalOpen,
    closeGuestModal,
    loginAsUser,
    setActiveView,
    fetchLiveData,
  } = useUserStore();

  React.useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // If user switched to club-owner portal, render ClubLayout with switcher banner
  if (portalMode === 'club-owner') {
    return (
      <div className="relative">
        <div className="sticky top-0 z-50 bg-blue-600 text-white text-xs py-2 px-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[10px]">
              CLUB OWNER PORTAL
            </span>
            <span className="hidden sm:inline">Viewing the Enterprise Sports Club Administration Portal</span>
          </div>
          <button
            onClick={() => setPortalMode('user')}
            className="px-3 py-1 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Switch to Customer / User Portal</span>
          </button>
        </div>
        <ClubLayout />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <UserHome />;
      case 'clubs':
        return <UserClubs />;
      case 'club-details':
        return <UserClubDetails />;
      case 'facilities':
        return <UserFacilities />;
      case 'facility-details':
        return <UserFacilityDetails />;
      case 'booking-create':
        return <UserBookingCreate />;
      case 'booking-confirmation':
        return <UserBookingConfirmation />;
      case 'bookings':
        return <UserBookings />;
      case 'memberships':
        return <UserMemberships />;
      case 'membership-purchase':
        return <UserMembershipPurchase />;
      case 'events':
        return <UserEvents />;
      case 'event-details':
        return <UserEventDetails />;
      case 'family':
        return <UserFamilyMembers />;
      case 'profile':
        return <UserProfile />;
      case 'payments':
        return <UserPayments />;
      case 'reviews':
        return <UserReviews />;
      case 'notifications':
        return <UserNotifications />;
      case 'favorites':
        return <UserFavorites />;
      case 'login':
        return <UserLogin />;
      case 'register':
        return <UserRegister />;
      case 'forgot-password':
        return <UserForgotPassword />;
      default:
        return <UserHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <UserHeader />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">{renderActiveView()}</main>

      {/* Slide-out Notification Drawer */}
      <UserNotificationPanel />

      {/* Mobile-first bottom navigation dock */}
      <UserBottomNav />

      {/* Footer */}
      <UserFooter />

      {/* Guest Authentication Interception Modal */}
      {guestAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <button
                onClick={closeGuestModal}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Sign in to Continue</h3>
              <p className="text-xs text-slate-500">
                You are currently browsing in Guest Mode. Making reservations, purchasing memberships, and payments require a verified Playnex account.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                One account unlocks instant bookings, digital QR turnstile passes, and family circles across 50+ clubs.
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  loginAsUser();
                  closeGuestModal();
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>Instant Sign In (Demo User)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  closeGuestModal();
                  setActiveView('login');
                }}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Use Another Email / Mobile OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
