import React, { useState } from 'react';
import { Mail, Lock, Smartphone, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserLogin: React.FC = () => {
  const { loginAsUser, loginAsGuest, setActiveView, closeGuestModal } = useUserStore();
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [emailOrPhone, setEmailOrPhone] = useState('john@example.com');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsUser({
      email: emailOrPhone.includes('@') ? emailOrPhone : 'john@example.com',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98765 43210',
    });
    closeGuestModal();
    setActiveView('home');
  };

  const handleSocialLogin = (provider: string) => {
    loginAsUser({
      name: `John Doe (${provider})`,
      email: `john.${provider.toLowerCase()}@example.com`,
    });
    closeGuestModal();
    setActiveView('home');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
            P
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Sports Club Platform
            </h2>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mt-0.5">
              One Account. Multiple Clubs.
            </p>
          </div>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            className="py-2 text-xs font-bold rounded-lg bg-white text-blue-600 shadow-xs"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveView('register')}
            className="py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
          >
            Register
          </button>
        </div>

        {/* Login Method Toggle: Password vs OTP */}
        <div className="flex justify-center gap-4 text-xs font-semibold border-b border-slate-100 pb-2">
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`pb-1 transition-all ${
              authMode === 'password'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('otp')}
            className={`pb-1 transition-all ${
              authMode === 'otp'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Mobile OTP Login
          </button>
        </div>

        {/* Main Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {authMode === 'password' ? 'Email or Mobile' : 'Mobile Number (+91)'}
            </label>
            <div className="relative">
              {authMode === 'password' ? (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
              <input
                type={authMode === 'password' ? 'text' : 'tel'}
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder={authMode === 'password' ? 'john@example.com' : '9876543210'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {authMode === 'password' ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setActiveView('forgot-password')}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              {otpSent ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-bold tracking-widest text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-emerald-600 block mt-1">OTP sent to {emailOrPhone}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Send OTP via SMS
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Login to Playnex</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Social Logins matching step 1 of reference image */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Microsoft')}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors"
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <div className="bg-[#F25022] w-1.5 h-1.5" />
              <div className="bg-[#7FBA00] w-1.5 h-1.5" />
              <div className="bg-[#00A4EF] w-1.5 h-1.5" />
              <div className="bg-[#FFB900] w-1.5 h-1.5" />
            </div>
            <span>Continue with Microsoft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-3 transition-colors"
          >
            <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.06-7.7-7.91-12.04-14.55-6.09-9.35-10.74-20.08-13.96-32.19-3.21-12.1-4.82-23.77-4.82-35 0-14.57 3.59-26.68 10.78-36.32 7.19-9.64 16.42-14.59 27.7-14.86 4.35 0 9.4 1.22 15.15 3.65 5.75 2.43 9.49 3.65 11.22 3.65 1.34 0 5.35-1.34 12.04-4.02 6.69-2.68 12.38-3.8 17.06-3.35 12.94.78 23.32 5.58 31.13 14.41-11.28 6.81-16.7 16.3-16.27 28.46.44 9.59 4.23 17.52 11.37 23.77 7.14 6.25 15.64 9.81 25.5 10.69-2.46 7.47-5.46 15.08-9.01 22.83zM119.22 31.84c0-7.37 2.68-14.28 8.03-20.73 5.36-6.44 11.94-10.49 19.74-12.14.22 1.56.33 3.01.33 4.35 0 7.36-2.8 14.5-8.39 21.41-5.59 6.92-12.17 10.7-19.71 11.37-.11-1.34-.17-2.77-.17-4.26z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Guest Mode Button */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={loginAsGuest}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1.5 mx-auto"
          >
            <User className="w-3.5 h-3.5" />
            <span>Continue as Guest User (Browse only)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
