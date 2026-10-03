import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  User as UserIcon,
  CreditCard,
  Bell,
  Heart,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Download,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Booking, BookingStatus } from '../../types/user.types';
import { UserBookingCard } from '../../components/user/UserBookingCard';
import { UserBookingDetails } from './UserBookingDetails';

export const UserBookings: React.FC = () => {
  const {
    currentUser,
    bookings,
    clubs,
    setActiveView,
    logout,
    startBooking,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [selectedClubFilter, setSelectedClubFilter] = useState<string>('All');
  const [detailsModalBooking, setDetailsModalBooking] = useState<Booking | null>(null);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeTab === 'All' || b.status === activeTab;
    const matchesClub = selectedClubFilter === 'All' || b.clubId === selectedClubFilter;
    return matchesTab && matchesClub;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Upcoming
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  const navMenuItems = [
    { label: 'Dashboard', view: 'home' as const, icon: LayoutDashboard },
    { label: 'My Bookings', view: 'bookings' as const, icon: Calendar, active: true },
    { label: 'My Memberships', view: 'memberships' as const, icon: ShieldCheck },
    { label: 'My Profile', view: 'profile' as const, icon: UserIcon },
    { label: 'Payments', view: 'payments' as const, icon: CreditCard },
    { label: 'Notifications', view: 'notifications' as const, icon: Bell },
    { label: 'Favorites', view: 'favorites' as const, icon: Heart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step 7 banner matching user journey image */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
            Step 7 • Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            View All Bookings (My Account)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            User can see and manage all their bookings across different clubs and facilities.
          </p>
        </div>

        <button
          onClick={() => startBooking()}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Main Layout Grid matching step 7 in reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Account Sidebar matching reference image */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-6">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h3>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveView(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    item.active
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Right Content Area: Bookings List matching reference image */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Top Bar: Title & Club Filter Dropdown matching step 7 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">My Bookings</h2>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Club:</span>
              <select
                value={selectedClubFilter}
                onChange={(e) => setSelectedClubFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Clubs</option>
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs matching step 7 in reference image: All, Upcoming, Past, Cancelled */}
          <div className="border-b border-slate-100 flex items-center gap-6 text-xs font-bold text-slate-500">
            {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 transition-all relative ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 font-black'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab === 'Completed' ? 'Past' : tab}
              </button>
            ))}
          </div>

          {/* Table View matching step 7 in reference image */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3">Facility</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No bookings found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{b.id}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900">{b.clubName}</td>
                      <td className="py-3.5 px-3 text-slate-700">{b.facilityName}</td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="font-semibold text-slate-800">{b.date}</div>
                        <div className="text-[11px] text-slate-400">{b.timeSlot}</div>
                      </td>
                      <td className="py-3.5 px-3 font-black text-slate-900">₹{b.totalPaid}</td>
                      <td className="py-3.5 px-3">{getStatusBadge(b.status)}</td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => setDetailsModalBooking(b)}
                          className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-blue-600 font-bold rounded-lg transition-colors border border-slate-200 text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards List */}
          <div className="md:hidden space-y-4">
            {filteredBookings.map((b) => (
              <UserBookingCard
                key={b.id}
                booking={b}
                onViewDetails={(booking) => setDetailsModalBooking(booking)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {detailsModalBooking && (
        <UserBookingDetails
          booking={detailsModalBooking}
          onClose={() => setDetailsModalBooking(null)}
        />
      )}
    </div>
  );
};
