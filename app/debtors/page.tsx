"use client";
import { useState, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  Phone,
  Paperclip,
  FileText,
  Upload,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowLeft,
  CreditCard,
  TrendingUp,
  Calendar,
  CircleDollarSign,
  History,
  Eye,
  Package,
  ShoppingCart,
  Banknote,
  Smartphone,
  Receipt,
  HelpCircle,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Toast } from "@/components/ui/Toast";
import {
  formatNaira,
  getDaysOverdue,
  getStatusColor,
  DebtRecord,
  Evidence,
} from "@/lib/data";
import TopBar from "@/components/layout/TopBar";
import PageSkeleton from "@/components/debtorsLayout/debtorsSkeleton";
import { useWhatsappReminder } from "@/components/aiReminder/aiReminder";
import { useDebts, type DebtForm } from "@/hooks/useDebts";
import { createPortal } from "react-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LineItem {
  id: string; // client-side only for key
  name: string;
  qty: number | string;
  unit: string;
  unitPrice: number | string;
}

export interface DebtFormV2 {
  customerName: string;
  phone: string;
  items: LineItem[];
  description: string; // optional override
  dueDate: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "transfer", label: "Bank Transfer", icon: Smartphone },
  { value: "pos", label: "POS", icon: CreditCard },
  { value: "cheque", label: "Cheque", icon: Receipt },
  { value: "other", label: "Other", icon: HelpCircle },
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number]["value"];

const EMPTY_ITEM = (): LineItem => ({
  id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  qty: 1,
  unit: "",
  unitPrice: "",
});

