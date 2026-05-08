"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldOff,
  Info,
  Check,
  CheckCircle2,
  Copy,
  RefreshCw,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";

/* ── Mock data ──────────────────────────────────────────────── */
const SECRET_KEY = "JBSW Y3DP EHPK 3PXP";
const INITIAL_CODES = ["A1B2-C3D4","E5F6-G7H8","I9J0-K1L2","M3N4-O5P6","Q7R8-S9T0","U1V2-W3X4"];

function generateCodes(): string[] {
  return Array.from({ length: 6 }, () => {
    const s = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${s()}-${s()}`;
  });
}

type Step = "idle" | "setup" | "enabled";

/* ── Main component ─────────────────────────────────────────── */
export default function TwoFactorPage() {
  const router = useRouter();
  const [step, setStep]               = useState<Step>("idle");
  const [otp, setOtp]                 = useState<string[]>(Array(6).fill(""));
  const [verifyLoading, setVerify]    = useState(false);
  const [recoveryCodes, setRecovery]  = useState<string[]>(INITIAL_CODES);
  const [copied, setCopied]           = useState(false);
  const [regenLoading, setRegen]      = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* OTP input handling */
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
      const next = [...otp]; next[idx - 1] = ""; setOtp(next);
    }
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    setVerify(true);
    await new Promise(r => setTimeout(r, 1800));
    setVerify(false);
    setStep("enabled");
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(recoveryCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegen = async () => {
    setRegen(true);
    await new Promise(r => setTimeout(r, 800));
    setRecovery(generateCodes());
    setRegen(false);
  };

  const handleDisable = () => {
    setStep("idle");
    setOtp(Array(6).fill(""));
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

              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900">
                  Two-Factor Authentication
                </h2>
                {step === "enabled" && (
                  <span className="inline-flex items-center gap-1 bg-jade/10 text-jade text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <Check size={11} /> Enabled
                  </span>
                )}
              </div>

              {/* ── IDLE ── */}
              {step === "idle" && (
                <div>
                  <div className="flex gap-3 bg-jade/5 border border-jade/15 rounded-xl p-4 mb-6">
                    <Info size={18} className="text-jade flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-ink-600 leading-relaxed">
                      Two-factor authentication adds an extra security layer. Once enabled,
                      you&apos;ll need both your password and a verification code to sign in.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("setup")}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-ink-900 hover:bg-ink-700 text-white rounded-xl transition-all"
                  >
                    <ShieldCheck size={15} /> Enable 2FA
                  </button>
                </div>
              )}

              {/* ── SETUP ── */}
              {step === "setup" && (
                <div>
                  <p className="text-sm text-ink-400 mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>

                  {/* QR placeholder */}
                  <div className="border border-dashed border-ink-200 rounded-xl p-6 text-center bg-ink-50 mb-5">
                    <QRPlaceholder />
                    <div className="mt-3">
                      <code className="inline-block bg-ink-900 text-jade font-mono text-sm tracking-widest px-4 py-2 rounded-lg">
                        {SECRET_KEY}
                      </code>
                      <p className="text-xs text-ink-400 mt-1.5">Can&apos;t scan? Use this key manually</p>
                    </div>
                  </div>

                  <p className="text-sm text-ink-400 text-center mb-3">
                    Enter the 6-digit code from your authenticator app
                  </p>

                  {/* OTP inputs */}
                  <div className="flex gap-2 justify-center mb-5" role="group" aria-label="6-digit verification code">
                    {Array(6).fill(null).map((_, i) => (
                      <input
                        key={i}
                        ref={el => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[i] ?? ""}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        disabled={verifyLoading}
                        aria-label={`Digit ${i + 1}`}
                        className={`w-11 h-12 text-center text-xl font-bold font-heading
                          border rounded-xl outline-none transition-all
                          bg-ink-50 disabled:opacity-50
                          ${otp[i]
                            ? "border-jade text-jade bg-white"
                            : "border-ink-200 text-ink-800 focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                          }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { setStep("idle"); setOtp(Array(6).fill("")); }}
                      className="px-5 py-2.5 text-sm font-medium text-ink-600 border border-ink-200 rounded-xl hover:border-ink-400 hover:bg-ink-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleVerify}
                      disabled={verifyLoading || otp.join("").length < 6}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-ink-900 hover:bg-ink-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {verifyLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={15} /> Verify & Enable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── ENABLED ── */}
              {step === "enabled" && (
                <div>
                  <div className="flex items-center gap-2 bg-jade/10 border border-jade/20 rounded-xl px-4 py-3 text-sm text-jade mb-5">
                    <CheckCircle2 size={16} className="flex-shrink-0" />
                    2FA successfully enabled on your account!
                  </div>

                  <div className="border border-ink-100 rounded-xl p-4 sm:p-5">
                    <h3 className="font-heading font-bold text-ink-900 text-base mb-1">
                      Recovery Codes
                    </h3>
                    <p className="text-xs text-ink-400 leading-relaxed mb-4">
                      Store these codes safely. Each can be used once if you lose access to your authenticator app.
                    </p>

                    <div className={`grid grid-cols-2 gap-1.5 mb-4 transition-opacity ${regenLoading ? "opacity-40" : "opacity-100"}`}>
                      {recoveryCodes.map(code => (
                        <code
                          key={code}
                          className="bg-ink-50 font-mono text-[12px] px-3 py-1.5 rounded-lg text-ink-700 tracking-wider"
                        >
                          {code}
                        </code>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:border-ink-400 hover:bg-ink-50 transition-all"
                      >
                        {copied ? <Check size={13} className="text-jade" /> : <Copy size={13} />}
                        {copied ? "Copied!" : "Copy codes"}
                      </button>
                      <button
                        onClick={handleRegen}
                        disabled={regenLoading}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-ink-700 border border-ink-200 rounded-lg hover:border-ink-400 hover:bg-ink-50 transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={13} className={regenLoading ? "animate-spin" : ""} />
                        Regenerate
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={handleDisable}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-coral-500 border border-coral-200 rounded-xl hover:bg-coral-50 transition-all"
                    >
                      <ShieldOff size={13} /> Disable 2FA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── QR code visual placeholder ─────────────────────────────── */
function QRPlaceholder() {
  const pattern = [
    1,1,1,1,1,1,1, 0,1,0,1,0,0,0, 1,1,1,1,1,1,1,
    1,0,0,0,0,0,1, 0,0,1,0,1,0,0, 1,0,0,0,0,0,1,
    1,0,1,1,1,0,1, 0,1,1,0,0,1,0, 1,0,1,1,1,0,1,
    1,0,1,1,1,0,1, 0,0,0,1,1,0,0, 1,0,1,1,1,0,1,
    1,0,1,1,1,0,1, 0,1,0,0,1,1,0, 1,0,1,1,1,0,1,
    1,0,0,0,0,0,1, 0,1,1,0,0,0,0, 1,0,0,0,0,0,1,
    1,1,1,1,1,1,1, 0,1,0,1,0,1,0, 1,1,1,1,1,1,1,
  ];
  return (
    <div
      className="inline-grid gap-px bg-ink-900 p-2 rounded-lg"
      style={{ gridTemplateColumns: "repeat(21, 1fr)", width: 110, height: 110 }}
    >
      {pattern.map((cell, i) => (
        <div key={i} className={`${cell ? "bg-ink-900" : "bg-white"}`} />
      ))}
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
