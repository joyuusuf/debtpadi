"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", businessName: "", password: "",
  });

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-jade rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-ink-900 text-sm">DP</span>
            </div>
            <span className="font-heading font-semibold text-white text-lg">DebtPadi</span>
          </Link>
        </div>

        <div className="max-w-sm w-full">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-jade text-ink-900' : 'bg-ink-700 text-ink-400'}`}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                <span className={`text-sm font-medium transition-colors ${step >= s ? 'text-white' : 'text-ink-600'}`}>
                  {s === 1 ? 'Personal info' : 'Business info'}
                </span>
                {s < 2 && <div className={`w-8 h-px transition-colors ${step > s ? 'bg-jade' : 'bg-ink-700'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-8 animate-fade-up delay-100">
            <h1 className="font-heading text-3xl font-bold text-white mb-2">
              {step === 1 ? "Create your account" : "Tell us about your business"}
            </h1>
            <p className="text-ink-400">
              {step === 1 ? "Start tracking debts in minutes. Free forever." : "This helps us personalize your experience."}
            </p>
          </div>

          {step === 1 ? (
            <form className="space-y-5 animate-fade-up delay-200" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Full name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Mama Fashola Pharmacy"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="mybusiness@gmail.com"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Phone number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="0801 234 5678"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                    required
                    minLength={8}
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

              <button type="submit" className="w-full group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2">
                Continue
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <form className="space-y-5 animate-fade-up delay-200" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Business name</label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={e => update('businessName', e.target.value)}
                  placeholder="Mama Chioma Stores"
                  className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-ink-500 focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Business type</label>
                <select className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none">
                  <option value="" className="bg-ink-800">Select your business type</option>
                  <option value="provision" className="bg-ink-800">Provision / Grocery Store</option>
                  <option value="pharmacy" className="bg-ink-800">Pharmacy / Chemist</option>
                  <option value="fabric" className="bg-ink-800">Fabric / Clothing Shop</option>
                  <option value="electronics" className="bg-ink-800">Electronics Store</option>
                  <option value="food" className="bg-ink-800">Food Vendor / Restaurant</option>
                  <option value="wholesale" className="bg-ink-800">Wholesale / Distribution</option>
                  <option value="other" className="bg-ink-800">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">Location (State)</label>
                <select className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none">
                  <option className="bg-ink-800">Select your state</option>
                  {["Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Anambra", "Enugu", "Delta", "Kaduna", "Ogun", "Other"].map(s => (
                    <option key={s} className="bg-ink-800">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink-300 text-sm font-medium mb-2">How many credit customers do you have?</label>
                <select className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all text-sm appearance-none">
                  <option className="bg-ink-800">Select an option</option>
                  <option className="bg-ink-800">Less than 10</option>
                  <option className="bg-ink-800">10 - 30</option>
                  <option className="bg-ink-800">30 - 50</option>
                  <option className="bg-ink-800">50+</option>
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
                  className="flex-[2] group bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 flex items-center justify-center gap-2"
                >
                  Launch DebtPadi
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 animate-fade-up delay-300">
            <div className="flex items-start gap-2 bg-jade/5 border border-jade/10 rounded-xl p-4">
              <CheckCircle size={15} className="text-jade flex-shrink-0 mt-0.5" />
              <p className="text-ink-400 text-xs leading-relaxed">
                By signing up, you agree to our Terms of Service and Privacy Policy. 
                We&apos;ll never sell your data or spam your customers.
              </p>
            </div>
          </div>

          <p className="text-center text-ink-400 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-jade hover:text-jade-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Benefits */}
      <div className="hidden lg:flex flex-1 bg-ink-800 border-l border-white/5 relative overflow-hidden flex-col justify-center p-12">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, #00C896 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-jade/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-sm">
          <h2 className="font-heading text-2xl font-bold text-white mb-8">
            Join thousands of<br />Nigerian business owners
          </h2>

          <div className="space-y-5">
            {[
              {
                title: "Free to start",
                desc: "Track up to 10 customers at no cost. Upgrade when you need more.",
                color: "text-jade",
              },
              {
                title: "Works without internet",
                desc: "Nigeria's network can be unreliable. DebtPadi works offline and syncs later.",
                color: "text-jade",
              },
              {
                title: "WhatsApp reminders",
                desc: "Send professional payment reminders without the awkward phone call.",
                color: "text-jade",
              },
              {
                title: "See who owes you, instantly",
                desc: "Your dashboard shows overdue debts the moment you open the app.",
                color: "text-jade",
              },
            ].map((b, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-jade/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-jade" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{b.title}</p>
                  <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-ink-700 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-jade/20 flex items-center justify-center">
                <span className="font-heading font-bold text-jade">TF</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Titi Fashola</p>
                <p className="text-jade text-xs">Fabric Shop, Lagos Island</p>
              </div>
            </div>
            <p className="text-ink-300 text-sm leading-relaxed italic">
              &ldquo;My collections improved 40% in the first month. 
              I&apos;m now getting paid faster than ever before.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
