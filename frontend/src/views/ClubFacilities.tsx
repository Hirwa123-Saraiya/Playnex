'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import { facilitiesService, FacilityItem } from '../services/facilities.service';
import {
  Building2,
  Plus,
  Trash2,
  Loader2,
  Clock,
  Sparkles,
  Info,
  X,
} from 'lucide-react';

export const ClubFacilities: React.FC = () => {
  const { selectedBranch } = useClub();
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Padel Court');
  const [hourlyRate, setHourlyRate] = useState('800');
  const [surface, setSurface] = useState('Synthetic Grass');
  const [openTime, setOpenTime] = useState('06:00:00');
  const [closeTime, setCloseTime] = useState('23:00:00');

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await facilitiesService.getFacilities();
      if (res.success && Array.isArray(res.data)) {
        setFacilities(res.data);
      } else {
        setFacilities([]);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a facility name');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await facilitiesService.createFacility({
        name: name.trim(),
        type,
        hourlyRate: Number(hourlyRate) || 500,
        surface,
        openTime,
        closeTime,
      });
      if (res.success) {
        setIsModalOpen(false);
        setName('');
        await fetchFacilities();
      } else {
        setError(res.message || 'Failed to create facility');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create facility');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    try {
      await facilitiesService.deleteFacility(id);
      await fetchFacilities();
    } catch (err) {
      console.error('Failed to delete facility:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Facilities &amp; Infrastructure
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage sports arenas, courts, and slot configurations for{' '}
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
          Add Facility
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading facilities from database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{fac.name}</h3>
                      <p className="text-xs text-slate-500">{fac.type}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Surface:</span>
                    <span className="font-semibold text-slate-800">{fac.surface || 'Synthetic'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hourly Rate:</span>
                    <span className="font-semibold text-slate-900">₹ {fac.hourlyRate} / hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operating Hours:</span>
                    <span className="font-medium text-slate-700">
                      {fac.openTime?.slice(0, 5)} - {fac.closeTime?.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">ID: {fac.id}</span>
                <button
                  onClick={() => handleDeleteFacility(fac.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}

          {facilities.length === 0 && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Facilities Configured</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Add your courts, arenas, or turfs to begin taking real-time member bookings.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Add First Facility
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Facility Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Sports Facility</h3>
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

            <form onSubmit={handleCreateFacility} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Facility Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Center Court 1, Indoor Turf A"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sport Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  >
                    <option>Padel Court</option>
                    <option>Tennis Court</option>
                    <option>Badminton Arena</option>
                    <option>Cricket Turf</option>
                    <option>Football Turf</option>
                    <option>Swimming Pool</option>
                    <option>Squash Court</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Surface Type</label>
                <input
                  value={surface}
                  onChange={(e) => setSurface(e.target.value)}
                  placeholder="e.g. Synthetic Grass, Clay, Wooden"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Opens At</label>
                  <input
                    type="time"
                    value={openTime.slice(0, 5)}
                    onChange={(e) => setOpenTime(`${e.target.value}:00`)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Closes At</label>
                  <input
                    type="time"
                    value={closeTime.slice(0, 5)}
                    onChange={(e) => setCloseTime(`${e.target.value}:00`)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>
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
                  <span>Save Facility</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
