import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">The Champions Club</h1>
        <p className="text-slate-400">Playnex Sports Club Management Platform</p>

        <div className="pt-4">
          <Link
            href="/super-admin/dashboard"
            className="inline-block rounded-md bg-[#17402B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1F5138] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6F03C]"
          >
            Go to Super Admin Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}


// export default function Home() {
//   return (
//     <main className="min-h-screen flex items-center justify-center p-6">
//       <div className="text-center space-y-4">
//         <h1 className="text-3xl font-bold">The Champions Club</h1>
//         <p className="text-slate-400">Playnex Sports Club Management Platform</p>
//       </div>
//     </main>
//   );
// }
