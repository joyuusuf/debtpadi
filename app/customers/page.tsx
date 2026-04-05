
"use client";
import { useState } from "react";
import {
  Plus, Search, Phone, MapPin, MessageSquare, MoreVertical,
  TrendingUp, X, ArrowLeft, Calendar, ShoppingBag, CreditCard, CheckCircle2
} from "lucide-react";
import { mockCustomers, formatNaira, getStatusColor } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerStatus = "cleared" | "overdue" | "active" | string;

interface HistoryEntry {
  id: string;
  date: string;
  description: string;
  type: "purchase" | "payment";
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
  status: CustomerStatus;
  totalOwed: number;
  totalPaid: number;
  history?: HistoryEntry[];
}

// ─── Seed mock history for existing customers ─────────────────────────────────

function seedHistory(customers: Customer[]): Customer[] {
  const sampleHistory: HistoryEntry[][] = [
    [
      { id: "h1", date: "2025-03-01", type: "purchase", description: "Bag of rice × 2", amount: 54000 },
      { id: "h2", date: "2025-03-08", type: "payment", description: "Part payment", amount: 20000 },
      { id: "h3", date: "2025-03-20", type: "purchase", description: "Palm oil × 4 litres", amount: 16000 },
      { id: "h4", date: "2025-03-27", type: "payment", description: "Cash payment", amount: 15000 },
    ],
    [
      { id: "h5", date: "2025-02-14", type: "purchase", description: "Semovita × 5", amount: 37500 },
      { id: "h6", date: "2025-02-20", type: "payment", description: "Transfer", amount: 37500 },
    ],
    [
      { id: "h7", date: "2025-03-10", type: "purchase", description: "Tomatoes (crate)", amount: 22000 },
      { id: "h8", date: "2025-03-15", type: "purchase", description: "Beans × 1 bag", amount: 31000 },
      { id: "h9", date: "2025-03-25", type: "payment", description: "Partial payment", amount: 10000 },
    ],
  ];

  return customers.map((c, i) => ({
    ...c,
    history: c.history ?? sampleHistory[i % sampleHistory.length],
  }));
}

