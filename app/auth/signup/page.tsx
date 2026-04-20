// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Eye, EyeOff, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
// import { Toast } from "@/components/ui/Toast";

// const API_BASE = "http://localhost:5000/api/auth"; // Change to production URL later

// export default function SignUpPage() {
//   const [showPass, setShowPass] = useState(false);
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     businessName: "",
//     businessType: "",
//     state: "",
//     creditCustomers: "",
//   });

//   const update = (k: string, v: string) => {
//     setForm((prev) => ({ ...prev, [k]: v }));
//   };

//   const handleStep1Submit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setStep(2);
//   };

//   const handleFinalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE}/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       // ✅ Save email and form data for verification page
//       localStorage.setItem("verificationEmail", form.email);
//       localStorage.setItem("signupData", JSON.stringify(form));

//       // Redirect to verification
//       window.location.href = "/auth/verify-email";
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-ink-900 flex">
//       {/* Left — Form */}
//       <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
//         {/* Logo */}
//         <div className="mb-12">
//           <Link href="/" className="inline-flex items-center">
//             <Image
//               src="/debtpadi.png"
//               alt="DebtPadi Logo"
//               width={140}
//               height={40}
//               className="object-contain"
//               priority
//             />
//           </Link>
//         </div>

//         <div className="max-w-sm w-full">
//           {/* Step Indicator */}
//           <div className="flex items-center gap-3 mb-8 animate-fade-up">
//             {[1, 2].map((s) => (
//               <div key={s} className="flex items-center gap-2">
//                 <div
//                   className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
//                     step >= s
//                       ? "bg-jade text-ink-900"
//                       : "bg-ink-700 text-ink-400"
//                   }`}
//                 >
//                   {step > s ? <CheckCircle size={14} /> : s}
//                 </div>
//                 <span
//                   className={`text-sm font-medium transition-colors ${
//                     step >= s ? "text-white" : "text-ink-600"
//                   }`}
//                 >
//                   {s === 1 ? "Personal info" : "Business info"}
//                 </span>
//                 {s < 2 && (
//                   <div
//                     className={`w-8 h-px transition-colors ${
//                       step > s ? "bg-jade" : "bg-ink-700"
//                     }`}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="mb-8 animate-fade-up delay-100">
//             <h1 className="font-heading text-3xl font-bold text-white mb-2">
//               {step === 1
//                 ? "Create your account"
//                 : "Tell us about your business"}
//             </h1>
//             <p className="text-ink-400">
//               {step === 1
//                 ? "Start tracking debts in minutes. Free forever."
//                 : "This helps us personalize your experience."}
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
//               {error}
//             </div>
//           )}

