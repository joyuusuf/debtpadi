// ─── hooks/useDebts.ts ───────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { debts as debtsApi, customers as customersApi } from "@/lib/api";
import { apiDebtToDebtRecord, debtRecordEvidencesToApi } from "@/lib/adapters";
import type { DebtRecord, Evidence } from "@/lib/data";

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
  recordPayment: (debtId: string, amount: number, note?: string) => Promise<void>;
}

const MAX_EVIDENCE_PAYLOAD_BYTES = 10 * 1024 * 1024;

function estimateEvidenceSize(evidences: Evidence[]): number {
  return evidences.reduce((sum, e) => sum + (e.url?.length ?? 0), 0);
}

export function useDebts(): UseDebtsReturn {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      debtsApi.sweepOverdue().catch(() => {});
      const res = await debtsApi.list({ limit: 200 });
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

  const addDebt = useCallback(
    async (form: DebtForm) => {
      const amount = parseFloat(form.amount);
      const amountPaid = parseFloat(form.amountPaid) || 0;

      let customerId: string;
      const existing = debts.find(
        (d) => d.customerName.toLowerCase() === form.customerName.trim().toLowerCase()
      );

      if (existing) {
        customerId = existing.customerId;
      } else {
        const phone = form.phone.trim() || "00000000000";
        const custRes = await customersApi.create({ name: form.customerName.trim(), phone });
        customerId = custRes.data._id;
      }

      const dueDate =
        form.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

      const res = await debtsApi.create({
        customerId,
        description: form.description.trim(),
        amount,
        dueDate,
      });

      const newDebt = apiDebtToDebtRecord(res.data);

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

  const editDebt = useCallback(
    async (id: string, form: DebtForm) => {
      const current = debts.find((d) => d.id === id);
      if (!current) return;

      await debtsApi.update(id, {
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
      });

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
        const getRes = await debtsApi.get(id);
        setDebts((prev) =>
          prev.map((d) => (d.id === id ? apiDebtToDebtRecord(getRes.data) : d))
        );
      }
    },
    [debts]
  );

  const removeDebt = useCallback(async (id: string) => {
    await debtsApi.delete(id);
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateEvidences = useCallback(async (debtId: string, evidences: Evidence[]) => {
    const estimatedSize = estimateEvidenceSize(evidences);
    if (estimatedSize > MAX_EVIDENCE_PAYLOAD_BYTES) {
      throw new Error(
        `Evidence files are too large (${(estimatedSize / 1024 / 1024).toFixed(1)}MB). ` +
        `Please use smaller images or fewer files.`
      );
    }

    // Optimistic update
    setDebts((prev) =>
      prev.map((d) => (d.id === debtId ? { ...d, evidences } : d))
    );

    // Persist — PUT /debts/:id with { evidences: [...] }
    const apiEvidences = debtRecordEvidencesToApi(evidences);
    const res = await debtsApi.updateEvidences(debtId, apiEvidences);

    // Sync back with server response
    const serverDebt = apiDebtToDebtRecord(res.data);
    setDebts((prev) =>
      prev.map((d) => (d.id === debtId ? serverDebt : d))
    );
  }, []);

  const recordPayment = useCallback(async (debtId: string, amount: number, note?: string) => {
    const res = await debtsApi.recordPayment(debtId, { amount, note });
    const updated = apiDebtToDebtRecord(res.data);
    setDebts((prev) => prev.map((d) => (d.id === debtId ? updated : d)));
  }, []);

  return {
    debts,
    loading,
    error,
    refresh,
    addDebt,
    editDebt,
    removeDebt,
    updateEvidences,
    recordPayment,
  };
}