"use client";
import { useState } from "react";
import { Bell, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-ink-50/80 backdrop-blur-xl border-b border-ink-100 px-4 sm:px-6 py-4 flex items-center relative">
        
        {/* LEFT: Hamburger */}
        <button
          className="md:hidden text-ink-600 z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* TITLE */}
        {title && (
          <h1 className="
            absolute left-1/2 -translate-x-1/2 
            md:static md:translate-x-0 
            font-heading font-bold text-lg sm:text-xl text-ink-900
          ">
            {title}
          </h1>
        )}

        {/* RIGHT: Actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-3 py-2 w-44 md:w-56">
            <Search size={14} className="text-ink-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-ink-700 w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 bg-white border border-ink-100 rounded-xl flex items-center justify-center text-ink-500 hover:text-ink-900">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-500 rounded-full text-white text-[9px] flex items-center justify-center">
              2
            </span>
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-jade flex items-center justify-center">
            <span className="font-heading font-bold text-ink-900 text-sm">
              MC
            </span>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-ink-900/95 md:hidden flex flex-col pt-12 px-6">
          
          {/* LOGO */}
          <div className="flex justify-left mt-7 mb-5">
            <div className="relative w-20 h-10 bg-white">
              <Image
                src="/debtpadi.png"
                alt="DebtPadi Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* NAV */}
          <nav className="space-y-1">
            {nav.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "block px-4 py-3 rounded-xl font-heading font-semibold text-lg",
                    active
                      ? "bg-jade text-ink-900"
                      : "text-ink-300 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* SIGN OUT */}
          <div className="mt-auto pb-8">
            <Link
              href="/"
              className="block px-4 py-3 rounded-xl text-coral-400"
            >
              Sign out
            </Link>
          </div>
        </div>
      )}
    </>
  );
}