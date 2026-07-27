"use client";
import { useState } from "react";
import { Check, Zap, Building2, Star, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { subscription as subscriptionApi } from "@/lib/api";
import { usePlanUsage } from "@/hooks/usePlanUsage";
import { Toast } from "@/components/ui/Toast";

// ── Plan definitions ──────────────────────────────────────────────────────────
const PLANS = [
  {
    id: "starter",
    label: "Starter",
    price: 0,
    priceLabel: "Free forever",
    tagline: "For new businesses just getting started",
    icon: Star,
    color: "border-ink-200 bg-white",
    headerColor: "bg-ink-50",
    badge: null,
    features: [
      { text: "Up to 10 customers",          included: true  },
      { text: "Up to 10 active debts",        included: true  },
      { text: "WhatsApp reminders (manual)",  included: true  },
      { text: "Payment recording",            included: true  },
      { text: "Evidence attachments",         included: true  },
      { text: "AI-generated reminders",       included: false },
      { text: "PDF export & reports",         included: false },
      { text: "100+ customers",               included: false },
      { text: "Priority support",             included: false },
      { text: "Subscription history",         included: false },
    ],
    cta: "Current plan",
    ctaDisabled: true,
  },
  {
    id: "growth",
    label: "Growth",
    price: 9800,
    priceLabel: "₦9,800",
    tagline: "For growing shops and traders",
    icon: Zap,
    color: "border-jade bg-white ring-2 ring-jade/20",
    headerColor: "bg-jade/5",
    badge: "Most Popular",
    features: [
      { text: "Up to 100 customers",          included: true  },
      { text: "Unlimited active debts",       included: true  },
      { text: "WhatsApp reminders",           included: true  },
      { text: "Payment recording",            included: true  },
      { text: "Evidence attachments",         included: true  },
      { text: "AI-generated reminders",       included: true  },
      { text: "PDF export & reports",         included: true  },
      { text: "Priority email support",       included: true  },
      { text: "Unlimited customers",          included: false },
      { text: "Dedicated account manager",    included: false },
    ],
    cta: "Upgrade to Growth",
    ctaDisabled: false,
  },
  {
    id: "business",
    label: "Business",
    price: 24500,
    priceLabel: "₦24,500",
    tagline: "For wholesale dealers and large operations",
    icon: Building2,
    color: "border-ink-800 bg-white",
    headerColor: "bg-ink-900",
    badge: "Best Value",
    features: [
      { text: "Unlimited customers",          included: true  },
      { text: "Unlimited active debts",       included: true  },
      { text: "WhatsApp reminders",           included: true  },
      { text: "Payment recording",            included: true  },
      { text: "Evidence attachments",         included: true  },
      { text: "AI-generated reminders",       included: true  },
      { text: "PDF export & reports",         included: true  },
      { text: "Priority support (24/7)",      included: true  },
      { text: "Dedicated account manager",    included: true  },
      { text: "Custom WhatsApp templates",    included: true  },
    ],
    cta: "Upgrade to Business",
    ctaDisabled: false,
  },
];

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. Your plan stays active until the end of the billing period. After that you move to Starter automatically — no charges." },
  { q: "What payment methods do you accept?", a: "We use Flutterwave which supports debit cards, credit cards, bank transfer, and USSD, all Nigerian banks supported." },
  { q: "What happens when I hit the customer limit?", a: "You can still view and manage existing customers and debts. You just won't be able to add new ones until you upgrade or free up space." },
  { q: "Is my data safe if I downgrade?", a: "Absolutely. All your records stay intact. You just lose access to premium features." },
  { q: "Do you offer annual billing?", a: "Not yet, monthly billing only for now. Annual plans with a discount are coming soon." },
];

