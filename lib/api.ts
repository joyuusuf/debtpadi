// ─── lib/api.ts ───────────────────────────────────────────────────────────────
// Centralised API client for DebtPadi.
// All requests go to NEXT_PUBLIC_API_URL (e.g. http://localhost:5000/api).

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("debtpadi_token");
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json();

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("debtpadi_token");
      localStorage.removeItem("debtpadi_user");
      window.location.href = "/auth/signin";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }

  return data as ApiResponse<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    phone?: string;
  }) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: Record<string, unknown> }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  forgotPassword: (email: string) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (body: { token: string; password: string }) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyEmail: (token: string) =>
    request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    request("/auth/change-password", {  // backend alias: POST /auth/change-password
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ─── Profile / Settings ───────────────────────────────────────────────────────

export const profile = {
  get: () => request<Record<string, unknown>>("/users/me"),

  update: (body: {
    name?: string;
    businessName?: string;
    phone?: string;
    address?: string;
  }) =>
    request<Record<string, unknown>>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteAccount: (password: string) =>
    request("/users/me", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
};

// ─── Customers ────────────────────────────────────────────────────────────────

export const customers = {
  list: (params?: { limit?: number; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.page) q.set("page", String(params.page));
    return request<Record<string, unknown>[]>(`/customers?${q.toString()}`);
  },

  get: (id: string) =>
    request<{ customer: Record<string, unknown>; debts: Record<string, unknown>[] }>(
      `/customers/${id}`
    ),

  create: (body: { name: string; phone: string; address?: string; notes?: string }) =>
    request<Record<string, unknown>>("/customers", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (
    id: string,
    body: { name?: string; phone?: string; address?: string; notes?: string }
  ) =>
    request<Record<string, unknown>>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request(`/customers/${id}`, { method: "DELETE" }),
};

// ─── Debts ────────────────────────────────────────────────────────────────────

export const debts = {
  list: (params?: { limit?: number; page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.page) q.set("page", String(params.page));
    if (params?.status) q.set("status", params.status);
    return request<Record<string, unknown>[]>(`/debts?${q.toString()}`);
  },

  get: (id: string) => request<Record<string, unknown>>(`/debts/${id}`),

  create: (body: {
    customerId: string;
    description: string;
    amount: number;
    dueDate: string;
  }) =>
    request<Record<string, unknown>>("/debts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (
    id: string,
    body: { description?: string; dueDate?: string; amount?: number }
  ) =>
    request<Record<string, unknown>>(`/debts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (id: string) => request(`/debts/${id}`, { method: "DELETE" }),

  recordPayment: (
    id: string,
    body: { amount: number; note?: string; method?: string }
  ) =>
    request<Record<string, unknown>>(`/debts/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateEvidences: (
    id: string,
    evidences: { url: string; name: string; type: string; size: number }[]
  ) =>
    request<Record<string, unknown>>(`/debts/${id}/evidences`, {
      method: "PUT",
      body: JSON.stringify({ evidences }),
    }),

  sweepOverdue: () =>
    request("/debts/sweep-overdue", { method: "POST" }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboard = {
  stats: () => request<Record<string, unknown>>("/dashboard/stats"),
};

// ─── Reminders ────────────────────────────────────────────────────────────────

export const reminders = {
  sendWhatsapp: (body: {
    debtId: string;
    message: string;
    phone: string;
  }) =>
    request("/reminders/whatsapp", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
