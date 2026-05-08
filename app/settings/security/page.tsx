"use client";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  Laptop,
  Trash2,
  ChevronRight,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";

/* ── Security items ─────────────────────────────────────────── */
const ITEMS = [
  {
    id: "change-password",
    icon: Lock,
    title: "Change password",
    description: "Update your account password securely",
    href: "/settings/security/change-password",
    danger: false,
  },
  {
    id: "two-factor",
    icon: ShieldCheck,
    title: "Two-factor authentication",
    description: "Add an extra layer of security to your account",
    href: "/settings/security/two-factor",
    danger: false,
  },
  {
    id: "sessions",
    icon: Laptop,
    title: "Active sessions",
    description: "Manage devices currently signed into your account",
    href: "/settings/security/sessions",
    danger: false,
  },
  {
    id: "delete-account",
    icon: Trash2,
    title: "Delete account",
    description: "Permanently remove your account and all data",
    href: "/settings/security/delete-account",
    danger: true,
  },
];

export default function SecurityPage() {
  const router = useRouter();

  const tabs = [
    { id: "profile",       label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security",      label: "Security" },
    { id: "billing",       label: "Billing & Plan" },
    { id: "app",           label: "App Settings" },
  ];

  return (
    <>
      <TopBar title="Settings" />

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* Mobile horizontal tab strip */}
        <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4 no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => router.push(
                t.id === "security"
                  ? "/settings/security"
                  : `/settings?tab=${t.id}`
              )}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                t.id === "security"
                  ? "bg-ink-900 text-white"
                  : "bg-white border border-ink-100 text-ink-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">

          {/* Desktop side nav */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => router.push(
                    t.id === "security"
                      ? "/settings/security"
                      : `/settings?tab=${t.id}`
                  )}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    t.id === "security"
                      ? "bg-ink-900 text-white"
                      : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
                Security Settings
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {ITEMS.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all text-left group
                        ${item.danger
                          ? "border-ink-100 hover:border-coral-200 hover:bg-coral-50 active:bg-coral-100"
                          : "border-ink-100 hover:bg-ink-50 active:bg-ink-100"
                        }`}
                    >
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                        ${item.danger
                          ? "bg-ink-50 group-hover:bg-coral-100"
                          : "bg-ink-50 group-hover:bg-ink-100"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={item.danger
                            ? "text-ink-500 group-hover:text-coral-500"
                            : "text-ink-500 group-hover:text-ink-800"
                          }
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium transition-colors ${
                          item.danger
                            ? "text-ink-700 group-hover:text-coral-600"
                            : "text-ink-700 group-hover:text-ink-900"
                        }`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-ink-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={15}
                        className={`flex-shrink-0 transition-colors ${
                          item.danger
                            ? "text-ink-300 group-hover:text-coral-400"
                            : "text-ink-300 group-hover:text-ink-500"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
