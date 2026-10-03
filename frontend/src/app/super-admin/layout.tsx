import Sidebar from "@/components/super-admin/Sidebar";
import {
  Search, Bell, MessageSquare, ChevronDown, MapPin, CalendarDays,
} from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-sand text-text md:flex-row">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex flex-wrap items-center gap-3 border-b border-line bg-sand px-5 py-3 md:px-8">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 md:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              placeholder="Search clubs, admins, users…"
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-14 text-sm outline-none placeholder:text-muted focus:border-moss/40"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-sand px-1.5 py-0.5 text-[10px] font-medium text-muted">
              ⌘K
            </span>
          </div>

          {/* Date chip */}
          <button className="hidden h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm text-muted hover:text-text md:flex">
            <CalendarDays size={15} />
            Mon, 14 Oct 2026
          </button>

          {/* Scope chip */}
          <button className="hidden h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm md:flex">
            <MapPin size={15} className="text-muted" />
            <span className="font-medium">All clubs</span>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-text"
            >
              <Bell size={16} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              aria-label="Messages"
              className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-text"
            >
              <MessageSquare size={16} />
            </button>
            <button className="flex h-10 items-center gap-2 rounded-lg border border-line bg-white pl-1 pr-3">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-moss text-sm font-semibold text-white">
                B
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-xs font-semibold">Bhavin S.</span>
                <span className="block text-[10px] text-muted">Super admin</span>
              </span>
              <ChevronDown size={14} className="text-muted" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}