//           {step === 1 ? (
//             /* ==================== STEP 1 ==================== */
//             <form
//               className="space-y-5 animate-fade-up delay-200"
//               onSubmit={handleStep1Submit}
//             >
//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Full name
//                 </label>
//                 <input
//                   type="text"
//                   value={form.name}
//                   onChange={(e) => update("name", e.target.value)}
//                   placeholder="Titilayo Oyeyemi"
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Email address
//                 </label>
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => update("email", e.target.value)}
//                   placeholder="titilayo@gmail.com"
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Phone number
//                 </label>
//                 <input
//                   type="tel"
//                   value={form.phone}
//                   onChange={(e) => update("phone", e.target.value)}
//                   placeholder="0801 234 5678"
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPass ? "text" : "password"}
//                     value={form.password}
//                     onChange={(e) => update("password", e.target.value)}
//                     placeholder="Minimum 8 characters"
//                     minLength={8}
//                     className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPass(!showPass)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors p-1"
//                   >
//                     {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
//               >
//                 Continue
//                 <ArrowRight
//                   size={18}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </button>
//             </form>
//           ) : (
//             /* ==================== STEP 2 ==================== */
//             <form
//               className="space-y-5 animate-fade-up delay-200"
//               onSubmit={handleFinalSubmit}
//             >
//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Business name
//                 </label>
//                 <input
//                   type="text"
//                   value={form.businessName}
//                   onChange={(e) => update("businessName", e.target.value)}
//                   placeholder="Titilayo Farms & Agro Supplies"
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Business type
//                 </label>
//                 <select
//                   value={form.businessType}
//                   onChange={(e) => update("businessType", e.target.value)}
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
//                   required
//                 >
//                   <option value="">Select your business type</option>
//                   <option value="provision">Provision / Grocery Store</option>
//                   <option value="farm">Farm Supplies / Equipments</option>
//                   <option value="pharmacy">Pharmacy / Chemist</option>
//                   <option value="fabric">Fabric / Clothing Shop</option>
//                   <option value="electronics">Electronics Store</option>
//                   <option value="food">Food Vendor / Restaurant</option>
//                   <option value="wholesale">Wholesale / Distribution</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   Location (State)
//                 </label>
//                 <select
//                   value={form.state}
//                   onChange={(e) => update("state", e.target.value)}
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
//                   required
//                 >
//                   <option value="">Select your state</option>
//                   {[
//                     "Lagos",
//                     "Abuja (FCT)",
//                     "Kano",
//                     "Rivers",
//                     "Oyo",
//                     "Anambra",
//                     "Enugu",
//                     "Delta",
//                     "Kaduna",
//                     "Ogun",
//                     "Other",
//                   ].map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-ink-300 text-sm font-medium mb-2">
//                   How many credit customers do you have?
//                 </label>
//                 <select
//                   value={form.creditCustomers}
//                   onChange={(e) => update("creditCustomers", e.target.value)}
//                   className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
//                   required
//                 >
//                   <option value="">Select an option</option>
//                   <option value="Less than 10">Less than 10</option>
//                   <option value="10 - 30">10 - 30</option>
//                   <option value="30 - 50">30 - 50</option>
//                   <option value="50+">50+</option>
//                 </select>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="flex-1 border border-white/10 text-white font-semibold py-4 rounded-xl hover:bg-ink-800 transition-colors"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-[2] group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <Loader2 size={20} className="animate-spin" />
//                   ) : (
//                     <>
//                       Launch DebtPadi
//                       <ArrowRight
//                         size={18}
//                         className="group-hover:translate-x-1 transition-transform"
//                       />
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Terms & Privacy */}
//           <div className="mt-6 animate-fade-up delay-300">
//             <div className="flex items-start gap-2 bg-jade/5 border border-jade/10 rounded-xl p-4">
//               <CheckCircle
//                 size={15}
//                 className="text-jade flex-shrink-0 mt-0.5"
//               />
//               <p className="text-ink-400 text-xs leading-relaxed">
//                 By signing up, you agree to our{" "}
//                 <Link href="/terms" className="text-jade hover:underline">
//                   Terms of Service
//                 </Link>{" "}
//                 and{" "}
//                 <Link href="/privacy" className="text-jade hover:underline">
//                   Privacy Policy
//                 </Link>
//                 . We&apos;ll never sell your data or spam your customers.
//               </p>
//             </div>
//           </div>

//           <p className="text-center text-ink-400 text-sm mt-6">
//             Already have an account?{" "}
//             <Link
//               href="/auth/signin"
//               className="text-jade hover:text-jade-400 font-medium transition-colors"
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Right — Benefits Sidebar */}
//       <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden flex-col justify-center p-12">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
//             backgroundSize: "32px 32px",
//           }}
//         />
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

//         <div className="relative z-10 max-w-sm">
//           <h2 className="font-heading text-2xl font-bold text-white mb-8">
//             Join thousands of
//             <br />
//             Nigerian business owners
//           </h2>

