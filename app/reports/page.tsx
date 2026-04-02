"use client";
import { useState } from "react";
import { FileText, Download, TrendingUp, Users, AlertTriangle, CheckCircle, BarChart3, Lock } from "lucide-react";
import { mockDebts, mockCustomers, formatNaira } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

const totalOwed = mockDebts.reduce((s, d) => s + d.amount, 0);
const totalPaid = mockDebts.reduce((s, d) => s + d.amountPaid, 0);
const totalOutstanding = totalOwed - totalPaid;
const overdueCount = mockDebts.filter(d => d.status === "overdue").length;
const clearedCount = mockDebts.filter(d => d.status === "cleared").length;

// Monthly breakdown mock
const months = [
  { month: "Aug", owed: 12000, collected: 5000 },
  { month: "Sep", owed: 32000, collected: 8000 },
  { month: "Oct", owed: 18000, collected: 15000 },
  { month: "Nov", owed: 55000, collected: 20000 },
  { month: "Dec", owed: 77000, collected: 32000 },
  { month: "Jan", owed: 167500, collected: totalPaid },
];
const maxVal = Math.max(...months.flatMap(m => [m.owed, m.collected]));

export default function ReportsPage() {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <TopBar title="Reports" />
      <div className="px-6 py-8 max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-ink-500 text-sm flex-1">Analyse your debt portfolio and export records</p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg flex-shrink-0"
          >
            <Download size={16} />
            Export to PDF
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Credit Extended", value: formatNaira(totalOwed), icon: TrendingUp, color: "text-ink-700", bg: "bg-ink-100 border-ink-200" },
            { label: "Total Collected", value: formatNaira(totalPaid), icon: CheckCircle, color: "text-jade-600", bg: "bg-jade-50 border-jade-100" },
            { label: "Still Outstanding", value: formatNaira(totalOutstanding), icon: AlertTriangle, color: "text-coral-600", bg: "bg-coral-50 border-coral-100" },
            { label: "Collection Rate", value: `${Math.round((totalPaid / totalOwed) * 100)}%`, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
          ].map((s, i) => (
            <div key={i} className={`bg-white border rounded-2xl p-5 card-hover ${s.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-ink-500 text-xs font-medium leading-tight">{s.label}</p>
                <s.icon size={15} className={s.color} />
              </div>
              <p className={`font-heading font-bold text-xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-ink-900 mb-1">Monthly Overview</h2>
            <p className="text-ink-400 text-xs mb-6">Credit extended vs. collected each month</p>

            <div className="flex items-end gap-3 h-40">
              {months.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 items-end" style={{ height: '120px' }}>
                    <div
                      className="flex-1 bg-coral-100 hover:bg-coral-200 rounded-t-md transition-all"
                      style={{ height: `${(m.owed / maxVal) * 100}%` }}
                      title={`Owed: ${formatNaira(m.owed)}`}
                    />
                    <div
                      className="flex-1 bg-jade rounded-t-md hover:bg-jade-400 transition-all"
                      style={{ height: `${(m.collected / maxVal) * 100}%` }}
                      title={`Collected: ${formatNaira(m.collected)}`}
                    />
                  </div>
                  <span className="text-ink-400 text-[10px] font-medium">{m.month}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4 pt-4 border-t border-ink-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-coral-100" />
                <span className="text-ink-500 text-xs">Credit extended</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-jade" />
                <span className="text-ink-500 text-xs">Collected</span>
              </div>
            </div>
          </div>

          {/* Debt Status Breakdown */}
          <div className="bg-white border border-ink-100 rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-ink-900 mb-1">Debt Status</h2>
            <p className="text-ink-400 text-xs mb-6">Breakdown of all debt records</p>

            <div className="space-y-4">
              {[
                { label: "Overdue", count: overdueCount, total: mockDebts.length, color: "bg-coral-500" },
                { label: "Partial payment", count: mockDebts.filter(d => d.status === "partial").length, total: mockDebts.length, color: "bg-amber-400" },
                { label: "Cleared", count: clearedCount, total: mockDebts.length, color: "bg-jade" },
                { label: "Pending", count: mockDebts.filter(d => d.status === "pending").length, total: mockDebts.length, color: "bg-ink-300" },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-ink-600 text-sm">{s.label}</span>
                    <span className="text-ink-500 text-sm font-semibold">{s.count}/{s.total}</span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / s.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-ink-50">
              <p className="text-ink-400 text-xs">Top debtor</p>
              <p className="font-heading font-semibold text-ink-800 mt-1">Ngozi Okonkwo</p>
              <p className="text-coral-600 text-sm font-bold">{formatNaira(55000)}</p>
            </div>
          </div>
        </div>

        {/* Debt Table */}
        <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-50 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-semibold text-ink-900">Full Debt Register</h2>
              <p className="text-ink-400 text-xs mt-0.5">All {mockDebts.length} records</p>
            </div>
            <button onClick={() => setShowUpgrade(true)} className="flex items-center gap-1.5 text-jade text-sm font-semibold hover:text-jade-600 transition-colors">
              <Download size={14} />
              Export PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ink-50/50 border-b border-ink-100">
                  {["Customer", "Description", "Total", "Paid", "Balance", "Status"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-ink-500 text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {mockDebts.map(debt => (
                  <tr key={debt.id} className="table-row-hover">
                    <td className="px-5 py-3.5 font-medium text-ink-800 text-sm">{debt.customerName}</td>
                    <td className="px-5 py-3.5 text-ink-500 text-sm max-w-[180px] truncate">{debt.description}</td>
                    <td className="px-5 py-3.5 font-mono text-ink-700 text-sm">{formatNaira(debt.amount)}</td>
                    <td className="px-5 py-3.5 font-mono text-jade-600 text-sm">{formatNaira(debt.amountPaid)}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-coral-600 text-sm">{formatNaira(debt.amount - debt.amountPaid)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge text-xs capitalize ${
                        debt.status === 'overdue' ? 'bg-coral-50 text-coral-600' :
                        debt.status === 'cleared' ? 'bg-jade-50 text-jade-600' :
                        debt.status === 'partial' ? 'bg-amber-50 text-amber-600' :
                        'bg-ink-100 text-ink-500'
                      }`}>{debt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-ink-50/80 border-t border-ink-200">
                  <td className="px-5 py-3.5 font-heading font-bold text-ink-900 text-sm" colSpan={2}>TOTAL</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-ink-900 text-sm">{formatNaira(totalOwed)}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-jade-600 text-sm">{formatNaira(totalPaid)}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-coral-600 text-sm">{formatNaira(totalOutstanding)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-up">
              <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-jade" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-ink-900 mb-2">Pro Feature</h2>
              <p className="text-ink-500 text-sm mb-6 leading-relaxed">
                PDF export and advanced reports are available on the Pro plan. Upgrade for just ₦3,500/month.
              </p>
              <button className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3.5 rounded-xl transition-all hover:shadow-lg mb-3">
                Upgrade to Pro — ₦3,500/mo
              </button>
              <button onClick={() => setShowUpgrade(false)} className="w-full text-ink-400 hover:text-ink-600 text-sm transition-colors py-2">
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
