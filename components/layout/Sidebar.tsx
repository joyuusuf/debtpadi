"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Bell,
} from "lucide-react";
import clsx from "clsx";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Debtors", href: "/debtors", icon: CreditCard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Payments", href: "/payments", icon: FileText },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const bottom = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 bg-ink-900 border-r border-white/5 min-h-screen fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-jade rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-bold text-ink-900 text-sm">DP</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-white text-base leading-tight">DebtPadi</p>
            <p className="text-ink-500 text-[10px] font-medium leading-tight">Business Edition</p>
          </div>
        </Link>
      </div>

      {/* Business name */}
      <div className="px-4 py-3 mx-3 mt-3 bg-jade/5 border border-jade/10 rounded-xl">
        <p className="text-jade text-xs font-medium uppercase tracking-wide">Active Store</p>
        <p className="text-white font-semibold text-sm mt-0.5">Titilayo Farms & Agro Supplies</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-ink-600 text-[10px] uppercase tracking-widest font-semibold px-3 mb-2">Menu</p>
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-jade text-ink-900"
                  : "text-ink-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={17} className={clsx(active ? "text-ink-900" : "text-ink-500 group-hover:text-white")} />
              {label}
              {label === "Debtors" && (
                <span className={clsx("ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full", active ? "bg-ink-900/20 text-ink-900" : "bg-coral-500/20 text-coral-400")}>
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4 space-y-1">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-white transition-all group">
          <Bell size={17} className="text-ink-500 group-hover:text-white" />
          Notifications
          <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-jade/20 text-jade">2</span>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-white transition-all group">
          <Settings size={17} className="text-ink-500 group-hover:text-white" />
          Settings
        </Link>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-coral-500/10 hover:text-coral-400 transition-all group">
          <LogOut size={17} className="text-ink-500 group-hover:text-coral-400" />
          Sign out
        </Link>

        {/* Plan badge */}
        <div className="mt-4 bg-ink-800 border border-white/5 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ink-400 text-xs">Free plan</p>
            <Link href="#" className="text-jade text-xs font-semibold hover:text-jade-400">Upgrade</Link>
          </div>
          <div className="h-1 bg-ink-700 rounded-full overflow-hidden">
            <div className="h-full bg-jade rounded-full" style={{ width: '60%' }} />
          </div>
          <p className="text-ink-500 text-[10px] mt-1.5">6 / 10 customers used</p>
        </div>
      </div>
    </aside>
  );
}
