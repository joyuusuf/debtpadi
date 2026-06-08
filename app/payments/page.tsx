"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, TrendingDown, Calendar, X, CheckCircle } from "lucide-react";
import { formatNaira } from "@/lib/data";
import { debts as debtsApi } from "@/lib/api";
import { apiDebtToDebtRecord } from "@/lib/adapters";
import type { DebtRecord } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";
import { Toast } from "@/components/ui/Toast";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

function PaymentsSkeleton() {
  return (
    <>
      <TopBar title="Payments" />
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Skeleton className="w-64 h-4 flex-1" />
          <Skeleton className="w-full sm:w-40 h-11 rounded-xl flex-shrink-0" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-ink-100 bg-white rounded-2xl p-5 space-y-2">
              <Skeleton className="w-28 h-3" />
              <Skeleton className="w-36 h-7" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-50">
            <Skeleton className="w-36 h-4 mb-2" />
            <Skeleton className="w-52 h-3" />
          </div>
          <div className="divide-y divide-ink-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="w-32 h-3.5" />
                  <Skeleton className="w-48 h-3" />
                </div>
                <div className="text-right flex-shrink-0 space-y-1.5">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

interface PaymentEntry {
  _id?: string;
  amount: number;
  note?: string;
  recordedAt?: string;
  createdAt?: string;
  customerName: string;
  debtDescription: string;
  debtId: string;
  debtTotal: number;
}

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "POS", "Cheque", "Other"];

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [allPayments, setAllPayments] = useState<PaymentEntry[]>([]);
  const [activeDebts, setActiveDebts] = useState<DebtRecord[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal form state
  const [selectedDebtId, setSelectedDebtId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await debtsApi.list({ limit: 200 });
      const records = (res.data as Record<string, unknown>[]).map(apiDebtToDebtRecord);

      // Split into active (for the modal select) and payment history
      setActiveDebts(records.filter(d => d.status !== "cleared"));

      const payments: PaymentEntry[] = records.flatMap(debt =>
        debt.payments.map(p => ({
          _id: p._id,
          amount: p.amount,
          note: p.note,
          recordedAt: p.recordedAt,
          createdAt: p.createdAt,
          customerName: debt.customerName,
          debtDescription: debt.description,
          debtId: debt.id,
          debtTotal: debt.amount,
        }))
      ).sort((a, b) => {
        const da = new Date(a.recordedAt ?? a.createdAt ?? 0).getTime();
        const db = new Date(b.recordedAt ?? b.createdAt ?? 0).getTime();
        return db - da;
      });
      setAllPayments(payments);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <PaymentsSkeleton />;

  const totalCollected = allPayments.reduce((s, p) => s + p.amount, 0);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthCount = allPayments.filter(p => (p.recordedAt ?? p.createdAt ?? "").startsWith(thisMonth)).length;
  const avgPayment = allPayments.length > 0 ? Math.round(totalCollected / allPayments.length) : 0;

  const stats = [
    { label: "Total Collected", value: formatNaira(totalCollected), color: "text-jade", bg: "bg-jade-50 border-jade-100" },
    { label: "Payments This Month", value: thisMonthCount.toString(), color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    { label: "Average Payment", value: formatNaira(avgPayment), color: "text-ink-700", bg: "bg-white border-ink-100" },
  ];

  async function handleSavePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDebtId || !amount) return;
    setSubmitting(true);
    try {
      await debtsApi.recordPayment(selectedDebtId, {
        amount: parseFloat(amount),
        method: method.toLowerCase().replace(" ", ""),
        note: note.trim() || undefined,
      });
      setToast({ message: "Payment recorded successfully!", type: "success" });
      setShowModal(false);
      setSelectedDebtId("");
      setAmount("");
      setMethod("Cash");
      setNote("");
      await fetchData();
    } catch (err: unknown) {
      setToast({ message: err instanceof Error ? err.message : "Failed to record payment", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedDebt = activeDebts.find(d => d.id === selectedDebtId);

  return (
    <>
      <TopBar title="Payments" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto pb-24 sm:pb-8">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-ink-500 text-sm flex-1">Record and track all incoming payments</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto flex-shrink-0"
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`border rounded-2xl p-5 ${s.bg}`}>
              <p className="text-ink-500 text-xs font-medium mb-1">{s.label}</p>
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment History */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-ink-50">
              <h2 className="font-heading font-semibold text-ink-900">Payment History</h2>
              <p className="text-ink-400 text-xs mt-0.5">All recorded payments, newest first</p>
            </div>
            <div className="divide-y divide-ink-50">
              {allPayments.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <TrendingDown size={32} className="text-ink-200 mx-auto mb-3" />
                  <p className="text-ink-400 text-sm">No payments recorded yet.</p>
                  <p className="text-ink-300 text-xs mt-1">Use "Record Payment" to get started.</p>
                </div>
              ) : allPayments.map((payment, i) => (
                <div key={payment._id ?? i} className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 hover:bg-ink-50/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                    <TrendingDown size={16} className="text-jade" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-800 text-sm">{payment.customerName}</p>
                    <p className="text-ink-400 text-xs truncate">{payment.debtDescription}</p>
                    {payment.note && <p className="text-ink-300 text-xs italic mt-0.5">{payment.note}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-bold text-jade text-sm sm:text-base">
                      +{formatNaira(payment.amount)}
                    </p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <Calendar size={11} className="text-ink-400" />
                      <p className="text-ink-400 text-xs">
                        {new Date(payment.recordedAt ?? payment.createdAt ?? "").toLocaleDateString("en-NG", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar breakdown */}
          <div className="space-y-4">
            <div className="bg-white border border-ink-100 rounded-2xl p-5">
              <h2 className="font-heading font-semibold text-ink-900 mb-4">By Customer</h2>
              <div className="space-y-3">
                {(() => {
                  const byCustomer = allPayments.reduce<Record<string, number>>((acc, p) => {
                    acc[p.customerName] = (acc[p.customerName] ?? 0) + p.amount;
                    return acc;
                  }, {});
                  const entries = Object.entries(byCustomer).sort((a, b) => b[1] - a[1]).slice(0, 8);
                  const max = entries[0]?.[1] ?? 1;
                  return entries.length === 0
                    ? <p className="text-ink-400 text-sm text-center py-4">No payments yet.</p>
                    : entries.map(([name, amt]) => (
                      <div key={name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-ink-700 text-xs font-medium truncate max-w-[60%]">{name}</span>
                          <span className="text-jade text-xs font-bold">{formatNaira(amt)}</span>
                        </div>
                        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full bg-jade rounded-full" style={{ width: `${Math.round((amt / max) * 100)}%` }} />
                        </div>
                      </div>
                    ));
                })()}
              </div>
            </div>

            <div className="bg-jade/5 border border-jade/20 rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-jade-700 mb-2">Collection Rate</h3>
              <p className="text-4xl font-heading font-bold text-jade mb-1">
                {allPayments.length > 0
                  ? Math.min(100, Math.round((totalCollected / allPayments.reduce((s, p) => s + p.debtTotal, 1)) * 100))
                  : 0}%
              </p>
              <p className="text-jade-700/70 text-xs">of total owed has been collected</p>
            </div>
          </div>
        </div>

        {/* Record Payment Modal — compact */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-up">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
                <h2 className="font-heading font-bold text-lg text-ink-900">Record Payment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <form className="px-5 py-4 space-y-3" onSubmit={handleSavePayment}>
                {/* Select Debt */}
                <div>
                  <label className="block text-ink-600 text-xs font-semibold mb-1.5">Select Debt *</label>
                  <select
                    required
                    value={selectedDebtId}
                    onChange={e => { setSelectedDebtId(e.target.value); setAmount(""); }}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  >
                    <option value="">Choose debt record...</option>
                    {activeDebts.length === 0 && (
                      <option disabled>No active debts found</option>
                    )}
                    {activeDebts.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.customerName} — {formatNaira(d.balance)} remaining
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount + Method on same row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-600 text-xs font-semibold mb-1.5">Amount (₦) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedDebt?.balance}
                      placeholder="0"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                    />
                    {selectedDebt && (
                      <p className="text-ink-400 text-[11px] mt-1">Max: {formatNaira(selectedDebt.balance)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-ink-600 text-xs font-semibold mb-1.5">Method</label>
                    <select
                      value={method}
                      onChange={e => setMethod(e.target.value)}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                    >
                      {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-ink-600 text-xs font-semibold mb-1.5">Note <span className="text-ink-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Cash at store"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-ink-200 text-ink-600 font-semibold py-2.5 rounded-xl hover:bg-ink-50 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] bg-jade hover:bg-jade-400 disabled:opacity-60 text-ink-900 font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={15} />
                    {submitting ? "Saving..." : "Save Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}
