"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { usePlanUsage } from "@/hooks/usePlanUsage";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronUp,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/context/AvatarContext";
import Image from "next/image";

const NAV = [
  { href: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/debtors",    label: "Debtors",      icon: BookOpen        },
  { href: "/customers",  label: "Customers",    icon: Users           },
  { href: "/payments",   label: "Payments",     icon: CreditCard      },
  { href: "/reports",    label: "Reports",      icon: BarChart3       },
  { href: "/notifications", label: "Notifications", icon: Bell        },
  { href: "/settings",   label: "Settings",     icon: Settings        },
];

export default function Sidebar() {
  const pathname  = usePathname();
  const { user, logout } = useAuth();
  const { avatar } = useAvatar();
  const { usage } = usePlanUsage();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/dashboard" className="block">
          <Image src="/debtpadi.png" alt="DebtPadi" width={120} height={32}
            className="object-contain brightness-0 invert" priority />
        </Link>
      </div>

      {/* Active Store badge */}
      <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
        <p className="text-[10px] font-semibold text-jade uppercase tracking-widest mb-0.5">
          Active Store
        </p>
        <p className="text-sm font-semibold text-white truncate">
          {user?.businessName ?? "My Business"}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-3 mb-2 border-t border-white/10" />
      <p className="px-4 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">Menu</p>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-jade text-ink-900 shadow-sm shadow-jade/30"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-3 border-t border-white/10">
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>

      {/* Plan banner */}
      <div className="mx-3 mb-4 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/50 text-xs">
            {usage?.isPaid ? "Pro plan" : "Free plan"}
          </span>
          {!usage?.isPaid && (
            <Link href="/settings?tab=billing"
              className="text-jade text-xs font-bold hover:text-jade-300 transition-colors flex items-center gap-1">
              <Zap size={11} /> Upgrade
            </Link>
          )}
        </div>
        {!usage?.isPaid && usage ? (
          <>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-jade rounded-full transition-all"
                style={{ width: `${Math.min(100, (usage.customers.used / (usage.customers.limit ?? 10)) * 100)}%` }}
              />
            </div>
            <p className={`text-[10px] mt-1.5 ${(usage.customers.remaining ?? 1) <= 0 ? "text-coral-400 font-medium" : "text-white/30"}`}>
              {usage.customers.used} / {usage.customers.limit} customers used
            </p>
          </>
        ) : usage?.isPaid ? (
          <p className="text-jade/60 text-[10px]">Unlimited customers &amp; debts</p>
        ) : (
          <div className="h-1.5 bg-white/10 rounded-full" />
        )}
      </div>

      {/* User row */}
      <div className="px-3 pb-5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          {avatar ? (
            <img src={avatar} alt="Avatar"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-jade flex items-center justify-center flex-shrink-0 text-ink-900 text-xs font-bold">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
            <p className="text-[11px] text-white/40 truncate">{user?.email ?? ""}</p>
          </div>
          <ChevronUp size={14} className="text-white/30 flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top-bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0f1117] border-b border-white/10 h-14 flex items-center justify-between px-4">
        <Link href="/dashboard">
          <Image src="/debtpadi.png" alt="DebtPadi" width={100} height={28}
            className="object-contain brightness-0 invert" priority />
        </Link>
        <button onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-xl text-white/60 hover:bg-white/10 transition" aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-[#0f1117] z-30
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}>
        <SidebarContent />
      </aside>

      {/* Mobile spacer */}
      <div className="md:hidden h-14" />
    </>
  );
}
