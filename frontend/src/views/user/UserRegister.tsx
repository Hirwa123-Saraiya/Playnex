import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserRegister: React.FC = () => {
  const { loginAsUser, setActiveView } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Ahmedabad',
    password: '',
    agreeTerms: true,
  });

  const [selectedSports, setSelectedSports] = useState<string[]>(['Tennis', 'Swimming']);

  const sportOptions = ['Tennis', 'Badminton', 'Swimming', 'Gym & Fitness', 'Squash', 'Padel', 'Yoga & Pilates'];

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUser({
      name: formData.name || 'John Doe',
      email: formData.email || 'john@example.com',
      phone: formData.phone || '+91 98765 43210',
      sportsInterests: selectedSports,
    });
    setActiveView('home');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
            P
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Playnex Account</h2>
          <p className="text-xs text-slate-500">
            One digital passport for sports clubs, courts, and wellness sanctuaries across India.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primary City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Surat">Surat</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Set Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sports Interests Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Your Sports Interests
            </label>
            <div className="flex flex-wrap gap-1.5">
              {sportOptions.map((sport) => {
                const isSelected = selectedSports.includes(sport);
                return (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => toggleSport(sport)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sport}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <span>
                I agree to the Playnex Terms of Service, Club Rules & Regulations, and Privacy Policy.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Create My Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => setActiveView('login')}
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
