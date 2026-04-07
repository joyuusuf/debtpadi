"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Search, MessageSquare, CheckCircle, Clock, MoreVertical, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { mockDebts as initialDebts, formatNaira, getDaysOverdue, getStatusColor, DebtRecord } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";
// ─── helpers ────────────────────────────────────────────────────────────────

function computeStatus(amountPaid: number, amount: number, dueDate: string): DebtRecord["status"] {
  if (amountPaid >= amount) return "cleared";
  const overdue = dueDate ? getDaysOverdue(dueDate) > 0 : false;
  if (amountPaid > 0) return overdue ? "overdue" : "partial";
  return overdue ? "overdue" : "pending";
}

const EMPTY_FORM = {
  customerName: "",
  phone: "",
  description: "",
  amount: "",
  amountPaid: "",
  dueDate: "",
};

// ─── Skeleton primitives ─────────────────────────────────────────────────────

function Bone({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-ink-100 rounded-lg animate-pulse ${className}`}
      style={style}
    />
  );
}

// ─── Desktop table skeleton ──────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
      {/* thead */}
      <div className="border-b border-ink-100 bg-ink-50/50 flex gap-4 px-5 py-3.5">
        {[120, 180, 100, 130, 80, 60].map((w, i) => (
          <Bone key={i} className="h-3 rounded" style={{ width: w }} />
        ))}
      </div>

      {/* rows */}
      <div className="divide-y divide-ink-50">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            {/* avatar + name */}
            <div className="flex items-center gap-3 flex-[1.4]">
              <Bone className="w-9 h-9 rounded-xl flex-shrink-0" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-28" />
                <Bone className="h-2.5 w-20" />
              </div>
            </div>
            {/* description */}
            <Bone className="h-3 flex-[1.8] max-w-[200px]" />
            {/* amount */}
            <div className="flex-1 space-y-1.5">
              <Bone className="h-3.5 w-24" />
              <Bone className="h-2.5 w-16" />
            </div>
            {/* progress */}
            <div className="flex-1 w-32 space-y-1.5">
              <Bone className="h-2 w-12" />
              <Bone className="h-1.5 w-32 rounded-full" />
            </div>
            {/* badge */}
            <Bone className="h-6 w-20 rounded-full flex-shrink-0" />
            {/* actions */}
            <div className="flex gap-1.5 flex-shrink-0">
              <Bone className="h-8 w-8 rounded-lg" />
              <Bone className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile cards skeleton ───────────────────────────────────────────────────

function CardsSkeleton() {
  return (
    <div className="sm:hidden space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-ink-100 rounded-2xl p-4">
          {/* top row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <Bone className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="space-y-1.5">
                <Bone className="h-3 w-32" />
                <Bone className="h-2.5 w-44" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <Bone className="w-8 h-8 rounded-lg" />
              <Bone className="w-8 h-8 rounded-lg" />
            </div>
          </div>

          {/* amount + badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="space-y-1.5">
              <Bone className="h-5 w-28" />
              <Bone className="h-2.5 w-40" />
            </div>
            <Bone className="h-6 w-20 rounded-full" />
          </div>

          {/* progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Bone className="h-2.5 w-24" />
              <Bone className="h-2.5 w-8" />
            </div>
            <Bone className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page skeleton (header + search + tabs + list) ───────────────────────────

function PageSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1 space-y-2">
          <Bone className="h-7 w-32" />
          <Bone className="h-4 w-64" />
        </div>
        <Bone className="h-11 w-full sm:w-40 rounded-xl" />
      </div>

      {/* search bar */}
      <Bone className="h-11 w-full rounded-xl mb-4" />

      {/* filter tabs */}
      <div className="flex gap-2 mb-5">
        {[64, 80, 72, 72, 72].map((w, i) => (
          <Bone key={i} className="h-9 rounded-xl flex-shrink-0" style={{ width: w }} />
        ))}
      </div>

      <TableSkeleton />
      <CardsSkeleton />
    </div>
  );
}

// ─── Dropdown menu ──────────────────────────────────────────────────────────

function ActionMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 hover:text-ink-700 flex items-center justify-center transition-colors"
        title="More options"
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 bg-white border border-ink-100 rounded-xl shadow-lg shadow-ink-900/10 w-36 py-1 animate-fade-in">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <Pencil size={14} className="text-ink-400" />
            Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-coral-600 hover:bg-coral-50 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Delete confirm modal ───────────────────────────────────────────────────

function DeleteModal({ debt, onConfirm, onCancel }: { debt: DebtRecord; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
        <div className="w-12 h-12 bg-coral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-coral-500" />
        </div>
        <h2 className="font-heading font-bold text-xl text-ink-900 text-center mb-2">Delete this debt?</h2>
        <p className="text-ink-500 text-sm text-center mb-1">
          <span className="font-semibold text-ink-700">{debt.customerName}</span> — {debt.description}
        </p>
        <p className="text-coral-500 font-bold text-center mb-2">{formatNaira(debt.amount)}</p>
        <p className="text-ink-400 text-xs text-center mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add / Edit modal ───────────────────────────────────────────────────────

function DebtModal({
  mode, initial, existingCustomers, onSave, onClose,
}: {
  mode: "add" | "edit";
  initial: typeof EMPTY_FORM;
  existingCustomers: string[];
  onSave: (data: typeof EMPTY_FORM) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [useExisting, setUseExisting] = useState(false);

  const update = (k: keyof typeof EMPTY_FORM, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
          <h2 className="font-heading font-bold text-lg text-ink-900">
            {mode === "add" ? "Add Debt Record" : "Edit Debt Record"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form id="debt-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>

            {/* New vs Existing toggle — only in add mode */}
            {mode === "add" && existingCustomers.length > 0 && (
              <div className="flex gap-2 p-1 bg-ink-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUseExisting(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    !useExisting ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                  }`}
                >
                  New customer
                </button>
                <button
                  type="button"
                  onClick={() => setUseExisting(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    useExisting ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                  }`}
                >
                  Existing customer
                </button>
              </div>
            )}

            {/* Customer fields */}
            {useExisting && mode === "add" ? (
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Select customer *</label>
                <select
                  required
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                >
                  <option value="">Choose a customer...</option>
                  {existingCustomers.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Customer name *</label>
                  <input
                    type="text" required placeholder="Full name"
                    value={form.customerName} onChange={(e) => update("customerName", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Phone number</label>
                  <input
                    type="tel" placeholder="0801 234 5678"
                    value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-ink-600 text-sm font-medium mb-2">What did they buy? *</label>
              <textarea
                required rows={2} placeholder="e.g. Bag of rice (50kg) + Semovita x3"
                value={form.description} onChange={(e) => update("description", e.target.value)}
                className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Total amount (₦) *</label>
                <input
                  type="number" required min={1} placeholder="15000"
                  value={form.amount} onChange={(e) => update("amount", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Amount paid (₦)</label>
                <input
                  type="number" min={0} placeholder="0"
                  value={form.amountPaid} onChange={(e) => update("amountPaid", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-600 text-sm font-medium mb-2">Due date</label>
              <input
                type="date" value={form.dueDate} onChange={(e) => update("dueDate", e.target.value)}
                className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
              />
            </div>
          </form>
        </div>

        {/* Footer — always visible */}
        <div className="flex gap-3 px-5 py-4 border-t border-ink-100 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors">
            Cancel
          </button>
          <button type="submit" form="debt-form" className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            {mode === "add" ? "Save Debt" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function DebtorsPage() {
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "overdue" | "partial" | "cleared" | "pending">("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DebtRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null);

  // Simulate data fetch — swap this for your real fetch/localStorage load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebts(initialDebts);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageSkeleton />;

  const filtered = debts.filter((d) => {
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const existingCustomers = [...new Set(debts.map((d) => d.customerName))];

  const counts = {
    all: debts.length,
    overdue: debts.filter((d) => d.status === "overdue").length,
    partial: debts.filter((d) => d.status === "partial").length,
    cleared: debts.filter((d) => d.status === "cleared").length,
    pending: debts.filter((d) => d.status === "pending").length,
  };

  function handleAdd(form: typeof EMPTY_FORM) {
    const amount = Number(form.amount);
    const amountPaid = Number(form.amountPaid) || 0;
    const newDebt: DebtRecord = {
      id: `d${Date.now()}`,
      customerId: `c${Date.now()}`,
      customerName: form.customerName.trim(),
      description: form.description.trim(),
      amount,
      amountPaid,
      dueDate: form.dueDate || undefined,
      createdAt: new Date().toISOString().split("T")[0],
      status: computeStatus(amountPaid, amount, form.dueDate),
      payments: [],
    };
    setDebts((prev) => [newDebt, ...prev]);
    setAddOpen(false);
  }

  function handleEdit(form: typeof EMPTY_FORM) {
    if (!editTarget) return;
    const amount = Number(form.amount);
    const amountPaid = Number(form.amountPaid) || 0;
    setDebts((prev) =>
      prev.map((d) =>
        d.id === editTarget.id
          ? { ...d, customerName: form.customerName.trim(), description: form.description.trim(), amount, amountPaid, dueDate: form.dueDate || undefined, status: computeStatus(amountPaid, amount, form.dueDate) }
          : d
      )
    );
    setEditTarget(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setDebts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function sendWhatsApp(name: string, amount: number) {
    const msg = encodeURIComponent(
      `Hello ${name}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(amount)} with us. Kindly make payment at your earliest convenience. Thank you.`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function toForm(d: DebtRecord): typeof EMPTY_FORM {
    return { customerName: d.customerName, phone: "", description: d.description, amount: String(d.amount), amountPaid: String(d.amountPaid), dueDate: d.dueDate || "" };
  }

  return (
    <>
     <TopBar title="Debtors" />
    <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* <div className="flex-1">
          <h1 className="font-heading font-bold text-2xl text-ink-900">Debtors</h1>
          <p className="text-ink-500 text-sm mt-0.5">Track all credit sales and outstanding balances</p>
        </div> */}
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto"
        >
          <Plus size={16} />
          Add Debt Record
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 mb-4 focus-within:border-jade/40 focus-within:ring-2 focus-within:ring-jade/10 transition-all">
        <Search size={15} className="text-ink-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-ink-400 hover:text-ink-600 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
        {(["all", "overdue", "partial", "pending", "cleared"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === f ? "bg-ink-900 text-white" : "bg-white border border-ink-100 text-ink-500 hover:border-ink-200 hover:text-ink-700"
            }`}
          >
            {f === "all" ? "All" : f}
            <span className={`ml-1.5 text-xs font-bold ${filter === f ? "opacity-70" : "opacity-50"}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/50">
                <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Description</th>
                <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Progress</th>
                <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {filtered.map((debt) => {
                const sc = getStatusColor(debt.status);
                const progress = debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0;
                const daysOverdue = debt.status === "overdue" ? getDaysOverdue(debt.dueDate || "") : 0;

                return (
                  <tr key={debt.id} className="table-row-hover">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-heading font-bold text-jade-600 text-sm">
                            {debt.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-ink-800 text-sm">{debt.customerName}</p>
                          <p className="text-ink-400 text-xs">
                            {new Date(debt.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-ink-600 text-sm max-w-[200px] truncate">{debt.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-heading font-bold text-ink-900">{formatNaira(debt.amount)}</p>
                      {debt.amountPaid > 0 && (
                        <p className="text-jade-600 text-xs">{formatNaira(debt.amountPaid)} paid</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-ink-400">{Math.round(progress)}%</span>
                          {daysOverdue > 0 && <span className="text-coral-500 font-medium">{daysOverdue}d late</span>}
                        </div>
                        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${debt.status === "cleared" ? "bg-jade" : progress > 50 ? "bg-amber-400" : "bg-coral-400"}`}
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
                      <div className="flex items-center gap-1.5">
                        {debt.status !== "cleared" && (
                          <button
                            onClick={() => sendWhatsApp(debt.customerName, debt.amount - debt.amountPaid)}
                            className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                            title="Send WhatsApp reminder"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                        <ActionMenu onEdit={() => setEditTarget(debt)} onDelete={() => setDeleteTarget(debt)} />
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

      {/* ── MOBILE CARDS ── */}
      <div className="sm:hidden space-y-3">
        {filtered.map((debt) => {
          const sc = getStatusColor(debt.status);
          const progress = debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0;
          const daysOverdue = debt.status === "overdue" ? getDaysOverdue(debt.dueDate || "") : 0;
          const outstanding = debt.amount - debt.amountPaid;

          return (
            <div key={debt.id} className="bg-white border border-ink-100 rounded-2xl p-4">
              {/* Top row: avatar + name + actions */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-jade-600 text-sm">
                      {debt.customerName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-ink-800 text-sm truncate">{debt.customerName}</p>
                    <p className="text-ink-400 text-xs truncate">{debt.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {debt.status !== "cleared" && (
                    <button
                      onClick={() => sendWhatsApp(debt.customerName, outstanding)}
                      className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                      title="Send WhatsApp reminder"
                    >
                      <MessageSquare size={14} />
                    </button>
                  )}
                  <ActionMenu onEdit={() => setEditTarget(debt)} onDelete={() => setDeleteTarget(debt)} />
                </div>
              </div>

              {/* Amount + status */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-heading font-bold text-ink-900 text-lg leading-none">{formatNaira(outstanding)}</p>
                  <p className="text-ink-400 text-xs mt-0.5">outstanding of {formatNaira(debt.amount)}</p>
                </div>
                <span className={`badge ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`} />
                  {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                  {daysOverdue > 0 && <span className="ml-1 opacity-75">· {daysOverdue}d</span>}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-400">{formatNaira(debt.amountPaid)} paid</span>
                  <span className="text-ink-500 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${debt.status === "cleared" ? "bg-jade" : progress > 50 ? "bg-amber-400" : "bg-coral-400"}`}
                    style={{ width: `${Math.max(progress, 3)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Clock size={22} className="text-ink-400" />
            </div>
            <p className="font-heading font-semibold text-ink-600">No debts found</p>
            <p className="text-ink-400 text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {addOpen && (
        <DebtModal mode="add" initial={EMPTY_FORM} existingCustomers={existingCustomers} onSave={handleAdd} onClose={() => setAddOpen(false)} />
      )}
      {editTarget && (
        <DebtModal mode="edit" initial={toForm(editTarget)} existingCustomers={existingCustomers} onSave={handleEdit} onClose={() => setEditTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteModal debt={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
    </> 
  );
}