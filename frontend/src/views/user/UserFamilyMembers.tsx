import React, { useState } from 'react';
import { Users, Plus, Trash2, ShieldCheck, Heart, User, CheckCircle2, ChevronRight } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserFamilyMembers: React.FC = () => {
  const { familyMembers, addFamilyMember, removeFamilyMember, clubs, startBooking } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Spouse' as 'Spouse' | 'Child' | 'Parent' | 'Sibling',
    age: 28,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    sportsInterests: ['Tennis', 'Swimming'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFamilyMember({
      name: formData.name,
      relation: formData.relation,
      age: Number(formData.age),
      gender: formData.gender,
      avatarUrl: formData.avatarUrl,
      sportsInterests: formData.sportsInterests,
      assignedMembershipClubId: 'club-sunrise',
    });
    setModalOpen(false);
    setFormData({
      name: '',
      relation: 'Spouse',
      age: 28,
      gender: 'Female',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      sportsInterests: ['Tennis', 'Swimming'],
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Family Sports Circle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Family Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Link spouses and children to share membership privileges and reserve court sessions on their behalf.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                  <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {member.relation} • {member.age} yrs
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Remove ${member.name} from family circle?`)) {
                    removeFamilyMember(member.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Remove Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Membership assignment */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
              <span className="text-slate-400 font-medium">Club Access Pass:</span>
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sunrise Sports Club (Gold Pass)</span>
              </div>
            </div>

            {/* Sports Interests */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Sports Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.sportsInterests.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Book on Behalf CTA */}
            <button
              onClick={() => startBooking('club-sunrise')}
              className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Book Slot for {member.name.split(' ')[0]}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">Add Family Member</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Doe"
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relation</label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
