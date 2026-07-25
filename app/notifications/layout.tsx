import Sidebar from "@/components/layout/Sidebar";
import { PlanUsageProvider } from "@/context/PlanUsageContext";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PlanUsageProvider>
      <div className="min-h-screen bg-ink-50">
        <Sidebar />
        <main className="md:ml-60">{children}</main>
      </div>
    </PlanUsageProvider>
  );
}
