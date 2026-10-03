"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-text md:hidden"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-bold">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 text-sm">
              <a href="#features" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-sand">
                Features
              </a>
              <a href="#how" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-sand">
                How it works
              </a>
              <a href="#pricing" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-sand">
                Pricing
              </a>
              <a href="#stories" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 hover:bg-sand">
                Stories
              </a>
            </nav>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-line px-4 py-2.5 text-center text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-moss px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}