export default function SubscriptionPage() {
  const { usage, refresh: refreshUsage } = usePlanUsage();
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPlan = usage?.plan ?? "starter";

  async function handleUpgrade(planId: string) {
    if (planId === "starter") return;
    setLoading(planId);
    try {
      const res = await subscriptionApi.initiate(planId as "growth" | "business");
      // Redirect to Flutterwave payment page
      window.location.href = res.data.payment_link;
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : "Failed to initiate payment. Try again.", type: "error" });
      setLoading(null);
    }
  }

  return (
    <>
      <TopBar title="Subscription" />
      <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto pb-24">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-ink-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-ink-500 text-base max-w-md mx-auto">
            Start free. Upgrade when your business grows. Cancel anytime — no hidden fees.
          </p>

          {currentPlan !== "starter" && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-jade/10 border border-jade/20 text-jade text-sm font-semibold">
              <Check size={14} />
              You're on the {PLANS.find(p => p.id === currentPlan)?.label} plan
              {usage?.planExpiresAt && (
                <span className="font-normal text-jade/70 ml-1">
                  · renews {new Date(usage.planExpiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isLoading = loading === plan.id;
            const isBusinessHeader = plan.id === "business";

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 flex flex-col overflow-hidden transition-all ${plan.color} ${isCurrent ? "shadow-lg" : "hover:shadow-md"}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      plan.id === "growth" ? "bg-jade text-ink-900" : "bg-ink-900 text-white"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`px-6 pt-6 pb-5 ${plan.headerColor}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    isBusinessHeader ? "bg-white/10" : "bg-ink-100"
                  }`}>
                    <Icon size={20} className={isBusinessHeader ? "text-white" : "text-ink-600"} />
                  </div>
                  <p className={`font-heading font-bold text-xl mb-0.5 ${isBusinessHeader ? "text-white" : "text-ink-900"}`}>
                    {plan.label}
                  </p>
                  <p className={`text-xs mb-4 ${isBusinessHeader ? "text-white/60" : "text-ink-400"}`}>
                    {plan.tagline}
                  </p>
                  <div className="flex items-end gap-1.5">
                    <span className={`font-heading font-bold text-3xl ${isBusinessHeader ? "text-white" : "text-ink-900"}`}>
                      {plan.priceLabel}
                    </span>
                    {plan.price > 0 && (
                      <span className={`text-sm mb-1 ${isBusinessHeader ? "text-white/50" : "text-ink-400"}`}>/month</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 py-5 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? "text-ink-700" : "text-ink-300"}`}>
                        {f.included
                          ? <Check size={15} className="text-jade flex-shrink-0 mt-0.5" />
                          : <X size={15} className="text-ink-200 flex-shrink-0 mt-0.5" />
                        }
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => !isCurrent && !plan.ctaDisabled && handleUpgrade(plan.id)}
                    disabled={isCurrent || plan.ctaDisabled || isLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      isCurrent
                        ? "bg-ink-100 text-ink-400 cursor-default"
                        : plan.id === "growth"
                        ? "bg-jade hover:bg-jade-400 text-ink-900 hover:shadow-lg"
                        : plan.id === "business"
                        ? "bg-ink-900 hover:bg-ink-700 text-white hover:shadow-lg"
                        : "bg-ink-100 text-ink-400 cursor-default"
                    } disabled:opacity-60`}
                  >
                    {isLoading ? (
                      <><Loader2 size={15} className="animate-spin" /> Redirecting...</>
                    ) : isCurrent ? (
                      <><Check size={15} /> Current Plan</>
                    ) : (
                      plan.cta
                    )}
                  </button>

                  {plan.id !== "starter" && isCurrent && (
                    <button
                      onClick={async () => {
                        if (!confirm("Cancel subscription and return to Starter plan?")) return;
                        try {
                          await subscriptionApi.cancel();
                          await refreshUsage();
                          setToast({ message: "Subscription cancelled. You're now on the Starter plan.", type: "success" });
                        } catch {
                          setToast({ message: "Failed to cancel. Contact support.", type: "error" });
                        }
                      }}
                      className="w-full mt-2 py-2 text-xs text-ink-400 hover:text-coral-500 transition-colors"
                    >
                      Cancel subscription
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-14">
          {[
            "🔒 Secured by Flutterwave",
            "✅ Cancel anytime",
            "🇳🇬 Nigerian bank cards accepted",
            "📱 USSD & bank transfer",
          ].map(b => (
            <span key={b} className="text-ink-400 text-sm">{b}</span>
          ))}
        </div>

        {/* Comparison table — desktop */}
        <div className="hidden md:block mb-14">
          <h2 className="font-heading font-bold text-xl text-ink-900 mb-5 text-center">Full comparison</h2>
          <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left px-6 py-4 text-ink-500 text-sm font-medium w-1/2">Feature</th>
                  {PLANS.map(p => (
                    <th key={p.id} className={`px-4 py-4 text-center text-sm font-bold ${
                      p.id === "growth" ? "text-jade" : p.id === "business" ? "text-ink-900" : "text-ink-400"
                    }`}>
                      {p.label}
                      {currentPlan === p.id && <span className="block text-[10px] font-normal text-ink-400">current</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Customers",           values: ["10", "100", "Unlimited"] },
                  { label: "Active debts",         values: ["10", "Unlimited", "Unlimited"] },
                  { label: "Payment recording",    values: [true, true, true] },
                  { label: "Evidence uploads",     values: [true, true, true] },
                  { label: "WhatsApp reminders",   values: [true, true, true] },
                  { label: "AI reminder writer",   values: [false, true, true] },
                  { label: "PDF export",           values: [false, true, true] },
                  { label: "Reports dashboard",    values: [false, true, true] },
                  { label: "Priority support",     values: [false, true, true] },
                  { label: "Account manager",      values: [false, false, true] },
                  { label: "Custom templates",     values: [false, false, true] },
                  { label: "Price / month",        values: ["Free", "₦9,800", "₦24,500"] },
                ].map((row, i) => (
                  <tr key={row.label} className={`border-t border-ink-50 ${i % 2 === 0 ? "" : "bg-ink-50/30"}`}>
                    <td className="px-6 py-3.5 text-ink-700 text-sm">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className="px-4 py-3.5 text-center">
                        {typeof val === "boolean"
                          ? val
                            ? <Check size={16} className="text-jade mx-auto" />
                            : <X size={16} className="text-ink-200 mx-auto" />
                          : <span className="text-sm font-semibold text-ink-700">{val}</span>
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading font-bold text-xl text-ink-900 mb-5 text-center">Frequently asked</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-ink-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink-800 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={16} className="text-ink-400 flex-shrink-0" />
                    : <ChevronDown size={16} className="text-ink-400 flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-ink-500 text-sm leading-relaxed border-t border-ink-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
