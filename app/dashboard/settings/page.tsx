// "use client";
// import { useState, useRef, useEffect } from "react";
// import { User, Bell, Shield, CreditCard, Smartphone, ChevronRight, Upload, Eye } from "lucide-react";
// import TopBar from "@/components/layout/TopBar";

// /* ── Skeleton helper ───────────────────────────────────────── */
// function Skeleton({ className = "" }: { className?: string }) {
//   return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
// }

// /* ── Skeleton UI ───────────────────────────────────────────── */
// function SettingsSkeleton() {
//   return (
//     <>
//       <TopBar title="Settings" />
//       <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

//         {/* Mobile tab strip skeleton */}
//         <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Skeleton key={i} className="flex-shrink-0 w-24 h-8 rounded-lg" />
//           ))}
//         </div>

//         <div className="flex gap-6">

//           {/* Desktop sidebar skeleton */}
//           <div className="hidden md:block w-52 flex-shrink-0 space-y-1">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <Skeleton key={i} className="w-full h-10 rounded-xl" />
//             ))}
//           </div>

//           {/* Content panel skeleton — mirrors Profile tab (default) */}
//           <div className="flex-1 min-w-0">
//             <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">

//               {/* Section title */}
//               <Skeleton className="w-44 h-6 mb-6" />

//               {/* Avatar row */}
//               <div className="flex items-center gap-4 mb-8">
//                 <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0" />
//                 <div className="space-y-2">
//                   <Skeleton className="w-48 h-4" />
//                   <Skeleton className="w-36 h-3" />
//                 </div>
//               </div>

//               {/* Name fields row */}
//               <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <Skeleton className="w-20 h-3" />
//                   <Skeleton className="w-full h-11 rounded-xl" />
//                 </div>
//                 <div className="space-y-2">
//                   <Skeleton className="w-20 h-3" />
//                   <Skeleton className="w-full h-11 rounded-xl" />
//                 </div>
//               </div>

//               {/* Single-column fields */}
//               <div className="space-y-4">
//                 {Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="space-y-2">
//                     <Skeleton className="w-28 h-3" />
//                     <Skeleton className="w-full h-11 rounded-xl" />
//                   </div>
//                 ))}

//                 {/* Save button */}
//                 <Skeleton className="w-full sm:w-36 h-11 rounded-xl mt-2" />
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// /* ── Main Page ─────────────────────────────────────────────── */
// export default function SettingsPage() {
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("profile");
//   const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const avatarRef = useRef<HTMLDivElement>(null);

//   const tabs = [
//     { id: "profile", label: "Profile", icon: User },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "security", label: "Security", icon: Shield },
//     { id: "billing", label: "Billing & Plan", icon: CreditCard },
//     { id: "app", label: "App Settings", icon: Smartphone },
//   ];

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   if (loading) return <SettingsSkeleton />;

//   return (
//     <>
//       <TopBar title="Settings" />

//       <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

//         {/* ── Mobile horizontal tab strip (hidden on md+) ── */}
//         <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4 no-scrollbar">
//           {tabs.map(t => (
//             <button
//               key={t.id}
//               onClick={() => setActiveTab(t.id)}
//               className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
//                 activeTab === t.id
//                   ? "bg-ink-900 text-white"
//                   : "bg-white border border-ink-100 text-ink-500"
//               }`}
//             >
//               <t.icon size={13} />
//               {t.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex gap-6">

//           {/* ── Desktop sidebar (hidden below md) ── */}
//           <div className="hidden md:block w-52 flex-shrink-0">
//             <nav className="space-y-1">
//               {tabs.map(t => (
//                 <button
//                   key={t.id}
//                   onClick={() => setActiveTab(t.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
//                     activeTab === t.id
//                       ? "bg-ink-900 text-white"
//                       : "text-ink-500 hover:bg-ink-100 hover:text-ink-800"
//                   }`}
//                 >
//                   <t.icon size={15} />
//                   {t.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* ── Content panel ── */}
//           <div className="flex-1 min-w-0">

//             {/* PROFILE */}
//             {activeTab === "profile" && (
//               <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
//                 <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
//                   Profile Information
//                 </h2>

//                 {/* Avatar row */}
//                 <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 mb-6 sm:mb-8">
//                   <div className="relative flex-shrink-0" ref={avatarRef}>
//                     <button
//                       onClick={() => setMenuOpen(prev => !prev)}
//                       className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-jade flex items-center justify-center overflow-hidden border-2 border-transparent focus:border-jade transition-all"
//                     >
//                       {avatarSrc ? (
//                         <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
//                       ) : (
//                         <span className="font-heading font-bold text-ink-900 text-xl sm:text-2xl">TF</span>
//                       )}
//                     </button>

