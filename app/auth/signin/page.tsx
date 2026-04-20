"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

const API_BASE = "http://localhost:5000/api/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      setToast({ message: "Welcome back! Redirecting...", type: "success" });
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
        {/* Logo */}
        <div className="mb-12 w-20 bg-white">
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
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-ink-400">Sign in to your account to continue</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-ink-300 text-sm font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mybusiness@gmail.com"
                required
                className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-ink-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

              <div className="flex justify-end mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-jade text-sm hover:text-jade-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to DebtPadi
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Google & Signup Link */}
          <div className="mt-6">
            <div className="relative flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-ink-500 text-xs">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button className="w-full bg-ink-800 border border-white/10 hover:border-white/20 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 text-sm hover:bg-ink-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-ink-400 text-sm mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-jade hover:text-jade-400 font-medium transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Visual — unchanged */}
      <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden items-center justify-center p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm">
          <div className="bg-ink-700 border border-white/10 rounded-2xl p-6 mb-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-coral-500/20 flex items-center justify-center">
                <span className="font-heading font-bold text-coral-400 text-sm">AB</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Adeola Bakare</p>
                <p className="text-ink-400 text-xs">08031234567</p>
              </div>
              <div className="ml-auto">
                <span className="badge bg-coral-500/20 text-coral-400 text-xs">Overdue</span>
              </div>
            </div>
            <div className="bg-ink-800 rounded-xl p-4">
              <p className="text-ink-400 text-xs mb-1">Total Owed</p>
              <p className="font-heading font-bold text-2xl text-white">₦45,000</p>
              <div className="mt-3 h-1.5 bg-ink-600 rounded-full overflow-hidden">
                <div className="h-full bg-jade rounded-full" style={{ width: '27%' }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-ink-500 text-xs">₦12,000 paid</span>
                <span className="text-coral-400 text-xs">27%</span>
              </div>
            </div>
            <button className="w-full mt-4 bg-jade/10 hover:bg-jade/20 text-jade font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Send WhatsApp Reminder
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-jade/10 border border-jade/20 rounded-xl p-4">
              <p className="text-jade-300 text-xs mb-1">Total Owed</p>
              <p className="font-heading font-bold text-white text-xl">₦167.5k</p>
            </div>
            <div className="bg-coral-500/10 border border-coral-500/20 rounded-xl p-4">
              <p className="text-coral-300 text-xs mb-1">Overdue</p>
              <p className="font-heading font-bold text-white text-xl">3 debts</p>
            </div>
          </div>

          <p className="text-center text-ink-500 text-xs mt-6 leading-relaxed">
            &ldquo;I collected ₦80,000 in the first week after signing up.&rdquo;<br />
            <span className="text-jade">- Titilayo, Ibadan</span>
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}