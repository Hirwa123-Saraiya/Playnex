'use client';

import React, { useEffect, useState } from 'react';
import { useClub } from '../context/ClubContext';
import {
  Send,
  Loader2,
  Trash2,
  BellRing,
  X,
  Plus,
} from 'lucide-react';
import {
  communicationsService,
  AnnouncementItem,
} from '../services/communications.service';

export const ClubCommunications: React.FC = () => {
  const { selectedBranch } = useClub();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetAudience: 'All Members',
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await communicationsService.getAnnouncements(selectedBranch.id);
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedBranch.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    try {
      setSubmitting(true);
      const res = await communicationsService.createAnnouncement({
        title: formData.title,
        message: formData.message,
        targetAudience: formData.targetAudience,
      });
      if (res.success) {
        setIsModalOpen(false);
        setFormData({ title: '', message: '', targetAudience: 'All Members' });
        fetchAnnouncements();
      }
    } catch (err) {
      console.error('Failed to publish announcement:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this broadcast?')) return;
    try {
      const res = await communicationsService.deleteAnnouncement(id);
      if (res.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete announcement:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Communications & Member Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Omni-channel messaging & member announcements for{' '}
            <span className="font-semibold text-slate-700">{selectedBranch.name}</span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          Compose Broadcast
        </button>
      </div>

      {/* Broadcast History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Broadcast Campaigns</h3>
          <span className="text-xs text-slate-400">{announcements.length} Active Records</span>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {announcements.map((b) => (
              <div
                key={b.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{b.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {b.targetAudience || 'All Members'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">{b.message}</p>
                  <p className="text-[11px] text-slate-400">
                    Published: {new Date(b.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Delivered
                  </span>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete broadcast"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-400">
                <BellRing className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <div className="font-semibold text-slate-700">No broadcasts sent yet</div>
                <div className="text-xs mt-1">Compose and send your first message to club members.</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Compose New Broadcast</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tournament RSVP or Notice"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Audience
                </label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="All Members">All Active Members</option>
                  <option value="Gold & Platinum Members">Gold & Platinum Tier Only</option>
                  <option value="Court Bookers">Active Court Bookers</option>
                  <option value="Staff & Trainers">Internal Staff & Trainers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type broadcast message details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
