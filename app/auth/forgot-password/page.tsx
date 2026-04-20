// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [canResend, setCanResend] = useState(true);

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitted(true);
//     setCanResend(false);
//     setResendTimer(59);
//     const countdown = setInterval(() => {
//       setResendTimer((s) => {
//         if (s <= 1) { clearInterval(countdown); setCanResend(true); return 0; }
//         return s - 1;
//       });
//     }, 1000);
//   }

//   function handleResend() {
//     if (!canResend) return;
//     setCanResend(false);
//     setResendTimer(59);
//     const countdown = setInterval(() => {
//       setResendTimer((s) => {
//         if (s <= 1) { clearInterval(countdown); setCanResend(true); return 0; }
//         return s - 1;
//       });
//     }, 1000);
//   }

//   return (
//     <div className="min-h-screen bg-ink-900 flex">
//       {/* Left — Form */}
//       <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
//         {/* Logo */}
//         <div className="mb-12">
//           <Link href="/" className="inline-flex items-center gap-2">
//             <div className="w-8 h-8 bg-jade rounded-lg flex items-center justify-center">
//               <span className="font-heading font-bold text-ink-900 text-sm">DP</span>
//             </div>
//             <span className="font-heading font-semibold text-white text-lg">DebtPadi</span>
//           </Link>
//         </div>

//         <div className="max-w-sm w-full">
//           {/* Back to sign in */}
//           <Link
//             href="/auth/signin"
//             className="inline-flex items-center gap-2 text-ink-400 hover:text-white transition-colors text-sm font-medium mb-8 animate-fade-up"
//           >
//             <ArrowLeft size={16} />
//             Back to sign in
//           </Link>

//           {!submitted ? (
//             <>
//               {/* Icon */}
//               <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 animate-fade-up">
//                 <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//                   <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//                 </svg>
//               </div>

//               <div className="mb-8 animate-fade-up delay-100">
//                 <h1 className="font-heading text-3xl font-bold text-white mb-2">Forgot password?</h1>
//                 <p className="text-ink-400 leading-relaxed">
//                   No worries. Enter the email address on your account and we&apos;ll send you a reset link.
//                 </p>
//               </div>

//               <form className="space-y-5 animate-fade-up delay-200" onSubmit={handleSubmit}>
//                 <div>
//                   <label className="block text-ink-300 text-sm font-medium mb-2">Email address</label>
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="mybusiness@gmail.com"
//                     className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
//                 >
//                   Send reset link
//                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </form>

//               <p className="text-center text-ink-500 text-sm mt-8 animate-fade-up delay-300">
//                 Remembered your password?{" "}
//                 <Link href="/auth/signin" className="text-jade hover:text-jade-400 font-medium transition-colors">
//                   Sign in
//                 </Link>
//               </p>
//             </>
//           ) : (
//             /* Sent state */
//             <div className="animate-fade-up">
//               {/* Success icon */}
//               <div className="w-14 h-14 bg-jade/10 border border-jade/20 rounded-2xl flex items-center justify-center mb-6">
//                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="2" y="4" width="20" height="16" rx="2" />
//                   <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//                 </svg>
//               </div>

//               <h1 className="font-heading text-3xl font-bold text-white mb-2">Check your email</h1>
//               <p className="text-ink-400 leading-relaxed mb-2">
//                 We sent a password reset link to{" "}
//                 <span className="text-white font-medium">{email}</span>.
//               </p>
//               <p className="text-ink-500 text-sm mb-8">
//                 The link expires in 30 minutes. If you don&apos;t see the email, check your spam folder.
//               </p>

//               <Link
//                 href="/auth/reset-password"
//                 className="group w-full flex items-center justify-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 mb-4"
//               >
//                 Open reset link
//                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//               </Link>

