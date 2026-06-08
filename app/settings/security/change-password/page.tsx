"use client";
import { useState } from "react";
import { auth as authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  Circle,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";

/* ── Types ─────────────────────────────────────────────────── */
interface FieldState {
  value: string;
  show: boolean;
  touched: boolean;
}

interface Req {
  id: string;
  label: string;
  test: (v: string) => boolean;
}

/* ── Password requirements ──────────────────────────────────── */
const REQUIREMENTS: Req[] = [
  {
    id: "len",
    label: "Minimum 8 characters",
    test: (v) => v.length >= 8,
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: "num",
    label: "One number",
    test: (v) => /[0-9]/.test(v),
  },
  {
    id: "special",
    label: "One special character",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

/* ── Strength helpers ───────────────────────────────────────── */
function getScore(val: string) {
  return REQUIREMENTS.filter((r) => r.test(val)).length;
}

function strengthLabel(score: number) {
  if (score === 0) return "";
  if (score <= 2) return "Weak";
  if (score === 3) return "Medium";
  return "Strong";
}

function strengthColor(score: number) {
  if (score <= 2) return "bg-coral-500";
  if (score === 3) return "bg-amber-400";
  return "bg-jade";
}

function strengthTextColor(score: number) {
  if (score <= 2) return "text-coral-500";
  if (score === 3) return "text-amber-500";
  return "text-jade";
}

/* ── Component ──────────────────────────────────────────────── */
export default function ChangePasswordPage() {
  const router = useRouter();

  const [current, setCurrent] = useState<FieldState>({
    value: "",
    show: false,
    touched: false,
  });

  const [newPw, setNewPw] = useState<FieldState>({
    value: "",
    show: false,
    touched: false,
  });

  const [confirm, setConfirm] = useState<FieldState>({
    value: "",
    show: false,
    touched: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  const score = getScore(newPw.value);

  /* field-level errors */
  const currentErr =
    current.touched && !current.value
      ? "Current password is required"
      : "";

  const newErr =
    newPw.touched && !newPw.value
      ? "New password is required"
      : newPw.touched && score < 4
      ? "Password does not meet all requirements"
      : "";

  const confirmErr =
    confirm.touched && !confirm.value
      ? "Please confirm your password"
      : confirm.touched && confirm.value !== newPw.value
      ? "Passwords do not match"
      : "";

  const canSubmit =
    current.value &&
    newPw.value &&
    confirm.value &&
    score === 4 &&
    newPw.value === confirm.value &&
    !loading;

  const goToSecurity = () => {
    router.push("/settings/security");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setCurrent((p) => ({ ...p, touched: true }));
    setNewPw((p) => ({ ...p, touched: true }));
    setConfirm((p) => ({ ...p, touched: true }));

    if (!canSubmit) return;

    setLoading(true);
    setSubmitErr("");

    try {
      await authApi.changePassword({
        currentPassword: current.value,
        newPassword: newPw.value,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setSubmitErr(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }

    setCurrent({
      value: "",
      show: false,
      touched: false,
    });

    setNewPw({
      value: "",
      show: false,
      touched: false,
    });

    setConfirm({
      value: "",
      show: false,
      touched: false,
    });

    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <>
      <TopBar title="Settings" />

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
        <div className="flex gap-6">
          {/* ── Settings sub-nav ── */}
          <SettingsSideNav active="security" />

          {/* ── Panel ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
              <button
                onClick={goToSecurity}
                className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors mb-5"
              >
                <ArrowLeft size={14} />
                Back to Security
              </button>

              <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-6">
                Change Password
              </h2>

              {/* Success banner */}
              {success && (
                <div className="flex items-center gap-2 bg-jade/10 border border-jade/20 rounded-xl px-4 py-3 text-sm text-jade mb-5">
                  <CheckCircle2 size={16} className="flex-shrink-0" />
                  Password updated successfully!
                </div>
              )}

              {submitErr && (
                <div className="flex items-center gap-2 bg-coral-50 border border-coral-200 rounded-xl px-4 py-3 text-sm text-coral-600 mb-5">
                  {submitErr}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Current password */}
                <PasswordField
                  id="current-pw"
                  label="Current password"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  state={current}
                  onChange={(v) =>
                    setCurrent((p) => ({
                      ...p,
                      value: v,
                    }))
                  }
                  onBlur={() =>
                    setCurrent((p) => ({
                      ...p,
                      touched: true,
                    }))
                  }
                  onToggle={() =>
                    setCurrent((p) => ({
                      ...p,
                      show: !p.show,
                    }))
                  }
                  error={currentErr}
                />

                {/* New password */}
                <div>
                  <PasswordField
                    id="new-pw"
                    label="New password"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    state={newPw}
                    onChange={(v) =>
                      setNewPw((p) => ({
                        ...p,
                        value: v,
                      }))
                    }
                    onBlur={() =>
                      setNewPw((p) => ({
                        ...p,
                        touched: true,
                      }))
                    }
                    onToggle={() =>
                      setNewPw((p) => ({
                        ...p,
                        show: !p.show,
                      }))
                    }
                    error={newErr}
                  />

                  {/* Strength bar */}
                  {newPw.value && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < score
                                ? strengthColor(score)
                                : "bg-ink-100"
                            }`}
                          />
                        ))}
                      </div>

                      {strengthLabel(score) && (
                        <p
                          className={`text-xs font-medium ${strengthTextColor(
                            score
                          )}`}
                        >
                          {strengthLabel(score)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Requirements checklist */}
                  {newPw.value && (
                    <div className="mt-3 bg-ink-50 rounded-xl px-4 py-3 space-y-1.5">
                      <p className="text-[11px] font-semibold text-ink-700 font-heading mb-1.5">
                        Password requirements
                      </p>

                      {REQUIREMENTS.map((req) => {
                        const met = req.test(newPw.value);

                        return (
                          <div
                            key={req.id}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                              met ? "text-jade" : "text-ink-400"
                            }`}
                          >
                            {met ? (
                              <CheckCircle2
                                size={13}
                                className="flex-shrink-0"
                              />
                            ) : (
                              <Circle
                                size={13}
                                className="flex-shrink-0"
                              />
                            )}

                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <PasswordField
                  id="confirm-pw"
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  state={confirm}
                  onChange={(v) =>
                    setConfirm((p) => ({
                      ...p,
                      value: v,
                    }))
                  }
                  onBlur={() =>
                    setConfirm((p) => ({
                      ...p,
                      touched: true,
                    }))
                  }
                  onToggle={() =>
                    setConfirm((p) => ({
                      ...p,
                      show: !p.show,
                    }))
                  }
                  error={confirmErr}
                  success={
                    !confirmErr &&
                    !!confirm.value &&
                    confirm.value === newPw.value
                  }
                />

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={goToSecurity}
                    className="px-5 py-2.5 text-sm font-medium text-ink-600 border border-ink-200 rounded-xl hover:border-ink-400 hover:bg-ink-50 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-ink-900 hover:bg-ink-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        Update password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Reusable password field ─────────────────────────────────── */
function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  state,
  onChange,
  onBlur,
  onToggle,
  error,
  success,
}: {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  state: FieldState;
  onChange: (v: string) => void;
  onBlur: () => void;
  onToggle: () => void;
  error?: string;
  success?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-ink-600 text-xs sm:text-sm font-medium"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={id}
          type={state.show ? "text" : "password"}
          value={state.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-ink-50 border rounded-xl px-4 py-2.5 sm:py-3 pr-10 text-ink-700 text-sm
            focus:ring-2 transition-all outline-none
            ${
              error
                ? "border-coral-400 focus:border-coral-400 focus:ring-coral-100"
                : success
                ? "border-jade/50 focus:border-jade/50 focus:ring-jade/10"
                : "border-ink-200 focus:border-jade/50 focus:ring-jade/10"
            }`}
        />

        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          className="absolute right-3 text-ink-400 hover:text-ink-700 transition-colors"
          aria-label={state.show ? "Hide" : "Show"}
        >
          {state.show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="text-xs text-coral-500">{error}</p>}
    </div>
  );
}

/* ── Settings side nav ─────────────────────────────────────── */
function SettingsSideNav({ active }: { active: string }) {
  const router = useRouter();

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "billing", label: "Billing & Plan" },
    { id: "app", label: "App Settings" },
  ];

  return (
    <div className="hidden md:block w-52 flex-shrink-0">
      <nav className="space-y-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() =>
              router.push(
                t.id === "security"
                  ? "/settings/security"
                  : `/settings?tab=${t.id}`
              )
            }
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