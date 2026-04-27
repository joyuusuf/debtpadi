"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await fetch(`http://localhost:5000/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // cookie will expire naturally, proceed anyway
    }
    router.push("/auth/signin");
  }

  return (
    <aside className="hidden md:flex flex-col w-60 bg-ink-900 border-r border-white/5 min-h-screen fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-white flex items-center justify-center flex-shrink-0">
            <Image
              src="/debtpadi.png"
              alt="DebtPadi Logo"
              width={80}
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      <BusinessBadge />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-ink-600 text-[10px] uppercase tracking-widest font-semibold px-3 mb-2">
          Menu
        </p>
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
                  : "text-ink-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon
                size={17}
                className={clsx(
                  active
                    ? "text-ink-900"
                    : "text-ink-500 group-hover:text-white",
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/5 pt-4 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-white transition-all group"
        >
          <Bell size={17} className="text-ink-500 group-hover:text-white" />
          Notifications
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-white/5 hover:text-white transition-all group"
        >
          <Settings size={17} className="text-ink-500 group-hover:text-white" />
          Settings
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-400 hover:bg-coral-500/10 hover:text-coral-400 transition-all group"
        >
          <LogOut
            size={17}
            className="text-ink-500 group-hover:text-coral-400"
          />
          Sign out
        </button>

        <PlanBadge />
      </div>
    </aside>
  );
}

function BusinessBadge() {
  const [businessName, setBusinessName] = useState<string>("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("debtpadi_user");
      if (raw) {
        const user = JSON.parse(raw);
        setBusinessName(user.businessName || user.name || "");
      }
    } catch {
      // ignore
    }
  }, []);

  if (!businessName) return null;

  return (
    <div className="px-4 py-3 mx-3 mt-3 bg-jade/5 border border-jade/10 rounded-xl">
      <p className="text-jade text-xs font-medium uppercase tracking-wide">
        Active Store
      </p>
      <p className="text-white font-semibold text-sm mt-0.5 truncate">
        {businessName}
      </p>
    </div>
  );
}

function PlanBadge() {
  const [plan, setPlan] = useState<{
    name: string;
    used: number;
    limit: number;
  }>({
    name: "Free",
    used: 0,
    limit: 10,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("debtpadi_user");
      if (raw) {
        const user = JSON.parse(raw);
        setPlan({
          name: user.plan === "pro" ? "Pro" : "Free",
          used: user.creditCustomers?.length ?? 0,
          limit: user.plan === "pro" ? 999 : 10,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const pct = Math.min((plan.used / plan.limit) * 100, 100);

  return (
    <div className="mt-4 bg-ink-800 border border-white/5 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-ink-400 text-xs">{plan.name} plan</p>
        {plan.name === "Free" && (
          <Link
            href="#"
            className="text-jade text-xs font-semibold hover:text-jade-400"
          >
            Upgrade
          </Link>
        )}
      </div>
      <div className="h-1 bg-ink-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-jade rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-ink-500 text-[10px] mt-1.5">
        {plan.used} / {plan.limit} customers used
      </p>
    </div>
  );
}
