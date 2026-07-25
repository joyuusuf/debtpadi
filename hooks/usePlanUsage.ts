"use client";
import { useState, useEffect, useCallback } from "react";
import { profile as profileApi } from "@/lib/api";

interface UsageData {
  plan: string;
  isPaid: boolean;
  planExpiresAt: string | null;
  customers: { used: number; limit: number | null; remaining: number | null };
  debts: { used: number; limit: number | null; remaining: number | null };
}

export function usePlanUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await profileApi.usage();
      setUsage(res.data as unknown as UsageData);
    } catch {
      // silently fail — features just won't show a limit badge
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const customersAtLimit = usage ? !usage.isPaid && (usage.customers.remaining ?? 1) <= 0 : false;
  const debtsAtLimit = usage ? !usage.isPaid && (usage.debts.remaining ?? 1) <= 0 : false;

  return { usage, loading, refresh, customersAtLimit, debtsAtLimit };
}
