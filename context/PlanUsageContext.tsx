"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { profile as profileApi } from "@/lib/api";

interface UsageData {
  plan: string;
  isPaid: boolean;
  planExpiresAt: string | null;
  customers: { used: number; limit: number | null; remaining: number | null };
  debts: { used: number; limit: number | null; remaining: number | null };
}

interface PlanUsageContextType {
  usage: UsageData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  customersAtLimit: boolean;
  debtsAtLimit: boolean;
}

const PlanUsageContext = createContext<PlanUsageContextType>({
  usage: null,
  loading: true,
  refresh: async () => {},
  customersAtLimit: false,
  debtsAtLimit: false,
});

export function PlanUsageProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await profileApi.usage();
      setUsage(res.data as unknown as UsageData);
    } catch {
      // silently fail — sidebar just won't show a limit badge
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const customersAtLimit = usage ? !usage.isPaid && (usage.customers.remaining ?? 1) <= 0 : false;
  const debtsAtLimit     = usage ? !usage.isPaid && (usage.debts.remaining     ?? 1) <= 0 : false;

  return (
    <PlanUsageContext.Provider value={{ usage, loading, refresh, customersAtLimit, debtsAtLimit }}>
      {children}
    </PlanUsageContext.Provider>
  );
}

export function usePlanUsage() {
  return useContext(PlanUsageContext);
}
