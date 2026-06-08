"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { profile as profileApi } from "@/lib/api";
import { User, Bell, Shield, CreditCard, Smartphone, ChevronRight, Upload, Eye, X } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { useAvatar } from "@/context/AvatarContext";
import { useSearchParams, useRouter } from "next/navigation";
import { Toast } from "@/components/ui/Toast";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

function SettingsSkeleton() {
  return (
    <>
      <TopBar title="Settings" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
        <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="flex-shrink-0 w-24 h-8 rounded-lg" />)}
        </div>
        <div className="flex gap-6">
          <div className="hidden md:block w-52 flex-shrink-0 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-full h-10 rounded-xl" />)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
              <Skeleton className="w-44 h-6 mb-6" />
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
                <div className="space-y-2"><Skeleton className="w-48 h-4" /><Skeleton className="w-36 h-3" /></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2"><Skeleton className="w-28 h-3" /><Skeleton className="w-full h-11 rounded-xl" /></div>
                ))}
                <Skeleton className="w-36 h-11 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-jade/30 ${
        checked ? "bg-jade" : "bg-ink-200"
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );
}

// ── Notification preference keys ─────────────────────────────────────────────
const NOTIF_DEFAULTS = {
  overdueAlerts:   true,
  paymentReceived: true,
  weeklySummary:   false,
  newCustomer:     false,
  reminderNudges:  true,
};

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") ?? "profile";

  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState(initialTab);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarRef    = useRef<HTMLDivElement>(null);
  const { avatar: avatarSrc, setAvatar: saveAvatar } = useAvatar();
  const { user, login } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", businessName: "", address: "",
  });
  const [saving, setSaving] = useState(false);

  // Notification preferences (persisted to localStorage)
  const [notifs, setNotifs] = useState(NOTIF_DEFAULTS);

  // Load notif prefs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("debtpadi_notif_prefs");
    if (saved) {
      try { setNotifs({ ...NOTIF_DEFAULTS, ...JSON.parse(saved) }); } catch { /* ignore */ }
    }
  }, []);

  // Populate profile form from auth context
  useEffect(() => {
    if (user) {
      const parts = user.name?.split(" ") ?? [];
      setProfileForm({
        firstName:    parts[0] ?? "",
        lastName:     parts.slice(1).join(" ") ?? "",
        email:        user.email ?? "",
        phone:        (user as any).phone ?? "",
        businessName: user.businessName ?? "",
        address:      (user as any).state ?? (user as any).address ?? "",
      });
    }
  }, [user]);

  // Dismiss avatar menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Sync tab from URL param
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t) setActiveTab(t);
  }, [searchParams]);

  function switchTab(id: string) {
    setActiveTab(id);
    router.replace(`/settings?tab=${id}`, { scroll: false });
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await profileApi.update({
        name:         `${profileForm.firstName} ${profileForm.lastName}`.trim(),
        businessName: profileForm.businessName,
        phone:        profileForm.phone,
        address:      profileForm.address,
        state:        profileForm.address,
      } as any);
      const updated = res.data as Record<string, unknown>;
      const stored  = localStorage.getItem("debtpadi_user");
      if (stored) {
        const merged = { ...JSON.parse(stored), ...updated };
        localStorage.setItem("debtpadi_user", JSON.stringify(merged));
        login(merged as any);
      }
      setToast({ message: "Profile saved successfully!", type: "success" });
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : "Failed to save", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  function handleToggleNotif(key: keyof typeof NOTIF_DEFAULTS, val: boolean) {
    const next = { ...notifs, [key]: val };
    setNotifs(next);
    localStorage.setItem("debtpadi_notif_prefs", JSON.stringify(next));
  }

  const tabs = [
    { id: "profile",       label: "Profile",        icon: User       },
    { id: "notifications", label: "Notifications",  icon: Bell       },
    { id: "security",      label: "Security",       icon: Shield     },
    { id: "billing",       label: "Billing & Plan", icon: CreditCard },
    { id: "app",           label: "App Settings",   icon: Smartphone },
  ];

  if (loading) return <SettingsSkeleton />;

  return (
    <>
      <TopBar title="Settings" />

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto pb-24 sm:pb-8">

        {/* Mobile tab strip */}
        <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4 no-scrollbar">
          {tabs.map(t => (
            <button key={t.id} onClick={() => switchTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id ? "bg-ink-900 text-white" : "bg-white border border-ink-100 text-ink-500"
              }`}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar nav */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => switchTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === t.id ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                  }`}>
                  <t.icon size={15} />{t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content panel */}
          <div className="flex-1 min-w-0">

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5">Profile Information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6" ref={avatarRef}>
                  <div className="relative flex-shrink-0">
                    <button onClick={() => setMenuOpen(p => !p)}
                      className="w-16 h-16 rounded-2xl bg-jade flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-jade/50 transition-all">
                      {avatarSrc
                        ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                        : <span className="font-heading font-bold text-ink-900 text-2xl">
                            {user?.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() ?? "U"}
                          </span>
                      }
                    </button>

                    {menuOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-ink-200 rounded-xl overflow-hidden shadow-lg min-w-[168px]">
                        <button onClick={() => { setMenuOpen(false); fileInputRef.current?.click(); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50 transition-colors text-left">
                          <Upload size={14} /> Change photo
                        </button>
                        <div className="h-px bg-ink-100" />
                        <button onClick={() => { if (avatarSrc) { setMenuOpen(false); setLightboxOpen(true); } }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                            avatarSrc ? "text-ink-800 hover:bg-ink-50" : "text-ink-400 cursor-not-allowed opacity-50"
                          }`}>
                          <Eye size={14} /> View photo
                        </button>
                      </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => saveAvatar(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }} />
                  </div>

                  <div>
                    <p className="font-semibold text-ink-800">{user?.businessName ?? user?.name ?? ""}</p>
                    <p className="text-ink-400 text-sm">{user?.email ?? ""}</p>
                    <p className="text-ink-300 text-xs mt-0.5">Click avatar to change photo</p>
                  </div>
                </div>

                {/* Lightbox */}
                {lightboxOpen && (
                  <div onClick={() => setLightboxOpen(false)}
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center cursor-zoom-out">
                    <button onClick={() => setLightboxOpen(false)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white">
                      <X size={18} />
                    </button>
                    <img src={avatarSrc!} alt="Profile" className="max-w-[88vw] max-h-[88vh] rounded-2xl object-contain"
                      onClick={e => e.stopPropagation()} />
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ink-600 text-sm font-medium mb-1.5">First name</label>
                      <input value={profileForm.firstName}
                        onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                        className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-ink-600 text-sm font-medium mb-1.5">Last name</label>
                      <input value={profileForm.lastName}
                        onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                        className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-1.5">Email address</label>
                    <input value={profileForm.email} type="email" disabled
                      className="w-full bg-ink-100 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-400 text-sm cursor-not-allowed" />
                    <p className="text-ink-400 text-xs mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-1.5">Phone number</label>
                    <input value={profileForm.phone} type="tel"
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>

                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-1.5">Business name</label>
                    <input value={profileForm.businessName}
                      onChange={e => setProfileForm(p => ({ ...p, businessName: e.target.value }))}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>

                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-1.5">Business location</label>
                    <input value={profileForm.address}
                      onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="e.g. Lagos, Nigeria"
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>

                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:shadow-lg">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-1">Notification Preferences</h2>
                <p className="text-ink-400 text-sm mb-5">Choose what you want to be notified about</p>
                <div className="space-y-0">
                  {([
                    { key: "overdueAlerts",   label: "Overdue debt alerts",  desc: "Get notified when a debt becomes overdue" },
                    { key: "paymentReceived", label: "Payment received",     desc: "Notify when a customer makes a payment"  },
                    { key: "weeklySummary",   label: "Weekly summary",       desc: "Weekly report of your debt portfolio"     },
                    { key: "newCustomer",     label: "New customer added",   desc: "Confirmation when you add a new customer" },
                    { key: "reminderNudges",  label: "Reminder nudges",      desc: "Remind you to send WhatsApp reminders"    },
                  ] as { key: keyof typeof NOTIF_DEFAULTS; label: string; desc: string }[]).map((n) => (
                    <div key={n.key} className="flex items-center justify-between py-4 border-b border-ink-50 last:border-0 gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-ink-800 text-sm">{n.label}</p>
                        <p className="text-ink-400 text-xs mt-0.5">{n.desc}</p>
                      </div>
                      <Toggle
                        checked={notifs[n.key]}
                        onChange={(v) => handleToggleNotif(n.key, v)}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-ink-300 text-xs mt-4">Preferences saved automatically</p>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-1">Security Settings</h2>
                <p className="text-ink-400 text-sm mb-5">Manage your account security</p>
                <div className="space-y-2">
                  {[
                    { label: "Change password",           desc: "Update your account password",          href: "/settings/security/change-password", danger: false },
                    { label: "Two-factor authentication", desc: "Add an extra layer of security",         href: "/settings/security/two-factor",       danger: false },
                    { label: "Active sessions",           desc: "View and manage your active sessions",   href: "/settings/security/sesssions",         danger: false },
                    { label: "Delete account",            desc: "Permanently delete your account",       href: "/settings/security/delete-account",   danger: true  },
                  ].map(item => (
                    <a key={item.href} href={item.href}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors group ${
                        item.danger ? "border-ink-100 hover:border-coral-200 hover:bg-coral-50" : "border-ink-100 hover:bg-ink-50"
                      }`}>
                      <div>
                        <p className={`text-sm font-medium transition-colors ${
                          item.danger ? "text-ink-700 group-hover:text-coral-600" : "text-ink-700 group-hover:text-ink-900"
                        }`}>{item.label}</p>
                        <p className="text-ink-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight size={15} className={`flex-shrink-0 transition-colors ${
                        item.danger ? "text-ink-400 group-hover:text-coral-400" : "text-ink-400"
                      }`} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ── BILLING ── */}
            {activeTab === "billing" && (
              <div className="space-y-4">
                <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-4">Current Plan</h2>
                  <div className="bg-ink-50 rounded-xl p-4 flex items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-heading font-semibold text-ink-800">Free Plan</p>
                      <p className="text-ink-400 text-sm">Up to 10 customers</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-ink-200 text-ink-600 text-xs font-semibold">Active</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-600">Customers used</span>
                      <span className="font-semibold text-ink-800">12 / 10</span>
                    </div>
                    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full bg-jade rounded-full" style={{ width: "100%" }} />
                    </div>
                    <p className="text-coral-500 text-xs mt-1.5 font-medium">Limit reached — upgrade to add more customers</p>
                  </div>
                </div>

                <div className="bg-jade/5 border border-jade/20 rounded-2xl p-4 sm:p-6">
                  <p className="font-heading font-bold text-lg text-ink-900">Pro Plan</p>
                  <p className="text-jade font-bold text-3xl mt-1">
                    ₦30,000<span className="text-ink-400 font-normal text-base">/month</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {["Unlimited customers", "WhatsApp reminders", "PDF export", "Priority support", "Advanced reports"].map(f => (
                      <li key={f} className="text-sm text-ink-600 flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-5 w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* ── APP SETTINGS ── */}
            {activeTab === "app" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-1">App Settings</h2>
                <p className="text-ink-400 text-sm mb-5">Configure your app preferences</p>
                <div className="space-y-2">
                  {[
                    { label: "Currency display", desc: "Nigerian Naira (₦)" },
                    { label: "Language",         desc: "English"           },
                    { label: "Date format",      desc: "DD/MM/YYYY"        },
                    { label: "Offline data sync",desc: "Sync when online"  },
                    { label: "Clear local cache",desc: "Free up storage"   },
                  ].map((item) => (
                    <button key={item.label}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors text-left group">
                      <div>
                        <p className="text-sm font-medium text-ink-700 group-hover:text-ink-900">{item.label}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight size={15} className="text-ink-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