const initialCustomers: Customer[] = seedHistory(mockCustomers as Customer[]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);

  // form state
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [formError, setFormError] = useState("");

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  // ── Add customer ────────────────────────────────────────────────────────────

  function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Name and phone number are required.");
      return;
    }
    const newCustomer: Customer = {
      id: generateId(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      notes: form.notes.trim() || undefined,
      status: "active",
      totalOwed: 0,
      totalPaid: 0,
      history: [],
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setForm({ name: "", phone: "", address: "", notes: "" });
    setFormError("");
    setShowAddModal(false);
  }

  function handleCloseAddModal() {
    setShowAddModal(false);
    setForm({ name: "", phone: "", address: "", notes: "" });
    setFormError("");
  }

  // ── WhatsApp remind ─────────────────────────────────────────────────────────

  const sendWhatsApp = (name: string, phone: string, amount: number) => {
    const msg = encodeURIComponent(
      `Hello ${name}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(amount)}. Kindly make payment at your earliest convenience. Thank you.`
    );
    window.open(`https://wa.me/234${phone.replace(/^0/, "")}?text=${msg}`, "_blank");
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <TopBar title="Customers" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <p className="text-ink-500 text-sm flex-1">Manage your credit customers and their history</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto"
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 w-full sm:max-w-sm mb-6 focus-within:border-jade/40 transition-all">
          <Search size={15} className="text-ink-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full outline-none"
          />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total Customers", value: customers.length, color: "text-ink-700" },
            { label: "Active Debtors", value: customers.filter(c => c.status !== "cleared").length, color: "text-coral-600" },
            { label: "Fully Cleared", value: customers.filter(c => c.status === "cleared").length, color: "text-jade-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-ink-100 rounded-xl p-3 sm:p-4 text-center">
              <p className={`font-heading font-bold text-xl sm:text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-ink-400 text-[10px] sm:text-xs mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Customer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => {
            const sc = getStatusColor(customer.status);
            const progress = customer.totalOwed > 0 ? (customer.totalPaid / customer.totalOwed) * 100 : 100;
            const outstanding = customer.totalOwed - customer.totalPaid;

            return (
              <div key={customer.id} className="bg-white border border-ink-100 rounded-2xl p-5 card-hover group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-jade-600 text-base">
                        {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-ink-800 text-sm">{customer.name}</p>
                      <span className={`badge ${sc.bg} ${sc.text} text-[10px] mt-0.5`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot} mr-1`} />
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button className="text-ink-300 hover:text-ink-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={15} />
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

                {/* Debt info */}
                <div className="bg-ink-50 rounded-xl p-3 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-ink-500 text-xs">Outstanding</span>
                    <span className={`font-heading font-bold text-sm ${outstanding > 0 ? "text-coral-600" : "text-jade-600"}`}>
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

                {/* Actions */}
                <div className="flex gap-2">
                  {outstanding > 0 && (
                    <button
                      onClick={() => sendWhatsApp(customer.name, customer.phone, outstanding)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-jade/10 hover:bg-jade/20 text-jade font-semibold text-xs py-2.5 rounded-xl transition-colors"
                    >
                      <MessageSquare size={13} />
                      Remind
                    </button>
                  )}
                  <button
                    onClick={() => setHistoryCustomer(customer)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-ink-50 hover:bg-ink-100 text-ink-600 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    <TrendingUp size={13} />
                    View History
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
            <p className="font-heading font-semibold text-ink-600 text-lg">No customers found</p>
            <p className="text-ink-400 text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* ── Add Customer Modal ───────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 animate-fade-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-ink-900">Add New Customer</h2>
              <button
                onClick={handleCloseAddModal}
                className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <p className="text-coral-600 text-xs bg-coral-50 border border-coral-200 rounded-xl px-4 py-2.5 mb-4">
                {formError}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Full name *</label>
                <input
                  type="text"
                  placeholder="Adaeze Okonkwo"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Phone number *</label>
                <input
                  type="tel"
                  placeholder="0801 234 5678"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Address / Area (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Surulere, Lagos"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">Notes (optional)</label>
                <textarea
                  placeholder="Any notes about this customer..."
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomer}
                  className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg"
                >
                  Save Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View History Drawer/Modal ────────────────────────────────────────── */}
      {historyCustomer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col max-h-[90vh] animate-fade-up">

            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-ink-100 flex-shrink-0">
              <button
                onClick={() => setHistoryCustomer(null)}
                className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
              >
                <ArrowLeft size={15} />
              </button>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading font-bold text-jade-600 text-sm">
                    {historyCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-ink-900 text-base leading-tight truncate">{historyCustomer.name}</p>
                  <p className="text-ink-400 text-xs">{historyCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setHistoryCustomer(null)}
                className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Balance summary strip */}
            <div className="grid grid-cols-3 gap-3 px-6 py-4 bg-ink-50 border-b border-ink-100 flex-shrink-0">
              {[
                { label: "Total Owed", value: formatNaira(historyCustomer.totalOwed), color: "text-ink-700" },
                { label: "Total Paid", value: formatNaira(historyCustomer.totalPaid), color: "text-jade-600" },
                {
                  label: "Outstanding",
                  value: formatNaira(historyCustomer.totalOwed - historyCustomer.totalPaid),
                  color: historyCustomer.totalOwed - historyCustomer.totalPaid > 0 ? "text-coral-600" : "text-jade-600",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className={`font-heading font-bold text-sm sm:text-base ${item.color}`}>{item.value}</p>
                  <p className="text-ink-400 text-[10px] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {!historyCustomer.history || historyCustomer.history.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag size={22} className="text-ink-400" />
                  </div>
                  <p className="font-heading font-semibold text-ink-600">No transactions yet</p>
                  <p className="text-ink-400 text-sm mt-1">This customer has no recorded activity.</p>
                </div>
              ) : (
                <>
                  <p className="text-ink-400 text-xs font-medium uppercase tracking-wider mb-1">
                    {historyCustomer.history.length} Transaction{historyCustomer.history.length !== 1 ? "s" : ""}
                  </p>
                  {[...historyCustomer.history]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 bg-white border border-ink-100 rounded-xl px-4 py-3"
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          entry.type === "payment" ? "bg-jade/10" : "bg-coral-50"
                        }`}>
                          {entry.type === "payment"
                            ? <CheckCircle2 size={16} className="text-jade-600" />
                            : <CreditCard size={16} className="text-coral-500" />
                          }
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-ink-700 text-sm font-medium truncate">{entry.description}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Calendar size={10} className="text-ink-400" />
                            <span className="text-ink-400 text-xs">{formatDate(entry.date)}</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <p className={`font-heading font-bold text-sm ${
                            entry.type === "payment" ? "text-jade-600" : "text-coral-600"
                          }`}>
                            {entry.type === "payment" ? "+" : "-"}{formatNaira(entry.amount)}
                          </p>
                          <p className="text-ink-400 text-[10px]">
                            {entry.type === "payment" ? "Payment" : "Purchase"}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </>
              )}
            </div>

            {/* Footer close */}
            <div className="px-6 pb-6 pt-3 border-t border-ink-100 flex-shrink-0">
              <button
                onClick={() => setHistoryCustomer(null)}
                className="w-full bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}