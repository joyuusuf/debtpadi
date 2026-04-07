"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Loader2,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Twitter,
  Instagram,
  Facebook,
  Send,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How it works", href: "/#how-it-works" },
];

const CONTACT_CHANNELS = [
  {
    icon: <Mail size={22} />,
    title: "Email Support",
    desc: "For account issues, billing questions, and general enquiries.",
    value: "support@debtpadi.ng",
    // href: "mailto:support@debtpadi.ng",
    href: "mailto:yuusufjawadolamide67@gmail.com",
    cta: "Send email",
    response: "Within 24 hours",
  },
  {
    icon: <MessageCircle size={22} />,
    title: "WhatsApp Support",
    desc: "Quick questions? Chat with us directly on WhatsApp.",
    value: "+234 800 DEBTPADI",
    href: "https://wa.me/2348142417877",
    cta: "Start chat",
    response: "Within 4 hours",
  },
  {
    icon: <Mail size={22} />,
    title: "Business Enquiries",
    desc: "Partnerships, press, and business development.",
    value: "hello@debtpadi.ng",
    // href: "mailto:hello@debtpadi.ng",
    href: "mailto:yuusufjawadolamide67@gmail.com",
    cta: "Send email",
    response: "Within 48 hours",
  },
];

const FAQ_ITEMS = [
  {
    q: "How do I cancel my Pro subscription?",
    a: "Go to Settings → Subscription → Cancel Plan. Your Pro access continues until the end of the billing period. You will not be charged again after cancellation.",
  },
  {
    q: "Can I export my data before deleting my account?",
    a: "Yes. Go to Settings → Export Data. You can download all your customer records and debt history as a CSV or PDF before closing your account.",
  },
  {
    q: "The WhatsApp reminder is not sending - what do I do?",
    a: "Make sure the customer's phone number is saved in international format (e.g. +2348012345678). Also check that WhatsApp is installed on your device, as DebtPadi opens WhatsApp to send the message.",
  },
  {
    q: "I was charged but my Pro features are not showing.",
    a: "Try logging out and logging back in. If the issue persists, email support@debtpadi.ng with your account email and payment receipt and we will resolve it within 2 hours.",
  },
  {
    q: "Is DebtPadi available on iPhone?",
    a: "DebtPadi is a web application and works on any device with a modern browser; iPhone, Android, laptop, or desktop. A dedicated iOS and Android app is on our roadmap.",
  },
  {
    q: "My customer disputes the amount I recorded. Can DebtPadi help?",
    a: "DebtPadi stores the records you enter along with timestamps. You can export this history as a PDF to share with your customer as evidence. We recommend always getting customers to acknowledge debts in writing.",
  },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

function Spinner() {
  return <Loader2 size={16} className="animate-spin" />;
}

function Navbar({ loadingKey, navigate }: { loadingKey: string | null; navigate: (k: string, h: string) => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 bg-white">
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

function Footer({ loadingKey, navigate }: { loadingKey: string | null; navigate: (k: string, h: string) => void }) {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 bg-white">
          <Image src="/debtpadi.png" alt="DebtPadi" width={100} height={28} className="h-7 w-auto object-contain" />
        </Link>
        <p className="text-ink-500 text-sm">© 2026 DebtPadi. Built with love for Nigerian SMEs.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-ink-500 hover:text-white transition-colors text-sm">Privacy</Link>
          <Link href="/terms" className="text-ink-500 hover:text-white transition-colors text-sm">Terms</Link>
          <Link href="/contact" className="text-jade text-sm font-medium">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default function ContactPage() {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navigate = (key: string, href: string) => {
    setLoadingKey(key);
    setTimeout(() => router.push(href), 400);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setFormStatus("submitting");
    // Simulate form submission (replace with real API call)
    await new Promise((res) => setTimeout(res, 1800));
    setFormStatus("success");
  };

  const isFormValid = form.name.trim() && form.email.trim() && form.message.trim();

  return (
    <div className="min-h-screen bg-ink-900 text-white overflow-x-hidden">
      <Navbar loadingKey={loadingKey} navigate={navigate} />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-jade/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-jade/10 border border-jade/20 rounded-full px-4 py-2 mb-6">
            <MessageCircle size={14} className="text-jade" />
            <span className="text-jade text-sm font-medium">We are here to help</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Get in touch
          </h1>
          <p className="text-ink-400 text-lg max-w-2xl leading-relaxed">
            Whether you have a technical problem, a billing question, or just want to share feedback, 
            we'd love to hear from you.
            Our support team is based in Nigeria and responds fast.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* Contact Channels */}
        <section>
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-8">Ways to reach us</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONTACT_CHANNELS.map((c, i) => (
              <div key={i} className="group bg-ink-800 border border-white/5 rounded-2xl p-6 hover:border-jade/20 transition-all">
                <div className="w-11 h-11 bg-jade/10 text-jade rounded-xl flex items-center justify-center mb-4 group-hover:bg-jade/20 transition-colors">
                  {c.icon}
                </div>
                <h3 className="font-heading font-semibold text-white text-lg mb-1">{c.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed mb-4">{c.desc}</p>
                <p className="font-mono text-jade text-sm font-medium mb-4">{c.value}</p>
                <div className="flex items-center justify-between">
                  <a
                    href={c.href}
                    className="flex items-center gap-1.5 text-white text-sm font-semibold hover:text-jade transition-colors"
                  >
                    {c.cta} <ChevronRight size={14} />
                  </a>
                  <div className="flex items-center gap-1.5 text-ink-500 text-xs">
                    <Clock size={11} />
                    {c.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form + Info */}
        <section>
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-2">Send us a message</h2>
              <p className="text-ink-400 text-sm mb-8">Fill in the form and we will get back to you within 24 hours.</p>

              {formStatus === "success" ? (
                <div className="bg-jade/10 border border-jade/20 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 bg-jade/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-jade" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-xl mb-2">Message sent!</h3>
                  <p className="text-ink-400 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. Our support team will get back to you at <span className="text-white">{form.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setFormStatus("idle"); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 text-jade text-sm font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ink-300 text-sm font-medium mb-2">
                        Full name <span className="text-jade">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Adeola Bakare"
                        className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-ink-600 text-sm focus:outline-none focus:border-jade/50 focus:ring-1 focus:ring-jade/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-ink-300 text-sm font-medium mb-2">
                        Email address <span className="text-jade">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="adeola@yourbusiness.com"
                        className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-ink-600 text-sm focus:outline-none focus:border-jade/50 focus:ring-1 focus:ring-jade/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-ink-300 text-sm font-medium mb-2">Subject</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-jade/50 focus:ring-1 focus:ring-jade/30 transition-all appearance-none text-white"
                    >
                      <option value="" className="text-ink-600 bg-ink-800">Select a topic...</option>
                      <option value="billing" className="bg-ink-800">Billing & Subscription</option>
                      <option value="technical" className="bg-ink-800">Technical Issue</option>
                      <option value="account" className="bg-ink-800">Account Help</option>
                      <option value="feature" className="bg-ink-800">Feature Request</option>
                      <option value="partnership" className="bg-ink-800">Partnership / Business</option>
                      <option value="other" className="bg-ink-800">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-ink-300 text-sm font-medium mb-2">
                      Your message <span className="text-jade">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Describe your issue or question in as much detail as possible..."
                      className="w-full bg-ink-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-ink-600 text-sm focus:outline-none focus:border-jade/50 focus:ring-1 focus:ring-jade/30 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {formStatus === "error" && (
                    <div className="flex items-center gap-3 bg-coral-500/10 border border-coral-500/20 rounded-xl px-4 py-3">
                      <AlertCircle size={16} className="text-coral-400 flex-shrink-0" />
                      <p className="text-coral-300 text-sm">Something went wrong. Please try again or email us directly.</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || formStatus === "submitting"}
                    className="w-full flex items-center justify-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-jade/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send message
                      </>
                    )}
                  </button>
                  <p className="text-ink-600 text-xs text-center">
                    By submitting this form you agree to our{" "}
                    <Link href="/privacy" className="text-ink-400 hover:text-jade transition-colors">Privacy Policy</Link>.
                  </p>
                </div>
              )}
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-5">
              {/* Office Info */}
              <div className="bg-ink-800 border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-white text-lg mb-4">Our details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-jade flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Ibadan, Nigeria</p>
                      <p className="text-ink-400 text-xs">Serving businesses across all 36 states</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-jade flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">Mon – Sat, 8am – 8pm WAT</p>
                      <p className="text-ink-400 text-xs">Closed on Sundays and public holidays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-jade flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-sm font-medium">support@debtpadi.ng</p>
                      <p className="text-ink-400 text-xs">Average reply time: under 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-ink-800 border border-white/5 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-white text-lg mb-4">Follow us</h3>
                <div className="space-y-3">
                  {[
                    { icon: <Twitter size={16} />, label: "@DebtPadiNG", href: "https://twitter.com/debtpadimg", sub: "Updates & tips" },
                    { icon: <Instagram size={16} />, label: "@debtpadi", href: "https://instagram.com/debtpadi", sub: "Stories & features" },
                    { icon: <Facebook size={16} />, label: "DebtPadi", href: "https://facebook.com/debtpadi", sub: "Community & news" },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-jade">{s.icon}</span>
                        <div>
                          <p className="text-white text-sm font-medium group-hover:text-jade transition-colors">{s.label}</p>
                          <p className="text-ink-500 text-xs">{s.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-ink-600 group-hover:text-jade transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time promise */}
              <div className="bg-jade/5 border border-jade/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-jade" />
                  <p className="text-jade text-sm font-semibold">Our support promise</p>
                </div>
                <p className="text-ink-400 text-xs leading-relaxed">
                  Every message is read and replied to by a real human on our Nigeria-based team.
                  No bots, no generic copy-paste responses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3">Frequently asked questions</h2>
            <p className="text-ink-400 text-sm max-w-md mx-auto">
              Quick answers to the most common questions. If yours isn't here, just send us a message above.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`bg-ink-800 border rounded-xl overflow-hidden transition-all ${
                  openFaq === i ? "border-jade/20" : "border-white/5 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                >
                  <span className="font-medium text-white text-sm">{item.q}</span>
                  <ChevronRight
                    size={16}
                    className={`flex-shrink-0 text-ink-500 transition-transform ${openFaq === i ? "rotate-90 text-jade" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-3">
                    <p className="text-ink-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-ink-800 border border-white/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-3">
            Still not sure? Try it free.
          </h2>
          <p className="text-ink-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            DebtPadi is free for up to 10 customers. No credit card required.
            See for yourself how much easier debt tracking can be.
          </p>
          <button
            onClick={() => navigate("contact-cta", "/auth/signup")}
            disabled={!!loadingKey}
            className="inline-flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-jade/30 disabled:opacity-80"
          >
            {loadingKey === "contact-cta" ? <Spinner /> : null}
            Create your free account
            {loadingKey !== "contact-cta" && <ChevronRight size={16} />}
          </button>
        </section>
      </div>

      <Footer loadingKey={loadingKey} navigate={navigate} />
    </div>
  );
}