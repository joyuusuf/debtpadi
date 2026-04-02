"use client";
import { useState } from "react";
import { Plus, Search, Phone, MapPin, MessageSquare, MoreVertical, TrendingUp } from "lucide-react";
import { mockCustomers, formatNaira, getStatusColor } from "@/lib/data";
import TopBar from "@/components/layout/TopBar";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const sendWhatsApp = (name: string, phone: string, amount: number) => {
    const msg = encodeURIComponent(
      `Hello ${name}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(amount)}. Kindly make payment at your earliest convenience. Thank you.`
    );
    window.open(`https://wa.me/234${phone.replace(/^0/, '')}?text=${msg}`, '_blank');
  };

  return (
    <>
      <TopBar title="Customers" />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <p className="text-ink-500 text-sm flex-1">Manage your credit customers and their history</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg flex-shrink-0"
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 max-w-sm mb-6 focus-within:border-jade/40 transition-all">
          <Search size={15} className="text-ink-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
          />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Customers", value: mockCustomers.length, color: "text-ink-700" },
            { label: "Active Debtors", value: mockCustomers.filter(c => c.status !== "cleared").length, color: "text-coral-600" },
            { label: "Fully Cleared", value: mockCustomers.filter(c => c.status === "cleared").length, color: "text-jade-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-ink-100 rounded-xl p-4 text-center">
              <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-ink-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Customer Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                    <span className={`font-heading font-bold text-sm ${outstanding > 0 ? 'text-coral-600' : 'text-jade-600'}`}>
                      {formatNaira(outstanding)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${customer.status === 'cleared' ? 'bg-jade' : progress > 60 ? 'bg-amber-400' : 'bg-coral-400'}`}
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
                  <button className="flex-1 flex items-center justify-center gap-1.5 bg-ink-50 hover:bg-ink-100 text-ink-600 font-semibold text-xs py-2.5 rounded-xl transition-colors">
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

        {/* Add Customer Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-ink-900">Add New Customer</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors text-lg">×</button>
              </div>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowModal(false); }}>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Full name *</label>
                  <input type="text" placeholder="Adaeze Okonkwo" required className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Phone number *</label>
                  <input type="tel" placeholder="0801 234 5678" required className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Address / Area (optional)</label>
                  <input type="text" placeholder="e.g. Surulere, Lagos" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">Notes (optional)</label>
                  <textarea placeholder="Any notes about this customer..." rows={2} className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg">Save Customer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
