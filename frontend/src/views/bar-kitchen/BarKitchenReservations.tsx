import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useBarKitchenStore } from '../../store/BarKitchenStore';
import { BarKitchenReservationCard } from '../../components/bar-kitchen/BarKitchenReservationCard';
import { BarKitchenReservation } from '../../types/BarKitchenTypes';

export const BarKitchenReservations: React.FC = () => {
  const { reservations, addReservation, updateReservationStatus, tables } =
    useBarKitchenStore();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'List' | 'Calendar' | 'Timeline'>('List');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New reservation form state
  const [form, setForm] = useState<Partial<BarKitchenReservation>>({
    guestName: '',
    phone: '',
    email: '',
    pax: 2,
    timeSlot: '8:00 PM',
    date: 'Today',
    type: 'Advance',
    area: 'Indoor',
    specialRequests: '',
  });

  const filteredReservations = reservations.filter((r) => {
    const matchesTab = activeTab === 'All' || r.status === activeTab;
    const matchesSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    return matchesTab && matchesSearch;
  });

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName || !form.phone) return;

    const newRes: BarKitchenReservation = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      guestName: form.guestName,
      phone: form.phone,
      email: form.email || '',
      type: form.type as any || 'Advance',
      status: 'Reserved',
      date: form.date || 'Today',
      timeSlot: form.timeSlot || '8:00 PM',
      pax: Number(form.pax) || 2,
      area: form.area as any || 'Indoor',
      specialRequests: form.specialRequests,
    };

    addReservation(newRes);
    setShowAddModal(false);
    setForm({
      guestName: '',
      phone: '',
      email: '',
      pax: 2,
      timeSlot: '8:00 PM',
      date: 'Today',
      type: 'Advance',
      area: 'Indoor',
      specialRequests: '',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dining & Table Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Advance bookings, VIP table holds, waitlist management, and online club portal integrations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Tabs & View Switcher Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['All', 'Reserved', 'Checked In', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Views */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest or phone..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['List', 'Calendar', 'Timeline'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  viewMode === mode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReservations.map((res) => (
          <BarKitchenReservationCard
            key={res.id}
            reservation={res}
            onCheckIn={(r) => updateReservationStatus(r.id, 'Checked In')}
            onCancel={(r) => updateReservationStatus(r.id, 'Cancelled')}
          />
        ))}

        {filteredReservations.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Reservations Found</h4>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different status filter or create a new booking.</p>
          </div>
        )}
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">New Table Reservation</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guest / Member Name</label>
                <input
                  type="text"
                  required
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  placeholder="e.g. Dr. Sameer Desai"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98201 00000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Number of Guests (Pax)</label>
                  <input
                    type="number"
                    min="1"
                    value={form.pax}
                    onChange={(e) => setForm({ ...form, pax: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
                  <select
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="7:30 PM">7:30 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="8:30 PM">8:30 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="9:30 PM">9:30 PM</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area</label>
                  <select
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Poolside">Poolside</option>
                    <option value="VIP">VIP</option>
                    <option value="Lounge">Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reservation Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Advance">Advance</option>
                    <option value="VIP">VIP</option>
                    <option value="Waitlist">Waitlist</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Requests / Seating Notes</label>
                <textarea
                  rows={2}
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="e.g. Window booth preferred, anniversary dessert setup..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
