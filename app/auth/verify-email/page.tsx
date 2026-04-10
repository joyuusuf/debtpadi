"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, RotateCcw, CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError(false);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...code];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setCode(next);
    const lastIdx = Math.min(pasted.length, 5);
    inputsRef.current[lastIdx]?.focus();
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const full = code.join("");
    if (full.length < 6) { setError(true); return; }
    if (full === "000000") { setError(true); return; }
    setVerified(true);
  }

  function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(59);
    setCode(["", "", "", "", "", ""]);
    setError(false);
    inputsRef.current[0]?.focus();
  }

  // ── Verified state ───────────────────────────────────────────────────────────
  if (verified) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-sm w-full animate-fade-up">
          <div className="w-20 h-20 bg-jade/10 border border-jade/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-jade" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">Email Verified!</h1>
          <p className="text-ink-400 leading-relaxed mb-8">
            Your account is all set up. Let&apos;s get your business organised.
          </p>
          <Link
            href="/dashboard"
            className="group w-full flex items-center justify-center gap-3 bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20"
          >
            Go to my Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Main page ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink-900 flex">

      {/* ── Left — Form ───────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-start justify-left px-6 md:px-12 py-10 min-w-0">

        {/* Logo — pinned to top-left on desktop, inline on mobile */}
                <div className="mb-12 w-20 bg-white">
          <Link href="/" className="inline-flex items-start">
            <Image
              src="/debtpadi.png"
              alt="DebtPadi Logo"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <div className="w-full max-w-sm">

          {/* Icon */}
          <div className="w-14 h-14 bg-jade/10 border border-jade/20 rounded-2xl flex items-center justify-center mb-6 animate-fade-up">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>

          <div className="mb-8 animate-fade-up [animation-delay:100ms]">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-ink-400 leading-relaxed">
              We sent a 6-digit verification code to{" "}
              <span className="text-white font-medium">your email address</span>.
              Enter it below to verify your account.
            </p>
          </div>

          <form className="space-y-5 animate-fade-up [animation-delay:200ms]" onSubmit={handleVerify}>

            {/* 6-digit OTP input */}
            <div>
              <label className="block text-ink-300 text-sm font-medium mb-3">
                Verification code
              </label>

              {/* Fixed-size boxes that look good on every screen */}
              <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`
                      w-full max-w-[52px] h-14 text-center text-xl font-heading font-bold
                      rounded-xl border transition-all bg-ink-800 text-white outline-none
                      ${error
                        ? "border-coral-500 focus:border-coral-400 focus:ring-2 focus:ring-coral-500/20"
                        : "border-white/10 focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                      }
                      ${digit ? "border-jade/40 bg-jade/5" : ""}
                    `}
                  />
                ))}
              </div>

              {error && (
                <p className="text-coral-400 text-sm mt-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 flex-shrink-0" />
                  Invalid code. Please check and try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={code.join("").length < 6}
            >
              Verify Email
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Resend block */}
          <div className="mt-5 animate-fade-up [animation-delay:300ms]">
            <div className="flex items-center justify-between p-4 bg-ink-800 border border-white/5 rounded-xl">
              <div>
                <p className="text-ink-300 text-sm font-medium">Didn&apos;t receive the code?</p>
                {!canResend && (
                  <p className="text-ink-500 text-xs mt-0.5">
                    Resend in{" "}
                    <span className="text-jade font-mono">{String(resendTimer).padStart(2, "0")}s</span>
                  </p>
                )}
              </div>
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
                  canResend
                    ? "text-jade hover:text-jade-400 cursor-pointer"
                    : "text-ink-600 cursor-not-allowed"
                }`}
              >
                <RotateCcw size={14} className={canResend ? "" : "opacity-40"} />
                Resend
              </button>
            </div>
          </div>

          <div className="mt-6 text-center animate-fade-up [animation-delay:400ms]">
            <p className="text-ink-500 text-sm">
              Wrong email?{" "}
              <Link href="/auth/signup" className="text-jade hover:text-jade-400 font-medium transition-colors">
                Go back to sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right — Visual (lg+ only) ──────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[480px] xl:w-[520px] flex-shrink-0 bg-ink-800 border-l border-white/5 relative overflow-hidden items-center justify-center p-12">

        {/* Background dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

        <div className="relative z-10 w-full max-w-[300px] text-center">

          {/* ── Step indicator ── */}
          <div className="flex items-start justify-center gap-0 mb-10">
            {[
              { label: "Create account", done: true },
              { label: "Verify email",   active: true },
              { label: "Start tracking", done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start">
                {/* Step dot + label */}
                <div className="flex flex-col items-center gap-1.5 w-20">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all ${
                    s.done
                      ? "bg-jade text-ink-900"
                      : s.active
                        ? "bg-jade/20 text-jade border border-jade/40"
                        : "bg-ink-700 text-ink-500"
                  }`}>
                    {s.done ? <CheckCircle size={15} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium leading-tight text-center whitespace-nowrap ${
                    s.done || s.active ? "text-jade" : "text-ink-600"
                  }`}>
                    {s.label}
                  </span>
                </div>

                {/* Connector line between steps */}
                {i < 2 && (
                  <div className={`w-8 h-px mt-4 flex-shrink-0 ${s.done ? "bg-jade" : "bg-ink-700"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Info card */}
          <div className="bg-ink-700 border border-white/10 rounded-2xl p-7">
            <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-white text-lg mb-2">One step away</h3>
            <p className="text-ink-400 text-sm leading-relaxed">
              Verifying your email keeps your account secure and ensures you can recover it anytime.
            </p>
          </div>

          <p className="text-ink-500 text-xs mt-6 leading-relaxed">
            Check your spam folder if you don&apos;t see the email within a few minutes.
          </p>
        </div>
      </div>

    </div>
  );
}