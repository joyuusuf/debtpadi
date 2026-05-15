// ─── hooks/useCustomers.ts ────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CustomerStatus = "cleared" | "overdue" | "active" | "partial" | "pending";

export interface HistoryEntry {
  id: string;
  date: string;
  description: string;
  type: "purchase" | "payment";
  amount: number;
}

export interface Customer {
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

export interface CustomerForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("debtpadi_token") : null;
}

async function apiFetch<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

/** Derive a display status from raw totals — can be enriched later with real debt status. */
function deriveStatus(totalDebt: number, totalPaid: number): CustomerStatus {
  const balance = totalDebt - totalPaid;
  return balance <= 0 ? "cleared" : "active";
}

/** Map a raw API customer object to the frontend Customer shape. */
function apiCustomerToCustomer(raw: Record<string, unknown>): Customer {
  const totalOwed = (raw.totalDebt as number) ?? 0;
  const totalPaid = (raw.totalPaid as number) ?? 0;
  return {
    id: raw._id as string,
    name: raw.name as string,
    phone: raw.phone as string,
    address: (raw.address as string) || undefined,
    notes: (raw.notes as string) || undefined,
    status: deriveStatus(totalOwed, totalPaid),
    totalOwed,
    totalPaid,
  };
}

/**
 * Map an array of debt documents (from GET /customers/:id) into flat HistoryEntry[].
 * Each debt becomes a "purchase" entry; each payment inside a debt becomes a "payment" entry.
 */
function debtsToHistory(debts: Record<string, unknown>[]): HistoryEntry[] {
  const entries: HistoryEntry[] = [];

  for (const debt of debts) {
    // The purchase itself
    entries.push({
      id: `purchase-${debt._id}`,
      date: debt.createdAt as string,
      type: "purchase",
      description: debt.description as string,
      amount: debt.amount as number,
    });

    // Individual payments recorded against this debt
    const payments = (debt.payments as Record<string, unknown>[]) ?? [];
    for (const p of payments) {
      entries.push({
        id: `payment-${p._id ?? Math.random()}`,
        date: (p.recordedAt ?? p.createdAt) as string,
        type: "payment",
        description: (p.note as string) || "Payment received",
        amount: p.amount as number,
      });
    }
  }

  return entries;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addCustomer: (form: CustomerForm) => Promise<void>;
  removeCustomer: (id: string) => Promise<void>;
  fetchHistory: (customerId: string) => Promise<HistoryEntry[]>;
}

export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ data: Record<string, unknown>[] }>("/customers?limit=200");
      setCustomers(res.data.map(apiCustomerToCustomer));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCustomer = useCallback(async (form: CustomerForm) => {
    const res = await apiFetch<{ data: Record<string, unknown> }>("/customers", {
      method: "POST",
      body: JSON.stringify({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        notes: form.notes.trim() || undefined,
      }),
    });
    setCustomers((prev) => [apiCustomerToCustomer(res.data), ...prev]);
  }, []);

  const removeCustomer = useCallback(async (id: string) => {
    await apiFetch(`/customers/${id}`, { method: "DELETE" });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /**
   * Fetches a single customer + their debts and returns a flat HistoryEntry[].
   * Called on-demand when the user opens the history drawer.
   */
  const fetchHistory = useCallback(async (customerId: string): Promise<HistoryEntry[]> => {
    const res = await apiFetch<{ data: { customer: unknown; debts: Record<string, unknown>[] } }>(
      `/customers/${customerId}`
    );
    return debtsToHistory(res.data.debts ?? []);
  }, []);

  return { customers, loading, error, refresh, addCustomer, removeCustomer, fetchHistory };
}