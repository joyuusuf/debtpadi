"use client";
import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const nav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Debtors", href: "/debtors" },
  { label: "Customers", href: "/customers" },
  { label: "Payments", href: "/payments" },
  { label: "Reports", href: "/reports" },
];

export default function TopBar({ title }: { title?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* <header className="sticky top-0 z-30 bg-ink-50/80 backdrop-blur-xl border-b border-ink-100 px-6 py-4 flex items-center gap-4 md:ml-60"> */}
      <header className="sticky top-0 z-30 bg-ink-50/80 backdrop-blur-xl border-b border-ink-100 px-6 py-4 flex items-center gap-4">
        <button className="md:hidden text-ink-500 hover:text-ink-900 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="flex-1">
          {title && <h1 className="font-heading font-bold text-xl text-ink-900">{title}</h1>}
        </div>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 w-56 group focus-within:border-jade/40 focus-within:ring-2 focus-within:ring-jade/10 transition-all">
          <Search size={15} className="text-ink-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search customers..."
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 bg-white border border-ink-100 rounded-xl flex items-center justify-center text-ink-500 hover:text-ink-900 hover:border-ink-200 transition-all">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">2</span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-jade flex items-center justify-center flex-shrink-0 cursor-pointer">
          <span className="font-heading font-bold text-ink-900 text-sm">MC</span>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-ink-900/95 md:hidden flex flex-col pt-20 px-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-jade rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-ink-900 text-sm">DP</span>
            </div>
            <span className="font-heading font-semibold text-white text-lg">DebtPadi</span>
          </div>
          <nav className="space-y-1">
            {nav.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "block px-4 py-3 rounded-xl font-heading font-semibold text-lg transition-all",
                    active ? "bg-jade text-ink-900" : "text-ink-300 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto pb-8 space-y-1">
            <Link href="/" className="block px-4 py-3 rounded-xl text-coral-400 font-medium">Sign out</Link>
          </div>
        </div>
      )}
    </>
  );
}
