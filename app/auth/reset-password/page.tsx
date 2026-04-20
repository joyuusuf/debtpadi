"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-coral-500", "bg-amber-400", "bg-amber-300", "bg-jade"];
  const textColors = ["", "text-coral-400", "text-amber-400", "text-amber-300", "text-jade"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all ${i <= strength ? colors[strength] : "bg-ink-700"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setMismatch(true); return; }
    setMismatch(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-sm w-full animate-fade-up">
          <div className="w-20 h-20 bg-jade/10 border border-jade/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-jade" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-white mb-3">Password Reset!</h1>
          <p className="text-ink-400 leading-relaxed mb-8">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <Link
            href="/auth/signin"
            className="group w-full flex items-center justify-center gap-3 bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20"
          >
            Sign in to DebtPadi
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
        
        {/* ✅ UPDATED LOGO */}
        <div className="mb-12 bg-white w-32 h-8">
          <Link href="/" className="inline-flex items-center">
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

        <div className="max-w-sm w-full">
          {/* Icon */}
          <div className="w-14 h-14 bg-jade/10 border border-jade/20 rounded-2xl flex items-center justify-center mb-6 animate-fade-up">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div className="mb-8 animate-fade-up delay-100">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Set new password</h1>
            <p className="text-ink-400 leading-relaxed">
              Choose a strong password for your DebtPadi account. You&apos;ll use it to sign in from now on.
            </p>
          </div>

          <form className="space-y-5 animate-fade-up delay-200" onSubmit={handleSubmit}>
            {/* New password */}
            <div>
              <label className="block text-ink-300 text-sm font-medium mb-2">New password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setMismatch(false); }}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <StrengthBar password={password} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-ink-300 text-sm font-medium mb-2">Confirm new password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setMismatch(false); }}
                  placeholder="Re-enter your password"
                  className={`w-full bg-ink-800 border rounded-xl px-4 py-3.5 pr-12 text-white placeholder-ink-500 focus:ring-2 transition-all text-sm ${
                    mismatch
                      ? "border-coral-500 focus:border-coral-400 focus:ring-coral-500/20"
                      : "border-white/10 focus:border-jade/50 focus:ring-jade/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors p-1"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {mismatch && (
                <p className="text-coral-400 text-sm mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-400 flex-shrink-0" />
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-ink-800 border border-white/5 rounded-xl p-4 space-y-2">
              <p className="text-ink-400 text-xs font-semibold uppercase tracking-wide mb-3">Password requirements</p>
              {[
                { label: "At least 8 characters", met: password.length >= 8 },
                { label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(password) },
                { label: "One number (0–9)", met: /[0-9]/.test(password) },
                { label: "One special character (!@#$...)", met: /[^A-Za-z0-9]/.test(password) },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${req.met ? "bg-jade/20" : "bg-ink-700"}`}>
                    {req.met
                      ? <CheckCircle size={11} className="text-jade" />
                      : <div className="w-1.5 h-1.5 rounded-full bg-ink-500" />
                    }
                  </div>
                  <span className={`text-xs transition-colors ${req.met ? "text-jade" : "text-ink-500"}`}>{req.label}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
            >
              Reset my password
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-ink-500 text-sm mt-6 animate-fade-up delay-300">
            Remember it now?{" "}
            <Link href="/auth/signin" className="text-jade hover:text-jade-400 font-medium transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-xs text-center">
          <div className="bg-ink-700 border border-white/10 rounded-2xl p-8 mb-6">
            <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-white text-lg mb-2">Almost there</h3>
            <p className="text-ink-400 text-sm leading-relaxed">
              Set a strong password to keep your debt records and customer data protected.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { label: "8+ characters", color: "bg-jade/20 text-jade" },
              { label: "Uppercase letter", color: "bg-jade/20 text-jade" },
              { label: "Number", color: "bg-jade/20 text-jade" },
              { label: "Special character", color: "bg-jade/20 text-jade" },
            ].map((t, i) => (
              <div key={i} className={`${t.color} rounded-lg px-3 py-2 text-xs font-semibold text-left flex items-center gap-2`}>
                <CheckCircle size={13} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}