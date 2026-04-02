"use client";
import Link from "next/link";
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, Plus, ArrowRight, MoreHorizontal } from "lucide-react";
import { mockDebts, mockCustomers, dashboardStats, formatNaira, getStatusColor, getDaysOverdue } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

export default function DashboardPage() {
  const overdue = mockDebts.filter(d => d.status === "overdue");

  return (
    <>
      <TopBar />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-ink-400 text-sm mb-1">Thursday, March 29 · Titilayo Farms & Agro Supplies</p>
            <h1 className="font-heading text-3xl font-bold text-ink-900">Good morning, Titilayo</h1>
          </div>
          <Link
            href="/debtors"
            className="hidden sm:flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg flex-shrink-0"
          >
            <Plus size={16} />
            Add Debt
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Owed to You",
              value: formatNaira(dashboardStats.totalOwed),
              sub: `${dashboardStats.activeDebts} active debts`,
              icon: TrendingUp,
              color: "text-coral-600",
              bg: "bg-coral-50",
              border: "border-coral-100",
            },
            {
              label: "Overdue Amount",
              value: formatNaira(dashboardStats.overdueAmount),
              sub: `${dashboardStats.overdueCount} overdue debts`,
              icon: AlertTriangle,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Cleared This Month",
              value: formatNaira(dashboardStats.clearedThisMonth),
              sub: "1 debt fully paid",
              icon: CheckCircle,
              color: "text-jade-600",
              bg: "bg-jade-50",
              border: "border-jade-100",
            },
            {
              label: "Total Customers",
              value: dashboardStats.totalCustomers.toString(),
              sub: "4 with active debts",
              icon: Users,
              color: "text-ink-600",
              bg: "bg-ink-100",
              border: "border-ink-200",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white border ${stat.border} rounded-2xl p-5 card-hover`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-ink-500 text-xs font-medium leading-snug">{stat.label}</p>
                <div className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <p className={`font-heading font-bold text-2xl ${stat.color} leading-none mb-1`}>{stat.value}</p>
              <p className="text-ink-400 text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Overdue Debts */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-50 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-ink-900">Overdue Debts</h2>
                <p className="text-ink-400 text-xs mt-0.5">These need your immediate attention</p>
              </div>
              <Link href="/debtors" className="text-jade text-sm font-semibold hover:text-jade-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-ink-50">
              {overdue.map((debt, i) => {
                const days = getDaysOverdue(debt.dueDate || "");
                const progress = (debt.amountPaid / debt.amount) * 100;
                return (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 table-row-hover">
                    <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-coral-500 text-sm">
                        {debt.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink-800 text-sm truncate">{debt.customerName}</p>
                      <p className="text-ink-400 text-xs truncate">{debt.description}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-ink-400">{formatNaira(debt.amountPaid)} paid</span>
                          <span className="text-ink-500 font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div className="h-full bg-jade rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-heading font-bold text-ink-900 text-base">{formatNaira(debt.amount - debt.amountPaid)}</p>
                      <p className="text-coral-500 text-xs font-medium">{days}d overdue</p>
                    </div>
                    <button className="text-ink-300 hover:text-ink-600 transition-colors ml-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-50">
                <h2 className="font-heading font-semibold text-ink-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-ink-50">
                {dashboardStats.recentActivity.map((a, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      a.type === 'cleared' ? 'bg-jade/10' :
                      a.type === 'payment' ? 'bg-amber-50' :
                      'bg-ink-100'
                    }`}>
                      {a.type === 'cleared' ? <CheckCircle size={13} className="text-jade" /> :
                       a.type === 'payment' ? <TrendingDown size={13} className="text-amber-500" /> :
                       <Plus size={13} className="text-ink-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink-700 text-xs font-medium truncate">{a.customer}</p>
                      <p className="text-ink-400 text-[11px]">
                        {a.type === 'cleared' ? 'Fully cleared' :
                         a.type === 'payment' ? `Paid ${formatNaira(a.amount)}` :
                         `New debt: ${formatNaira(a.amount)}`}
                      </p>
                    </div>
                    <p className="text-ink-400 text-[11px] flex-shrink-0">{a.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-ink-900 border border-white/5 rounded-2xl p-5">
              <h2 className="font-heading font-semibold text-white mb-4">Quick actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Add new debt record", href: "/debtors", color: "hover:bg-jade/10 hover:text-jade" },
                  { label: "Add new customer", href: "/customers", color: "hover:bg-jade/10 hover:text-jade" },
                  { label: "Record a payment", href: "/payments", color: "hover:bg-amber-50/10 hover:text-amber-400" },
                  { label: "Export to PDF", href: "/reports", color: "hover:bg-white/5 hover:text-white" },
                ].map(a => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-ink-400 text-sm font-medium transition-all ${a.color}`}
                  >
                    {a.label}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
