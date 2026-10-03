'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useClub } from '../context/ClubContext';
import { bookingsService, BookingItem } from '../services/bookings.service';
import { facilitiesService, FacilityItem } from '../services/facilities.service';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  X,
  Info,
} from 'lucide-react';

export const ClubBookings: React.FC = () => {
  const { selectedBranch } = useClub();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('17:00:00');
  const [endTime, setEndTime] = useState('18:00:00');
  const [totalAmount, setTotalAmount] = useState('800');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bkgRes, facRes] = await Promise.all([
        bookingsService.getBookings(),
        facilitiesService.getFacilities(),
      ]);
      if (bkgRes.success && Array.isArray(bkgRes.data)) {
        setBookings(bkgRes.data);
      }
      if (facRes.success && Array.isArray(facRes.data)) {
        setFacilities(facRes.data);
        if (facRes.data.length > 0 && !selectedFacilityId) {
          setSelectedFacilityId(facRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching bookings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityId || !memberName.trim()) {
      setError('Please choose a facility and provide a member name');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await bookingsService.createBooking({
        facilityId: selectedFacilityId,
        memberName: memberName.trim(),
        bookingDate,
        startTime,
        endTime,
        totalAmount: Number(totalAmount) || 0,
        status: 'confirmed',
        paymentStatus: 'paid',
      });
      if (res.success) {
        setIsModalOpen(false);
        setMemberName('');
        await fetchData();
      } else {
        setError(res.message || 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to book slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsService.cancelBooking(id);
      await fetchData();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (
        searchTerm &&
        !((b.memberName || '') + (b.facilityName || '') + (b.id || ''))
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [bookings, filterStatus, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Court &amp; Facility Bookings
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time schedule and slot reservations for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member name, facility, or booking ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading reservations...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Facility / Arena</th>
                  <th className="py-3 px-4">Date &amp; Slot</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{b.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{b.memberName}</div>
                      <div className="text-[11px] text-slate-400">{b.memberEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{b.facilityName}</div>
                      <div className="text-[11px] text-slate-400">{b.facilityType}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{b.bookingDate}</div>
                      <div className="text-[11px] text-slate-400">
                        {b.startTime?.slice(0, 5)} - {b.endTime?.slice(0, 5)}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      ₹ {Number(b.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status === 'confirmed' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No Reservations Found</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Create a new slot booking using the button above.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reserve a Court Slot</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Facility / Court</label>
                <select
                  required
                  value={selectedFacilityId}
                  onChange={(e) => {
                    setSelectedFacilityId(e.target.value);
                    const fac = facilities.find((f) => f.id === e.target.value);
                    if (fac) setTotalAmount(String(fac.hourlyRate || 800));
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.type}) - ₹ {f.hourlyRate}/hr
                    </option>
                  ))}
                  {facilities.length === 0 && <option value="">No facilities available</option>}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Member Name</label>
                <input
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Booking Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime.slice(0, 5)}
                    onChange={(e) => setStartTime(`${e.target.value}:00`)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime.slice(0, 5)}
                    onChange={(e) => setEndTime(`${e.target.value}:00`)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Slot Total Fee (₹)</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
