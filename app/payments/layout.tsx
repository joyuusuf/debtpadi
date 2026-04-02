import Sidebar from "@/components/layout/Sidebar";

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar />
      <main className="md:ml-60">{children}</main>
    </div>
  );
}
