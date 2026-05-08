"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, X, Trash2 } from "lucide-react";
import TopBar from "@/components/layout/TopBar";

const CONFIRM_WORD = "DELETE";

const CONSEQUENCES = [
  "All debtors and customer records will be deleted",
  "Payment history and reports will be lost",
  "Your store profile and business data will be removed",
  "All active sessions will be revoked",
  "This action cannot be undone under any circumstances",
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const [input, setInput]         = useState("");
  const [modalOpen, setModal]     = useState(false);
  const [loading, setLoading]     = useState(false);

  const confirmed = input === CONFIRM_WORD;

  const handleFinalDelete = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setModal(false);
    // In production: call API, clear localStorage, redirect to sign-in
    router.push("/settings");
  };

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

              <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-6">
                Delete Account
              </h2>

              {/* Warning banner */}
              <div className="flex gap-3.5 bg-coral-50 border border-coral-200 rounded-xl p-4 sm:p-5 mb-6">
                <AlertTriangle size={22} className="text-coral-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-bold text-coral-800 text-sm sm:text-base mb-1">
                    This action is permanent and irreversible
                  </h3>
                  <p className="text-sm text-coral-700 leading-relaxed">
                    Deleting your account will permanently remove all your data, active sessions,
                    and payment history from DebtPadi servers.
                  </p>
                </div>
              </div>

              {/* Consequences list */}
              <div className="space-y-2.5 mb-7">
                {CONSEQUENCES.map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-ink-500">
                    <X size={15} className="text-coral-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Confirm input */}
              <div className="mb-5">
                <p className="text-sm text-ink-700 mb-2">
                  To confirm, type{" "}
                  <code className="font-mono bg-coral-50 text-coral-600 border border-coral-200 px-1.5 py-0.5 rounded text-xs">
                    {CONFIRM_WORD}
                  </code>{" "}
                  below
                </p>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Type ${CONFIRM_WORD} to confirm`}
                  spellCheck={false}
                  autoComplete="off"
                  className={`w-full font-mono tracking-widest text-sm px-4 py-2.5 sm:py-3
                    border rounded-xl outline-none transition-all bg-ink-50
                    placeholder:text-ink-300 placeholder:tracking-normal
                    ${confirmed
                      ? "border-coral-400 bg-coral-50/50 text-ink-800"
                      : "border-ink-200 focus:border-coral-300 focus:ring-2 focus:ring-coral-100 text-ink-800"
                    }`}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="px-5 py-2.5 text-sm font-medium text-ink-600 border border-ink-200 rounded-xl hover:border-ink-400 hover:bg-ink-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={!confirmed}
                  onClick={() => setModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                  Delete my account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final confirmation modal */}
      {modalOpen && (
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
              <h3 className="font-heading font-bold text-coral-600 text-base">
                ⚠ Permanently delete account?
              </h3>
              {!loading && (
                <button
                  onClick={() => setModal(false)}
                  className="text-ink-400 hover:text-ink-700 transition-colors ml-4"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="text-sm text-ink-400 leading-relaxed mb-6">
              This will immediately and permanently delete your DebtPadi account,
              all stored data, and revoke all sessions. There is absolutely no undo.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-ink-600 border border-ink-200 rounded-xl hover:border-ink-400 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-coral-500 hover:bg-coral-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Yes, delete forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
