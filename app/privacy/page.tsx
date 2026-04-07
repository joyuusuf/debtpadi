"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Shield, Eye, Lock, Database, Bell, UserCheck, Mail, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How it works", href: "/#how-it-works" },
];

const SECTIONS = [
  {
    icon: <Database size={20} />,
    title: "Information We Collect",
    content: [
      {
        heading: "Account Information",
        body: "When you sign up for DebtPadi, we collect your full name, email address, phone number, and business name. This is the minimum we need to create and manage your account.",
      },
      {
        heading: "Business & Customer Data",
        body: "To power the core features of DebtPadi, we store the debt records, customer names, phone numbers, and transaction histories that you enter into the app. This data belongs to you — we are simply the custodians of it.",
      },
      {
        heading: "Device & Usage Data",
        body: "We automatically collect certain technical data when you use our service, including your IP address, browser type, device identifiers, and pages visited. This helps us diagnose bugs and improve the product.",
      },
    ],
  },
  {
    icon: <Eye size={20} />,
    title: "How We Use Your Information",
    content: [
      {
        heading: "To Provide the Service",
        body: "Your data is primarily used to operate DebtPadi — storing your records, processing your account, and delivering features like WhatsApp reminders and PDF exports.",
      },
      {
        heading: "To Improve the Product",
        body: "We analyse aggregated, anonymised usage patterns to understand how features are being used and where we can improve. No individual record is ever used for this purpose without anonymisation.",
      },
      {
        heading: "To Communicate with You",
        body: "We may send you product updates, feature announcements, or support responses via email. You can opt out of marketing emails at any time from your account settings.",
      },
    ],
  },
  {
    icon: <Lock size={20} />,
    title: "Data Security",
    content: [
      {
        heading: "Encryption at Rest and in Transit",
        body: "All data stored on our servers is encrypted at rest using AES-256 encryption. All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher.",
      },
      {
        heading: "Access Controls",
        body: "Only a small number of authorised DebtPadi engineers can access production databases, and only for the purposes of maintenance or resolving technical issues. All access is logged and audited.",
      },
      {
        heading: "No Password Storage",
        body: "We never store your password in plain text. We use industry-standard bcrypt hashing with salting, so even in the highly unlikely event of a data breach, your password remains protected.",
      },
    ],
  },
  {
    icon: <UserCheck size={20} />,
    title: "Sharing Your Data",
    content: [
      {
        heading: "We Do Not Sell Your Data",
        body: "DebtPadi does not sell, rent, or trade your personal data or your customers' data to any third party, advertiser, or data broker. Full stop.",
      },
      {
        heading: "Trusted Service Providers",
        body: "We share limited data with vetted third-party providers who help us run the service — for example, our cloud hosting provider and payment processor. These partners are contractually bound to use your data only as instructed by us.",
      },
      {
        heading: "Legal Requirements",
        body: "We may disclose data if required to do so by Nigerian law, a court order, or a government authority with proper jurisdiction. We will notify you if we are legally permitted to do so.",
      },
    ],
  },
  {
    icon: <Bell size={20} />,
    title: "Your Rights",
    content: [
      {
        heading: "Access and Correction",
        body: "You have the right to request a copy of the personal data we hold about you, and to ask us to correct any inaccuracies. You can do this from your account settings or by emailing us.",
      },
      {
        heading: "Data Deletion",
        body: "You can delete your account and all associated data at any time from the Settings page. We will permanently delete your data within 30 days of your request, except where we are required to retain it by law.",
      },
      {
        heading: "Data Portability",
        body: "You can export all your debt records and customer data in CSV or PDF format from within the app at any time. Your data is yours and should be portable.",
      },
    ],
  },
  {
    icon: <Shield size={20} />,
    title: "Cookies & Tracking",
    content: [
      {
        heading: "Essential Cookies Only",
        body: "DebtPadi uses only essential session cookies required to keep you logged in. We do not use advertising cookies, cross-site tracking pixels, or third-party analytics cookies.",
      },
      {
        heading: "Local Storage",
        body: "For the offline-first experience, we store a copy of your records in your browser's local storage. This data never leaves your device unless you are online and syncing.",
      },
    ],
  },
];

function Spinner() {
  return <Loader2 size={16} className="animate-spin" />;
}

