import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Heart, ShieldCheck, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserProfile: React.FC = () => {
  const { currentUser, updateProfile, setActiveView } = useUserStore();

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    bloodGroup: currentUser.bloodGroup || 'O+',
    dateOfBirth: currentUser.dateOfBirth || '1992-06-15',
    street: currentUser.address?.street || '402, Skyline Residency',
    city: currentUser.address?.city || 'Ahmedabad',
    emergencyName: currentUser.emergencyContact?.name || 'Sarah Doe',
    emergencyPhone: currentUser.emergencyContact?.phone || '+91 98765 43211',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      dateOfBirth: formData.dateOfBirth,
      address: {
        street: formData.street,
        city: formData.city,
        state: 'Gujarat',
        pincode: '380054',
      },
      emergencyContact: {
        name: formData.emergencyName,
        relation: 'Spouse',
        phone: formData.emergencyPhone,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>My Profile & Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Member Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details, emergency contacts, and sports interests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">Personal Information</h3>

          <div className="flex items-center gap-4 pb-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
              <span className="text-[11px] text-slate-400 block font-mono">
                Member ID: {currentUser.membershipId}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold cursor-pointer"
              >
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.emergencyName}
                onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Sports Interests */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">Sports Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {currentUser.sportsInterests.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