//           <div className="space-y-5">
//             {[
//               {
//                 title: "Free to start",
//                 desc: "Track up to 10 customers at no cost. Upgrade when you need more.",
//               },
//               {
//                 title: "Works without internet",
//                 desc: "Nigeria's network can be unreliable. DebtPadi works offline and syncs later.",
//               },
//               {
//                 title: "WhatsApp reminders",
//                 desc: "Send professional payment reminders without the awkward phone call.",
//               },
//               {
//                 title: "See who owes you, instantly",
//                 desc: "Your dashboard shows overdue debts the moment you open the app.",
//               },
//             ].map((b, i) => (
//               <div key={i} className="flex gap-4 items-start">
//                 <div className="w-5 h-5 rounded-full bg-jade/20 flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <div className="w-2 h-2 rounded-full bg-jade" />
//                 </div>
//                 <div>
//                   <p className="font-semibold text-white text-sm">{b.title}</p>
//                   <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">
//                     {b.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Testimonial */}
//           <div className="mt-10 bg-ink-700 border border-white/5 rounded-2xl p-5">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-jade/20 flex items-center justify-center">
//                 <span className="font-heading font-bold text-jade">TF</span>
//               </div>
//               <div>
//                 <p className="font-semibold text-white text-sm">Titi Fashola</p>
//                 <p className="text-jade text-xs">Fabric Shop, Lagos Island</p>
//               </div>
//             </div>
//             <p className="text-ink-300 text-sm leading-relaxed italic">
//               “My collections improved 40% in the first month. I&apos;m now
//               getting paid faster than ever before.”
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
import { Eye, EyeOff, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

const API_BASE = "http://localhost:5000/api/auth";

export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    businessType: "",
    state: "",
    creditCustomers: "",
  });

  const update = (k: string, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("verificationEmail", form.email);
      localStorage.setItem("signupData", JSON.stringify(form));

      setToast({ message: "Account created! Redirecting...", type: "success" });
      setTimeout(() => { window.location.href = "/auth/verify-email"; }, 1200);
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
        <div className="mb-12">
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
          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s
                      ? "bg-jade text-ink-900"
                      : "bg-ink-700 text-ink-400"
                  }`}
                >
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    step >= s ? "text-white" : "text-ink-600"
                  }`}
                >
                  {s === 1 ? "Personal info" : "Business info"}
                </span>
                {s < 2 && (
                  <div
                    className={`w-8 h-px transition-colors ${
                      step > s ? "bg-jade" : "bg-ink-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-8 animate-fade-up delay-100">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              {step === 1
                ? "Create your account"
                : "Tell us about your business"}
            </h1>
            <p className="text-ink-400">
              {step === 1
                ? "Start tracking debts in minutes. Free forever."
                : "This helps us personalize your experience."}
            </p>
          </div>

          {step === 1 ? (
            /* ==================== STEP 1 ==================== */
            <form
              className="space-y-5 animate-fade-up delay-200"
              onSubmit={handleStep1Submit}
            >
              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Titilayo Oyeyemi"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="titilayo@gmail.com"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="0801 234 5678"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors p-1"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          ) : (
            /* ==================== STEP 2 ==================== */
            <form
              className="space-y-5 animate-fade-up delay-200"
              onSubmit={handleFinalSubmit}
            >
              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Business name
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Titilayo Farms & Agro Supplies"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Business type
                </label>
                <select
                  value={form.businessType}
                  onChange={(e) => update("businessType", e.target.value)}
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
                  required
                >
                  <option value="">Select your business type</option>
                  <option value="provision">Provision / Grocery Store</option>
                  <option value="farm">Farm Supplies / Equipments</option>
                  <option value="pharmacy">Pharmacy / Chemist</option>
                  <option value="fabric">Fabric / Clothing Shop</option>
                  <option value="electronics">Electronics Store</option>
                  <option value="food">Food Vendor / Restaurant</option>
                  <option value="wholesale">Wholesale / Distribution</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  Location (State)
                </label>
                <select
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
                  required
                >
                  <option value="">Select your state</option>
                  {[
                    "Lagos",
                    "Abuja (FCT)",
                    "Kano",
                    "Rivers",
                    "Oyo",
                    "Anambra",
                    "Enugu",
                    "Delta",
                    "Kaduna",
                    "Ogun",
                    "Other",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">
                  How many credit customers do you have?
                </label>
                <select
                  value={form.creditCustomers}
                  onChange={(e) => update("creditCustomers", e.target.value)}
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Less than 10">Less than 10</option>
                  <option value="10 - 30">10 - 30</option>
                  <option value="30 - 50">30 - 50</option>
                  <option value="50+">50+</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-white/10 text-white font-semibold py-4 rounded-xl hover:bg-ink-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Launch DebtPadi
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Terms & Privacy */}
          <div className="mt-6 animate-fade-up delay-300">
            <div className="flex items-start gap-2 bg-jade/5 border border-jade/10 rounded-xl p-4">
              <CheckCircle
                size={15}
                className="text-jade flex-shrink-0 mt-0.5"
              />
              <p className="text-ink-400 text-xs leading-relaxed">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-jade hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-jade hover:underline">
                  Privacy Policy
                </Link>
                . We&apos;ll never sell your data or spam your customers.
              </p>
            </div>
          </div>

          <p className="text-center text-ink-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-jade hover:text-jade-400 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Benefits Sidebar */}
      <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden flex-col justify-center p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm">
          <h2 className="font-heading text-2xl font-bold text-white mb-8">
            Join thousands of
            <br />
            Nigerian business owners
          </h2>

          <div className="space-y-5">
            {[
              {
                title: "Free to start",
                desc: "Track up to 10 customers at no cost. Upgrade when you need more.",
              },
              {
                title: "Works without internet",
                desc: "Nigeria's network can be unreliable. DebtPadi works offline and syncs later.",
              },
              {
                title: "WhatsApp reminders",
                desc: "Send professional payment reminders without the awkward phone call.",
              },
              {
                title: "See who owes you, instantly",
                desc: "Your dashboard shows overdue debts the moment you open the app.",
              },
            ].map((b, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-jade/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-jade" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{b.title}</p>
                  <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-10 bg-ink-700 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-jade/20 flex items-center justify-center">
                <span className="font-heading font-bold text-jade">JF</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Jibola Fashola</p>
                <p className="text-jade text-xs">Fabric Shop, Lagos Island, Nigeria.</p>
              </div>
            </div>
            <p className="text-ink-300 text-sm leading-relaxed italic">
              "My collections improved 40% in the first month. I&apos;m now
              getting paid faster than ever before."
            </p>
          </div>
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