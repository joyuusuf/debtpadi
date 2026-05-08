"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  MapPin,
  LogOut,
  X,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";

/* ── Types ─────────────────────────────────────────────────── */
interface Session {
  id: string;
  device: "laptop" | "phone" | "tablet" | "desktop";
  browser: string;
  os: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

/* ── Mock data ──────────────────────────────────────────────── */
const MOCK_SESSIONS: Session[] = [
  {
    id: "sess_01",
    device: "laptop",
    browser: "Chrome 124",
    os: "macOS Ventura",
    location: "Abuja, NG",
    ip: "102.89.45.12",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "sess_02",
    device: "phone",
    browser: "Safari 17",
    os: "iOS 17",
    location: "Lagos, NG",
    ip: "197.211.63.8",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess_03",
    device: "tablet",
    browser: "Firefox 125",
    os: "Windows 11",
    location: "London, UK",
    ip: "81.145.22.99",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

const deviceIcon = {
  laptop:  Laptop,
  phone:   Smartphone,
  tablet:  Tablet,
  desktop: Monitor,
};

/* ── Main component ─────────────────────────────────────────── */
export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions]       = useState<Session[]>(MOCK_SESSIONS);
  const [modal, setModal]             = useState<"single" | "all" | null>(null);
  const [target, setTarget]           = useState<Session | null>(null);
  const [actionLoading, setActLoading] = useState(false);

  const openSingle = (s: Session) => { setTarget(s); setModal("single"); };
  const openAll    = ()            => { setTarget(null); setModal("all"); };
  const closeModal = ()            => { setModal(null); setTarget(null); };

  const confirmAction = async () => {
    setActLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (modal === "single" && target) {
      setSessions(p => p.filter(s => s.id !== target.id));
    } else if (modal === "all") {
      setSessions(p => p.filter(s => s.isCurrent));
    }
    setActLoading(false);
    closeModal();
  };

  const others = sessions.filter(s => !s.isCurrent);

  return (
    <>
      <TopBar title="Settings" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
        <div className="flex gap-6">
          <SettingsSideNav active="security" />

          <div className="flex-1 min-w-0">
            <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">

              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors mb-5"
              >
                <ArrowLeft size={14} /> Back to Security
              </button>

              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900">
                  Active Sessions
                </h2>
                {others.length > 0 && (
                  <button
                    onClick={openAll}
                    className="flex items-center gap-1.5 text-xs font-medium text-coral-500 border border-coral-200 rounded-lg px-3 py-1.5 hover:bg-coral-50 transition-all"
                  >
                    <LogOut size={12} /> Log out all others
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {sessions.map(s => {
                  const DevIcon = deviceIcon[s.device];
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3.5 p-4 border border-ink-100 rounded-xl hover:border-ink-200 hover:bg-ink-50/50 transition-all"
                    >
                      {/* Device icon */}
                      <div className="w-10 h-10 bg-ink-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <DevIcon size={18} className="text-ink-600" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                          <span className="font-semibold text-sm font-heading text-ink-800">
                            {s.browser}
                          </span>
                          <span className="text-ink-300">·</span>
                          <span className="text-sm text-ink-400">{s.os}</span>
                          {s.isCurrent && (
                            <span className="inline-flex items-center gap-1 bg-jade/10 text-jade text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 bg-jade rounded-full" />
                              This device
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-ink-400 mt-0.5">
                          <MapPin size={11} />
                          <span>{s.location}</span>
                          <span>·</span>
                          <span>{s.ip}</span>
                          <span>·</span>
                          <span>Last active {s.lastActive}</span>
                        </div>
                      </div>

                      {/* Logout button (hidden for current session) */}
                      {!s.isCurrent && (
                        <button
                          onClick={() => openSingle(s)}
                          className="flex-shrink-0 text-xs text-coral-500 border border-coral-200 rounded-lg px-2.5 py-1.5 hover:bg-coral-50 transition-all"
                        >
                          Log out
                        </button>
                      )}
                    </div>
                  );
                })}

                {others.length === 0 && sessions.length > 0 && (
                  <p className="text-sm text-ink-400 text-center py-4">
                    No other active sessions.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {modal && (
        <ConfirmModal
          title={modal === "all" ? "Log out all other sessions?" : "Log out this session?"}
          description={
            modal === "all"
              ? "This will log out all sessions except your current device. They will need to sign in again."
              : `This will log out the session on ${target?.browser} (${target?.os}) from ${target?.location}.`
          }
          confirmLabel={modal === "all" ? "Log out all others" : "Log out"}
          loading={actionLoading}
          onCancel={closeModal}
          onConfirm={confirmAction}
        />
      )}
    </>
  );
}

/* ── Confirm modal ──────────────────────────────────────────── */
function ConfirmModal({
  title, description, confirmLabel, loading, onCancel, onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white border border-ink-100 rounded-2xl p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-heading font-bold text-ink-900 text-base">{title}</h3>
          <button
            onClick={onCancel}
            className="text-ink-400 hover:text-ink-700 transition-colors ml-4 flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-ink-400 leading-relaxed mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-ink-600 border border-ink-200 rounded-xl hover:border-ink-400 hover:bg-ink-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Settings side nav ──────────────────────────────────────── */
function SettingsSideNav({ active }: { active: string }) {
  const router = useRouter();
  const tabs = [
    { id: "profile",       label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security",      label: "Security" },
    { id: "billing",       label: "Billing & Plan" },
    { id: "app",           label: "App Settings" },
  ];
  return (
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
              active === t.id
                ? "bg-ink-900 text-white"
                : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
