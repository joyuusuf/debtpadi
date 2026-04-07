"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, FileText, AlertCircle, CreditCard, Ban, Scale, HelpCircle, ChevronRight, Mail } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How it works", href: "/#how-it-works" },
];

const SECTIONS = [
  {
    icon: <FileText size={20} />,
    title: "Acceptance of Terms",
    items: [
      {
        heading: "Agreement to Terms",
        body: "By creating an account or using DebtPadi, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use the service.",
      },
      {
        heading: "Eligibility",
        body: "You must be at least 18 years old and legally capable of entering into a binding agreement to use DebtPadi. By using the service, you confirm that you meet these requirements.",
      },
      {
        heading: "Changes to Terms",
        body: "We reserve the right to update these terms at any time. We will give you at least 14 days' notice of any material changes via email or an in-app notification before they take effect.",
      },
    ],
  },
  {
    icon: <CreditCard size={20} />,
    title: "Account & Subscription",
    items: [
      {
        heading: "Account Responsibility",
        body: "You are responsible for all activity that occurs under your account. Keep your login credentials confidential and notify us immediately at support@debtpadi.ng if you suspect any unauthorised access.",
      },
      {
        heading: "Free Plan",
        body: "The Free plan allows you to track up to 10 customers at no charge, for as long as you wish. We reserve the right to adjust the limits of the Free plan with 30 days' notice.",
      },
      {
        heading: "Pro Subscription",
        body: "The Pro plan is billed monthly in Nigerian Naira at the rate displayed at checkout. Payment is processed via our payment provider. Your subscription renews automatically at the end of each billing period unless you cancel.",
      },
      {
        heading: "Free Trial",
        body: "New users on the Pro plan receive a 14-day free trial. No charge is made until the trial ends. You may cancel any time before the trial ends and you will not be charged.",
      },
      {
        heading: "Refunds",
        body: "If you are unsatisfied with the Pro plan within the first 7 days of a paid billing period, contact us and we will issue a full refund for that period. Refunds are not available outside this window.",
      },
      {
        heading: "Cancellation",
        body: "You may cancel your Pro subscription at any time from your account settings. Access to Pro features continues until the end of your current billing period. After that, your account reverts to the Free plan.",
      },
    ],
  },
  {
    icon: <Scale size={20} />,
    title: "Acceptable Use",
    items: [
      {
        heading: "Permitted Use",
        body: "DebtPadi is designed for legitimate business debt tracking between merchants and their customers. You may use it to record credit extended to customers, track repayments, and send payment reminders.",
      },
      {
        heading: "Prohibited Use",
        body: "You may not use DebtPadi to track debts arising from illegal activity, to harass or intimidate individuals, to store data on minors, to automate unsolicited bulk messages, or to engage in any activity that violates Nigerian law.",
      },
      {
        heading: "Customer Data Responsibility",
        body: "You are responsible for obtaining any necessary consent from your customers before entering their personal data into DebtPadi. You must handle their data in compliance with applicable Nigerian data protection regulations (NDPR).",
      },
      {
        heading: "WhatsApp Reminders",
        body: "The WhatsApp reminder feature must only be used to contact customers who have a legitimate pre-existing debt relationship with your business. You must not use it to send unsolicited messages.",
      },
    ],
  },
  {
    icon: <Ban size={20} />,
    title: "Termination",
    items: [
      {
        heading: "Termination by You",
        body: "You may close your account at any time from Settings > Account > Delete Account. All your data will be permanently deleted within 30 days. This action is irreversible.",
      },
      {
        heading: "Termination by Us",
        body: "We may suspend or permanently terminate your account, with or without notice, if we have reasonable grounds to believe you have breached these Terms, engaged in fraudulent activity, or used the service to cause harm.",
      },
      {
        heading: "Effect of Termination",
        body: "Upon termination, your right to access the service ceases immediately. We recommend exporting your data before deleting your account. We are not liable for any loss of data following account termination.",
      },
    ],
  },
  {
    icon: <AlertCircle size={20} />,
    title: "Limitation of Liability",
    items: [
      {
        heading: "Service Availability",
        body: "We aim for high availability but do not guarantee that DebtPadi will be available at all times. We may have scheduled or unscheduled downtime. We are not liable for any business loss resulting from service unavailability.",
      },
      {
        heading: "Data Accuracy",
        body: "DebtPadi displays the data you enter. We are not responsible for errors in your records, incorrect amounts, or disputes between you and your customers arising from the data you store.",
      },
      {
        heading: "Cap on Liability",
        body: "To the maximum extent permitted by Nigerian law, our total liability to you for any claim arising from the use of DebtPadi shall not exceed the amount you paid us in the 3 months preceding the claim.",
      },
    ],
  },
  {
    icon: <HelpCircle size={20} />,
    title: "Governing Law & Disputes",
    items: [
      {
        heading: "Governing Law",
        body: "These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any dispute shall be subject to the exclusive jurisdiction of the courts in any State in Nigeria.",
      },
      {
        heading: "Dispute Resolution",
        body: "Before initiating any legal proceedings, both parties agree to attempt to resolve any dispute in good faith through direct negotiation for a period of 30 days. Contact us at legal@debtpadi.ng to initiate this process.",
      },
      {
        heading: "Severability",
        body: "If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. The unenforceable provision shall be replaced with one that most closely matches the intent of the original.",
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
          <Link href="/privacy" className="text-ink-500 hover:text-white transition-colors text-sm">Privacy</Link>
          <Link href="/terms" className="text-jade text-sm font-medium">Terms</Link>
          <Link href="/contact" className="text-ink-500 hover:text-white transition-colors text-sm">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default function TermsPage() {
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
            <FileText size={14} className="text-jade" />
            <span className="text-jade text-sm font-medium">Plain English, Honest Terms</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-ink-400 text-lg max-w-2xl leading-relaxed mb-4">
            These are the rules that govern your use of DebtPadi. We have written them to be
            fair and easy to understand, not to hide anything from you.
          </p>
          <p className="text-ink-500 text-sm">
            Last updated: <span className="text-ink-300"> March 30, 2026</span> · Effective: <span className="text-ink-300"> March 30, 2026</span>
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
                  Questions about these terms? Our support team can help clarify anything.
                </p>
                <Link href="/contact" className="flex items-center gap-1.5 text-jade text-xs font-semibold hover:underline">
                  Get in touch <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-16">
              {/* Intro */}
              <div className="bg-jade/5 border border-jade/15 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-xl mb-3">Before you read</h2>
                <p className="text-ink-300 leading-relaxed text-sm md:text-base">
                  DebtPadi is a tool for tracking customer debts in your business. By using it, you agree to
                  use it honestly and legally. In return, we agree to provide you a reliable, secure service,
                  protect your data, and give you fair notice before changing anything that affects you.
                  The sections below cover the details.
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

                  <div className="space-y-4">
                    {section.items.map((item, j) => (
                      <div key={j} className="bg-ink-800 border border-white/5 rounded-xl p-5 md:p-6">
                        <h3 className="font-heading font-semibold text-white text-lg mb-2">{item.heading}</h3>
                        <p className="text-ink-400 leading-relaxed text-sm md:text-base">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Intellectual Property */}
              <div className="bg-ink-800 border border-white/5 rounded-2xl p-6 md:p-8">
                <h2 className="font-heading font-bold text-white text-2xl mb-3">Intellectual Property</h2>
                <p className="text-ink-400 leading-relaxed text-sm md:text-base mb-4">
                  The DebtPadi name, logo, application, and all associated content are owned by DebtPadi and
                  protected under applicable intellectual property laws. You may not copy, modify, distribute,
                  or create derivative works from any part of our service without our prior written consent.
                </p>
                <p className="text-ink-400 leading-relaxed text-sm md:text-base">
                  Your data, including your customer records and business information, belongs entirely to you.
                  We claim no ownership over the content you enter into DebtPadi.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-jade/5 border border-jade/15 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="font-heading font-bold text-white text-xl mb-2">Still have questions?</h2>
                  <p className="text-ink-400 text-sm max-w-md leading-relaxed">
                    Our team is happy to clarify any part of these terms. We believe you should fully
                    understand what you are agreeing to.
                  </p>
                </div>
                <button
                  onClick={() => navigate("terms-contact", "/contact")}
                  disabled={!!loadingKey}
                  className="flex-shrink-0 flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-80"
                >
                  {loadingKey === "terms-contact" ? <Spinner /> : <Mail size={16} />}
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