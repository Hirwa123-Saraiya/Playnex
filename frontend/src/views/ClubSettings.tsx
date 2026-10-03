'use client';

import React, { useState, useEffect } from 'react';
import { useClub } from '../context/ClubContext';
import { clubSettingsService, ClubSettingsData } from '../services/clubSettings.service';
import {
  Settings,
  Building2,
  Save,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Info,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export const ClubSettings: React.FC = () => {
  const { club, selectedBranch, setActiveNav } = useClub();
  const [settings, setSettings] = useState<ClubSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [clubName, setClubName] = useState('');
  const [sport, setSport] = useState('Multi-Sport');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await clubSettingsService.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
        setClubName(res.data.name || club.name);
        setSport(res.data.sport || 'Multi-Sport');
        setLocation(res.data.location || '');
        setAddress(res.data.address || selectedBranch.address || '');
        setPhone(res.data.phone || selectedBranch.phone || '');
      } else {
        setClubName(club.name);
        setAddress(selectedBranch.address || '');
        setPhone(selectedBranch.phone || '');
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      setClubName(club.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await clubSettingsService.updateSettings({
        clubName: clubName.trim(),
        sport,
        location: location.trim(),
        address: address.trim(),
        phone: phone.trim(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Club settings updated and synced to database!' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to update settings' });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to update settings',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Club Settings &amp; Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure multi-tenant parameters and operating profile for{' '}
            <span className="font-semibold text-slate-700">{club.name}</span>
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading configuration...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Multi-Tenant Metadata */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Multi-Tenant Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Tenant ID</label>
                <input
                  type="text"
                  disabled
                  value={club.tenantId}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Active Facility ID
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedBranch.id}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Platform Subscription & Razorpay Tier */}
          <div className="bg-gradient-to-r from-blue-900 to-[#071A3D] rounded-2xl p-6 border border-blue-800 shadow-sm text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                  Platform Operating License
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-1">
                {club.subscriptionPlan || 'Enterprise'} Plan
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Monthly &amp; Annual plans configured by Super Admin. You can review available tiers and pay securely with Razorpay.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveNav('Platform Subscription')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors shrink-0 cursor-pointer"
            >
              <span>Manage &amp; Pay Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Club Profile */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Club Profile &amp; Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Club Name</label>
                <input
                  required
                  type="text"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Sport</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>Padel</option>
                  <option>Tennis</option>
                  <option>Badminton</option>
                  <option>Cricket</option>
                  <option>Football</option>
                  <option>Swimming</option>
                  <option>Multi-Sport</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ahmedabad, GJ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Official Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Full Complex Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address of the sports club..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
