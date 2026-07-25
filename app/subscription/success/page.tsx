"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Zap, Building2 } from "lucide-react";

const PLAN_DETAILS = {
  growth:   { label: "Growth", color: "text-jade",     icon: Zap,       perks: ["Up to 100 customers", "Unlimited debts", "AI reminders", "PDF exports"] },
  business: { label: "Business", color: "text-ink-900", icon: Building2, perks: ["Unlimited customers", "Unlimited debts", "AI reminders", "Dedicated manager"] },
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = (searchParams.get("plan") ?? "growth") as keyof typeof PLAN_DETAILS;
  const details = PLAN_DETAILS[plan] ?? PLAN_DETAILS.growth;
  const Icon = details.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-ink-50">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-xl p-10 text-center max-w-md w-full">
        {/* Animated checkmark */}
        <div className="w-20 h-20 bg-jade/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={44} className="text-jade" />
        </div>

        <h1 className="font-heading font-bold text-2xl text-ink-900 mb-2">Welcome to {details.label}!</h1>
        <p className="text-ink-400 text-sm mb-6">Your subscription is now active. Here's what you unlocked:</p>

        {/* Perks */}
        <div className="bg-jade/5 border border-jade/15 rounded-xl p-4 mb-7 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Icon size={16} className="text-jade" />
            <span className="font-semibold text-ink-800 text-sm">{details.label} Plan</span>
          </div>
          <ul className="space-y-2">
            {details.perks.map(p => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-ink-600">
                <CheckCircle size={13} className="text-jade flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 mb-3"
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>
        <button
          onClick={() => router.push("/debtors")}
          className="w-full border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition text-sm"
        >
          Add more debtors
        </button>
      </div>
    </div>
  );
}