function Navbar({ loadingKey, navigate }: { loadingKey: string | null; navigate: (k: string, h: string) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/debtpadi.png" alt="DebtPadi" width={110} height={32} className="h-8 w-auto object-contain" priority />
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-ink-300 hover:text-white transition-colors text-sm font-medium">
            {l.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("nav-signin", "/auth/signin")}
          disabled={!!loadingKey}
          className="text-ink-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 flex items-center gap-2"
        >
          {loadingKey === "nav-signin" ? <Spinner /> : null}
          Sign in
        </button>
        <button
          onClick={() => navigate("nav-signup", "/auth/signup")}
          disabled={!!loadingKey}
          className="flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-jade/20 disabled:opacity-80"
        >
          {loadingKey === "nav-signup" ? <Spinner /> : null}
          Start free
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/debtpadi.png" alt="DebtPadi" width={100} height={28} className="h-7 w-auto object-contain" />
        </Link>
        <p className="text-ink-500 text-sm">© 2026 DebtPadi. Built with love for Nigerian SMEs.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-jade text-sm font-medium">Privacy</Link>
          <Link href="/terms" className="text-ink-500 hover:text-white transition-colors text-sm">Terms</Link>
          <Link href="/contact" className="text-ink-500 hover:text-white transition-colors text-sm">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default function PrivacyPage() {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const navigate = (key: string, href: string) => {
    setLoadingKey(key);
    setTimeout(() => router.push(href), 400);
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white overflow-x-hidden">
      <Navbar loadingKey={loadingKey} navigate={navigate} />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-jade/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-jade/10 border border-jade/20 rounded-full px-4 py-2 mb-6">
            <Shield size={14} className="text-jade" />
            <span className="text-jade text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-ink-400 text-lg max-w-2xl leading-relaxed mb-4">
            We built DebtPadi for Nigerian business owners who trust us with sensitive financial data.
            Here is exactly what we collect, why we collect it, and how we protect it.
          </p>
          <p className="text-ink-500 text-sm">
            Last updated: <span className="text-ink-300">March 30, 2026</span> · Effective: <span className="text-ink-300">March 30, 2026</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar TOC */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-28">
              <p className="text-ink-500 text-xs uppercase tracking-widest font-semibold mb-4">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSection(i);
                      document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeSection === i
                        ? "bg-jade/10 text-jade border border-jade/20"
                        : "text-ink-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`flex-shrink-0 ${activeSection === i ? "text-jade" : "text-ink-600"}`}>
                      {s.icon}
                    </span>
                    {s.title}
                  </button>
                ))}
              </nav>

              <div className="mt-8 bg-ink-800 border border-white/5 rounded-xl p-4">
                <p className="text-ink-400 text-xs leading-relaxed mb-3">
                  Have a privacy concern or request? We respond within 48 hours.
                </p>
                <Link href="/contact" className="flex items-center gap-1.5 text-jade text-xs font-semibold hover:underline">
                  Contact us <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-16">
              {/* Intro */}
              <div className="bg-jade/5 border border-jade/15 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-xl mb-3">The short version</h2>
                <p className="text-ink-300 leading-relaxed text-sm md:text-base">
                  DebtPadi stores your business data to power the app. We never sell it.
                  We secure it with industry-standard encryption. You can delete it any time.
                  We only share data with trusted providers needed to run the service, and only
                  under contractual protection. That is the whole story — everything below is just the legal detail.
                </p>
              </div>

              {/* Sections */}
              {SECTIONS.map((section, i) => (
                <div key={i} id={`section-${i}`} className="scroll-mt-28">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-jade/10 text-jade rounded-xl flex items-center justify-center flex-shrink-0">
                      {section.icon}
                    </div>
                    <h2 className="font-heading font-bold text-white text-2xl md:text-3xl">{section.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, j) => (
                      <div key={j} className="bg-ink-800 border border-white/5 rounded-xl p-5 md:p-6">
                        <h3 className="font-heading font-semibold text-white text-lg mb-2">{item.heading}</h3>
                        <p className="text-ink-400 leading-relaxed text-sm md:text-base">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Children */}
              <div id="section-children" className="scroll-mt-28 bg-ink-800 border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-2xl mb-3">Children's Privacy</h2>
                <p className="text-ink-400 leading-relaxed text-sm md:text-base">
                  DebtPadi is a business tool intended for adults aged 18 and over. We do not knowingly collect
                  personal data from anyone under the age of 18. If you believe a minor has created an account,
                  please contact us immediately and we will delete the account without delay.
                </p>
              </div>

              {/* Changes */}
              <div className="bg-ink-800 border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-2xl mb-3">Changes to This Policy</h2>
                <p className="text-ink-400 leading-relaxed text-sm md:text-base">
                  We may update this Privacy Policy from time to time. When we make material changes, we will
                  notify you via email and display a banner in the app at least 14 days before the changes take
                  effect. Continued use of the service after that date constitutes your acceptance of the updated policy.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-jade/5 border border-jade/15 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="font-heading font-bold text-white text-xl mb-2">Questions or concerns?</h2>
                  <p className="text-ink-400 text-sm max-w-md leading-relaxed">
                    If you have any questions about this policy or want to exercise your data rights,
                    our team is here to help. We respond within 48 hours.
                  </p>
                </div>
                <button
                  onClick={() => navigate("privacy-contact", "/contact")}
                  disabled={!!loadingKey}
                  className="flex-shrink-0 flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-80"
                >
                  {loadingKey === "privacy-contact" ? <Spinner /> : <Mail size={16} />}
                  Contact us
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}