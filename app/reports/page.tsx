"use client";
import { useState, useEffect, useCallback } from "react";
import { Download, TrendingUp, Users, AlertTriangle, CheckCircle, BarChart3, Lock } from "lucide-react";
import { formatNaira, getStatusColor } from "@/lib/data";
import { debts as debtsApi, dashboard } from "@/lib/api";
import { apiDebtToDebtRecord } from "@/lib/adapters";
import type { DebtRecord } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-ink-100 rounded-lg animate-pulse ${className}`} style={style} />;
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-ink-100 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-7 w-28" />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-ink-50 flex justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="divide-y divide-ink-50">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatsData {
  totalOwed: number;
  overdueAmount: number;
  overdueCount: number;
  clearedThisMonth: number;
  activeDebts: number;
  totalCustomers: number;
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [debts, setDebts] = useState<DebtRecord[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, debtsRes] = await Promise.all([
        dashboard.stats(),
        debtsApi.list({ limit: 200 }),
      ]);
      setStats(statsRes.data as unknown as StatsData);
      setDebts((debtsRes.data as Record<string, unknown>[]).map(apiDebtToDebtRecord));
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalOwed = stats?.totalOwed ?? 0;
  // totalPaid = totalOwed minus current outstanding
  const totalOutstanding = stats?.overdueAmount ?? 0;
  const totalPaid = totalOwed - totalOutstanding;
  const overdueCount = stats?.overdueCount ?? 0;
  const clearedCount = stats?.clearedThisMonth ?? 0;
  const totalDebts = stats?.activeDebts ?? debts.length;
  const collectionRate = totalOwed > 0 ? Math.round((totalPaid / totalOwed) * 100) : 0;

  // Top debtor from real debt records
  const topDebtor = debts.reduce<{ name: string; balance: number } | null>((top, d) => {
    if (!top || d.balance > top.balance) return { name: d.customerName, balance: d.balance };
    return top;
  }, null);

  return (
    <>
      <TopBar title="Reports" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto pb-24 sm:pb-8">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-ink-500 text-sm flex-1">Analyse your debt portfolio and export records</p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto flex-shrink-0"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {isLoading ? (
          <>
            <KPISkeleton />
            <TableSkeleton />
          </>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Credit Extended", value: formatNaira(totalOwed), icon: TrendingUp, color: "text-ink-700", bg: "bg-ink-100 border-ink-200" },
                { label: "Total Collected", value: formatNaira(totalPaid), icon: CheckCircle, color: "text-jade-600", bg: "bg-jade-50 border-jade-100" },
                { label: "Still Outstanding", value: formatNaira(totalOutstanding), icon: AlertTriangle, color: "text-coral-600", bg: "bg-coral-50 border-coral-100" },
                { label: "Collection Rate", value: `${collectionRate}%`, icon: BarChart3, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
              ].map((s, i) => (
                <div key={i} className={`bg-white border rounded-2xl p-5 ${s.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-ink-500 text-xs font-medium leading-tight">{s.label}</p>
                    <s.icon size={15} className={s.color} />
                  </div>
                  <p className={`font-heading font-bold text-xl ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Debt Status Breakdown */}
              <div className="lg:col-span-1 bg-white border border-ink-100 rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-ink-900 mb-1">Debt Status</h2>
                <p className="text-ink-400 text-xs mb-5">Breakdown of all debt records</p>
                <div className="space-y-4">
                  {[
                    { label: "Overdue", count: overdueCount, color: "bg-coral-500" },
                    { label: "Partial", count: debts.filter(d => d.status === "partial").length, color: "bg-amber-400" },
                    { label: "Cleared", count: debts.filter(d => d.status === "cleared").length, color: "bg-jade" },
                    { label: "Pending", count: debts.filter(d => d.status === "pending").length, color: "bg-ink-300" },
                  ].map(s => {
                    const pct = totalDebts > 0 ? Math.round((s.count / totalDebts) * 100) : 0;
                    return (
                      <div key={s.label}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-ink-600 text-sm">{s.label}</span>
                          <span className="text-ink-500 text-xs font-semibold">{s.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {topDebtor && (
                  <div className="mt-6 pt-4 border-t border-ink-50">
                    <p className="text-ink-400 text-xs">Top debtor</p>
                    <p className="font-heading font-semibold text-ink-800 mt-1">{topDebtor.name}</p>
                    <p className="text-coral-600 text-sm font-bold">{formatNaira(topDebtor.balance)}</p>
                  </div>
                )}
              </div>

              {/* Summary stats */}
              <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-ink-900 mb-1">Portfolio Summary</h2>
                <p className="text-ink-400 text-xs mb-5">Key metrics across all debt records</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Total Customers", value: stats?.totalCustomers ?? 0, unit: "" },
                    { label: "Active Debts", value: totalDebts, unit: "" },
                    { label: "Overdue Debts", value: overdueCount, unit: "" },
                    { label: "Cleared This Month", value: clearedCount, unit: "records" },
                    { label: "Avg Debt Size", value: formatNaira(totalDebts > 0 ? Math.round(totalOwed / totalDebts) : 0), unit: "" },
                    { label: "Collection Rate", value: `${collectionRate}%`, unit: "" },
                  ].map((m, i) => (
                    <div key={i} className="bg-ink-50 rounded-xl p-4">
                      <p className="text-ink-400 text-xs mb-1">{m.label}</p>
                      <p className="font-heading font-bold text-ink-900 text-xl">{m.value}{m.unit ? ` ${m.unit}` : ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Debt Table */}
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-ink-50 flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-ink-900">Full Debt Register</h2>
                  <p className="text-ink-400 text-xs mt-0.5">All {debts.length} records</p>
                </div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="flex items-center gap-1.5 text-jade text-sm font-semibold hover:text-jade-600 transition-colors"
                >
                  <Download size={14} />
                  Export PDF
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-ink-50/50 border-b border-ink-100">
                      {["Customer", "Description", "Total", "Paid", "Balance", "Status"].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-ink-500 text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {debts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-ink-400 text-sm">
                          No debt records yet. Add debts from the Debtors page.
                        </td>
                      </tr>
                    ) : debts.map(debt => (
                      <tr key={debt.id} className="hover:bg-ink-50/40 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-ink-800 text-sm whitespace-nowrap">{debt.customerName}</td>
                        <td className="px-5 py-3.5 text-ink-500 text-sm max-w-[160px] truncate">{debt.description}</td>
                        <td className="px-5 py-3.5 font-mono text-ink-700 text-sm whitespace-nowrap">{formatNaira(debt.amount)}</td>
                        <td className="px-5 py-3.5 font-mono text-jade text-sm whitespace-nowrap">{formatNaira(debt.amountPaid)}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-coral-600 text-sm whitespace-nowrap">{formatNaira(debt.balance)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(debt.status)}`}>
                            {debt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-ink-50/80 border-t border-ink-200">
                      <td className="px-5 py-3.5 font-heading font-bold text-ink-900 text-sm" colSpan={2}>TOTAL</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-ink-900 text-sm">{formatNaira(debts.reduce((s, d) => s + d.amount, 0))}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-jade text-sm">{formatNaira(debts.reduce((s, d) => s + d.amountPaid, 0))}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-coral-600 text-sm">{formatNaira(debts.reduce((s, d) => s + d.balance, 0))}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Upgrade Modal */}
        {showUpgrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center animate-fade-up">
              <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-jade" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-ink-900 mb-2">Pro Feature</h2>
              <p className="text-ink-500 text-sm mb-6 leading-relaxed">
                PDF export and advanced reports are available on the Pro plan. Upgrade for just ₦30,000/month.
              </p>
              <button className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3.5 rounded-xl transition-all hover:shadow-lg mb-3">
                Upgrade to Pro — ₦30,000/mo
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