//                     {menuOpen && (
//                       <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-ink-200 rounded-xl overflow-hidden shadow-lg min-w-[176px]">
//                         <button
//                           onClick={() => { setMenuOpen(false); fileInputRef.current?.click(); }}
//                           className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50 transition-colors text-left"
//                         >
//                           <Upload size={14} />
//                           Change photo
//                         </button>
//                         <div className="h-px bg-ink-100" />
//                         <button
//                           onClick={() => { if (avatarSrc) { setMenuOpen(false); setLightboxOpen(true); } }}
//                           className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
//                             avatarSrc ? "text-ink-800 hover:bg-ink-50 cursor-pointer" : "text-ink-400 cursor-not-allowed opacity-50"
//                           }`}
//                         >
//                           <Eye size={14} />
//                           View photo
//                         </button>
//                       </div>
//                     )}

//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={e => {
//                         const file = e.target.files?.[0];
//                         if (!file) return;
//                         const reader = new FileReader();
//                         reader.onload = ev => setAvatarSrc(ev.target?.result as string);
//                         reader.readAsDataURL(file);
//                         e.target.value = "";
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p className="font-semibold text-ink-800 text-sm sm:text-base">Titilayo Farms &amp; Agro Supplies</p>
//                     <p className="text-ink-400 text-xs sm:text-sm">titilayo.farms@gmail.com</p>
//                   </div>
//                 </div>

//                 {lightboxOpen && (
//                   <div
//                     onClick={() => setLightboxOpen(false)}
//                     className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center cursor-zoom-out"
//                   >
//                     <img
//                       src={avatarSrc!}
//                       alt="Profile photo"
//                       className="max-w-[88vw] max-h-[88vh] rounded-2xl object-contain"
//                       onClick={e => e.stopPropagation()}
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">First name</label>
//                       <input defaultValue="Titilayo" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
//                     </div>
//                     <div>
//                       <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Last name</label>
//                       <input defaultValue="Hamzat" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
//                     </div>
//                   </div>

//                   {[
//                     { label: "Email address", value: "titilayo.farms@gmail.com", type: "email" },
//                     { label: "Phone number", value: "08031234567", type: "tel" },
//                     { label: "Business name", value: "Titilayo Farms & Agro Supplies", type: "text" },
//                     { label: "Business location", value: "Ibadan, Oyo State", type: "text" },
//                   ].map(({ label, value, type }) => (
//                     <div key={label}>
//                       <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">{label}</label>
//                       <input defaultValue={value} type={type} className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
//                     </div>
//                   ))}

//                   <button className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start">
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* NOTIFICATIONS */}
//             {activeTab === "notifications" && (
//               <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
//                 <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
//                   Notification Preferences
//                 </h2>
//                 <div className="space-y-1">
//                   {[
//                     { label: "Overdue debt alerts", desc: "Get notified when a debt becomes overdue", default: true },
//                     { label: "Payment received", desc: "Notify when a customer makes a payment", default: true },
//                     { label: "Weekly summary", desc: "Weekly report of your debt portfolio", default: false },
//                     { label: "New customer added", desc: "Confirmation when you add a new customer", default: false },
//                     { label: "Reminder nudges", desc: "Remind you to send WhatsApp reminders", default: true },
//                   ].map((n, i) => (
//                     <div key={i} className="flex items-center justify-between py-3.5 border-b border-ink-50 last:border-0 gap-4">
//                       <div className="min-w-0">
//                         <p className="font-medium text-ink-800 text-sm">{n.label}</p>
//                         <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">{n.desc}</p>
//                       </div>
//                       <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
//                         <input type="checkbox" className="sr-only peer" defaultChecked={n.default} />
//                         <div className="w-10 h-5 bg-ink-200 peer-focus:ring-2 peer-focus:ring-jade/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jade" />
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* BILLING */}
//             {activeTab === "billing" && (
//               <div className="space-y-4">
//                 <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
//                   <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-4">Current Plan</h2>
//                   <div className="bg-ink-50 rounded-xl p-3 sm:p-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4">
//                     <div>
//                       <p className="font-heading font-semibold text-ink-800">Free Plan</p>
//                       <p className="text-ink-400 text-sm">Up to 10 customers</p>
//                     </div>
//                     <span className="badge bg-ink-200 text-ink-600 flex-shrink-0">Active</span>
//                   </div>
//                   <div className="mb-2">
//                     <div className="flex justify-between text-sm mb-2">
//                       <span className="text-ink-600">Customers used</span>
//                       <span className="font-semibold text-ink-800">6 / 10</span>
//                     </div>
//                     <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-jade rounded-full" style={{ width: "60%" }} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-jade/5 border border-jade/20 rounded-2xl p-4 sm:p-6">
//                   <p className="font-heading font-bold text-lg text-ink-900">Pro Plan</p>
//                   <p className="text-jade font-bold text-2xl sm:text-3xl mt-1">
//                     ₦30000<span className="text-ink-400 font-normal text-sm">/month</span>
//                   </p>
//                   <ul className="mt-3 space-y-1.5">
//                     {["Unlimited customers", "WhatsApp reminders", "PDF export", "Priority support"].map(f => (
//                       <li key={f} className="text-sm text-ink-600 flex items-center gap-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
//                         {f}
//                       </li>
//                     ))}
//                   </ul>
//                   <button className="mt-4 w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg text-sm sm:text-base">
//                     Upgrade to Pro
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* SECURITY & APP */}
//             {(activeTab === "security" || activeTab === "app") && (
//               <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
//                 <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
//                   {activeTab === "security" ? "Security Settings" : "App Settings"}
//                 </h2>
//                 <div className="space-y-2 sm:space-y-3">
//                   {(activeTab === "security"
//                     ? ["Change password", "Two-factor authentication", "Active sessions", "Delete account"]
//                     : ["Currency display", "Language", "Date format", "Offline data sync", "Clear local cache"]
//                   ).map((item, i) => (
//                     <button
//                       key={i}
//                       className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-ink-100 hover:bg-ink-50 active:bg-ink-100 transition-colors text-left group"
//                     >
//                       <span className="text-ink-700 text-sm font-medium group-hover:text-ink-900">{item}</span>
//                       <ChevronRight size={15} className="text-ink-400 flex-shrink-0" />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useState, useRef, useEffect } from "react";
import { User, Bell, Shield, CreditCard, Smartphone, ChevronRight, Upload, Eye } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import { useAvatar } from "@/context/AvatarContext";

