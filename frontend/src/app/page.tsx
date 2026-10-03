import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Reusing the icons you already installed

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        
        {/* Background Visual Effect (matches your membership page style) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="text-center space-y-6 relative z-10">
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
            The Champions Club
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Playnex Sports Club Management Platform
          </p>

          {/* 3. Route Links (Passing your routes here) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/memberships"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Explore Memberships
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all w-full sm:w-auto"
            >
              Member Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 



//export default function Home() {
//   return (
//     <main className="min-h-screen flex items-center justify-center p-6">
//       <div className="text-center space-y-4">
//         <h1 className="text-3xl font-bold">The Champions Club</h1>
//         <p className="text-slate-400">Playnex Sports Club Management Platform</p>
//       </div>
//     </main>
//   );
// }
