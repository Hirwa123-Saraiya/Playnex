import React from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  PhoneCall,
  Mail,
  MapPin,
  Smartphone,
} from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserFooter: React.FC = () => {
  const { setActiveView } = useUserStore();

  return (
    <footer className="bg-navy text-slate-300 pt-16 pb-24 md:pb-16">
      {/* Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blueAlt/20 text-blueAlt flex items-center justify-center shrink-0 border border-blueAlt/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">One Account, Multi-Club</h4>
              <p className="text-xs text-slate-300 mt-1">
                Book courts and buy memberships across verified luxury clubs in India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Olympic & ITF Standard</h4>
              <p className="text-xs text-slate-300 mt-1">
                FINA pools, BWF badminton mats, and high-lux floodlit red clay courts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Real-Time Availability</h4>
              <p className="text-xs text-slate-300 mt-1">
                Zero double bookings. Instant QR confirmations and turnstile entry.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Digital Membership Pass</h4>
              <p className="text-xs text-slate-300 mt-1">
                Seamless Apple Wallet & Google Pass integration with biometric access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
                P
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                PLAYNEX
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Playnex is India's leading consumer sports club network platform. We connect athletes, families, and fitness enthusiasts to premier country clubs, sporting arenas, and wellness retreats through a unified digital membership experience.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#instagram" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue hover:text-white flex items-center justify-center transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue hover:text-white flex items-center justify-center transition-colors" title="X / Twitter">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#linkedin" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue hover:text-white flex items-center justify-center transition-colors" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-full bg-white/5 hover:bg-blue hover:text-white flex items-center justify-center transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveView('clubs')} className="hover:text-white transition-colors">All Sports Clubs</button></li>
              <li><button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Tennis Courts</button></li>
              <li><button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Olympic Pools</button></li>
              <li><button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Padel & Squash</button></li>
              <li><button onClick={() => setActiveView('events')} className="hover:text-white transition-colors">Tournaments & Opens</button></li>
            </ul>
          </div>

          {/* Column 2: Memberships */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Memberships</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Gold Annual Pass</button></li>
              <li><button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Family Heritage Access</button></li>
              <li><button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Executive Platinum</button></li>
              <li><button onClick={() => setActiveView('family')} className="hover:text-white transition-colors">Family Management</button></li>
              <li><button onClick={() => setActiveView('payments')} className="hover:text-white transition-colors">Invoices & Receipts</button></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Playnex Concierge</h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blueAlt" />
                <span>1800-PLAYNEX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blueAlt" />
                <span>concierge@playnex.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blueAlt" />
                <span>Mumbai • Ahmedabad • Bengaluru</span>
              </div>
              <div className="pt-2">
                <span className="inline-block text-[11px] font-semibold text-emerald-300 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
                  Concierge Online 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          © {new Date().getFullYear()} Playnex Technologies Pvt. Ltd. All rights reserved. Built for sports lovers.
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#refund" className="hover:text-white transition-colors">Cancellation & Refund Policy</a>
          <a href="#security" className="hover:text-white transition-colors">Security & Trust</a>
        </div>
      </div>
    </footer>
  );
};


// import React from 'react';
// import {
//   ShieldCheck,
//   Award,
//   Clock,
//   PhoneCall,
//   Mail,
//   MapPin,
//   Heart,
//   Globe,
//   Share2,
//   Smartphone,
//   ChevronRight,
// } from 'lucide-react';
// import { useUserStore } from '../../store/userStore';

// export const UserFooter: React.FC = () => {
//   const { setActiveView } = useUserStore();

//   return (
//     <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 md:pb-16 border-t border-slate-800">
//       {/* Trust Badges */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800/80">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
//           <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
//             <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
//               <ShieldCheck className="w-5 h-5" />
//             </div>
//             <div>
//               <h4 className="text-sm font-bold text-white">One Account, Multi-Club</h4>
//               <p className="text-xs text-slate-400 mt-1">Book courts and buy memberships across verified luxury clubs in India.</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
//             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
//               <Award className="w-5 h-5" />
//             </div>
//             <div>
//               <h4 className="text-sm font-bold text-white">Olympic & ITF Standard</h4>
//               <p className="text-xs text-slate-400 mt-1">FINA pools, BWF badminton mats, and high-lux floodlit red clay courts.</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
//             <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
//               <Clock className="w-5 h-5" />
//             </div>
//             <div>
//               <h4 className="text-sm font-bold text-white">Real-Time Availability</h4>
//               <p className="text-xs text-slate-400 mt-1">Zero double bookings. Instant QR confirmations and turnstile entry.</p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
//             <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
//               <Smartphone className="w-5 h-5" />
//             </div>
//             <div>
//               <h4 className="text-sm font-bold text-white">Digital Membership Pass</h4>
//               <p className="text-xs text-slate-400 mt-1">Seamless Apple Wallet & Google Pass integration with biometric access.</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Links */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
//           {/* Brand Info */}
//           <div className="col-span-2 space-y-4">
//             <div className="flex items-center gap-2.5">
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">
//                 P
//               </div>
//               <span className="text-xl font-black tracking-tight text-white">PLAYNEX</span>
//             </div>
//             <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
//               Playnex is India's leading consumer sports club network platform. We connect athletes, families, and fitness enthusiasts to premier country clubs, sporting arenas, and wellness retreats through a unified digital membership experience.
//             </p>
//             <div className="flex items-center gap-3 pt-2 text-slate-400">
//               <a href="#instagram" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors" title="Instagram">
//                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
//                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
//                 </svg>
//               </a>
//               <a href="#twitter" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors" title="X / Twitter">
//                 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
//                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
//                 </svg>
//               </a>
//               <a href="#linkedin" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors" title="LinkedIn">
//                 <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
//                   <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//                 </svg>
//               </a>
//               <a href="#youtube" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors" title="YouTube">
//                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
//                   <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>

//           {/* Column 1: Explore */}
//           <div className="space-y-3">
//             <h5 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h5>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <button onClick={() => setActiveView('clubs')} className="hover:text-white transition-colors">All Sports Clubs</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Tennis Courts</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Olympic Pools</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('facilities')} className="hover:text-white transition-colors">Padel & Squash</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('events')} className="hover:text-white transition-colors">Tournaments & Opens</button>
//               </li>
//             </ul>
//           </div>

//           {/* Column 2: Memberships & Family */}
//           <div className="space-y-3">
//             <h5 className="text-xs font-bold uppercase tracking-wider text-white">Memberships</h5>
//             <ul className="space-y-2 text-xs">
//               <li>
//                 <button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Gold Annual Pass</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Family Heritage Access</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('memberships')} className="hover:text-white transition-colors">Executive Platinum</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('family')} className="hover:text-white transition-colors">Family Management</button>
//               </li>
//               <li>
//                 <button onClick={() => setActiveView('payments')} className="hover:text-white transition-colors">Invoices & Receipts</button>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3: Contact & Concierge */}
//           <div className="space-y-3">
//             <h5 className="text-xs font-bold uppercase tracking-wider text-white">Playnex Concierge</h5>
//             <div className="space-y-2.5 text-xs">
//               <div className="flex items-center gap-2">
//                 <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
//                 <span>1800-PLAYNEX (Toll Free)</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Mail className="w-3.5 h-3.5 text-blue-400" />
//                 <span>concierge@playnex.in</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-3.5 h-3.5 text-blue-400" />
//                 <span>Mumbai • Ahmedabad • Bengaluru</span>
//               </div>
//               <div className="pt-2">
//                 <span className="inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
//                   Concierge Online 24/7
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
//         <div>
//           © {new Date().getFullYear()} Playnex Technologies Pvt. Ltd. All rights reserved. Built for sports lovers.
//         </div>
//         <div className="flex items-center gap-6">
//           <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
//           <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
//           <a href="#refund" className="hover:text-slate-300 transition-colors">Cancellation & Refund Policy</a>
//           <a href="#security" className="hover:text-slate-300 transition-colors">Security & Trust</a>
//         </div>
//       </div>
//     </footer>
//   );
// };
