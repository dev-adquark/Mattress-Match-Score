"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Moon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/match", label: "Find My Match" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/methodology", label: "Methodology" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050b16]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 text-white">
            <Moon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base tracking-tight">Mattress Match Score</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:text-white",
                  active && "text-teal-300"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-teal-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <Link
            href="/match"
            className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 text-sm font-semibold text-[#04121c] hover:from-teal-300 hover:to-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b16]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#050b16] md:hidden" aria-label="Primary mobile">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/match"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 px-5 text-sm font-semibold text-[#04121c]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
