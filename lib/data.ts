// Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalOwed: number;
  totalPaid: number;
  lastActivity: string;
  status: "active" | "cleared" | "overdue";
  createdAt: string;
}

export interface Evidence {
  id: string;
  name: string;
  type: "image" | "document";
  url: string;
  uploadedAt: string;
  note?: string;
}

export interface DebtRecord {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  amountPaid: number;
  dueDate?: string;
  createdAt: string;
  status: "pending" | "partial" | "cleared" | "overdue";
  payments: Payment[];
  evidences: Evidence[];
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

// Mock Data
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Adeola Bakare",
    phone: "08031234567",
    address: "Alimosho, Lagos",
    totalOwed: 45000,
    totalPaid: 12000,
    lastActivity: "2024-01-15",
    status: "overdue",
    createdAt: "2023-11-01",
  },
  {
    id: "c2",
    name: "Chukwuemeka Obi",
    phone: "07056789012",
    address: "Surulere, Lagos",
    totalOwed: 18500,
    totalPaid: 8500,
    lastActivity: "2024-01-20",
    status: "active",
    createdAt: "2023-12-05",
  },
  {
    id: "c3",
    name: "Fatima Al-Hassan",
    phone: "08123456789",
    address: "Kano, Kano State",
    totalOwed: 7200,
    totalPaid: 7200,
    lastActivity: "2024-01-18",
    status: "cleared",
    createdAt: "2023-10-15",
  },
  {
    id: "c4",
    name: "Blessing Eze",
    phone: "09087654321",
    address: "Enugu, Enugu State",
    totalOwed: 32000,
    totalPaid: 0,
    lastActivity: "2024-01-10",
    status: "overdue",
    createdAt: "2023-09-22",
  },
  {
    id: "c5",
    name: "Kayode Adeyemi",
    phone: "08076543210",
    address: "Ibadan, Oyo State",
    totalOwed: 9800,
    totalPaid: 5000,
    lastActivity: "2024-01-22",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: "c6",
    name: "Ngozi Okonkwo",
    phone: "08154321098",
    address: "Onitsha, Anambra",
    totalOwed: 55000,
    totalPaid: 20000,
    lastActivity: "2024-01-08",
    status: "overdue",
    createdAt: "2023-08-10",
  },
];

export const mockDebts: DebtRecord[] = [
  {
    id: "d1",
    customerId: "c1",
    customerName: "Adeola Bakare",
    description: "Agribusiness - Crops, livestock, fish, and farm inputs",
    amount: 45000,
    amountPaid: 12000,
    dueDate: "2026-01-10",
    createdAt: "2025-12-20",
    status: "overdue",
    payments: [
      { id: "p1", amount: 7000, date: "2025-12-28", note: "Cash payment" },
      { id: "p2", amount: 5000, date: "2026-01-05", note: "Transfer" }
    ],
    evidences: [],
  },
  {
    id: "d2",
    customerId: "c2",
    customerName: "Chukwuemeka Obi",
    description: "Agribusiness - Fertilizers, herbicides, pesticides, seeds, and farm tools",
    amount: 18500,
    amountPaid: 8500,
    dueDate: "2025-02-01",
    createdAt: "2026-01-05",
    status: "partial",
    payments: [
      { id: "p3", amount: 8500, date: "2025-01-15", note: "Part payment" }
    ],
    evidences: [],
  },
  {
    id: "d3",
    customerId: "c3",
    customerName: "Fatima Al-Hassan",
    description: "Agribusiness - Broilers, layers, eggs, and poultry feed",
    amount: 7200,
    amountPaid: 7200,
    dueDate: "2026-01-20",
    createdAt: "2026-01-01",
    status: "cleared",
    payments: [
      { id: "p4", amount: 3200, date: "2025-01-10", note: "First payment" },
      { id: "p5", amount: 4000, date: "2025-01-18", note: "Final payment" }
    ],
    evidences: [],
  },
  {
    id: "d4",
    customerId: "c4",
    customerName: "Toye Olajide",
    description: "Agribusiness - Catfish, tilapia, fingerlings, and fish feed",
    amount: 32000,
    amountPaid: 0,
    dueDate: "2026-01-05",
    createdAt: "2025-12-15",
    status: "overdue",
    payments: [],
    evidences: [],
  },
  {
    id: "d5",
    customerId: "c5",
    customerName: "Kayode Adeyemi",
    description: "Fertilizer - NPK 15-15-15, Urea, and Ammonium Sulfate",
    amount: 9800,
    amountPaid: 5000,
    dueDate: "2026-02-10",
    createdAt: "2026-01-10",
    status: "partial",
    payments: [
      { id: "p6", amount: 5000, date: "2026-01-20", note: "Cash" }
    ],
    evidences: [],
  },
  {
    id: "d6",
    customerId: "c6",
    customerName: "Hassan Mohammed",
    description: "Agribusiness - Goats, cattle, sheep, and animal feed",
    amount: 55000,
    amountPaid: 20000,
    dueDate: "2025-12-31",
    createdAt: "2025-11-30",
    status: "overdue",
    payments: [
      { id: "p7", amount: 10000, date: "2025-12-10", note: "Cash" },
      { id: "p8", amount: 10000, date: "2025-12-20", note: "Transfer" }
    ],
    evidences: [],
  },
];

export const dashboardStats = {
  totalOwed: 167500,
  overdueAmount: 132000,
  clearedThisMonth: 7200,
  totalCustomers: 6,
  activeDebts: 5,
  overdueCount: 3,
  recentActivity: [
    { type: "payment", customer: "Kayode Adeyemi", amount: 5000, date: "Jan 20" },
    { type: "new_debt", customer: "Chukwuemeka Obi", amount: 18500, date: "Jan 15" },
    { type: "cleared", customer: "Fatima Al-Hassan", amount: 7200, date: "Jan 18" },
    { type: "payment", customer: "Adeola Bakare", amount: 5000, date: "Jan 5" },
  ],
};

export const formatNaira = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getDaysOverdue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "overdue": return { bg: "bg-coral-50", text: "text-coral-600", dot: "bg-coral-500" };
    case "partial": return { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" };
    case "cleared": return { bg: "bg-jade-50", text: "text-jade-600", dot: "bg-jade-500" };
    case "active": return { bg: "bg-ink-100", text: "text-ink-500", dot: "bg-ink-400" };
    case "pending": return { bg: "bg-ink-100", text: "text-ink-500", dot: "bg-ink-400" };
    default: return { bg: "bg-ink-100", text: "text-ink-500", dot: "bg-ink-400" };
  }
};
