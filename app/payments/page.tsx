"use client";
import { useState, useEffect } from "react";
import { Plus, CheckCircle, TrendingDown, Calendar } from "lucide-react";
import { mockDebts, formatNaira } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

// Flatten all payments with debt context
const allPayments = mockDebts.flatMap(debt =>
  debt.payments.map(p => ({
    ...p,
    customerName: debt.customerName,
    debtDescription: debt.description,
    debtId: debt.id,
    debtTotal: debt.amount,
  }))
).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const totalCollected = allPayments.reduce((sum, p) => sum + p.amount, 0);

// ─── Skeleton helper ──────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

// ─── Skeleton UI ──────────────────────────────────────────────────────────────

function PaymentsSkeleton() {
  return (
    <>
      <TopBar title="Payments" />
      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Skeleton className="w-64 h-4 flex-1" />
          <Skeleton className="w-full sm:w-40 h-11 rounded-xl flex-shrink-0" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-ink-100 bg-white rounded-2xl p-5 space-y-2">
              <Skeleton className="w-28 h-3" />
              <Skeleton className="w-36 h-7" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Payment history table */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="px-6 py-4 border-b border-ink-50">
              <Skeleton className="w-36 h-4 mb-2" />
              <Skeleton className="w-52 h-3" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-ink-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  {/* Icon */}
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />

                  {/* Name + description */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="w-32 h-3.5" />
                    <Skeleton className="w-48 h-3" />
                  </div>

                  {/* Amount + date */}
                  <div className="text-right flex-shrink-0 space-y-1.5">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* By Customer card */}
            <div className="bg-white border border-ink-100 rounded-2xl p-5">
              <Skeleton className="w-24 h-4 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between">
                      <Skeleton className="w-28 h-3" />
                      <Skeleton className="w-20 h-3" />
                    </div>
                    <Skeleton className="w-full h-1.5 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Collection Rate card */}
            <div className="bg-jade/5 border border-jade/20 rounded-2xl p-5 space-y-2">
              <Skeleton className="w-32 h-4 bg-jade/20" />
              <Skeleton className="w-20 h-10 bg-jade/20 rounded-xl" />
              <Skeleton className="w-44 h-3 bg-jade/20" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PaymentsSkeleton />;

  return (
    <>
      <TopBar title="Payments" />
      <div className="px-6 py-8 max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-ink-500 text-sm flex-1">Record and track all incoming payments</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg flex-shrink-0"
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Collected", value: formatNaira(totalCollected), color: "text-jade-600", bg: "bg-jade-50 border-jade-100" },
            { label: "Payments This Month", value: allPayments.filter(p => p.date.startsWith("2024-01")).length.toString(), color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            { label: "Average Payment", value: formatNaira(Math.round(totalCollected / allPayments.length)), color: "text-ink-700", bg: "bg-white border-ink-100" },
          ].map((s, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${s.bg}`}>
              <p className="text-ink-500 text-xs font-medium mb-1">{s.label}</p>
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment History */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-50">
              <h2 className="font-heading font-semibold text-ink-900">Payment History</h2>
              <p className="text-ink-400 text-xs mt-0.5">All recorded payments, newest first</p>
            </div>
            <div className="divide-y divide-ink-50">
              {allPayments.map((payment) => (
                <div key={payment.id} className="px-6 py-4 flex items-center gap-4 table-row-hover">
                  <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                    <TrendingDown size={16} className="text-jade" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-800 text-sm">{payment.customerName}</p>
                    <p className="text-ink-400 text-xs truncate max-w-xs">{payment.debtDescription}</p>
                    {payment.note && (
                      <p className="text-ink-300 text-xs italic mt-0.5">{payment.note}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-bold text-jade-600 text-base">+{formatNaira(payment.amount)}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Calendar size={11} className="text-ink-400" />
                      <p className="text-ink-400 text-xs">
                        {new Date(payment.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-4">
            <div className="bg-white border border-ink-100 rounded-2xl p-5">
              <h2 className="font-heading font-semibold text-ink-900 mb-4">By Customer</h2>
              <div className="space-y-3">
                {mockDebts.filter(d => d.amountPaid > 0).map(debt => {
                  const pct = Math.round((debt.amountPaid / debt.amount) * 100);
                  return (
                    <div key={debt.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-ink-700 text-xs font-medium">{debt.customerName}</span>
                        <span className="text-jade-600 text-xs font-bold">{formatNaira(debt.amountPaid)}</span>
                      </div>
                      <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div className="h-full bg-jade rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-jade/5 border border-jade/20 rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-jade-700 mb-2">Collection Rate</h3>
              <p className="text-4xl font-heading font-bold text-jade-600 mb-1">
                {Math.round((totalCollected / mockDebts.reduce((s, d) => s + d.amount, 0)) * 100)}%
              </p>
              <p className="text-jade-700/70 text-xs">of total owed has been collected</p>
            </div>
          </div>
        </div>

        {/* Record Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-ink-900">Record Payment</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors text-lg">×</button>
              </div>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Select Debt *</label>
                  <select required className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all">
                    <option value="">Choose debt record...</option>
                    {mockDebts.filter(d => d.status !== 'cleared').map(d => (
                      <option key={d.id} value={d.id}>
                        {d.customerName} — {formatNaira(d.amount - d.amountPaid)} remaining
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Amount Paid (₦) *</label>
                  <input type="number" placeholder="5,000" required className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Payment Date</label>
                  <input type="date" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Payment method</label>
                  <select className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>POS</option>
                    <option>Mobile Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Note (optional)</label>
                  <input type="text" placeholder="e.g. Cash payment at store" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-[2] bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    Save Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}