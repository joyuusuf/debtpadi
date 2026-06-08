// ─── lib/data.ts ─────────────────────────────────────────────────────────────
// Central data types, format helpers, and status utilities used across the app.

export type DebtStatus = "active" | "overdue" | "cleared" | "partial";

export interface Evidence {
  id: string;
  url: string;       // base64 data-url or remote URL
  name: string;
  type: string;      // MIME type
  size: number;      // bytes
  uploadedAt: string;
}

export interface Payment {
  _id?: string;
  amount: number;
  note?: string;
  recordedAt?: string;
  createdAt?: string;
}

export interface DebtRecord {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  description: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: DebtStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  evidences: Evidence[];
  payments: Payment[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getDaysOverdue(dueDate: string): number {
  return Math.floor(
    (Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getStatusColor(status: DebtStatus): string {
  switch (status) {
    case "cleared":
      return "text-jade bg-jade/10";
    case "overdue":
      return "text-coral-600 bg-coral-50";
    case "partial":
      return "text-amber-600 bg-amber-50";
    case "active":
    default:
      return "text-ink-600 bg-ink-100";
  }
}

export function getStatusLabel(status: DebtStatus): string {
  switch (status) {
    case "cleared":
      return "Cleared";
    case "overdue":
      return "Overdue";
    case "partial":
      return "Partial";
    case "active":
    default:
      return "Active";
  }
}

// ─── Minimal mock data (used by pages not yet connected to the API) ──────────
// These are placeholders so pages that still import mockDebts/mockCustomers
// compile without errors. Real data comes from the API hooks.

export const mockDebts: DebtRecord[] = [];

export const mockCustomers: {
  id: string;
  name: string;
  phone: string;
  totalOwed: number;
  totalPaid: number;
}[] = [];
