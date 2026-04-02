"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, TrendingUp, Users, Bell, Shield, Wifi, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-900 text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-jade rounded-lg flex items-center justify-center">
            <span className="font-heading font-bold text-ink-900 text-sm">DP</span>
          </div>
          <span className="font-heading font-semibold text-white text-lg tracking-tight">DebtPadi</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-ink-300 hover:text-white transition-colors text-sm font-medium">Features</Link>
          <Link href="#pricing" className="text-ink-300 hover:text-white transition-colors text-sm font-medium">Pricing</Link>
          <Link href="#how-it-works" className="text-ink-300 hover:text-white transition-colors text-sm font-medium">How it works</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/signin" className="text-ink-300 hover:text-white transition-colors text-sm font-medium px-4 py-2">
            Sign in
          </Link>
          <Link href="/auth/signup" className="bg-jade hover:bg-jade-400 text-ink-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-jade/20">
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#00C896 1px, transparent 1px), linear-gradient(90deg, #00C896 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-jade/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-up">
            <div className="w-2 h-2 bg-jade rounded-full animate-pulse" />
            <span className="text-jade text-sm font-medium">Built for Nigerian Business Owners</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up delay-100">
            Stop losing money<br />
            <span className="text-jade">to notebook debt</span>
          </h1>

          <p className="text-ink-300 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
            Track who owes you, send WhatsApp reminders with one tap, and collect your money faster.
            No more torn notebooks. No more disputes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up delay-300">
            <Link href="/auth/signup" className="group flex items-center gap-3 bg-jade hover:bg-jade-400 text-ink-900 font-bold text-base px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-jade/30 w-full sm:w-auto justify-center">
              Start tracking for free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/signin" className="flex items-center gap-2 text-ink-300 hover:text-white transition-colors font-medium text-base px-6 py-4">
              Already have an account? Sign in
              <ChevronRight size={16} />
            </Link>
          </div>

          <p className="text-ink-400 text-sm mt-6 animate-fade-up delay-400">
            Free for up to 10 customers · No credit card required
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto mt-20 animate-fade-up delay-500">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900 z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="bg-ink-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Fake browser bar */}
            <div className="bg-ink-700 px-4 py-3 flex items-center gap-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-coral-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-jade-500/60" />
              </div>
              <div className="flex-1 bg-ink-600 rounded-md h-6 mx-4 flex items-center px-3">
                <span className="text-ink-400 text-xs">app.debtpadi.ng/dashboard</span>
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="p-6 bg-ink-50 text-ink-900">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Owed", value: "₦167,500", color: "border-coral-200 bg-coral-50", vcolor: "text-coral-600" },
                  { label: "Overdue", value: "₦132,000", color: "border-amber-200 bg-amber-50", vcolor: "text-amber-600" },
                  { label: "Cleared", value: "₦7,200", color: "border-jade-200 bg-jade-50", vcolor: "text-jade-600" },
                ].map((s, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${s.color}`}>
                    <p className="text-ink-400 text-xs font-medium">{s.label}</p>
                    <p className={`font-heading font-bold text-xl mt-1 ${s.vcolor}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              {/* Table mockup */}
              <div className="bg-white rounded-xl border border-ink-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-ink-100 flex items-center justify-between">
                  <span className="font-heading font-semibold text-sm">Recent Debtors</span>
                  <span className="text-jade text-xs font-medium">View all</span>
                </div>
                {[
                  { name: "Adeola Bakare", amount: "₦45,000", status: "Overdue", statusColor: "bg-coral-50 text-coral-600" },
                  { name: "Chukwuemeka Obi", amount: "₦18,500", status: "Partial", statusColor: "bg-amber-50 text-amber-600" },
                  { name: "Blessing Eze", amount: "₦32,000", status: "Overdue", statusColor: "bg-coral-50 text-coral-600" },
                ].map((row, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between border-b border-ink-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-jade/10 flex items-center justify-center">
                        <span className="text-jade font-semibold text-xs">{row.name[0]}</span>
                      </div>
                      <span className="font-medium text-sm text-ink-700">{row.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-sm">{row.amount}</span>
                      <span className={`badge ${row.statusColor} text-xs`}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-ink-400 text-sm mb-8 uppercase tracking-widest font-medium">Trusted by business owners across Nigeria</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-ink-500 text-sm font-medium">
            {["Provision Stores", "Pharmacies", "Fabric Shops", "Open Markets", "Electronics Traders", "Food Vendors"].map(b => (
              <span key={b} className="hover:text-jade transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-jade text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">Everything you need.<br />Nothing you don&apos;t.</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users size={20} />,
                title: "Customer Profiles",
                desc: "Save customer names, phone numbers and addresses. Build your credit ledger without paper.",
              },
              {
                icon: <TrendingUp size={20} />,
                title: "Debt Dashboard",
                desc: "See total owed, overdue amounts, and cleared debts at a glance. Your money, organised.",
              },
              {
                icon: <Bell size={20} />,
                title: "WhatsApp Reminders",
                desc: "Send a polite payment reminder to any debtor in one tap. Pre-written, professional message.",
              },
              {
                icon: <CheckCircle size={20} />,
                title: "Partial Payments",
                desc: "Record part-payments as they come in. Track the running balance automatically.",
              },
              {
                icon: <Wifi size={20} />,
                title: "Works Offline",
                desc: "No internet? No problem. DebtPadi works fully offline and syncs when you reconnect.",
              },
              {
                icon: <BarChart3 size={20} />,
                title: "Reports & Export",
                desc: "Export your debt records to PDF for your own records or to share with anyone.",
              },
              {
                icon: <Shield size={20} />,
                title: "Secure & Private",
                desc: "Your business data stays yours. We never sell or share your customer information.",
              },
            ].map((f, i) => (
              <div key={i} className="group bg-ink-800 border border-white/5 rounded-2xl p-6 hover:border-jade/30 hover:bg-ink-700 transition-all card-hover">
                <div className="w-10 h-10 bg-jade/10 text-jade rounded-xl flex items-center justify-center mb-4 group-hover:bg-jade/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-jade text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">Simple enough for<br />your market stall</h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Add a customer",
                desc: "Enter their name, phone number, and what they bought on credit. Takes 15 seconds.",
              },
              {
                step: "02",
                title: "Track what they owe",
                desc: "Their debt appears on your dashboard with the date it was added and when it&apos;s due.",
              },
              {
                step: "03",
                title: "Send a reminder",
                desc: "Tap once to send a WhatsApp message. DebtPadi writes the message for you, polite and clear.",
              },
              {
                step: "04",
                title: "Record payments",
                desc: "When they pay, fully or partly, mark it. The balance updates automatically.",
              },
            ].map((s, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="flex-shrink-0 w-16 h-16 bg-jade/5 border border-jade/20 rounded-2xl flex items-center justify-center group-hover:bg-jade/10 transition-colors">
                  <span className="font-heading font-bold text-jade text-lg">{s.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-heading font-semibold text-white text-xl mb-2">{s.title}</h3>
                  <p className="text-ink-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.desc }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-jade text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold">Pay less than one cup<br />of Nescafé per day</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-ink-800 border border-white/10 rounded-2xl p-8">
              <div className="mb-6">
                <p className="text-ink-400 text-sm font-medium mb-1">Free</p>
                <p className="font-heading text-4xl font-bold text-white">₦0<span className="text-lg font-normal text-ink-400">/month</span></p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 10 customers", "Basic debt tracking", "Manual payment recording", "Dashboard overview"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-ink-300 text-sm">
                    <CheckCircle size={16} className="text-jade flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {["WhatsApp reminders", "PDF export", "Unlimited customers"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-ink-600 text-sm line-through">
                    <div className="w-4 h-4 rounded-full border border-ink-700 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/5 transition-colors">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-jade border border-jade/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-ink-900/20 text-ink-900 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="mb-6">
                <p className="text-jade-800 text-sm font-medium mb-1">Pro</p>
                <p className="font-heading text-4xl font-bold text-ink-900">₦3,500<span className="text-lg font-normal text-jade-800">/month</span></p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited customers",
                  "Full debt tracking",
                  "WhatsApp reminders (one tap)",
                  "PDF export & reports",
                  "Partial payment tracking",
                  "Offline mode + sync",
                  "Priority support",
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-ink-900 text-sm font-medium">
                    <CheckCircle size={16} className="text-jade-800 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center bg-ink-900 text-jade font-bold py-3 rounded-xl hover:bg-ink-800 transition-colors">
                Start 14-day free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-16">What business owners say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Titilayo Farms & Agro Supplies",
                biz: "Agro Store, Dugbe, Ibadan",
                text: "Before DebtPadi, tracking customer credit and product sales was stressful. Records got mixed up and payments were hard to follow. Now everything is organized, from agro inputs to customer debts, and nothing goes missing.",
              },
              {
                name: "Alhaji Musa",
                biz: "Wholesale Trader, Kano",
                text: "The WhatsApp reminder is genius. I don't have to embarrass myself by calling customers. One tap and the message goes. Very professional.",
              },
              {
                name: "Chinedu Okafor",
                biz: "Electronics Shop, Onitsha",
                text: "Before DebtPadi, I was always guessing who owed me and how much. Some customers delayed payments for months. Now I track every sale and debt clearly, and I’ve been able to recover more money without stress."
              }
            ].map((t, i) => (
              <div key={i} className="bg-ink-800 border border-white/5 rounded-2xl p-6">
                <p className="text-ink-300 leading-relaxed mb-6 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-heading font-semibold text-white">{t.name}</p>
                  <p className="text-jade text-xs">{t.biz}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Stop writing in<br />notebooks today
          </h2>
          <p className="text-ink-400 text-lg mb-10 leading-relaxed">
            Join thousands of Nigerian business owners who are collecting their money faster with DebtPadi.
          </p>
          <Link href="/auth/signup" className="group inline-flex items-center gap-3 bg-jade hover:bg-jade-400 text-ink-900 font-bold text-lg px-10 py-5 rounded-xl transition-all hover:shadow-2xl hover:shadow-jade/30">
            Create your free account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-jade rounded-lg flex items-center justify-center">
              <span className="font-heading font-bold text-ink-900 text-xs">DP</span>
            </div>
            <span className="font-heading font-semibold text-white">DebtPadi</span>
          </div>
          <p className="text-ink-500 text-sm">© 2026 DebtPadi. Built with love for Nigerian SMEs.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-ink-500 hover:text-white transition-colors text-sm">Privacy</Link>
            <Link href="#" className="text-ink-500 hover:text-white transition-colors text-sm">Terms</Link>
            <Link href="#" className="text-ink-500 hover:text-white transition-colors text-sm">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
