"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  Phone,
  MapPin,
  MessageSquare,
  MoreVertical,
  TrendingUp,
  X,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Trash2,
} from "lucide-react";
import { formatNaira, getStatusColor } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";
import { usePlanUsage } from "@/hooks/usePlanUsage";
import { UpgradeModal } from "@/components/ui/UpgradeModal";
import {
  useCustomers,
  type Customer,
  type CustomerForm,
  type HistoryEntry,
} from "@/hooks/useCustomers";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

function CustomersSkeleton() {
  return (
    <>
      <TopBar title="Customers" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <Skeleton className="w-64 h-4 flex-1" />
          <Skeleton className="w-full sm:w-36 h-11 rounded-xl" />
        </div>
        <Skeleton className="w-full sm:max-w-sm h-11 rounded-xl mb-6" />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-xl p-3 sm:p-4 text-center"
            >
              <Skeleton className="w-12 h-7 mx-auto mb-2" />
              <Skeleton className="w-20 h-3 mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
                  <div className="space-y-2">
                    <Skeleton className="w-28 h-3.5" />
                    <Skeleton className="w-16 h-3 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded" />
                  <Skeleton className="w-28 h-3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded" />
                  <Skeleton className="w-36 h-3" />
                </div>
              </div>
              <div className="bg-ink-50 rounded-xl p-3 mb-4 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
                <div className="flex justify-between">
                  <Skeleton className="w-16 h-2.5" />
                  <Skeleton className="w-16 h-2.5" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="flex-1 h-9 rounded-xl" />
                <Skeleton className="flex-1 h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Add Customer Modal ───────────────────────────────────────────────────────

function AddCustomerModal({
  onSave,
  onClose,
}: {
  onSave: (form: CustomerForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k: keyof CustomerForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone number are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-fade-up">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-ink-100">
          <h2 className="font-heading font-bold text-xl text-ink-900">
            Add New Customer
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-coral-600 text-xs bg-coral-50 border border-coral-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <AlertTriangle size={13} className="flex-shrink-0" /> {error}
            </p>
          )}

          <div>
            <label className="block text-ink-600 text-sm font-medium mb-2">
              Full name *
            </label>
            <input
              type="text"
              required
              placeholder="Adaeze Okonkwo"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-ink-600 text-sm font-medium mb-2">
              Phone number *
            </label>
            <input
              type="tel"
              required
              placeholder="0801 234 5678"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-ink-600 text-sm font-medium mb-2">
              Address / Area{" "}
              <span className="text-ink-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Surulere, Lagos"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-ink-600 text-sm font-medium mb-2">
              Notes <span className="text-ink-400 font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Any notes about this customer..."
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Saving...
                </>
              ) : (
                "Save Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── History Drawer ───────────────────────────────────────────────────────────

function HistoryDrawer({
  customer,
  onClose,
  fetchHistory,
}: {
  customer: Customer;
  onClose: () => void;
  fetchHistory: (id: string) => Promise<HistoryEntry[]>;
}) {
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Fetch on mount
  useState(() => {
    fetchHistory(customer.id)
      .then((entries) => setHistory(entries))
      .catch((err: unknown) =>
        setHistoryError(
          err instanceof Error ? err.message : "Failed to load history",
        ),
      )
      .finally(() => setLoadingHistory(false));
  });

  const outstanding = customer.totalOwed - customer.totalPaid;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh] animate-fade-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-ink-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-jade-600 text-sm">
                {initials(customer.name)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-ink-900 text-base leading-tight truncate">
                {customer.name}
              </p>
              <p className="text-ink-400 text-xs">{customer.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Balance strip */}
        <div className="grid grid-cols-3 gap-3 px-6 py-4 bg-ink-50 border-b border-ink-100 flex-shrink-0">
          {[
            {
              label: "Total Owed",
              value: formatNaira(customer.totalOwed),
              color: "text-ink-700",
            },
            {
              label: "Total Paid",
              value: formatNaira(customer.totalPaid),
              color: "text-jade-600",
            },
            {
              label: "Outstanding",
              value: formatNaira(outstanding),
              color: outstanding > 0 ? "text-coral-600" : "text-jade-600",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p
                className={`font-heading font-bold text-sm sm:text-base ${item.color}`}
              >
                {item.value}
              </p>
              <p className="text-ink-400 text-[10px] mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {loadingHistory && (
            <div className="py-16 flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-ink-300" />
              <p className="text-ink-400 text-sm">Loading transactions...</p>
            </div>
          )}

          {historyError && (
            <div className="py-12 text-center">
              <AlertTriangle
                size={28}
                className="text-coral-400 mx-auto mb-2"
              />
              <p className="text-coral-600 text-sm font-medium">
                {historyError}
              </p>
            </div>
          )}

          {!loadingHistory &&
            !historyError &&
            history !== null &&
            (history.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={22} className="text-ink-400" />
                </div>
                <p className="font-heading font-semibold text-ink-600">
                  No transactions yet
                </p>
                <p className="text-ink-400 text-sm mt-1">
                  This customer has no recorded activity.
                </p>
              </div>
            ) : (
              <>
                <p className="text-ink-400 text-xs font-medium uppercase tracking-wider mb-1">
                  {history.length} Transaction{history.length !== 1 ? "s" : ""}
                </p>
                {[...history]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 bg-white border border-ink-100 rounded-xl px-4 py-3"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          entry.type === "payment"
                            ? "bg-jade/10"
                            : "bg-coral-50"
                        }`}
                      >
                        {entry.type === "payment" ? (
                          <CheckCircle2 size={16} className="text-jade-600" />
                        ) : (
                          <CreditCard size={16} className="text-coral-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-ink-700 text-sm font-medium truncate">
                          {entry.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar size={10} className="text-ink-400" />
                          <span className="text-ink-400 text-xs">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`font-heading font-bold text-sm ${
                            entry.type === "payment"
                              ? "text-jade-600"
                              : "text-coral-600"
                          }`}
                        >
                          {entry.type === "payment" ? "+" : "−"}
                          {formatNaira(entry.amount)}
                        </p>
                        <p className="text-ink-400 text-[10px]">
                          {entry.type === "payment" ? "Payment" : "Purchase"}
                        </p>
                      </div>
                    </div>
                  ))}
              </>
            ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-ink-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const {
    customers,
    loading,
    error,
    refresh,
    addCustomer,
    removeCustomer,
    fetchHistory,
  } = useCustomers();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { usage, customersAtLimit, refresh: refreshUsage } = usePlanUsage();
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <CustomersSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertTriangle size={32} className="text-coral-400" />
        <p className="font-heading font-semibold text-ink-700">{error}</p>
        <button onClick={refresh} className="text-sm text-jade underline">
          Reload
        </button>
      </div>
    );
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const sendWhatsApp = (customer: Customer) => {
    const outstanding = customer.totalOwed - customer.totalPaid;
    const msg = encodeURIComponent(
      `Hello ${customer.name}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(outstanding)}. Kindly make payment at your earliest convenience. Thank you.`,
    );
    window.open(
      `https://wa.me/234${customer.phone.replace(/^0/, "")}?text=${msg}`,
      "_blank",
    );
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await removeCustomer(deleteTarget.id);
      setDeleteTarget(null);
      refreshUsage(); // sync sidebar count immediately
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete customer",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <TopBar title="Customers" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <p className="text-ink-500 text-sm flex-1">
            Manage your credit customers and their history
          </p>
          <div className="flex flex-col items-stretch sm:items-end gap-1.5">
            <button
              onClick={() => (customersAtLimit ? setShowUpgrade(true) : setShowAddModal(true))}
              className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto"
            >
              <Plus size={16} /> Add Customer
            </button>
            {usage && !usage.isPaid && (
              <p className={`text-xs text-right ${customersAtLimit ? "text-coral-500 font-medium" : "text-ink-400"}`}>
                {usage.customers.used} / {usage.customers.limit} customers used
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 w-full sm:max-w-sm mb-6 focus-within:border-jade/40 transition-all">
          <Search size={15} className="text-ink-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={13} className="text-ink-400 hover:text-ink-600" />
            </button>
          )}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            {
              label: "Total Customers",
              value: customers.length,
              color: "text-ink-700",
            },
            {
              label: "Active Debtors",
              value: customers.filter((c) => c.status !== "cleared").length,
              color: "text-coral-600",
            },
            {
              label: "Fully Cleared",
              value: customers.filter((c) => c.status === "cleared").length,
              color: "text-jade-600",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white border border-ink-100 rounded-xl p-3 sm:p-4 text-center"
            >
              <p
                className={`font-heading font-bold text-xl sm:text-2xl ${s.color}`}
              >
                {s.value}
              </p>
              <p className="text-ink-400 text-[10px] sm:text-xs mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Customer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => {
            const sc = getStatusColor(customer.status);
            const progress =
              customer.totalOwed > 0
                ? (customer.totalPaid / customer.totalOwed) * 100
                : 100;
            const outstanding = customer.totalOwed - customer.totalPaid;

            return (
              <div
                key={customer.id}
                className="bg-white border border-ink-100 rounded-2xl p-5 card-hover group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-jade-600 text-base">
                        {initials(customer.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-ink-800 text-sm">
                        {customer.name}
                      </p>
                      <span
                        className={`badge ${sc.bg} ${sc.text} text-[10px] mt-0.5`}
                      >
                        <span
                          className={`w-1 h-1 rounded-full ${sc.dot} mr-1`}
                        />
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {/* Delete — only shown on hover, only if no outstanding debt */}
                  <button
                    onClick={() => setDeleteTarget(customer)}
                    className="text-ink-300 hover:text-coral-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove customer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-ink-500 text-xs">
                    <Phone size={12} />
                    <span>{customer.phone}</span>
                  </div>
                  {customer.address && (
                    <div className="flex items-center gap-2 text-ink-400 text-xs">
                      <MapPin size={12} />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </div>

                <div className="bg-ink-50 rounded-xl p-3 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-ink-500 text-xs">Outstanding</span>
                    <span
                      className={`font-heading font-bold text-sm ${outstanding > 0 ? "text-coral-600" : "text-jade-600"}`}
                    >
                      {formatNaira(outstanding)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${customer.status === "cleared" ? "bg-jade" : progress > 60 ? "bg-amber-400" : "bg-coral-400"}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] text-ink-400">
                    <span>{formatNaira(customer.totalPaid)} paid</span>
                    <span>{Math.round(progress)}% cleared</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {outstanding > 0 && (
                    <button
                      onClick={() => sendWhatsApp(customer)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-jade/10 hover:bg-jade/20 text-jade font-semibold text-xs py-2.5 rounded-xl transition-colors"
                    >
                      <MessageSquare size={13} /> Remind
                    </button>
                  )}
                  <button
                    onClick={() => setHistoryCustomer(customer)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-ink-50 hover:bg-ink-100 text-ink-600 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    <TrendingUp size={13} /> View History
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-ink-400" />
            </div>
            <p className="font-heading font-semibold text-ink-600 text-lg">
              No customers found
            </p>
            <p className="text-ink-400 text-sm mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>

      {/* ── Add Customer Modal ─────────────────────────────────────────────── */}
      {showAddModal && (
        <AddCustomerModal
          onSave={async (form) => {
            try {
              await addCustomer(form);
              refreshUsage();
            } catch (err: any) {
              if (err?.code === "PLAN_LIMIT_REACHED") {
                setShowAddModal(false);
                setShowUpgrade(true);
                refreshUsage();
                return;
              }
              throw err;
            }
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* ── History Drawer ─────────────────────────────────────────────────── */}
      {historyCustomer && (
        <HistoryDrawer
          customer={historyCustomer}
          onClose={() => setHistoryCustomer(null)}
          fetchHistory={fetchHistory}
        />
      )}

      {/* ── Delete Confirmation ─────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
            <div className="w-12 h-12 bg-coral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-coral-500" />
            </div>
            <h2 className="font-heading font-bold text-xl text-ink-900 text-center mb-2">
              Remove customer?
            </h2>
            <p className="text-ink-500 text-sm text-center mb-1">
              <span className="font-semibold text-ink-700">
                {deleteTarget.name}
              </span>
            </p>
            {deleteTarget.totalOwed - deleteTarget.totalPaid > 0 && (
              <p className="text-amber-600 text-xs text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                This customer has an outstanding balance — the server will
                reject this deletion.
              </p>
            )}
            {deleteError && (
              <p className="text-coral-600 text-xs text-center mb-3 bg-coral-50 border border-coral-100 rounded-xl px-3 py-2">
                {deleteError}
              </p>
            )}
            <p className="text-ink-400 text-xs text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                disabled={deleting}
                className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Removing...
                  </>
                ) : (
                  "Yes, Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgrade && (
        <UpgradeModal resource="customers" limit={usage?.customers.limit ?? 10} onClose={() => setShowUpgrade(false)} />
      )}
    </>
  );
}
