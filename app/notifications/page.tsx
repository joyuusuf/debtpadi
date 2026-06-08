"use client";
import { Bell } from "lucide-react";
import TopBar from "@/components/layout/TopBar";

export default function NotificationsPage() {
  return (
    <>
      <TopBar title="Notifications" />
      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <div className="bg-white border border-ink-100 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-ink-400" />
          </div>
          <p className="font-heading font-semibold text-ink-700 text-lg">No notifications yet</p>
          <p className="text-ink-400 text-sm mt-1">You'll see payment alerts and overdue reminders here.</p>
        </div>
      </div>
    </>
  );
}
