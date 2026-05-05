// ─── lib/adapters.ts ─────────────────────────────────────────────────────────
// Maps between API response shapes (ApiDebt) and the frontend DebtRecord shape.

import type { ApiDebt, ApiEvidence } from './api';
import type { DebtRecord, Evidence } from './data';

export function apiDebtToDebtRecord(apiDebt: ApiDebt): DebtRecord {
  return {
    id: apiDebt._id,
    // customerId is needed by useDebts to reuse existing customers
    customerId: typeof apiDebt.customer === 'string'
      ? apiDebt.customer
      : apiDebt.customer._id,
    customerName: typeof apiDebt.customer === 'string'
      ? ''
      : apiDebt.customer.name,
    description: apiDebt.description,
    amount: apiDebt.amount,
    amountPaid: apiDebt.amountPaid,
    dueDate: apiDebt.dueDate
      ? new Date(apiDebt.dueDate).toISOString().split('T')[0]
      : undefined,
    status: apiDebt.status,
    payments: apiDebt.payments ?? [],
    evidences: (apiDebt.evidences ?? []).map(apiEvidenceToEvidence),
    createdAt: apiDebt.createdAt,
  };
}

export function apiEvidenceToEvidence(e: ApiEvidence): Evidence {
  return {
    id: e.id,
    name: e.name,
    type: e.type,
    url: e.url,
    uploadedAt: e.uploadedAt,
    note: e.note,
  };
}

export function debtRecordEvidencesToApi(evidences: Evidence[]): ApiEvidence[] {
  return evidences.map((e) => ({
    id: e.id,
    name: e.name,
    type: e.type,
    url: e.url,
    uploadedAt: e.uploadedAt,
    note: e.note,
  }));
}