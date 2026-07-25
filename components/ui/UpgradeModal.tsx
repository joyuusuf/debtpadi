"use client";
import { Lock, Users, Receipt } from "lucide-react";

interface UpgradeModalProps {
  resource: "customers" | "debts";
  limit?: number;
  onClose: () => void;
}

const COPY = {
  customers: {
    icon: Users,
    title: "Customer limit reached",
    body: (limit: number) =>
      `You've reached the free plan limit of ${limit} customers. Upgrade to Pro for unlimited customers.`,
  },
  debts: {
    icon: Receipt,
    title: "Debt limit reached",
    body: (limit: number) =>
      `You've reached the free plan limit of ${limit} active debts. Upgrade to Pro for unlimited debts, or clear an existing debt to free up a slot.`,
  },
};

export function UpgradeModal({ resource, limit = 10, onClose }: UpgradeModalProps) {
  const { icon: Icon, title, body } = COPY[resource];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-up">
        <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
          <Icon size={24} className="text-jade" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
            <Lock size={11} className="text-white" />
          </div>
        </div>
        <h2 className="font-heading font-bold text-2xl text-ink-900 mb-2">{title}</h2>
        <p className="text-ink-500 text-sm mb-6 leading-relaxed">{body(limit)}</p>

        <div className="bg-jade/5 border border-jade/20 rounded-xl p-4 mb-5 text-left">
          <p className="font-heading font-bold text-ink-900">Pro Plan</p>
          <p className="text-jade font-bold text-2xl mt-0.5 mb-2">
            ₦30,000<span className="text-ink-400 font-normal text-sm">/month</span>
          </p>
          <ul className="space-y-1.5">
            {["Unlimited customers & debts", "WhatsApp reminders", "PDF export", "Priority support"].map((f) => (
              <li key={f} className="text-xs text-ink-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3.5 rounded-xl transition-all hover:shadow-lg mb-3">
          Upgrade to Pro — ₦30,000/mo
        </button>
        <button onClick={onClose} className="w-full text-ink-400 hover:text-ink-600 text-sm transition-colors py-2">
          Maybe later
        </button>
      </div>
    </div>
  );
}
