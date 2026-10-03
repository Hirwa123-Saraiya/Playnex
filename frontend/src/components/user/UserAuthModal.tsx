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
  Gift,
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
        phone: signUpPhone.trim() || undefined,
        age: ageNum,
      } as any);

      if (res.success && res.data?.user) {
        if (typeof window !== 'undefined') {
          if (res.data.accessToken) localStorage.setItem('accessToken', res.data.accessToken);
          if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        setSuccessMessage(
          'Account created! Your 7-day free trial has started — enjoy full access.'
        );
        setTimeout(() => {
          loginAsUser({
            id: res.data!.user.userId,
            name: res.data!.user.name,
            email: res.data!.user.email,
            phone: signUpPhone || undefined,
          });
          onClose();
        }, 700);
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
    <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-line overflow-hidden my-8">

        {/* Header */}
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
                {tab === 'signin'
                  ? 'Sign in to access your bookings & courts'
                  : 'Create an account — 7 days free, then choose a plan'}
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1 mt-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMessage(''); }}
              className={`py-2.5 rounded-lg transition-all text-center ${
                tab === 'signin'
                  ? 'bg-blue text-white shadow-sm'
                  : 'text-blue-100 hover:text-white'
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
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">

          {/* 7-day trial callout */}
          {tab === 'signup' && (
            <div className="flex items-center gap-2 rounded-xl bg-blueSoft border border-blue/20 px-3 py-2.5 text-[11px] font-semibold text-blue">
              <Gift size={14} />
              Start your 7-day free trial — full access, no card required.
            </div>
          )}

          {/* Notifications */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-navy">Password</label>
                  <span className="text-[11px] text-blue font-semibold hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue hover:bg-blueHover active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
                  <div className="w-full border-t border-line" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-white px-2 text-muted uppercase font-semibold">Or Quick Access</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstantDemoLogin}
                className="w-full py-2.5 bg-page hover:bg-blueSoft text-navy font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-line"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Instant Demo Login (John Doe - Member)</span>
              </button>

              <p className="text-center text-xs text-muted pt-1">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-bold text-blue hover:underline"
                >
                  Start your free trial
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full pl-10 pr-3 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="rohan@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Cake className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      min={5}
                      max={99}
                      value={signUpAge}
                      onChange={(e) => setSignUpAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full pl-10 pr-3 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                    />
                  </div>
                  {derivedTier && (
                    <p className="mt-1 text-[10px] font-semibold text-blue">
                      Suggested tier: <span className="font-bold">{derivedTier}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-page border border-line rounded-xl text-xs text-text focus:bg-white focus:border-blue focus:ring-2 focus:ring-blue/10 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-blueSoft border border-blue/20 rounded-xl flex items-start gap-2 text-[11px] text-navy">
                <Sparkles className="w-3.5 h-3.5 text-blue shrink-0 mt-0.5" />
                <span>
                  Your 7-day free trial starts today. Age determines your tier — under 18 gets the
                  Junior plan. Full court booking access from day one.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue hover:bg-blueHover active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-blue/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Starting your trial...</span>
                ) : (
                  <>
                    <span>Start My 7-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className="font-bold text-blue hover:underline"
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