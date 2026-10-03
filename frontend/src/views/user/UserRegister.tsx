import React, { useState } from 'react';
import {
  User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck,
  AlertCircle, Loader2, Cake,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { authService } from '../../services/auth.service';

export const UserRegister: React.FC = () => {
  const { loginAsUser, setActiveView } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: 'Ahmedabad',
    password: '',
    agreeTerms: true,
  });

  const [selectedSports, setSelectedSports] = useState<string[]>(['Tennis', 'Swimming']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sportOptions = ['Tennis', 'Badminton', 'Swimming', 'Gym & Fitness', 'Squash', 'Padel', 'Yoga & Pilates'];

  const toggleSport = (sport: string) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  /* Suggested tier from age — informational only */
  const derivedTier = (() => {
    const n = Number(formData.age);
    if (!formData.age || Number.isNaN(n) || n <= 0) return null;
    if (n < 18) return 'Junior';
    if (n < 40) return 'Silver';
    return 'Gold';
  })();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.age) {
      setErrorMessage('Please fill in all required fields, including age.');
      return;
    }

    const ageNum = Number(formData.age);
    if (Number.isNaN(ageNum) || ageNum < 5 || ageNum > 99) {
      setErrorMessage('Please enter a valid age between 5 and 99.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        type: 'MEMBER',
        // Extra fields passed through to backend
        phone: formData.phone.trim() || undefined,
        age: ageNum,
        city: formData.city,
        sportsInterests: selectedSports,
      } as any);

      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        loginAsUser({
          id: res.data.user.userId,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: formData.phone || undefined,
          sportsInterests: selectedSports,
        });
        setActiveView('home');
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
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
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Age <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Cake className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min={5}
                  max={99}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="e.g. 24"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              {derivedTier && (
                <p className="mt-1 text-[10px] font-semibold text-blue-600">
                  Suggested tier: <span className="font-bold">{derivedTier}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

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

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
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


// import React, { useState } from 'react';
// import { User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
// import { useUserStore } from '../../store/userStore';
// import { authService } from '../../services/auth.service';

// export const UserRegister: React.FC = () => {
//   const { loginAsUser, setActiveView } = useUserStore();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     city: 'Ahmedabad',
//     password: '',
//     agreeTerms: true,
//   });

//   const [selectedSports, setSelectedSports] = useState<string[]>(['Tennis', 'Swimming']);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const sportOptions = ['Tennis', 'Badminton', 'Swimming', 'Gym & Fitness', 'Squash', 'Padel', 'Yoga & Pilates'];

//   const toggleSport = (sport: string) => {
//     setSelectedSports((prev) =>
//       prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
//     );
//   };

//   const handleRegisterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name || !formData.email || !formData.password) {
//       setErrorMessage('Please fill in all required fields.');
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const res = await authService.register({
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         password: formData.password,
//         type: 'MEMBER',
//       });

//       if (res.success && res.data?.user) {
//         if (typeof window !== 'undefined') {
//           if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
//           if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
//         }
//         loginAsUser({
//           id: res.data.user.userId,
//           name: res.data.user.name,
//           email: res.data.user.email,
//           phone: formData.phone || '+91 98765 43210',
//           sportsInterests: selectedSports,
//         });
//         setActiveView('home');
//       } else {
//         setErrorMessage(res.message || 'Registration failed. Please try again.');
//       }
//     } catch (err: any) {
//       setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
//         <div className="text-center space-y-2">
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
//             P
//           </div>
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Playnex Account</h2>
//           <p className="text-xs text-slate-500">
//             One digital passport for sports clubs, courts, and wellness sanctuaries across India.
//           </p>
//         </div>

//         <form onSubmit={handleRegisterSubmit} className="space-y-4">
//           <div>
//             <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
//             <div className="relative">
//               <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="e.g. John Doe"
//                 className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
//               <div className="relative">
//                 <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   placeholder="john@example.com"
//                   className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
//               <div className="relative">
//                 <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   placeholder="+91 98765 43210"
//                   className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-bold text-slate-700 block mb-1">Primary City</label>
//               <div className="relative">
//                 <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <select
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
//                 >
//                   <option value="Ahmedabad">Ahmedabad</option>
//                   <option value="Vadodara">Vadodara</option>
//                   <option value="Surat">Surat</option>
//                   <option value="Mumbai">Mumbai</option>
//                   <option value="Bengaluru">Bengaluru</option>
//                   <option value="Delhi NCR">Delhi NCR</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="text-xs font-bold text-slate-700 block mb-1">Set Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   required
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   placeholder="Min 8 characters"
//                   className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Sports Interests Selector */}
//           <div>
//             <label className="text-xs font-bold text-slate-700 block mb-1.5">
//               Select Your Sports Interests
//             </label>
//             <div className="flex flex-wrap gap-1.5">
//               {sportOptions.map((sport) => {
//                 const isSelected = selectedSports.includes(sport);
//                 return (
//                   <button
//                     key={sport}
//                     type="button"
//                     onClick={() => toggleSport(sport)}
//                     className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
//                       isSelected
//                         ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
//                         : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
//                     }`}
//                   >
//                     {sport}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="pt-2">
//             <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
//               <input
//                 type="checkbox"
//                 required
//                 checked={formData.agreeTerms}
//                 onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
//                 className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
//               />
//               <span>
//                 I agree to the Playnex Terms of Service, Club Rules & Regulations, and Privacy Policy.
//               </span>
//             </label>
//           </div>

//           {errorMessage && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-600">
//               <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
//               <span>{errorMessage}</span>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 <span>Creating Account...</span>
//               </>
//             ) : (
//               <>
//                 <span>Create My Account</span>
//                 <ArrowRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="text-center pt-2 border-t border-slate-100">
//           <p className="text-xs text-slate-500">
//             Already have an account?{' '}
//             <button
//               onClick={() => setActiveView('login')}
//               className="font-bold text-blue-600 hover:text-blue-700"
//             >
//               Sign In here
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
