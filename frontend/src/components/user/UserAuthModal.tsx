import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  Cake,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { authService } from '../../services/auth.service';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const { loginAsUser, closeGuestModal, fetchLiveData } = useUserStore();
  const [tab, setTab] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpAge, setSignUpAge] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  /* Compute tier from age for display only — backend decides the final tier */
  const derivedTier = (() => {
    const n = Number(signUpAge);
    if (!signUpAge || Number.isNaN(n) || n <= 0) return null;
    if (n < 18) return 'Junior';
    if (n < 40) return 'Silver';
    return 'Gold';
  })();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authService.login(signInEmail.trim(), signInPassword);
      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setSuccessMessage('Welcome back! Logging you in...');
        setTimeout(() => {
          loginAsUser({
            id: res.data!.user.userId,
            name: res.data!.user.name,
            email: res.data!.user.email,
          });
          onClose();
        }, 400);
      } else {
        setErrorMessage(res.message || 'Invalid email or password credentials');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName || !signUpEmail || !signUpPassword || !signUpAge) {
      setErrorMessage('Please fill in all required fields, including age.');
      return;
    }

    const ageNum = Number(signUpAge);
    if (Number.isNaN(ageNum) || ageNum < 5 || ageNum > 99) {
      setErrorMessage('Please enter a valid age between 5 and 99.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authService.register({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        type: 'MEMBER',
        // Extra fields passed through to backend
        phone: signUpPhone.trim() || undefined,
        age: ageNum,
      } as any);

      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setSuccessMessage('Account created successfully! Welcome to Playnex.');
        setTimeout(() => {
          loginAsUser({
            id: res.data!.user.userId,
            name: res.data!.user.name,
            email: res.data!.user.email,
            phone: signUpPhone || undefined,
          });
          onClose();
        }, 500);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await authService.login('john@example.com', 'password123');
      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setSuccessMessage('Instant Demo Login successful!');
        setTimeout(() => {
          loginAsUser({
            id: res.data!.user.userId,
            name: res.data!.user.name,
            email: res.data!.user.email,
          });
          onClose();
        }, 300);
      } else {
        setErrorMessage(res.message || 'Demo login failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Top Header Graphic */}
        <div className="bg-navy p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue text-white font-black text-xl flex items-center justify-center shadow-md">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg tracking-tight">Playnex Sports</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
                  Member Portal
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {tab === 'signin' ? 'Sign in to access your bookings & courts' : 'Create an account to reserve courts'}
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 rounded-xl border border-line bg-page p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMessage(''); }}
              className={`py-2.5 rounded-lg transition-all text-center ${
                tab === 'signin'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-muted hover:text-navy'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMessage(''); }}
              className={`py-2.5 rounded-lg transition-all text-center ${
                tab === 'signup'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-muted hover:text-navy'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-700 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Member Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-white px-2 text-slate-400 uppercase font-semibold">Or Quick Access</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstantDemoLogin}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Instant Demo Login (John Doe - Member)</span>
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign up now
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="rohan@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Cake className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min={5}
                      max={99}
                      value={signUpAge}
                      onChange={(e) => setSignUpAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                  {derivedTier && (
                    <p className="mt-1 text-[10px] font-semibold text-blue-600">
                      Suggested tier: <span className="font-bold">{derivedTier}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Age determines your default membership tier — players under 18 get the Junior plan.
                  Joining gives you instant access to book courts across all participating sports clubs.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Member Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


// import React, { useState } from 'react';
// import {
//   X,
//   Mail,
//   Lock,
//   User,
//   Phone,
//   ArrowRight,
//   Sparkles,
//   Eye,
//   EyeOff,
//   CheckCircle2,
//   AlertCircle,
//   Zap,
// } from 'lucide-react';
// import { useUserStore } from '../../store/userStore';
// import { authService } from '../../services/auth.service';

// interface UserAuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialMode?: 'signin' | 'signup';
// }

// export const UserAuthModal: React.FC<UserAuthModalProps> = ({
//   isOpen,
//   onClose,
//   initialMode = 'signin',
// }) => {
//   const { loginAsUser, closeGuestModal, fetchLiveData } = useUserStore();
//   const [tab, setTab] = useState<'signin' | 'signup'>(initialMode);
//   const [showPassword, setShowPassword] = useState(false);

//   // Sign In State
//   const [signInEmail, setSignInEmail] = useState('john@example.com');
//   const [signInPassword, setSignInPassword] = useState('password123');

//   // Sign Up State
//   const [signUpName, setSignUpName] = useState('');
//   const [signUpEmail, setSignUpEmail] = useState('');
//   const [signUpPhone, setSignUpPhone] = useState('');
//   const [signUpPassword, setSignUpPassword] = useState('');

//   // Status
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   if (!isOpen) return null;

//   const handleSignIn = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const res = await authService.login(signInEmail.trim(), signInPassword);
//       if (res.success && res.data?.user) {
//         if (typeof window !== 'undefined') {
//           if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
//           if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
//         }
//         setSuccessMessage('Welcome back! Logging you in...');
//         setTimeout(() => {
//           loginAsUser({
//             id: res.data!.user.userId,
//             name: res.data!.user.name,
//             email: res.data!.user.email,
//           });
//           onClose();
//         }, 400);
//       } else {
//         setErrorMessage(res.message || 'Invalid email or password credentials');
//       }
//     } catch (err: any) {
//       setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!signUpName || !signUpEmail || !signUpPassword) {
//       setErrorMessage('Please fill in all required fields.');
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const res = await authService.register({
//         name: signUpName.trim(),
//         email: signUpEmail.trim(),
//         password: signUpPassword,
//         type: 'MEMBER',
//       });

//       if (res.success && res.data?.user) {
//         if (typeof window !== 'undefined') {
//           if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
//           if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
//         }
//         setSuccessMessage('Account created successfully! Welcome to Playnex.');
//         setTimeout(() => {
//           loginAsUser({
//             id: res.data!.user.userId,
//             name: res.data!.user.name,
//             email: res.data!.user.email,
//             phone: signUpPhone || '+91 98765 43210',
//           });
//           onClose();
//         }, 500);
//       } else {
//         setErrorMessage(res.message || 'Registration failed. Please try again.');
//       }
//     } catch (err: any) {
//       setErrorMessage(err.message || 'Registration failed. An account with this email may already exist.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInstantDemoLogin = async () => {
//     setIsLoading(true);
//     setErrorMessage('');
//     setSuccessMessage('');

//     try {
//       const res = await authService.login('john@example.com', 'password123');
//       if (res.success && res.data?.user) {
//         if (typeof window !== 'undefined') {
//           if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
//           if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
//         }
//         setSuccessMessage('Instant Demo Login successful!');
//         setTimeout(() => {
//           loginAsUser({
//             id: res.data!.user.userId,
//             name: res.data!.user.name,
//             email: res.data!.user.email,
//             phone: '+91 98765 43210',
//           });
//           onClose();
//         }, 300);
//       } else {
//         setErrorMessage(res.message || 'Demo login failed');
//       }
//     } catch (err: any) {
//       setErrorMessage(err.message || 'Demo login failed. Make sure backend is running.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
//       <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
//         {/* Top Header Graphic */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
//             title="Close"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-xl flex items-center justify-center shadow-md shadow-black/10">
//               P
//             </div>
//             <div>
//               <div className="flex items-center gap-1.5">
//                 <h3 className="font-extrabold text-lg tracking-tight">Playnex Sports</h3>
//                 <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
//                   Member Portal
//                 </span>
//               </div>
//               <p className="text-xs text-blue-100 mt-0.5">
//                 {tab === 'signin' ? 'Sign in to access your bookings & courts' : 'Create an account to reserve courts'}
//               </p>
//             </div>
//           </div>

//           {/* Tab Selector */}
//           <div className="grid grid-cols-2 p-1 bg-black/20 rounded-xl mt-5 text-xs font-bold">
//             <button
//               type="button"
//               onClick={() => {
//                 setTab('signin');
//                 setErrorMessage('');
//               }}
//               className={`py-2 rounded-lg transition-all text-center ${
//                 tab === 'signin' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
//               }`}
//             >
//               Sign In
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setTab('signup');
//                 setErrorMessage('');
//               }}
//               className={`py-2 rounded-lg transition-all text-center ${
//                 tab === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-blue-100 hover:text-white'
//               }`}
//             >
//               Create Account (Sign Up)
//             </button>
//           </div>
//         </div>

//         {/* Content Body */}
//         <div className="p-6 space-y-4">
//           {/* Notifications */}
//           {errorMessage && (
//             <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
//               <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
//               <span>{errorMessage}</span>
//             </div>
//           )}

//           {successMessage && (
//             <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-700 animate-in fade-in">
//               <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
//               <span>{successMessage}</span>
//             </div>
//           )}

//           {/* TAB 1: SIGN IN */}
//           {tab === 'signin' && (
//             <form onSubmit={handleSignIn} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     required
//                     value={signInEmail}
//                     onChange={(e) => setSignInEmail(e.target.value)}
//                     placeholder="john@example.com"
//                     className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <label className="text-xs font-bold text-slate-700">
//                     Password
//                   </label>
//                   <span className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer">
//                     Forgot password?
//                   </span>
//                 </div>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     value={signInPassword}
//                     onChange={(e) => setSignInPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <span>Signing In...</span>
//                 ) : (
//                   <>
//                     <span>Sign In to Member Portal</span>
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>

//               <div className="relative my-3">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-200" />
//                 </div>
//                 <div className="relative flex justify-center text-[11px]">
//                   <span className="bg-white px-2 text-slate-400 uppercase font-semibold">Or Quick Access</span>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleInstantDemoLogin}
//                 className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
//               >
//                 <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
//                 <span>Instant Demo Login (John Doe - Member)</span>
//               </button>

//               <p className="text-center text-xs text-slate-500 pt-1">
//                 Don't have an account?{' '}
//                 <button
//                   type="button"
//                   onClick={() => setTab('signup')}
//                   className="font-bold text-blue-600 hover:underline"
//                 >
//                   Sign up now
//                 </button>
//               </p>
//             </form>
//           )}

//           {/* TAB 2: SIGN UP */}
//           {tab === 'signup' && (
//             <form onSubmit={handleSignUp} className="space-y-3.5">
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="text"
//                     required
//                     value={signUpName}
//                     onChange={(e) => setSignUpName(e.target.value)}
//                     placeholder="e.g. Rohan Sharma"
//                     className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="email"
//                     required
//                     value={signUpEmail}
//                     onChange={(e) => setSignUpEmail(e.target.value)}
//                     placeholder="rohan@example.com"
//                     className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="tel"
//                     value={signUpPhone}
//                     onChange={(e) => setSignUpPhone(e.target.value)}
//                     placeholder="+91 98765 43210"
//                     className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     required
//                     value={signUpPassword}
//                     onChange={(e) => setSignUpPassword(e.target.value)}
//                     placeholder="Create a strong password"
//                     className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2 text-[11px] text-blue-900">
//                 <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
//                 <span>
//                   Joining gives you instant access to book courts across all participating sports clubs with zero membership lock-in.
//                 </span>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
//               >
//                 {isLoading ? (
//                   <span>Creating Account...</span>
//                 ) : (
//                   <>
//                     <span>Create Free Member Account</span>
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>

//               <p className="text-center text-xs text-slate-500 pt-1">
//                 Already have an account?{' '}
//                 <button
//                   type="button"
//                   onClick={() => setTab('signin')}
//                   className="font-bold text-blue-600 hover:underline"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
