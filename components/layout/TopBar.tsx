"use client";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/context/AvatarContext";
import Link from "next/link";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { user } = useAuth();
  const { avatar } = useAvatar();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-ink-100 px-4 sm:px-6 h-14 flex items-center gap-3">
      {/* Title (optional) */}
      {title && (
        <h1 className="font-heading font-bold text-ink-900 text-base mr-2 flex-shrink-0">
          {title}
        </h1>
      )}

      {/* Search bar */}
      <div className="flex-1 max-w-sm relative hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-ink-50 border border-ink-100 rounded-xl pl-9 pr-4 py-2 text-sm text-ink-700 placeholder-ink-400 focus:outline-none focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Notification bell */}
        <Link href="/notifications"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-800 transition-all relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </Link>

        {/* User avatar */}
        <Link href="/settings" className="flex-shrink-0">
          {avatar ? (
            <img src={avatar} alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-jade/30 hover:border-jade transition-all" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-jade flex items-center justify-center text-ink-900 text-xs font-bold border-2 border-jade/30 hover:border-jade transition-all">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
