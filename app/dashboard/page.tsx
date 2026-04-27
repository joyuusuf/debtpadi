"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";

const API = "http://localhost:5000";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getDaysOverdue(dueDate: string) {
  return Math.floor(
    (Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <>
      <TopBar />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Skeleton className="w-56 h-4 mb-2" />
            <Skeleton className="w-72 h-8" />
          </div>
          <Skeleton className="hidden sm:block w-32 h-11 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="w-28 h-3" />
                <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
              </div>
              <Skeleton className="w-36 h-7 mb-2" />
              <Skeleton className="w-24 h-3" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface DashboardData {
  totalOwed: number;
  activeDebts: number;
  overdueAmount: number;
  overdueCount: number;
  clearedThisMonth: number;
  totalCustomers: number;
  overdueDebts: {
    _id: string;
    customerName: string;
    description: string;
    amount: number;
    amountPaid: number;
    dueDate: string;
  }[];
  recentActivity: {
    customer: string;
    type: "cleared" | "payment" | "new";
    amount: number;
    date: string;
  }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{
    name: string;
    businessName: string;
  } | null>(null);

  useEffect(() => {
    // 1. Check token first
    const token = localStorage.getItem("debtpadi_token");
    if (!token) {
      window.location.href = "/auth/signin"; // Hard redirect
      return;
    }

    // 2. Load user from localStorage
    try {
      const rawUser = localStorage.getItem("debtpadi_user");
      if (rawUser) {
        const userData = JSON.parse(rawUser);
        setUser({
          name: userData.name || "",
          businessName: userData.businessName || "",
        });
      }
    } catch {
      console.error("Failed to load user from localStorage");
    }

    // 3. Fetch dashboard data
    console.log("Dashboard token:", token ? "exists" : "missing");
    fetch(`${API}/api/dashboard/stats`, {
      credentials: "include",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        console.log("Dashboard response:", json);
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load dashboard");
          // Clear invalid session
          localStorage.removeItem("debtpadi_user");
          localStorage.removeItem("debtpadi_token");
          window.location.href = "/auth/signin";
        }
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError("Network error. Please refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Dashboard useEffect
  useEffect(() => {
    const token = localStorage.getItem("debtpadi_token");
    console.log("Dashboard token:", token ? "exists" : "missing"); // Debug

    fetch(`${API}/api/dashboard/stats`, {
      credentials: "include", // ✅ Sends cookie automatically
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ Backup header
      },
    })
      .then((r) => r.json())
      .then((json) => {
        console.log("Dashboard response:", json); // Debug
        if (json.success) setData(json.data);
        else setError("Failed to load dashboard.");
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <>
        <TopBar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-ink-400">{error || "Something went wrong."}</p>
        </div>
      </>
    );
  }

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <TopBar />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-ink-400 text-sm mb-1">
              {today} · {user?.businessName ?? ""}
            </p>
            <h1 className="font-heading text-3xl font-bold text-ink-900">
              {getGreeting()}, {firstName}
            </h1>
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
              value: formatNaira(data.totalOwed),
              sub: `${data.activeDebts} active debt${data.activeDebts !== 1 ? "s" : ""}`,
              icon: TrendingUp,
              color: "text-coral-600",
              bg: "bg-coral-50",
              border: "border-coral-100",
            },
            {
              label: "Overdue Amount",
              value: formatNaira(data.overdueAmount),
              sub: `${data.overdueCount} overdue debt${data.overdueCount !== 1 ? "s" : ""}`,
              icon: AlertTriangle,
              color: "text-amber-600",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Cleared This Month",
              value: formatNaira(data.clearedThisMonth),
              sub: "fully paid this month",
              icon: CheckCircle,
              color: "text-jade-600",
              bg: "bg-jade-50",
              border: "border-jade-100",
            },
            {
              label: "Total Customers",
              value: data.totalCustomers.toString(),
              sub: "active customers",
              icon: Users,
              color: "text-ink-600",
              bg: "bg-ink-100",
              border: "border-ink-200",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white border ${stat.border} rounded-2xl p-5 card-hover`}
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-ink-500 text-xs font-medium leading-snug">
                  {stat.label}
                </p>
                <div
                  className={`w-8 h-8 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <p
                className={`font-heading font-bold text-2xl ${stat.color} leading-none mb-1`}
              >
                {stat.value}
              </p>
              <p className="text-ink-400 text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Overdue Debts */}
          <div className="lg:col-span-2 bg-white border border-ink-100 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-ink-50 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-ink-900">
                  Overdue Debts
                </h2>
                <p className="text-ink-400 text-xs mt-0.5">
                  These need your immediate attention
                </p>
              </div>
              <Link
                href="/debtors"
                className="text-jade text-sm font-semibold hover:text-jade-600 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-ink-50">
              {data.overdueDebts.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <CheckCircle
                    size={32}
                    className="text-jade mx-auto mb-3 opacity-50"
                  />
                  <p className="text-ink-400 text-sm">
                    No overdue debts — great work!
                  </p>
                </div>
              ) : (
                data.overdueDebts.map((debt, i) => {
                  const days = getDaysOverdue(debt.dueDate);
                  const progress = (debt.amountPaid / debt.amount) * 100;
                  return (
                    <div
                      key={debt._id ?? i}
                      className="px-6 py-4 flex items-center gap-4 table-row-hover"
                    >
                      <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
                        <span className="font-heading font-bold text-coral-500 text-sm">
                          {debt.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-800 text-sm truncate">
                          {debt.customerName}
                        </p>
                        <p className="text-ink-400 text-xs truncate">
                          {debt.description}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-ink-400">
                              {formatNaira(debt.amountPaid)} paid
                            </span>
                            <span className="text-ink-500 font-medium">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-jade rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-heading font-bold text-ink-900 text-base">
                          {formatNaira(debt.amount - debt.amountPaid)}
                        </p>
                        <p className="text-coral-500 text-xs font-medium">
                          {days}d overdue
                        </p>
                      </div>
                      <button className="text-ink-300 hover:text-ink-600 transition-colors ml-1">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-50">
                <h2 className="font-heading font-semibold text-ink-900">
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y divide-ink-50">
                {data.recentActivity.length === 0 ? (
                  <p className="px-5 py-6 text-ink-400 text-sm text-center">
                    No activity yet.
                  </p>
                ) : (
                  data.recentActivity.map((a, i) => (
                    <div
                      key={i}
                      className="px-5 py-3.5 flex items-center gap-3"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          a.type === "cleared"
                            ? "bg-jade/10"
                            : a.type === "payment"
                              ? "bg-amber-50"
                              : "bg-ink-100"
                        }`}
                      >
                        {a.type === "cleared" ? (
                          <CheckCircle size={13} className="text-jade" />
                        ) : a.type === "payment" ? (
                          <TrendingDown size={13} className="text-amber-500" />
                        ) : (
                          <Plus size={13} className="text-ink-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink-700 text-xs font-medium truncate">
                          {a.customer}
                        </p>
                        <p className="text-ink-400 text-[11px]">
                          {a.type === "cleared"
                            ? "Fully cleared"
                            : a.type === "payment"
                              ? `Paid ${formatNaira(a.amount)}`
                              : `New debt: ${formatNaira(a.amount)}`}
                        </p>
                      </div>
                      <p className="text-ink-400 text-[11px] flex-shrink-0">
                        {a.date}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-ink-900 border border-white/5 rounded-2xl p-5">
              <h2 className="font-heading font-semibold text-white mb-4">
                Quick actions
              </h2>
              <div className="space-y-2">
                {[
                  {
                    label: "Add new debt record",
                    href: "/debtors",
                    color: "hover:bg-jade/10 hover:text-jade",
                  },
                  {
                    label: "Add new customer",
                    href: "/customers",
                    color: "hover:bg-jade/10 hover:text-jade",
                  },
                  {
                    label: "Record a payment",
                    href: "/payments",
                    color: "hover:bg-amber-50/10 hover:text-amber-400",
                  },
                  {
                    label: "Export to PDF",
                    href: "/reports",
                    color: "hover:bg-white/5 hover:text-white",
                  },
                ].map((a) => (
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
