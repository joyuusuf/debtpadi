// ─── hooks/useDebts.ts ───────────────────────────────────────────────────────
// Drop-in hook that replaces the mock data + local state in page.tsx.
//
// Usage in page.tsx — replace the three lines:
//   const [debts, setDebts] = useState<DebtRecord[]>([]);
//   useEffect(() => { setTimeout(() => { setDebts(initialDebts); ... }) }, []);
//   function handleAdd / handleEdit / handleDelete / handleEvidenceUpdate
//
// With:
//   const { debts, loading, error, addDebt, editDebt, removeDebt, updateEvidences } = useDebts();

import { useState, useEffect, useCallback } from "react";
import { debts as debtsApi, customers as customersApi } from "@/lib/api";
import { apiDebtToDebtRecord, debtRecordEvidencesToApi } from "@/lib/adapters";
import type { DebtRecord, Evidence } from "@/lib/data";

// ── Form shape used by page.tsx DebtModal ─────────────────────────────────────
export interface DebtForm {
  customerName: string;
  phone: string;
  description: string;
  amount: string;
  amountPaid: string;
  dueDate: string;
}

interface UseDebtsReturn {
  debts: DebtRecord[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addDebt: (form: DebtForm) => Promise<void>;
  editDebt: (id: string, form: DebtForm) => Promise<void>;
  removeDebt: (id: string) => Promise<void>;
  updateEvidences: (debtId: string, evidences: Evidence[]) => Promise<void>;
}

export function useDebts(): UseDebtsReturn {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch all debts ─────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Trigger server-side overdue sweep silently on each load
      debtsApi.sweepOverdue().catch(() => {});

      const res = await debtsApi.list({ limit: 200 }); // load up to 200; add pagination later
      setDebts(res.data.map(apiDebtToDebtRecord));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load debts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ── Add a new debt ──────────────────────────────────────────────────────────
  // If customerName matches an existing customer we reuse their ID;
  // otherwise we create a new customer record first.
  const addDebt = useCallback(
    async (form: DebtForm) => {
      const amount = parseFloat(form.amount);
      const amountPaid = parseFloat(form.amountPaid) || 0;

      // 1. Resolve or create customer
      let customerId: string;
      const existing = debts.find(
        (d) =>
          d.customerName.toLowerCase() === form.customerName.trim().toLowerCase()
      );

      if (existing) {
        customerId = existing.customerId;
      } else {
        // Create a new customer — phone is required by backend validation
        const phone = form.phone.trim() || "00000000000"; // fallback if not provided
        const custRes = await customersApi.create({
          name: form.customerName.trim(),
          phone,
        });
        customerId = custRes.data._id;
      }

      // 2. Create the debt
      const dueDate =
        form.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]; // default 30 days

      const res = await debtsApi.create({
        customerId,
        description: form.description.trim(),
        amount,
        dueDate,
      });

      const newDebt = apiDebtToDebtRecord(res.data);

      // 3. If there was an initial payment, record it
      if (amountPaid > 0) {
        const payRes = await debtsApi.recordPayment(newDebt.id, {
          amount: amountPaid,
          note: "Initial payment recorded at creation",
        });
        setDebts((prev) => [apiDebtToDebtRecord(payRes.data), ...prev]);
      } else {
        setDebts((prev) => [newDebt, ...prev]);
      }
    },
    [debts]
  );

  // ── Edit an existing debt ───────────────────────────────────────────────────
  // Backend only allows description + dueDate edits.
  // Amount changes should go through recordPayment; we handle amountPaid delta here.
  const editDebt = useCallback(
    async (id: string, form: DebtForm) => {
      const current = debts.find((d) => d.id === id);
      if (!current) return;

      // Update description / dueDate
      await debtsApi.update(id, {
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
      });

      // If amountPaid increased, record the difference as a new payment
      const newAmountPaid = parseFloat(form.amountPaid) || 0;
      const delta = newAmountPaid - current.amountPaid;
      if (delta > 0) {
        const payRes = await debtsApi.recordPayment(id, {
          amount: delta,
          note: "Payment recorded via edit",
        });
        setDebts((prev) =>
          prev.map((d) => (d.id === id ? apiDebtToDebtRecord(payRes.data) : d))
        );
      } else {
        // Re-fetch the single debt to get updated state
        const getRes = await debtsApi.get(id);
        setDebts((prev) =>
          prev.map((d) => (d.id === id ? apiDebtToDebtRecord(getRes.data) : d))
        );
      }
    },
    [debts]
  );

  // ── Delete a debt ───────────────────────────────────────────────────────────
  const removeDebt = useCallback(async (id: string) => {
    await debtsApi.delete(id);
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ── Update evidences ────────────────────────────────────────────────────────
  // Persists the evidences array to the backend debt document.
  const updateEvidences = useCallback(
    async (debtId: string, evidences: Evidence[]) => {
      // Optimistic UI update first
      setDebts((prev) =>
        prev.map((d) => (d.id === debtId ? { ...d, evidences } : d))
      );
      // Persist to backend
      await debtsApi.updateEvidences(debtId, debitRecordEvidencesToApi(evidences));
    },
    []
  );

  // typo guard — re-export correct name
  function debitRecordEvidencesToApi(evidences: Evidence[]) {
    return debtRecordEvidencesToApi(evidences);
  }

  return { debts, loading, error, refresh, addDebt, editDebt, removeDebt, updateEvidences };
}
