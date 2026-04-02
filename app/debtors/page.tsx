"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreVertical, MessageSquare, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { mockDebts, formatNaira, getDaysOverdue, getStatusColor } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

export default function DebtorsPage() {
  const [filter, setFilter] = useState<"all" | "overdue" | "partial" | "cleared">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = mockDebts.filter(d => {
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch = d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sendWhatsApp = (name: string, phone: string, amount: number) => {
    const msg = encodeURIComponent(
      `Hello ${name}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(amount)} with us. Kindly make payment at your earliest convenience. Thank you.`
    );
    window.open(`https://wa.me/234${phone.replace(/^0/, '')}?text=${msg}`, '_blank');
  };

  return (
    <>
      <TopBar title="Debtors" />
      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-1">
            <p className="text-ink-500 text-sm">Track all credit sales and outstanding balances</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg flex-shrink-0"
          >
            <Plus size={16} />
            Add Debt Record
          </button>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 flex-1 max-w-xs focus-within:border-jade/40 transition-all">
            <Search size={15} className="text-ink-400" />
            <input
              type="text"
              placeholder="Search debtors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "overdue", "partial", "cleared"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-ink-900 text-white"
                    : "bg-white border border-ink-100 text-ink-500 hover:border-ink-200 hover:text-ink-700"
                }`}
              >
                {f === "all" ? `All (${mockDebts.length})` : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Customer</th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Description</th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Progress</th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((debt) => {
                  const sc = getStatusColor(debt.status);
                  const progress = (debt.amountPaid / debt.amount) * 100;
                  const daysOverdue = debt.status === "overdue" ? getDaysOverdue(debt.dueDate || "") : 0;

                  return (
                    <tr key={debt.id} className="table-row-hover group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-heading font-bold text-jade-600 text-sm">
                              {debt.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-ink-800 text-sm">{debt.customerName}</p>
                            <p className="text-ink-400 text-xs">{new Date(debt.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-ink-600 text-sm max-w-[200px] truncate">{debt.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-heading font-bold text-ink-900">{formatNaira(debt.amount)}</p>
                        {debt.amountPaid > 0 && (
                          <p className="text-jade-600 text-xs">{formatNaira(debt.amountPaid)} paid</p>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-ink-400">{Math.round(progress)}%</span>
                            {daysOverdue > 0 && <span className="text-coral-500 font-medium">{daysOverdue}d late</span>}
                          </div>
                          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${debt.status === 'cleared' ? 'bg-jade' : progress > 50 ? 'bg-amber-400' : 'bg-coral-400'}`}
                              style={{ width: `${Math.max(progress, 3)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`} />
                          {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => sendWhatsApp(debt.customerName, "08031234567", debt.amount - debt.amountPaid)}
                            className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                            title="Send WhatsApp reminder"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 flex items-center justify-center transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-ink-400" />
              </div>
              <p className="font-heading font-semibold text-ink-600 text-lg">No debts found</p>
              <p className="text-ink-400 text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Add Debt Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-ink-900">Add Debt Record</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors">
                  ×
                </button>
              </div>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Customer</label>
                  <select className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all">
                    <option value="">Select existing customer</option>
                    {mockDebts.map(d => (
                      <option key={d.id}>{d.customerName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-ink-100" />
                  <span className="text-ink-400 text-xs">or add new</span>
                  <div className="flex-1 h-px bg-ink-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Customer name</label>
                    <input type="text" placeholder="Full name" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Phone number</label>
                    <input type="tel" placeholder="0801 234 5678" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">What did they buy?</label>
                  <textarea placeholder="e.g. Bag of rice (50kg) + Semovita x3" rows={2} className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Amount (₦)</label>
                    <input type="number" placeholder="15,000" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Due date</label>
                    <input type="date" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    Save Debt Record
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