/* ── Skeleton helper ───────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink-100 rounded-lg ${className}`} />;
}

/* ── Skeleton UI ───────────────────────────────────────────── */
function SettingsSkeleton() {
  return (
    <>
      <TopBar title="Settings" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* Mobile tab strip skeleton */}
        <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-24 h-8 rounded-lg" />
          ))}
        </div>

        <div className="flex gap-6">

          {/* Desktop sidebar skeleton */}
          <div className="hidden md:block w-52 flex-shrink-0 space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-10 rounded-xl" />
            ))}
          </div>

          {/* Content panel skeleton — mirrors Profile tab (default) */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">

              {/* Section title */}
              <Skeleton className="w-44 h-6 mb-6" />

              {/* Avatar row */}
              <div className="flex items-center gap-4 mb-8">
                <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="w-48 h-4" />
                  <Skeleton className="w-36 h-3" />
                </div>
              </div>

              {/* Name fields row */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-full h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-full h-11 rounded-xl" />
                </div>
              </div>

              {/* Single-column fields */}
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="w-28 h-3" />
                    <Skeleton className="w-full h-11 rounded-xl" />
                  </div>
                ))}

                {/* Save button */}
                <Skeleton className="w-full sm:w-36 h-11 rounded-xl mt-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  // const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { avatar: avatarSrc, setAvatar: saveAvatar } = useAvatar();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
    { id: "app", label: "App Settings", icon: Smartphone },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   const saved = localStorage.getItem("debtpadi_avatar");
  //   if (saved) setAvatarSrc(saved);
  // }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return <SettingsSkeleton />;

  return (
    <>
      <TopBar title="Settings" />

      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">

        {/* ── Mobile horizontal tab strip (hidden on md+) ── */}
        <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-3 mb-4 no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.id
                  ? "bg-ink-900 text-white"
                  : "bg-white border border-ink-100 text-ink-500"
              }`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">

          {/* ── Desktop sidebar (hidden below md) ── */}
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

          {/* ── Content panel ── */}
          <div className="flex-1 min-w-0">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
                  Profile Information
                </h2>

                {/* Avatar row */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 mb-6 sm:mb-8">
                  <div className="relative flex-shrink-0" ref={avatarRef}>
                    <button
                      onClick={() => setMenuOpen(prev => !prev)}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-jade flex items-center justify-center overflow-hidden border-2 border-transparent focus:border-jade transition-all"
                    >
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-heading font-bold text-ink-900 text-xl sm:text-2xl">TF</span>
                      )}
                    </button>

                    {menuOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-ink-200 rounded-xl overflow-hidden shadow-lg min-w-[176px]">
                        <button
                          onClick={() => { setMenuOpen(false); fileInputRef.current?.click(); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-800 hover:bg-ink-50 transition-colors text-left"
                        >
                          <Upload size={14} />
                          Change photo
                        </button>
                        <div className="h-px bg-ink-100" />
                        <button
                          onClick={() => { if (avatarSrc) { setMenuOpen(false); setLightboxOpen(true); } }}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                            avatarSrc ? "text-ink-800 hover:bg-ink-50 cursor-pointer" : "text-ink-400 cursor-not-allowed opacity-50"
                          }`}
                        >
                          <Eye size={14} />
                          View photo
                        </button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
  saveAvatar(ev.target?.result as string);
};
                        reader.readAsDataURL(file);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-ink-800 text-sm sm:text-base">Titilayo Farms &amp; Agro Supplies</p>
                    <p className="text-ink-400 text-xs sm:text-sm">titilayo.farms@gmail.com</p>
                  </div>
                </div>

                {lightboxOpen && (
                  <div
                    onClick={() => setLightboxOpen(false)}
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center cursor-zoom-out"
                  >
                    <img
                      src={avatarSrc!}
                      alt="Profile photo"
                      className="max-w-[88vw] max-h-[88vh] rounded-2xl object-contain"
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">First name</label>
                      <input defaultValue="Titilayo" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Last name</label>
                      <input defaultValue="Hamzat" className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                  </div>

                  {[
                    { label: "Email address", value: "titilayo.farms@gmail.com", type: "email" },
                    { label: "Phone number", value: "08031234567", type: "tel" },
                    { label: "Business name", value: "Titilayo Farms & Agro Supplies", type: "text" },
                    { label: "Business location", value: "Ibadan, Oyo State", type: "text" },
                  ].map(({ label, value, type }) => (
                    <div key={label}>
                      <label className="block text-ink-600 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">{label}</label>
                      <input defaultValue={value} type={type} className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all" />
                    </div>
                  ))}

                  <button className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto justify-center sm:justify-start">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-1">
                  {[
                    { label: "Overdue debt alerts", desc: "Get notified when a debt becomes overdue", default: true },
                    { label: "Payment received", desc: "Notify when a customer makes a payment", default: true },
                    { label: "Weekly summary", desc: "Weekly report of your debt portfolio", default: false },
                    { label: "New customer added", desc: "Confirmation when you add a new customer", default: false },
                    { label: "Reminder nudges", desc: "Remind you to send WhatsApp reminders", default: true },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between py-3.5 border-b border-ink-50 last:border-0 gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-ink-800 text-sm">{n.label}</p>
                        <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">{n.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked={n.default} />
                        <div className="w-10 h-5 bg-ink-200 peer-focus:ring-2 peer-focus:ring-jade/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jade" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BILLING */}
            {activeTab === "billing" && (
              <div className="space-y-4">
                <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-4">Current Plan</h2>
                  <div className="bg-ink-50 rounded-xl p-3 sm:p-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="font-heading font-semibold text-ink-800">Free Plan</p>
                      <p className="text-ink-400 text-sm">Up to 10 customers</p>
                    </div>
                    <span className="badge bg-ink-200 text-ink-600 flex-shrink-0">Active</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-600">Customers used</span>
                      <span className="font-semibold text-ink-800">6 / 10</span>
                    </div>
                    <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div className="h-full bg-jade rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                </div>

                <div className="bg-jade/5 border border-jade/20 rounded-2xl p-4 sm:p-6">
                  <p className="font-heading font-bold text-lg text-ink-900">Pro Plan</p>
                  <p className="text-jade font-bold text-2xl sm:text-3xl mt-1">
                    ₦30000<span className="text-ink-400 font-normal text-sm">/month</span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {["Unlimited customers", "WhatsApp reminders", "PDF export", "Priority support"].map(f => (
                      <li key={f} className="text-sm text-ink-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-jade flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all hover:shadow-lg text-sm sm:text-base">
                    Upgrade to Pro
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY & APP */}
            {(activeTab === "security" || activeTab === "app") && (
              <div className="bg-white border border-ink-100 rounded-2xl p-4 sm:p-6">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-ink-900 mb-5 sm:mb-6">
                  {activeTab === "security" ? "Security Settings" : "App Settings"}
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {(activeTab === "security"
                    ? ["Change password", "Two-factor authentication", "Active sessions", "Delete account"]
                    : ["Currency display", "Language", "Date format", "Offline data sync", "Clear local cache"]
                  ).map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-ink-100 hover:bg-ink-50 active:bg-ink-100 transition-colors text-left group"
                    >
                      <span className="text-ink-700 text-sm font-medium group-hover:text-ink-900">{item}</span>
                      <ChevronRight size={15} className="text-ink-400 flex-shrink-0" />
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