//               {/* Resend */}
//               <div className="flex items-center justify-between p-4 bg-ink-800 border border-white/5 rounded-xl">
//                 <div>
//                   <p className="text-ink-300 text-sm font-medium">Didn&apos;t receive it?</p>
//                   {!canResend && resendTimer > 0 && (
//                     <p className="text-ink-500 text-xs mt-0.5">
//                       Resend in <span className="text-jade font-mono">{String(resendTimer).padStart(2, "0")}s</span>
//                     </p>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleResend}
//                   disabled={!canResend}
//                   className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
//                     canResend ? "text-jade hover:text-jade-400 cursor-pointer" : "text-ink-600 cursor-not-allowed"
//                   }`}
//                 >
//                   <RotateCcw size={14} className={canResend ? "" : "opacity-40"} />
//                   Resend link
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right — Visual */}
//       <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden items-center justify-center p-12">
//         <div className="absolute inset-0 opacity-[0.03]" style={{
//           backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
//           backgroundSize: "32px 32px",
//         }} />
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

//         <div className="relative z-10 max-w-xs text-center">
//           <div className="bg-ink-700 border border-white/10 rounded-2xl p-8 mb-6">
//             <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//                 <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//               </svg>
//             </div>
//             <h3 className="font-heading font-bold text-white text-lg mb-2">Secure reset</h3>
//             <p className="text-ink-400 text-sm leading-relaxed">
//               Your reset link is encrypted and expires automatically after 30 minutes for your security.
//             </p>
//           </div>

//           <div className="bg-jade/5 border border-jade/10 rounded-xl p-4">
//             <p className="text-jade text-xs font-semibold uppercase tracking-wide mb-2">Security tip</p>
//             <p className="text-ink-400 text-xs leading-relaxed">
//               We will never ask for your password via phone call or WhatsApp. Only reset through our official link.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setCanResend(false);
    setResendTimer(59);
    const countdown = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleResend() {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(59);
    const countdown = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
        {/* Logo */}
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
          {/* Back to sign in */}
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-ink-400 hover:text-white transition-colors text-sm font-medium mb-8 animate-fade-up"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          {!submitted ? (
            <>
              {/* Icon */}
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 animate-fade-up">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <div className="mb-8 animate-fade-up delay-100">
                <h1 className="font-heading text-3xl font-bold text-white mb-2">Forgot password?</h1>
                <p className="text-ink-400 leading-relaxed">
                  No worries. Enter the email address on your account and we&apos;ll send you a reset link.
                </p>
              </div>

              <form className="space-y-5 animate-fade-up delay-200" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-ink-300 text-sm font-medium mb-2">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mybusiness@gmail.com"
                    className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
                >
                  Send reset link
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-center text-ink-500 text-sm mt-8 animate-fade-up delay-300">
                Remembered your password?{" "}
                <Link href="/auth/signin" className="text-jade hover:text-jade-400 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <div className="animate-fade-up">
              <div className="w-14 h-14 bg-jade/10 border border-jade/20 rounded-2xl flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00C896" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <h1 className="font-heading text-3xl font-bold text-white mb-2">Check your email</h1>
              <p className="text-ink-400 leading-relaxed mb-2">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>.
              </p>
              <p className="text-ink-500 text-sm mb-8">
                The link expires in 30 minutes. If you don&apos;t see the email, check your spam folder.
              </p>

              <Link
                href="/auth/reset-password"
                className="group w-full flex items-center justify-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 mb-4"
              >
                Open reset link
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-between p-4 bg-ink-800 border border-white/5 rounded-xl">
                <div>
                  <p className="text-ink-300 text-sm font-medium">Didn&apos;t receive it?</p>
                  {!canResend && resendTimer > 0 && (
                    <p className="text-ink-500 text-xs mt-0.5">
                      Resend in <span className="text-jade font-mono">{String(resendTimer).padStart(2, "0")}s</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
                    canResend ? "text-jade hover:text-jade-400 cursor-pointer" : "text-ink-600 cursor-not-allowed"
                  }`}
                >
                  <RotateCcw size={14} className={canResend ? "" : "opacity-40"} />
                  Resend link
                </button>
              </div>
            </div>
          )}
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
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-white text-lg mb-2">Secure reset</h3>
            <p className="text-ink-400 text-sm leading-relaxed">
              Your reset link is encrypted and expires automatically after 30 minutes for your security.
            </p>
          </div>

          <div className="bg-jade/5 border border-jade/10 rounded-xl p-4">
            <p className="text-jade text-xs font-semibold uppercase tracking-wide mb-2">Security tip</p>
            <p className="text-ink-400 text-xs leading-relaxed">
              We will never ask for your password via phone call or WhatsApp. Only reset through our official link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}