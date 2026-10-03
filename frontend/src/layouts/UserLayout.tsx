import React from 'react';
import { useUserStore } from '../store/userStore';
import { UserHeader } from '../components/user/UserHeader';
import { UserFooter } from '../components/user/UserFooter';
import { UserBottomNav } from '../components/user/UserBottomNav';
import { UserNotificationPanel } from '../components/user/UserNotificationPanel';
import { TrialBanner } from '../components/user/TrialBanner';
import { TrialExpiredModal } from '../components/user/TrialExpiredModal';

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
import { UserAuthModal } from '../components/user/UserAuthModal';

// Club Owner Layout fallback
import { ClubLayout } from './ClubLayout';
import { Layers } from 'lucide-react';

export const UserLayout: React.FC = () => {
  const {
    activeView,
    portalMode,
    setPortalMode,
    guestAuthModalOpen,
    closeGuestModal,
    fetchLiveData,
    trialExpiredModalOpen,
    closeTrialExpiredModal,
  } = useUserStore();

  React.useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // If user switched to club-owner portal, render ClubLayout with switcher banner
  if (portalMode === 'club-owner') {
    return (
      <div className="relative">
        <div className="sticky top-0 z-50 bg-navy text-white text-xs py-2 px-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[10px]">
              CLUB OWNER PORTAL
            </span>
            <span className="hidden sm:inline">
              Viewing the Enterprise Sports Club Administration Portal
            </span>
          </div>
          <button
            onClick={() => setPortalMode('user')}
            className="px-3 py-1 bg-white text-navy font-bold rounded-lg hover:bg-blueSoft transition-colors flex items-center gap-1"
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
      case 'home':                 return <UserHome />;
      case 'clubs':                return <UserClubs />;
      case 'club-details':         return <UserClubDetails />;
      case 'facilities':           return <UserFacilities />;
      case 'facility-details':     return <UserFacilityDetails />;
      case 'booking-create':       return <UserBookingCreate />;
      case 'booking-confirmation': return <UserBookingConfirmation />;
      case 'bookings':             return <UserBookings />;
      case 'memberships':          return <UserMemberships />;
      case 'membership-purchase':  return <UserMembershipPurchase />;
      case 'events':               return <UserEvents />;
      case 'event-details':        return <UserEventDetails />;
      case 'family':               return <UserFamilyMembers />;
      case 'profile':              return <UserProfile />;
      case 'payments':             return <UserPayments />;
      case 'reviews':              return <UserReviews />;
      case 'notifications':        return <UserNotifications />;
      case 'favorites':            return <UserFavorites />;
      case 'login':                return <UserLogin />;
      case 'register':             return <UserRegister />;
      case 'forgot-password':      return <UserForgotPassword />;
      default:                     return <UserHome />;
    }
  };

  return (
    <div className="min-h-screen bg-page text-text flex flex-col font-sans selection:bg-blue selection:text-white">
      {/* Header */}
      <UserHeader />

      {/* 7-day trial countdown banner */}
      <TrialBanner />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">{renderActiveView()}</main>

      {/* Slide-out Notification Drawer */}
      <UserNotificationPanel />

      {/* Mobile-first bottom navigation dock */}
      <UserBottomNav />

      {/* Footer */}
      <UserFooter />

      {/* Member Sign In & Sign Up Modal */}
      <UserAuthModal
        isOpen={guestAuthModalOpen}
        onClose={closeGuestModal}
      />

      {/* Trial expired blocking modal */}
      <TrialExpiredModal
        open={trialExpiredModalOpen}
        onClose={closeTrialExpiredModal}
      />
    </div>
  );
};