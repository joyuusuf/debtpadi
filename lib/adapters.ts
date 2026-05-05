// ─── lib/adapters.ts ─────────────────────────────────────────────────────────
// Converts backend API shapes → the DebtRecord shape that page.tsx already uses.
// This keeps the UI component untouched while we swap mock → real data.

import type { ApiDebt, ApiEvidence } from "./api";
import type { DebtRecord, Evidence } from "./data";

export function apiEvidenceToEvidence(ev: ApiEvidence): Evidence {
  return {
    id: ev.id,
    name: ev.name,
    type: ev.type,
    url: ev.url,
    uploadedAt: ev.uploadedAt,
    note: ev.note,
  };
}

export function apiDebtToDebtRecord(d: ApiDebt): DebtRecord {
  return {
    id: d._id,
    customerId: d.customer._id,
    customerName: d.customer.name,
    description: d.description,
    amount: d.amount,
    amountPaid: d.amountPaid,
    dueDate: d.dueDate,
    status: d.status,
    createdAt: d.createdAt.split("T")[0],
    payments: (d.payments ?? []).map((p) => ({
      amount: p.amount,
      note: p.note,
      recordedAt: p.recordedAt,
    })),
    evidences: (d.evidences ?? []).map(apiEvidenceToEvidence),
  };
}

export function debtRecordEvidencesToApi(evidences: Evidence[]): ApiEvidence[] {
  return evidences.map((ev) => ({
    id: ev.id,
    name: ev.name,
    type: ev.type,
    url: ev.url,
    uploadedAt: ev.uploadedAt,
    note: ev.note,
  }));
}
