// ─── lib/api.ts ──────────────────────────────────────────────────────────────
// Typed API client for DebtPadi backend.
// All methods read the JWT from localStorage (key: "debtpadi_token").
// Base URL is read from NEXT_PUBLIC_API_URL env var (default: /api).

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("debtpadi_token");
}

export function setToken(token: string) {
  localStorage.setItem("debtpadi_token", token);
}

export function clearToken() {
  localStorage.removeItem("debtpadi_token");
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Handle 401 globally — clear token and redirect to login
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorised");
  }

  const json = await res.json();

  if (!res.ok) {
    const message =
      Array.isArray(json?.error)
        ? json.error.join(", ")
        : json?.error ?? "Something went wrong";
    throw new Error(message);
  }

  return json as T;
}

// ── Types (mirrors backend responses) ────────────────────────────────────────

export interface ApiCustomer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  totalDebt: number;
  totalPaid: number;
}

export interface ApiPayment {
  amount: number;
  note?: string;
  recordedAt: string;
}

export interface ApiDebt {
  _id: string;
  customer: ApiCustomer;
  description: string;
  amount: number;
  amountPaid: number;
  dueDate?: string;
  status: "pending" | "partial" | "overdue" | "cleared";
  payments: ApiPayment[];
  evidences?: ApiEvidence[];
  createdAt: string;
}

export interface ApiEvidence {
  id: string;
  name: string;
  type: "image" | "document";
  url: string;
  uploadedAt: string;
  note?: string;
}

interface PaginatedDebts {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: ApiDebt[];
}

interface SingleDebt {
  success: boolean;
  data: ApiDebt;
}

interface AuthResponse {
  success: boolean;
  token: string;
  data: { name: string; email: string };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Customers ─────────────────────────────────────────────────────────────────

export const customers = {
  list: () =>
    apiFetch<{ success: boolean; data: ApiCustomer[] }>("/customers"),

  create: (body: { name: string; phone: string; email?: string }) =>
    apiFetch<{ success: boolean; data: ApiCustomer }>("/customers", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Debts ─────────────────────────────────────────────────────────────────────

export const debts = {
  /** Fetch paginated debt list, with optional status/customer filters */
  list: (params?: {
    status?: string;
    customerId?: string;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.customerId) qs.set("customerId", params.customerId);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<PaginatedDebts>(`/debts${query}`);
  },

  get: (id: string) => apiFetch<SingleDebt>(`/debts/${id}`),

  create: (body: {
    customerId: string;
    description: string;
    amount: number;
    dueDate: string;
  }) =>
    apiFetch<SingleDebt>("/debts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (
    id: string,
    body: Partial<{ description: string; dueDate: string }>
  ) =>
    apiFetch<SingleDebt>(`/debts/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/debts/${id}`, {
      method: "DELETE",
    }),

  /** Record a partial or full payment against a debt */
  recordPayment: (id: string, body: { amount: number; note?: string }) =>
    apiFetch<SingleDebt>(`/debts/${id}/pay`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** Trigger server-side overdue sweep */
  sweepOverdue: () =>
    apiFetch<{ success: boolean; message: string }>("/debts/sweep-overdue", {
      method: "POST",
    }),

  // ── Evidence (stored on the debt document) ─────────────────────────────────
  // The backend Debt model should have an `evidences` array field.
  // These helpers PATCH just the evidences array via the generic update route.
  // If you add a dedicated /debts/:id/evidences route later, swap these out.

  /** Replace the evidence array on a debt record */
  updateEvidences: (id: string, evidences: ApiEvidence[]) =>
    apiFetch<SingleDebt>(`/debts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ evidences }),
    }),
};