const EMPTY_FORM: DebtFormV2 = {
  customerName: "",
  phone: "",
  items: [EMPTY_ITEM()],
  description: "",
  dueDate: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcItemsTotal(items: LineItem[]): number {
  return items.reduce((sum, it) => {
    const q = parseFloat(String(it.qty)) || 0;
    const p = parseFloat(String(it.unitPrice)) || 0;
    return sum + q * p;
  }, 0);
}

function itemsToDescription(items: LineItem[]): string {
  return items
    .filter((it) => it.name.trim())
    .map((it) => {
      const q = it.qty ? `x${it.qty}` : "";
      const u = it.unit ? ` ${it.unit}` : "";
      return `${it.name.trim()} ${q}${u}`.trim();
    })
    .join(", ");
}

// ─── Portal ───────────────────────────────────────────────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Action dropdown ──────────────────────────────────────────────────────────

function ActionMenu({
  onPayment,
  onDetail,
  onDelete,
  onEvidence,
}: {
  onPayment: () => void;
  onDetail: () => void;
  onDelete: () => void;
  onEvidence: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [pos, setPos] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  }>({ right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function openMenu(e: React.MouseEvent) {
    e.stopPropagation();
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const right = window.innerWidth - rect.right;
    if (window.innerHeight - rect.bottom < 210) {
      setPos({ bottom: window.innerHeight - rect.top + 8, right });
    } else {
      setPos({ top: rect.bottom + 8, right });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      const h = (e: PointerEvent) => {
        if (
          !menuRef.current?.contains(e.target as Node) &&
          !triggerRef.current?.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("pointerdown", h);
      return () => document.removeEventListener("pointerdown", h);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  function pick(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <>
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={openMenu}
          className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 hover:text-ink-700 flex items-center justify-center transition-colors"
        >
          <MoreVertical size={15} />
        </button>
        {open && (
          <Portal>
            <div
              ref={menuRef}
              style={pos}
              className="fixed z-[9999] bg-white border border-ink-100 rounded-xl shadow-xl shadow-ink-900/15 w-52 py-1"
            >
              {[
                {
                  label: "View Details",
                  icon: Eye,
                  fn: onDetail,
                  cls: "text-ink-700 hover:bg-ink-50",
                },
                {
                  label: "Record Payment",
                  icon: CreditCard,
                  fn: onPayment,
                  cls: "text-ink-700 hover:bg-ink-50",
                },
                {
                  label: "View Evidence",
                  icon: Paperclip,
                  fn: onEvidence,
                  cls: "text-ink-700 hover:bg-ink-50",
                },
              ].map(({ label, icon: Icon, fn, cls }) => (
                <button
                  key={label}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => pick(fn)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors ${cls}`}
                >
                  <Icon size={14} className="text-ink-400" />
                  {label}
                </button>
              ))}
              <div className="mx-3 my-1 h-px bg-ink-100" />
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-coral-600 hover:bg-coral-50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </Portal>
        )}
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

// ─── Line item editor ─────────────────────────────────────────────────────────

function LineItemEditor({
  items,
  onChange,
}: {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}) {
  function updateItem(id: string, key: keyof LineItem, value: string | number) {
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }
  function addItem() {
    onChange([...items, EMPTY_ITEM()]);
  }
  function removeItem(id: string) {
    if (items.length === 1) return; // keep at least one row
    onChange(items.filter((it) => it.id !== id));
  }

  const total = calcItemsTotal(items);

  return (
    <div className="space-y-2">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_56px_72px_90px_28px] gap-1.5 px-1">
        {["Item", "Qty", "Unit", "Price (₦)", ""].map((h) => (
          <p
            key={h}
            className="text-[10px] font-semibold uppercase tracking-wide text-ink-400"
          >
            {h}
          </p>
        ))}
      </div>

      {items.map((item, idx) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_56px_72px_90px_28px] gap-1.5 items-center"
        >
          {/* Name */}
          <input
            type="text"
            required
            placeholder={`Item ${idx + 1}`}
            value={item.name}
            onChange={(e) => updateItem(item.id, "name", e.target.value)}
            className="w-full bg-ink-50 border border-ink-200 rounded-lg px-2.5 py-2 text-ink-700 text-sm focus:border-jade/50 focus:ring-1 focus:ring-jade/10 transition-all"
          />
          {/* Qty */}
          <input
            type="number"
            min={0.01}
            step="any"
            placeholder="1"
            value={item.qty}
            onChange={(e) => updateItem(item.id, "qty", e.target.value)}
            className="w-full bg-ink-50 border border-ink-200 rounded-lg px-2 py-2 text-ink-700 text-sm text-center focus:border-jade/50 focus:ring-1 focus:ring-jade/10 transition-all"
          />
          {/* Unit */}
          <input
            type="text"
            placeholder="kg/bag"
            value={item.unit}
            onChange={(e) => updateItem(item.id, "unit", e.target.value)}
            className="w-full bg-ink-50 border border-ink-200 rounded-lg px-2 py-2 text-ink-700 text-sm focus:border-jade/50 focus:ring-1 focus:ring-jade/10 transition-all"
          />
          {/* Unit price */}
          <input
            type="number"
            min={0}
            step="any"
            required
            placeholder="0"
            value={item.unitPrice}
            onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
            className="w-full bg-ink-50 border border-ink-200 rounded-lg px-2 py-2 text-ink-700 text-sm focus:border-jade/50 focus:ring-1 focus:ring-jade/10 transition-all"
          />
          {/* Remove */}
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            disabled={items.length === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-400 hover:text-coral-500 hover:bg-coral-50 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <X size={13} />
          </button>
        </div>
      ))}

      {/* Add row + running total */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs font-semibold text-jade-700 bg-jade/8 hover:bg-jade/15 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={12} /> Add item
        </button>
        {total > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-ink-400 uppercase tracking-wide">
              Total
            </p>
            <p className="font-heading font-bold text-ink-900 text-base">
              {formatNaira(total)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Payment method selector ──────────────────────────────────────────────────

function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {PAYMENT_METHODS.map(({ value: v, label, icon: Icon }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-center transition-all ${
            value === v
              ? "bg-ink-900 border-ink-900 text-white"
              : "bg-ink-50 border-ink-100 text-ink-500 hover:border-ink-300 hover:text-ink-700"
          }`}
        >
          <Icon size={15} />
          <span className="text-[10px] font-semibold leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Evidence lightbox ────────────────────────────────────────────────────────

function EvidenceLightbox({
  evidences,
  startIndex,
  onClose,
}: {
  evidences: Evidence[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const current = evidences[idx];

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && idx > 0) setIdx((i) => i - 1);
      if (e.key === "ArrowRight" && idx < evidences.length - 1)
        setIdx((i) => i + 1);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [idx, evidences.length, onClose]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[1100] bg-ink-900/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold text-sm">{current.name}</p>
              <p className="text-ink-400 text-xs">
                {idx + 1} of {evidences.length} ·{" "}
                {new Date(current.uploadedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={current.url}
                download={current.name}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Download size={16} />
              </a>
              <button
                onClick={onClose}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="bg-ink-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[60vh]">
            {current.type === "image" ? (
              <img
                src={current.url}
                alt={current.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 p-12 text-center">
                <div className="w-20 h-20 bg-ink-700 rounded-2xl flex items-center justify-center">
                  <FileText size={40} className="text-ink-400" />
                </div>
                <p className="text-white font-semibold">{current.name}</p>
                {current.note && (
                  <p className="text-ink-500 text-sm italic">
                    "{current.note}"
                  </p>
                )}
                <a
                  href={current.url}
                  download={current.name}
                  className="flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  <Download size={16} /> Download File
                </a>
              </div>
            )}
          </div>
          {current.note && current.type === "image" && (
            <p className="text-ink-400 text-sm text-center mt-3 italic">
              "{current.note}"
            </p>
          )}
          {evidences.length > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() =>
                  setIdx((i) => Math.min(evidences.length - 1, i + 1))
                }
                disabled={idx === evidences.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}

// ─── Evidence panel ───────────────────────────────────────────────────────────

function EvidencePanel({
  debt,
  onClose,
  onUpdate,
}: {
  debt: DebtRecord;
  onClose: () => void;
  onUpdate: (id: string, evidences: Evidence[]) => void;
}) {
  const [evidences, setEvidences] = useState<Evidence[]>(debt.evidences || []);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setUploading(true);
    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<Evidence>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) =>
              resolve({
                id: `ev${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
                name: file.name,
                type: file.type.startsWith("image/") ? "image" : "document",
                url: e.target?.result as string,
                uploadedAt: new Date().toISOString().split("T")[0],
              });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((newEvs) => {
      const updated = [...evidences, ...newEvs];
      setEvidences(updated);
      onUpdate(debt.id, updated);
      setUploading(false);
    });
  }

  function handleDelete(evId: string) {
    const updated = evidences.filter((e) => e.id !== evId);
    setEvidences(updated);
    onUpdate(debt.id, updated);
  }

  function saveNote(evId: string) {
    const updated = evidences.map((e) =>
      e.id === evId ? { ...e, note: noteText } : e,
    );
    setEvidences(updated);
    onUpdate(debt.id, updated);
    setNoteFor(null);
    setNoteText("");
  }

  return (
    <>
      <Portal>
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="font-heading font-bold text-lg text-ink-900">
                  Debt Evidence
                </h2>
                <p className="text-ink-400 text-xs mt-0.5 truncate">
                  {debt.customerName} · {debt.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-amber-700 text-xs font-semibold uppercase tracking-wide mb-1">
                  What is debt evidence?
                </p>
                <p className="text-amber-700/80 text-xs leading-relaxed">
                  Upload receipts, photos of goods delivered, written
                  agreements, or screenshots of payment conversations. This
                  protects you in case of disputes.
                </p>
              </div>

              <div>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div
                  className="border-2 border-dashed border-ink-200 hover:border-jade/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-jade/[0.02] group"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                >
                  <div className="w-12 h-12 bg-ink-100 group-hover:bg-jade/10 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                    <Upload
                      size={22}
                      className="text-ink-400 group-hover:text-jade transition-colors"
                    />
                  </div>
                  <p className="font-semibold text-ink-700 text-sm group-hover:text-ink-900">
                    {uploading
                      ? "Uploading..."
                      : "Tap to upload or drag & drop"}
                  </p>
                  <p className="text-ink-400 text-xs mt-1">
                    Photos, PDFs, Word docs · Multiple files allowed
                  </p>
                </div>
              </div>

              {evidences.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Paperclip size={22} className="text-ink-400" />
                  </div>
                  <p className="text-ink-500 text-sm font-medium">
                    No evidence uploaded yet
                  </p>
                  <p className="text-ink-400 text-xs mt-1">
                    Upload a receipt or photo to protect yourself from disputes
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-ink-500 text-xs font-semibold uppercase tracking-wide mb-3">
                    {evidences.length} file{evidences.length !== 1 ? "s" : ""}{" "}
                    uploaded
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {evidences.map((ev, i) => (
                      <div
                        key={ev.id}
                        className="group relative bg-ink-50 border border-ink-100 rounded-xl overflow-hidden"
                      >
                        {ev.type === "image" ? (
                          <div
                            className="aspect-square bg-ink-100 overflow-hidden cursor-pointer"
                            onClick={() => setLightboxIdx(i)}
                          >
                            <img
                              src={ev.url}
                              alt={ev.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : (
                          <div
                            className="aspect-square bg-ink-100 flex flex-col items-center justify-center gap-2 cursor-pointer"
                            onClick={() => setLightboxIdx(i)}
                          >
                            <FileText size={28} className="text-ink-400" />
                            <p className="text-ink-500 text-[10px] text-center px-2 truncate w-full">
                              {ev.name}
                            </p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/50 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => setLightboxIdx(i)}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-jade hover:text-ink-900 text-ink-700 transition-all"
                          >
                            <ZoomIn size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setNoteFor(ev.id);
                              setNoteText(ev.note || "");
                            }}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-amber-50 text-ink-700 transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-coral-50 text-coral-500 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="px-2 py-1.5">
                          <p className="text-ink-600 text-[10px] truncate font-medium">
                            {ev.name}
                          </p>
                          {ev.note && (
                            <p className="text-ink-400 text-[9px] truncate italic">
                              "{ev.note}"
                            </p>
                          )}
                          <p className="text-ink-300 text-[9px] mt-0.5">
                            {ev.uploadedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      className="aspect-square bg-ink-50 border-2 border-dashed border-ink-200 hover:border-jade/50 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all hover:bg-jade/5"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Plus size={20} className="text-ink-400" />
                      <p className="text-ink-400 text-[10px] font-medium">
                        Add more
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {noteFor && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-700 text-sm font-semibold mb-2">
                    Add a note to this file
                  </p>
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. Receipt from Jan 15 delivery"
                    autoFocus
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm mb-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNoteFor(null)}
                      className="flex-1 border border-amber-200 text-amber-700 font-semibold py-2 rounded-xl text-sm hover:bg-amber-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveNote(noteFor)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-ink-100 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Portal>
      {lightboxIdx !== null && (
        <EvidenceLightbox
          evidences={evidences}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

// ─── Reminder modal ───────────────────────────────────────────────────────────

function ReminderModal({
  debt,
  onClose,
}: {
  debt: DebtRecord;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const evCount = debt.evidences?.length || 0;
  const daysOverdue = debt.dueDate ? getDaysOverdue(debt.dueDate) : 0;
  const defaultMsg = `Hello ${debt.customerName}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(outstanding)} with us. Kindly make payment at your earliest convenience. Thank you.`;
  const [msg, setMsg] = useState(defaultMsg);
  const {
    generate,
    message: aiMessage,
    loading: aiLoading,
  } = useWhatsappReminder();

  useEffect(() => {
    if (aiMessage) setMsg(aiMessage);
  }, [aiMessage]);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg text-ink-900">
                Send Reminder
              </h2>
              <p className="text-ink-400 text-xs mt-0.5">
                To{" "}
                <span className="font-semibold text-ink-600">
                  {debt.customerName}
                </span>{" "}
                · {formatNaira(outstanding)} outstanding
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {evCount > 0 ? (
              <div className="bg-jade/5 border border-jade/20 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-jade/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Paperclip size={15} className="text-jade" />
                </div>
                <div>
                  <p className="text-jade-700 text-sm font-semibold">
                    {evCount} evidence file{evCount !== 1 ? "s" : ""} attached
                  </p>
                  <p className="text-jade-700/70 text-xs mt-0.5 leading-relaxed">
                    Evidence is saved and will be linked automatically.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-ink-50 border border-ink-100 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 bg-ink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Paperclip size={15} className="text-ink-400" />
                </div>
                <div>
                  <p className="text-ink-600 text-sm font-semibold">
                    No evidence uploaded
                  </p>
                  <p className="text-ink-400 text-xs mt-0.5 leading-relaxed">
                    Upload a receipt or photo to this debt record first.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-ink-600 text-sm font-medium">Message</p>
              <button
                onClick={() =>
                  generate({
                    customerName: debt.customerName,
                    amountOwed: outstanding,
                    daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
                    businessName: "DebtPadi",
                  })
                }
                disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs bg-jade/10 hover:bg-jade/20 text-jade-700 font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <svg
                      className="animate-spin w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>✦ AI Generate</>
                )}
              </button>
            </div>
            <div>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none"
              />
              <p className="text-ink-400 text-xs mt-1.5">
                {msg.length} characters · Edit freely before sending
              </p>
            </div>
            <div>
              <p className="text-ink-600 text-sm font-medium mb-3">Send via</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(msg)}`,
                      "_blank",
                    );
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 py-4 px-3 rounded-xl transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-ink-800">WhatsApp</p>
                    <p className="text-[10px] text-ink-500 mt-0.5">
                      Opens WhatsApp
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    window.open(
                      `sms:?body=${encodeURIComponent(msg)}`,
                      "_blank",
                    );
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 bg-ink-50 hover:bg-ink-100 border border-ink-200 hover:border-ink-300 py-4 px-3 rounded-xl transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 bg-ink-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-ink-800">SMS</p>
                    <p className="text-[10px] text-ink-500 mt-0.5">
                      Opens messages app
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Delete modal ─────────────────────────────────────────────────────────────

function DeleteModal({
  debt,
  onConfirm,
  onCancel,
}: {
  debt: DebtRecord;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-up">
          <div className="w-12 h-12 bg-coral-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-coral-500" />
          </div>
          <h2 className="font-heading font-bold text-xl text-ink-900 text-center mb-2">
            Delete this debt?
          </h2>
          <p className="text-ink-500 text-sm text-center mb-1">
            <span className="font-semibold text-ink-700">
              {debt.customerName}
            </span>{" "}
            — {debt.description}
          </p>
          <p className="text-coral-500 font-bold text-center mb-2">
            {formatNaira(debt.amount)}
          </p>
          <p className="text-ink-400 text-xs text-center mb-6">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Record Payment modal (with method + optional evidence) ───────────────────

function RecordPaymentModal({
  debt,
  onSave,
  onClose,
}: {
  debt: DebtRecord;
  onSave: (
    amount: number,
    method: PaymentMethod,
    note: string,
    evidenceFile?: File,
  ) => Promise<void>;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [note, setNote] = useState("");
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const quickAmounts = [
    outstanding * 0.25,
    outstanding * 0.5,
    outstanding * 0.75,
    outstanding,
  ].filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (val > outstanding + 0.001) {
      setError(
        `Amount exceeds outstanding balance of ${formatNaira(outstanding)}`,
      );
      return;
    }
    setSaving(true);
    try {
      await onSave(val, method, note, evidenceFile ?? undefined);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg text-ink-900">
                Record Payment
              </h2>
              <p className="text-ink-400 text-xs mt-0.5">
                {debt.customerName} · {formatNaira(outstanding)} outstanding
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <form
              id="payment-form"
              onSubmit={handleSubmit}
              className="px-5 py-4 space-y-4"
            >
              {/* Amount */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Amount received (₦) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={outstanding}
                  step="0.01"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-lg font-bold focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {quickAmounts.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAmount(String(Math.round(q)))}
                      className="text-xs bg-ink-100 hover:bg-jade/10 hover:text-jade-700 text-ink-600 font-medium px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {i === quickAmounts.length - 1
                        ? "Full"
                        : `${[25, 50, 75][i]}%`}{" "}
                      — {formatNaira(Math.round(q))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Payment method
                </label>
                <PaymentMethodSelector value={method} onChange={setMethod} />
              </div>

              {/* Transfer evidence upload — only shown for transfer */}
              {method === "transfer" && (
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Transfer screenshot{" "}
                    <span className="text-ink-400 font-normal">(optional)</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) =>
                      setEvidenceFile(e.target.files?.[0] ?? null)
                    }
                  />
                  {evidenceFile ? (
                    <div className="flex items-center gap-3 bg-jade/5 border border-jade/20 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-jade/10 flex items-center justify-center flex-shrink-0">
                        {evidenceFile.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(evidenceFile)}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <FileText size={18} className="text-jade" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-800 truncate">
                          {evidenceFile.name}
                        </p>
                        <p className="text-xs text-ink-400">
                          {(evidenceFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEvidenceFile(null)}
                        className="w-7 h-7 rounded-lg bg-coral-50 hover:bg-coral-100 text-coral-500 flex items-center justify-center transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-ink-200 hover:border-jade/50 rounded-xl py-4 flex flex-col items-center gap-1.5 text-ink-400 hover:text-jade transition-all group"
                    >
                      <Upload
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="text-xs font-medium">
                        Upload screenshot or PDF
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Note{" "}
                  <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash payment, bank transfer ref..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
              </div>

              {error && (
                <p className="text-coral-500 text-sm font-medium flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  {error}
                </p>
              )}
            </form>
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-ink-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="payment-form"
              disabled={saving}
              className="flex-[2] bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Record Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Debt Detail panel ────────────────────────────────────────────────────────

function DebtDetailPanel({
  debt,
  onClose,
  onPayment,
  onEvidence,
  onReminder,
}: {
  debt: DebtRecord;
  onClose: () => void;
  onPayment: () => void;
  onEvidence: () => void;
  onReminder: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const progress = debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0;
  const sc = getStatusColor(debt.status);
  const daysOverdue =
    debt.status === "overdue" ? getDaysOverdue(debt.dueDate || "") : 0;
  const evCount = debt.evidences?.length || 0;
  const payments = (debt as any).payments || [];
  const items: any[] = (debt as any).items || [];

  const methodIcon: Record<string, React.ReactNode> = {
    cash: <Banknote size={12} />,
    transfer: <Smartphone size={12} />,
    pos: <CreditCard size={12} />,
    cheque: <Receipt size={12} />,
    other: <HelpCircle size={12} />,
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[94vh] flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg text-ink-900 truncate">
                {debt.customerName}
              </h2>
              <p className="text-ink-400 text-xs truncate">
                {debt.description}
              </p>
            </div>
            <span className={`badge ${sc.bg} ${sc.text} flex-shrink-0`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`} />
              {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
            </span>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
            {/* Summary card */}
            <div className="bg-ink-900 rounded-2xl p-5 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-ink-400 text-xs font-medium uppercase tracking-wide">
                    Outstanding
                  </p>
                  <p className="font-heading font-bold text-3xl mt-1">
                    {formatNaira(outstanding)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-ink-400 text-xs">Total debt</p>
                  <p className="font-semibold text-ink-200">
                    {formatNaira(debt.amount)}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink-400">
                    {formatNaira(debt.amountPaid)} paid
                  </span>
                  <span className="text-ink-300">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${debt.status === "cleared" ? "bg-jade" : progress > 50 ? "bg-amber-400" : "bg-coral-400"}`}
                    style={{ width: `${Math.max(progress, 2)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Items bought */}
            {items.length > 0 && (
              <div>
                <h3 className="font-heading font-semibold text-ink-800 flex items-center gap-2 mb-3">
                  <ShoppingCart size={15} className="text-jade" /> Items
                  Purchased
                </h3>
                <div className="bg-ink-50 rounded-xl overflow-hidden border border-ink-100">
                  <div className="grid grid-cols-[1fr_48px_64px_80px] gap-2 px-4 py-2 border-b border-ink-100">
                    {["Item", "Qty", "Unit", "Price"].map((h) => (
                      <p
                        key={h}
                        className="text-[10px] font-semibold uppercase tracking-wide text-ink-400"
                      >
                        {h}
                      </p>
                    ))}
                  </div>
                  {items.map((it: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_48px_64px_80px] gap-2 px-4 py-2.5 border-b border-ink-50 last:border-0"
                    >
                      <p className="text-ink-700 text-sm font-medium truncate">
                        {it.name}
                      </p>
                      <p className="text-ink-500 text-sm text-center">
                        {it.qty}
                      </p>
                      <p className="text-ink-400 text-sm">{it.unit || "—"}</p>
                      <p className="text-ink-700 text-sm font-semibold">
                        {formatNaira(it.unitPrice)}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-2.5 bg-ink-100/50">
                    <p className="text-ink-500 text-xs font-semibold uppercase tracking-wide">
                      Total
                    </p>
                    <p className="font-heading font-bold text-ink-900 text-sm">
                      {formatNaira(debt.amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-ink-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={13} className="text-ink-400" />
                  <p className="text-ink-400 text-xs font-medium">Created</p>
                </div>
                <p className="text-ink-700 text-sm font-semibold">
                  {new Date(debt.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div
                className={`rounded-xl p-3.5 ${daysOverdue > 0 ? "bg-coral-50" : "bg-ink-50"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock
                    size={13}
                    className={
                      daysOverdue > 0 ? "text-coral-400" : "text-ink-400"
                    }
                  />
                  <p
                    className={`text-xs font-medium ${daysOverdue > 0 ? "text-coral-400" : "text-ink-400"}`}
                  >
                    Due date
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${daysOverdue > 0 ? "text-coral-600" : "text-ink-700"}`}
                >
                  {debt.dueDate
                    ? new Date(debt.dueDate).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                  {daysOverdue > 0 && (
                    <span className="ml-1 text-xs font-normal">
                      ({daysOverdue}d late)
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-ink-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <History size={13} className="text-ink-400" />
                  <p className="text-ink-400 text-xs font-medium">
                    Payments made
                  </p>
                </div>
                <p className="text-ink-700 text-sm font-semibold">
                  {payments.length} payment{payments.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="bg-ink-50 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Paperclip size={13} className="text-ink-400" />
                  <p className="text-ink-400 text-xs font-medium">Evidence</p>
                </div>
                <p className="text-ink-700 text-sm font-semibold">
                  {evCount} file{evCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Payment history */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-ink-800 flex items-center gap-2">
                  <TrendingUp size={15} className="text-jade" />
                  Payment History
                </h3>
                {debt.status !== "cleared" && (
                  <button
                    onClick={onPayment}
                    className="text-xs bg-jade/10 hover:bg-jade/20 text-jade-700 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Add Payment
                  </button>
                )}
              </div>
              {payments.length === 0 ? (
                <div className="bg-ink-50 rounded-xl p-5 text-center">
                  <CircleDollarSign
                    size={24}
                    className="text-ink-300 mx-auto mb-2"
                  />
                  <p className="text-ink-500 text-sm">
                    No payments recorded yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...payments].reverse().map((p: any, i: number) => (
                    <div key={i} className="bg-ink-50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-ink-800 text-sm font-semibold">
                            {formatNaira(p.amount)}
                          </p>
                          {p.method && (
                            <span className="inline-flex items-center gap-1 bg-ink-100 text-ink-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize">
                              {methodIcon[p.method]}
                              {p.method}
                            </span>
                          )}
                        </div>
                        <p className="text-ink-400 text-xs">
                          {new Date(p.recordedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {p.note && (
                        <p className="text-ink-400 text-xs mt-0.5 italic">
                          {p.note}
                        </p>
                      )}
                      {/* Payment evidence thumbnail */}
                      {p.evidence?.url && (
                        <a
                          href={p.evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 bg-jade/5 hover:bg-jade/10 border border-jade/15 rounded-lg px-2.5 py-1.5 transition-colors w-fit"
                        >
                          {p.evidence.type === "image" ? (
                            <img
                              src={p.evidence.url}
                              alt=""
                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <FileText
                              size={16}
                              className="text-jade flex-shrink-0"
                            />
                          )}
                          <span className="text-jade-700 text-xs font-medium truncate max-w-[140px]">
                            {p.evidence.name}
                          </span>
                          <Download
                            size={11}
                            className="text-jade-500 flex-shrink-0 ml-auto"
                          />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-ink-100 flex-shrink-0 space-y-2.5">
            {debt.status !== "cleared" && (
              <button
                onClick={onPayment}
                className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={16} /> Record Payment
              </button>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {debt.status !== "cleared" && (
                <button
                  onClick={onReminder}
                  className="flex items-center justify-center gap-2 bg-ink-100 hover:bg-ink-200 text-ink-700 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  <MessageSquare size={15} /> Send Reminder
                </button>
              )}
              <button
                onClick={onEvidence}
                className={`flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl transition-colors text-sm ${evCount > 0 ? "bg-amber-50 hover:bg-amber-100 text-amber-700" : "bg-ink-100 hover:bg-ink-200 text-ink-700"} ${debt.status === "cleared" ? "col-span-2" : ""}`}
              >
                <Paperclip size={15} /> Evidence{" "}
                {evCount > 0 ? `(${evCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Add Debt modal ───────────────────────────────────────────────────────────

function DebtModal({
  initial,
  existingCustomers,
  onSave,
  onClose,
}: {
  initial: DebtFormV2;
  existingCustomers: string[];
  onSave: (data: DebtFormV2) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DebtFormV2>(initial);
  const [useExisting, setUseExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const total = calcItemsTotal(form.items);

  function update<K extends keyof DebtFormV2>(k: K, v: DebtFormV2[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (total <= 0) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <h2 className="font-heading font-bold text-lg text-ink-900">
              Add Debt Record
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4">
            <form id="debt-form" className="space-y-5" onSubmit={handleSubmit}>
              {/* Customer */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Customer *
                </label>
                {existingCustomers.length > 0 && (
                  <div className="flex gap-2 p-1 bg-ink-100 rounded-xl mb-3">
                    {["new", "existing"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setUseExisting(t === "existing")}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${(useExisting ? "existing" : "new") === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
                      >
                        {t === "new" ? "New customer" : "Existing customer"}
                      </button>
                    ))}
                  </div>
                )}
                {useExisting ? (
                  <select
                    required
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  >
                    <option value="">Choose a customer...</option>
                    {existingCustomers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={form.customerName}
                        onChange={(e) => update("customerName", e.target.value)}
                        className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2 flex items-center gap-1.5">
                  <Package size={13} className="text-ink-400" />
                  Items Purchased *
                </label>
                <LineItemEditor
                  items={form.items}
                  onChange={(items) => update("items", items)}
                />
                {total > 0 && (
                  <div className="mt-3 bg-jade/5 border border-jade/15 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <p className="text-jade-700 text-sm font-medium">
                      Total debt amount
                    </p>
                    <p className="font-heading font-bold text-jade-800 text-lg">
                      {formatNaira(total)}
                    </p>
                  </div>
                )}
              </div>

              {/* Due date */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Due date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
              </div>

              {/* Optional note */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Note{" "}
                  <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any extra info about this debt..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none"
                />
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-ink-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="debt-form"
              disabled={saving || total <= 0}
              className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Save Debt · {formatNaira(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DebtorsPage() {
  const {
    debts,
    loading,
    error,
    addDebt,
    removeDebt,
    updateEvidences,
    recordPayment,
  } = useDebts();

  const [filter, setFilter] = useState<
    "all" | "overdue" | "partial" | "cleared" | "pending"
  >("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null);
  const [reminderDebt, setReminderDebt] = useState<DebtRecord | null>(null);
  const [evidenceDebt, setEvidenceDebt] = useState<DebtRecord | null>(null);
  const [paymentDebt, setPaymentDebt] = useState<DebtRecord | null>(null);
  const [detailDebt, setDetailDebt] = useState<DebtRecord | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Debounce search input — 250 ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Client-side filter + search (works immediately; hook can also pass `search` to API)
  const filtered = useMemo(() => {
    return debts.filter((d) => {
      const matchesFilter = filter === "all" || d.status === filter;
      if (!matchesFilter) return false;
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      const itemsText = ((d as any).items || [])
        .map((it: any) => it.name)
        .join(" ")
        .toLowerCase();
      return (
        d.customerName.toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q) ||
        itemsText.includes(q)
      );
    });
  }, [debts, filter, debouncedSearch]);

  const existingCustomers = useMemo(
    () => [...new Set(debts.map((d) => d.customerName))],
    [debts],
  );

  const counts = useMemo(
    () => ({
      all: debts.length,
      overdue: debts.filter((d) => d.status === "overdue").length,
      partial: debts.filter((d) => d.status === "partial").length,
      cleared: debts.filter((d) => d.status === "cleared").length,
      pending: debts.filter((d) => d.status === "pending").length,
    }),
    [debts],
  );

  if (loading) return <PageSkeleton />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertTriangle size={32} className="text-coral-400" />
        <p className="font-heading font-semibold text-ink-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-jade underline"
        >
          Reload
        </button>
      </div>
    );

  async function handleAdd(form: DebtFormV2) {
    try {
      setActionError(null);
      // Map DebtFormV2 → whatever your useDebts.addDebt expects
      await addDebt({
        customerName: form.customerName,
        phone: form.phone,
        description: form.description || itemsToDescription(form.items),
        items: form.items.map((it) => ({
          name: it.name,
          qty: parseFloat(String(it.qty)),
          unit: it.unit,
          unitPrice: parseFloat(String(it.unitPrice)),
        })),
        amount: String(calcItemsTotal(form.items)),
        amountPaid: "0",
        dueDate: form.dueDate,
      } as any);
      setAddOpen(false);
      setToast({ message: "Debt record added", type: "success" });
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to add debt");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setActionError(null);
      await removeDebt(deleteTarget.id);
      setDeleteTarget(null);
      setToast({ message: "Debt deleted", type: "success" });
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete debt",
      );
    }
  }

  async function handleRecordPayment(
    amount: number,
    method: PaymentMethod,
    note: string,
    evidenceFile?: File,
  ) {
    if (!paymentDebt) return;
    await recordPayment(paymentDebt.id, amount, note, method, evidenceFile);
    if (detailDebt?.id === paymentDebt.id) {
      const updated = debts.find((d) => d.id === paymentDebt.id);
      if (updated) setDetailDebt(updated);
    }
    setToast({ message: "Payment recorded", type: "success" });
  }

  async function handleEvidenceUpdate(debtId: string, evidences: Evidence[]) {
    try {
      await updateEvidences(debtId, evidences);
      if (evidenceDebt?.id === debtId)
        setEvidenceDebt((p) => (p ? { ...p, evidences } : p));
      if (detailDebt?.id === debtId)
        setDetailDebt((p) => (p ? { ...p, evidences } : p));
    } catch (err) {
      console.error("Evidence sync failed:", err);
    }
  }

  function EvidenceBadge({ count }: { count: number }) {
    if (count === 0) return null;
    return (
      <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100">
        <Paperclip size={9} />
        {count}
      </span>
    );
  }

  return (
    <>
      <TopBar title="Debtors" />
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {actionError && (
          <div className="mb-4 flex items-center gap-3 bg-coral-50 border border-coral-200 text-coral-700 text-sm font-medium px-4 py-3 rounded-xl">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span className="flex-1">{actionError}</span>
            <button
              onClick={() => setActionError(null)}
              className="text-coral-400 hover:text-coral-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto"
          >
            <Plus size={16} />
            Add Debt Record
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 mb-4 focus-within:border-jade/40 focus-within:ring-2 focus-within:ring-jade/10 transition-all">
          <Search size={15} className="text-ink-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, item, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-ink-400 hover:text-ink-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-5"
          style={{ scrollbarWidth: "none" }}
        >
          {(["all", "overdue", "partial", "pending", "cleared"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? "bg-ink-900 text-white" : "bg-white border border-ink-100 text-ink-500 hover:border-ink-200 hover:text-ink-700"}`}
              >
                {f === "all" ? "All" : f}
                <span
                  className={`ml-1.5 text-xs font-bold ${filter === f ? "opacity-70" : "opacity-50"}`}
                >
                  {counts[f]}
                </span>
              </button>
            ),
          )}
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  {[
                    "Customer",
                    "Items",
                    "Amount",
                    "Progress",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((debt) => {
                  const sc = getStatusColor(debt.status);
                  const progress =
                    debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0;
                  const daysOverdue =
                    debt.status === "overdue"
                      ? getDaysOverdue(debt.dueDate || "")
                      : 0;
                  const items: any[] = (debt as any).items || [];
                  return (
                    <tr
                      key={debt.id}
                      className="table-row-hover cursor-pointer"
                      onClick={() => setDetailDebt(debt)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-heading font-bold text-jade-600 text-sm">
                              {debt.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-ink-800 text-sm">
                                {debt.customerName}
                              </p>
                              <EvidenceBadge
                                count={debt.evidences?.length || 0}
                              />
                            </div>
                            <p className="text-ink-400 text-xs">
                              {new Date(debt.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {items.length > 0 ? (
                          <div>
                            <p className="text-ink-700 text-sm font-medium truncate max-w-[160px]">
                              {items[0].name}
                            </p>
                            {items.length > 1 && (
                              <p className="text-ink-400 text-xs">
                                +{items.length - 1} more item
                                {items.length > 2 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-ink-500 text-sm truncate max-w-[160px]">
                            {debt.description}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-heading font-bold text-ink-900">
                          {formatNaira(debt.amount)}
                        </p>
                        {debt.amountPaid > 0 && (
                          <p className="text-jade-600 text-xs">
                            {formatNaira(debt.amountPaid)} paid
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-ink-400">
                              {Math.round(progress)}%
                            </span>
                            {daysOverdue > 0 && (
                              <span className="text-coral-500 font-medium">
                                {daysOverdue}d late
                              </span>
                            )}
                          </div>
                          <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${debt.status === "cleared" ? "bg-jade" : progress > 50 ? "bg-amber-400" : "bg-coral-400"}`}
                              style={{ width: `${Math.max(progress, 3)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${sc.bg} ${sc.text}`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`}
                          />
                          {debt.status.charAt(0).toUpperCase() +
                            debt.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5">
                          {debt.status !== "cleared" && (
                            <button
                              onClick={() => setReminderDebt(debt)}
                              className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                              title="Send reminder"
                            >
                              <MessageSquare size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => setEvidenceDebt(debt)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${(debt.evidences?.length || 0) > 0 ? "bg-amber-50 hover:bg-amber-100 text-amber-500" : "bg-ink-50 hover:bg-ink-100 text-ink-400"}`}
                            title="Evidence"
                          >
                            <Paperclip size={14} />
                          </button>
                          <ActionMenu
                            onPayment={() => setPaymentDebt(debt)}
                            onDetail={() => setDetailDebt(debt)}
                            onDelete={() => setDeleteTarget(debt)}
                            onEvidence={() => setEvidenceDebt(debt)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-ink-400" />
              </div>
              <p className="font-heading font-semibold text-ink-600 text-lg">
                {debouncedSearch ? "No results found" : "No debts found"}
              </p>
              <p className="text-ink-400 text-sm mt-1">
                {debouncedSearch
                  ? `Nothing matched "${debouncedSearch}"`
                  : "Try adjusting your filter"}
              </p>
            </div>
          )}
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="sm:hidden space-y-3">
          {filtered.map((debt) => {
            const sc = getStatusColor(debt.status);
            const progress =
              debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0;
            const daysOverdue =
              debt.status === "overdue"
                ? getDaysOverdue(debt.dueDate || "")
                : 0;
            const outstanding = debt.amount - debt.amountPaid;
            const evCount = debt.evidences?.length || 0;
            const items: any[] = (debt as any).items || [];
            return (
              <div
                key={debt.id}
                className="bg-white border border-ink-100 rounded-2xl p-4"
                onClick={() => setDetailDebt(debt)}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-jade/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-jade-600 text-sm">
                        {debt.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-heading font-semibold text-ink-800 text-sm truncate">
                          {debt.customerName}
                        </p>
                        {evCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100">
                            <Paperclip size={8} />
                            {evCount}
                          </span>
                        )}
                      </div>
                      {/* Item summary on mobile */}
                      {items.length > 0 ? (
                        <p className="text-ink-400 text-xs truncate">
                          {items[0].name}
                          {items.length > 1 ? ` +${items.length - 1} more` : ""}
                        </p>
                      ) : (
                        <p className="text-ink-400 text-xs truncate">
                          {debt.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {debt.status !== "cleared" && (
                      <button
                        onClick={() => setReminderDebt(debt)}
                        className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                      >
                        <MessageSquare size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setPaymentDebt(debt)}
                      className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 flex items-center justify-center transition-colors"
                    >
                      <CreditCard size={14} />
                    </button>
                    <ActionMenu
                      onPayment={() => setPaymentDebt(debt)}
                      onDetail={() => setDetailDebt(debt)}
                      onDelete={() => setDeleteTarget(debt)}
                      onEvidence={() => setEvidenceDebt(debt)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-ink-900 text-lg leading-none">
                      {formatNaira(outstanding)}
                    </p>
                    <p className="text-ink-400 text-xs mt-0.5">
                      outstanding of {formatNaira(debt.amount)}
                    </p>
                  </div>
                  <span className={`badge ${sc.bg} ${sc.text}`}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-1.5`}
                    />
                    {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                    {daysOverdue > 0 && (
                      <span className="ml-1 opacity-75">· {daysOverdue}d</span>
                    )}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-400">
                      {formatNaira(debt.amountPaid)} paid
                    </span>
                    <span className="text-ink-500 font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${debt.status === "cleared" ? "bg-jade" : progress > 50 ? "bg-amber-400" : "bg-coral-400"}`}
                      style={{ width: `${Math.max(progress, 3)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-ink-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock size={22} className="text-ink-400" />
              </div>
              <p className="font-heading font-semibold text-ink-600">
                {debouncedSearch ? "No results found" : "No debts found"}
              </p>
              <p className="text-ink-400 text-sm mt-1">
                {debouncedSearch
                  ? `Nothing matched "${debouncedSearch}"`
                  : "Try adjusting your filter"}
              </p>
            </div>
          )}
        </div>

        {/* ── MODALS ── */}
        {addOpen && (
          <DebtModal
            initial={EMPTY_FORM}
            existingCustomers={existingCustomers}
            onSave={handleAdd}
            onClose={() => setAddOpen(false)}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            debt={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
        {reminderDebt && (
          <ReminderModal
            debt={reminderDebt}
            onClose={() => setReminderDebt(null)}
          />
        )}
        {evidenceDebt && (
          <EvidencePanel
            debt={evidenceDebt}
            onClose={() => setEvidenceDebt(null)}
            onUpdate={handleEvidenceUpdate}
          />
        )}
        {paymentDebt && (
          <RecordPaymentModal
            debt={paymentDebt}
            onSave={handleRecordPayment}
            onClose={() => setPaymentDebt(null)}
          />
        )}
        {detailDebt && (
          <DebtDetailPanel
            debt={detailDebt}
            onClose={() => setDetailDebt(null)}
            onPayment={() => {
              setPaymentDebt(detailDebt);
              setDetailDebt(null);
            }}
            onEvidence={() => {
              setEvidenceDebt(detailDebt);
              setDetailDebt(null);
            }}
            onReminder={() => {
              setReminderDebt(detailDebt);
              setDetailDebt(null);
            }}
          />
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
