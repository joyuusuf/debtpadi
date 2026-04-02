"use client";
import { useState } from "react";
import { User, Bell, Shield, CreditCard, Smartphone, Save, ChevronRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
    { id: "app", label: "App Settings", icon: Smartphone },
  ];

  return (
    <>
      <TopBar title="Settings" />
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex gap-6">
          {/* Tabs */}
          <div className="hidden md:block w-52 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === t.id
                      ? "bg-ink-900 text-white"
                      : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile tabs */}
          <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-4 mb-2 flex-shrink-0">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === t.id ? "bg-ink-900 text-white" : "bg-white border border-ink-100 text-ink-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-6">
                <h2 className="font-heading font-bold text-xl text-ink-900 mb-6">Profile Information</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-jade flex items-center justify-center">
                    <span className="font-heading font-bold text-ink-900 text-2xl">MC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800">Titilayo Farms & Agro Supplies </p>
                    <p className="text-ink-400 text-sm">titilayo.farms@gmail.com</p>
                    <button className="text-jade text-sm font-medium mt-1 hover:text-jade-600 transition-colors">Change photo</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ink-600 text-sm font-medium mb-2">First name</label>
                      <input defaultValue="Titilayo" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-ink-600 text-sm font-medium mb-2">Last name</label>
                      <input defaultValue="Hamzat" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Email address</label>
                    <input defaultValue="titilayo.farms@gmail.com" type="email" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Phone number</label>
                    <input defaultValue="08031234567" type="tel" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Business name</label>
                    <input defaultValue="Titilayo Farms & Agro Supplies" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">Business location</label>
                    <input defaultValue="Ibadan, Oyo State" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                  </div>
                  <button className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg">
                    <Save size={15} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-6">
                <h2 className="font-heading font-bold text-xl text-ink-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Overdue debt alerts", desc: "Get notified when a debt becomes overdue", default: true },
                    { label: "Payment received", desc: "Notify when a customer makes a payment", default: true },
                    { label: "Weekly summary", desc: "Weekly report of your debt portfolio", default: false },
                    { label: "New customer added", desc: "Confirmation when you add a new customer", default: false },
                    { label: "Reminder nudges", desc: "Remind you to send WhatsApp reminders", default: true },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-ink-50 last:border-0">
                      <div>
                        <p className="font-medium text-ink-800 text-sm">{n.label}</p>
                        <p className="text-ink-400 text-xs mt-0.5">{n.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={n.default} />
                        <div className="w-10 h-5 bg-ink-200 peer-focus:ring-2 peer-focus:ring-jade/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jade" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-4">
                <div className="bg-white border border-ink-100 rounded-2xl p-6">
                  <h2 className="font-heading font-bold text-xl text-ink-900 mb-4">Current Plan</h2>
                  <div className="bg-ink-50 rounded-xl p-4 flex items-center justify-between mb-4">
                    <div>
                      <p className="font-heading font-semibold text-ink-800">Free Plan</p>
                      <p className="text-ink-400 text-sm">Up to 10 customers</p>
                    </div>
                    <span className="badge bg-ink-200 text-ink-600">Active</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-600">Customers used</span>
                      <span className="font-semibold text-ink-800">6 / 10</span>
                    </div>
                    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full bg-jade rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
                <div className="bg-jade/5 border border-jade/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-bold text-lg text-ink-900">Pro Plan</p>
                      <p className="text-jade font-bold text-2xl mt-1">₦3,500<span className="text-ink-400 font-normal text-sm">/month</span></p>
                      <ul className="mt-3 space-y-1">
                        {["Unlimited customers", "WhatsApp reminders", "PDF export", "Priority support"].map(f => (
                          <li key={f} className="text-sm text-ink-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-jade" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {(activeTab === "security" || activeTab === "app") && (
              <div className="bg-white border border-ink-100 rounded-2xl p-6">
                <h2 className="font-heading font-bold text-xl text-ink-900 mb-6">
                  {activeTab === "security" ? "Security Settings" : "App Settings"}
                </h2>
                <div className="space-y-3">
                  {(activeTab === "security" ? [
                    "Change password",
                    "Two-factor authentication",
                    "Active sessions",
                    "Delete account",
                  ] : [
                    "Currency display",
                    "Language",
                    "Date format",
                    "Offline data sync",
                    "Clear local cache",
                  ]).map((item, i) => (
                    <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-ink-100 hover:bg-ink-50 transition-colors text-left group">
                      <span className="text-ink-700 text-sm font-medium group-hover:text-ink-900">{item}</span>
                      <ChevronRight size={15} className="text-ink-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
