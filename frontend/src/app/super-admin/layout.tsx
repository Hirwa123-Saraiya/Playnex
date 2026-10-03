import Sidebar from "@/components/super-admin/Sidebar";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F5EF] text-[#1B2420] md:flex">
      <Sidebar />
      <main className="max-w-[1200px] flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}