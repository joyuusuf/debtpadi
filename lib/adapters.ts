// ─── lib/adapters.ts ──────────────────────────────────────────────────────────
// Maps raw API debt/customer objects → typed frontend records, and vice-versa.

import type { DebtRecord, Evidence, DebtStatus, Payment } from "./data";

// ─── API → Frontend ───────────────────────────────────────────────────────────

function deriveStatus(
  amount: number,
  amountPaid: number,
  dueDate: string,
  rawStatus?: string
): DebtStatus {
  if (rawStatus === "cleared" || amountPaid >= amount) return "cleared";
  if (rawStatus === "overdue" || new Date(dueDate) < new Date()) return "overdue";
  if (amountPaid > 0) return "partial";
  return "active";
}

function apiEvidenceToEvidence(raw: Record<string, unknown>): Evidence {
  return {
    id: (raw._id ?? raw.id ?? Math.random().toString(36).slice(2)) as string,
    url: raw.url as string,
    name: (raw.name ?? "file") as string,
    type: (raw.type ?? "application/octet-stream") as string,
    size: (raw.size ?? 0) as number,
    uploadedAt: (raw.uploadedAt ?? raw.createdAt ?? new Date().toISOString()) as string,
  };
}

function apiPaymentToPayment(raw: Record<string, unknown>): Payment {
  return {
    _id: raw._id as string | undefined,
    amount: raw.amount as number,
    note: raw.note as string | undefined,
    recordedAt: raw.recordedAt as string | undefined,
    createdAt: raw.createdAt as string | undefined,
  };
}

export function apiDebtToDebtRecord(raw: Record<string, unknown>): DebtRecord {
  const amount = (raw.amount ?? 0) as number;
  const amountPaid = (raw.amountPaid ?? 0) as number;
  const balance = Math.max(0, amount - amountPaid);
  const dueDate = (raw.dueDate ?? raw.due_date ?? new Date().toISOString()) as string;

  const rawEvidences = (raw.evidences as Record<string, unknown>[]) ?? [];
  const rawPayments = (raw.payments as Record<string, unknown>[]) ?? [];

  // Backend populates customer as { _id, name, phone } object when using .populate()
  const customerObj = raw.customer as Record<string, unknown> | null;
  const customerId = (customerObj?._id ?? raw.customerId ?? raw.customer_id ?? raw.customer) as string;
  const customerName = (raw.customerName ?? raw.customer_name ?? customerObj?.name ?? "Unknown") as string;
  const phone = (raw.phone ?? raw.customerPhone ?? customerObj?.phone ?? "") as string;

  return {
    id: (raw._id ?? raw.id) as string,
    customerId,
    customerName,
    phone,
    description: (raw.description ?? "") as string,
    amount,
    amountPaid,
    balance,
    status: deriveStatus(amount, amountPaid, dueDate, raw.status as string),
    dueDate,
    createdAt: (raw.createdAt ?? raw.created_at ?? new Date().toISOString()) as string,
    updatedAt: (raw.updatedAt ?? raw.updated_at ?? new Date().toISOString()) as string,
    evidences: rawEvidences.map(apiEvidenceToEvidence),
    payments: rawPayments.map(apiPaymentToPayment),
  };
}

// ─── Frontend → API ───────────────────────────────────────────────────────────

export function debtRecordEvidencesToApi(evidences: Evidence[]) {
  return evidences.map((e) => ({
    url: e.url,
    name: e.name,
    type: e.type,
    size: e.size,
  }));
}
