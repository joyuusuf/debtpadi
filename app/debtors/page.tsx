"use client";
import { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  MoreVertical,
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
  ShoppingCart,
  Receipt,
  Check,
  Pencil,
  Loader2,
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
import { usePlanUsage } from "@/hooks/usePlanUsage";
import { UpgradeModal } from "@/components/ui/UpgradeModal";
import { createPortal } from "react-dom";

const EMPTY_FORM: DebtForm = {
  customerName: "",
  phone: "",
  description: "",
  amount: "",
  amountPaid: "",
  dueDate: "",
};

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "transfer", label: "Bank Transfer" },
  { value: "pos", label: "POS" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

// ─── Portal ───────────────────────────────────────────────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
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
  );
}

// ─── Action menu ──────────────────────────────────────────────────────────────

function ActionMenu({
  onPayment,
  onDetail,
  onDelete,
  onEvidence,
  onEdit,
}: {
  onPayment: () => void;
  onDetail: () => void;
  onDelete: () => void;
  onEvidence: () => void;
  onEdit: () => void;
}) {
  const [open, setOpen] = useState(false);
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
    const r = triggerRef.current.getBoundingClientRect();
    const right = window.innerWidth - r.right;
    if (window.innerHeight - r.bottom < 210) {
      setPos({ bottom: window.innerHeight - r.top + 8, right });
    } else {
      setPos({ top: r.bottom + 8, right });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function h(e: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    const id = window.setTimeout(
      () => document.addEventListener("pointerdown", h),
      0,
    );
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", h);
    };
  }, [open]);

  function pick(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
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
            className="fixed z-[9999] bg-white border border-ink-100 rounded-xl shadow-xl shadow-ink-900/15 w-52 py-1"
            style={pos}
          >
            {[
              {
                icon: <Eye size={14} className="text-ink-400" />,
                label: "View Details",
                fn: onDetail,
                style: "text-ink-700 hover:bg-ink-50",
              },
              {
                icon: <Pencil size={14} className="text-jade" />,
                label: "Edit Debtor Info",
                fn: onEdit,
                style: "text-jade hover:bg-jade/5",
              },
              {
                icon: <CreditCard size={14} className="text-ink-400" />,
                label: "Record Payment",
                fn: onPayment,
                style: "text-ink-700 hover:bg-ink-50",
              },
              {
                icon: <Paperclip size={14} className="text-ink-400" />,
                label: "View Evidence",
                fn: onEvidence,
                style: "text-ink-700 hover:bg-ink-50",
              },
            ].map((item) => (
              <button
                key={item.label}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => pick(item.fn)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium ${item.style} transition-colors`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <div className="mx-3 my-1 h-px bg-ink-100" />
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => pick(onDelete)}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-coral-600 hover:bg-coral-50 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </Portal>
      )}
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
  const cur = evidences[idx];

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
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white font-semibold text-sm">{cur.name}</p>
              <p className="text-ink-400 text-xs">
                {idx + 1} / {evidences.length} ·{" "}
                {new Date(cur.uploadedAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={cur.url}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                title="Open in new tab"
              >
                <Eye size={16} />
              </a>
              <a
                href={cur.url}
                download={cur.name}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                title="Download"
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

          {/* Viewer */}
          <div className="bg-ink-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[60vh]">
            {cur.type === "image" ? (
              <img
                src={cur.url}
                alt={cur.name}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 p-12 text-center">
                <div className="w-20 h-20 bg-ink-700 rounded-2xl flex items-center justify-center">
                  <FileText size={40} className="text-ink-400" />
                </div>
                <p className="text-white font-semibold">{cur.name}</p>
                {cur.note && (
                  <p className="text-ink-500 text-sm italic">"{cur.note}"</p>
                )}
                <div className="flex gap-3">
                  <a
                    href={cur.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl"
                  >
                    <Eye size={16} /> Preview
                  </a>
                  <a
                    href={cur.url}
                    download={cur.name}
                    className="flex items-center gap-2 bg-jade hover:bg-jade-400 text-ink-900 font-bold px-5 py-2.5 rounded-xl"
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              </div>
            )}
          </div>

          {cur.note && cur.type === "image" && (
            <p className="text-ink-400 text-sm text-center mt-3 italic">
              "{cur.note}"
            </p>
          )}

          {/* Download bar for images */}
          {cur.type === "image" && (
            <div className="flex justify-center mt-3 gap-3">
              <a
                href={cur.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 bg-white/10 rounded-lg transition-colors"
              >
                <Eye size={12} /> Open full size
              </a>
              <a
                href={cur.url}
                download={cur.name}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white px-3 py-1.5 bg-white/10 rounded-lg transition-colors"
              >
                <Download size={12} /> Download
              </a>
            </div>
          )}

          {evidences.length > 1 && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() =>
                  setIdx((i) => Math.min(evidences.length - 1, i + 1))
                }
                disabled={idx === evidences.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30"
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
  onUpload,
}: {
  debt: DebtRecord;
  onClose: () => void;
  onUpload: (evidences: Evidence[]) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const existing = debt.evidences || [];
  const maxMore = 5 - existing.length;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    setFiles((prev) => [...prev, ...dropped].slice(0, maxMore));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const sel = Array.from(e.target.files || []).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    setFiles((prev) => [...prev, ...sel].slice(0, maxMore));
    e.target.value = "";
  }

  async function uploadFiles() {
    if (!files.length) {
      setToast({ message: "Select files first", type: "error" });
      return;
    }
    setUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("debtId", debt.id);
    fd.append("customerName", debt.customerName);
    try {
      const token = localStorage.getItem("debtpadi_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/debts/${debt.id}/evidence`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );
      const data = await res.json();
      if (data.success) {
        setToast({
          message: `${data.uploaded} file${data.uploaded !== 1 ? "s" : ""} uploaded!`,
          type: "success",
        });
        onUpload(data.evidences);
        setTimeout(onClose, 1200);
      } else {
        setToast({ message: data.message || "Upload failed", type: "error" });
      }
    } catch {
      setToast({ message: "Upload failed — check connection", type: "error" });
    } finally {
      setUploading(false);
      setFiles([]);
    }
  }

  return (
    <>
      <Portal>
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
              <div>
                <h2 className="font-heading font-bold text-lg text-ink-900">
                  Evidence ({existing.length + files.length}/5)
                </h2>
                <p className="text-ink-400 text-xs mt-0.5">
                  {debt.customerName} ·{" "}
                  {formatNaira(debt.amount - debt.amountPaid)} owed
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Existing files with view + download */}
              {existing.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                    Uploaded Files
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {existing.map((ev, i) => (
                      <div
                        key={ev.id}
                        className="relative group rounded-xl overflow-hidden border border-ink-100 bg-ink-50"
                      >
                        {ev.type === "image" ? (
                          <button
                            onClick={() => setLightboxIdx(i)}
                            className="w-full h-24 block overflow-hidden"
                          >
                            <img
                              src={ev.url}
                              alt={ev.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/30 flex items-center justify-center transition-all">
                              <ZoomIn
                                size={20}
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                          </button>
                        ) : (
                          <div className="w-full h-24 flex flex-col items-center justify-center gap-1 bg-ink-100">
                            <FileText size={28} className="text-ink-400" />
                            <span className="text-[10px] text-ink-400 uppercase font-medium">
                              {ev.name.split(".").pop()}
                            </span>
                          </div>
                        )}
                        <div className="px-2 py-1.5 flex items-center justify-between gap-1">
                          <p className="text-ink-600 text-[11px] font-medium truncate flex-1">
                            {ev.name}
                          </p>
                          <div className="flex gap-1 flex-shrink-0">
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-6 h-6 rounded-lg bg-ink-100 hover:bg-jade/20 flex items-center justify-center text-ink-400 hover:text-jade transition-colors"
                              title="Preview"
                            >
                              <Eye size={11} />
                            </a>
                            <a
                              href={ev.url}
                              download={ev.name}
                              className="w-6 h-6 rounded-lg bg-ink-100 hover:bg-jade/20 flex items-center justify-center text-ink-400 hover:text-jade transition-colors"
                              title="Download"
                            >
                              <Download size={11} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload zone */}
              {maxMore > 0 && (
                <>
                  <div
                    className={`relative border-2 rounded-2xl p-6 text-center transition-all ${
                      dragActive
                        ? "border-jade-400 bg-jade/10 ring-2 ring-jade/30"
                        : "border-dashed border-ink-200 hover:border-ink-300 bg-ink-50/50"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                    }}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload
                      size={36}
                      className={`mx-auto mb-2 ${dragActive ? "text-jade-500" : "text-ink-400"}`}
                    />
                    <p
                      className={`font-semibold text-sm mb-1 ${dragActive ? "text-jade-700" : "text-ink-700"}`}
                    >
                      {dragActive
                        ? "Drop here"
                        : "Drag & drop or click to browse"}
                    </p>
                    <p className="text-xs text-ink-500 mb-3">
                      PNG, JPG, PDF · max {maxMore} more · 10 MB each
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 bg-jade hover:bg-jade-500 text-ink-900 font-semibold px-4 py-2 rounded-xl text-sm"
                    >
                      <Upload size={13} /> Select Files
                    </button>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide">
                        New Files
                      </p>
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-ink-50 rounded-xl border border-ink-100"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {f.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(f)}
                                alt={f.name}
                                className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 bg-ink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText size={16} className="text-ink-500" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-ink-700 text-xs font-medium truncate">
                                {f.name}
                              </p>
                              <p className="text-ink-400 text-[10px]">
                                {(f.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setFiles((prev) => prev.filter((_, j) => j !== i))
                            }
                            className="w-6 h-6 rounded-full bg-ink-200 hover:bg-coral-100 text-ink-400 hover:text-coral-500 flex items-center justify-center transition-all flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {existing.length >= 5 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-amber-700 text-sm font-medium">
                    Maximum 5 files reached
                  </p>
                </div>
              )}

              {uploading && (
                <div className="bg-ink-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-jade-400 border-t-transparent rounded-full animate-spin" />
                  <p className="font-semibold text-sm text-ink-700">
                    Uploading to Cloudinary...
                  </p>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-ink-100 flex gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                disabled={uploading}
                className="flex-1 bg-ink-50 hover:bg-ink-100 text-ink-600 font-semibold py-3 rounded-xl disabled:opacity-50"
              >
                Close
              </button>
              {maxMore > 0 && (
                <button
                  onClick={uploadFiles}
                  disabled={files.length === 0 || uploading}
                  className="flex-1 bg-gradient-to-r from-jade to-emerald text-ink-900 font-bold py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading
                    ? "Uploading..."
                    : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </Portal>

      {lightboxIdx !== null && (
        <EvidenceLightbox
          evidences={existing}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
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

// ─── Reminder modal ───────────────────────────────────────────────────────────

function ReminderModal({
  debt,
  onClose,
}: {
  debt: DebtRecord;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const evidences = debt.evidences || [];
  const daysOverdue = debt.dueDate ? getDaysOverdue(debt.dueDate) : 0;
  const defaultMsg = `Hello ${debt.customerName}, this is a friendly reminder that you have an outstanding balance of ${formatNaira(outstanding)} with us. Kindly make payment at your earliest convenience. Thank you.`;
  const [msg, setMsg] = useState(defaultMsg);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const {
    generate,
    message: aiMessage,
    loading: aiLoading,
    error: aiError,
  } = useWhatsappReminder();

  useEffect(() => {
    if (aiMessage) setMsg(aiMessage);
  }, [aiMessage]);

  const [smsCopied, setSmsCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "loading" | "done">("idle");
  const [shareError, setShareError] = useState("");

  function isMobileDevice() {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  // Fetch a single image file through our proxy (avoids CORS on Cloudinary)
  async function fetchImageFile(ev: { url: string; name?: string }): Promise<File | null> {
    try {
      const proxyUrl = ev.url.includes("cloudinary.com")
        ? `/api/proxy-image?url=${encodeURIComponent(ev.url)}`
        : ev.url;
      const res = await fetch(proxyUrl);
      if (!res.ok) return null;
      const blob = await res.blob();
      // Force a recognized image MIME type
      const ext = ev.url.split(".").pop()?.split("?")[0]?.toLowerCase() ?? "jpg";
      const mimeMap: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp" };
      const mime = blob.type.startsWith("image/") ? blob.type : (mimeMap[ext] ?? "image/jpeg");
      const correctedBlob = new Blob([blob], { type: mime });
      return new File([correctedBlob], ev.name || `evidence.${ext}`, { type: mime });
    } catch {
      return null;
    }
  }

  async function share(channel: "whatsapp" | "sms") {
    setShareError("");
    const imgEvs = evidences.filter(
      (e) => e.type === "image" || /\.(jpg|jpeg|png|gif|webp)$/i.test(e.url ?? "")
    ).slice(0, 5);

    const phone = (debt.phone ?? "").replace(/\D/g, "");
    const intlPhone = phone.startsWith("0") ? "234" + phone.slice(1) : phone;

    // ── WhatsApp ───────────────────────────────────────────────────────────────
    if (channel === "whatsapp") {

      // Step 1: If on mobile and has images, try Web Share API (native attach)
      if (imgEvs.length > 0 && isMobileDevice() && typeof navigator.share === "function") {
        setShareStatus("loading");
        try {
          const files = (await Promise.all(imgEvs.map(fetchImageFile))).filter(Boolean) as File[];

          if (files.length > 0) {
            // Try sharing files + text together
            if (navigator.canShare?.({ files, text: msg })) {
              await navigator.share({ files, text: msg });
              setShareStatus("done");
              setTimeout(onClose, 600);
              return;
            }

            // canShare returned false — share files only, then open wa.me with text
            if (navigator.canShare?.({ files })) {
              await navigator.share({ files });
              // Small delay then open WhatsApp with message text
              setTimeout(() => {
                window.open(`https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`, "_blank");
              }, 800);
              setShareStatus("done");
              setTimeout(onClose, 1200);
              return;
            }
          }
        } catch (err: unknown) {
          if ((err as Error)?.name === "AbortError") {
            setShareStatus("idle");
            return; // User cancelled the share sheet — do nothing
          }
          // Other error — fall through to wa.me
        } finally {
          setShareStatus("idle");
        }
      }

      // Step 2: wa.me deep link (text message) — always works
      window.open(
        `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
      onClose();
      return;
    }

    // ── SMS ────────────────────────────────────────────────────────────────────
    if (isMobileDevice()) {
      window.location.href = `sms:${debt.phone ?? ""}?body=${encodeURIComponent(msg)}`;
      onClose();
    } else {
      try {
        await navigator.clipboard.writeText(msg);
        setSmsCopied(true);
        setTimeout(() => setSmsCopied(false), 2500);
      } catch {
        // no-op
      }
    }
  }

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
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {evidences.length > 0 && (
              <div className="space-y-2">
                <p className="text-ink-600 text-sm font-medium">
                  Evidence — images sent directly, PDFs as links
                </p>
                <div className="flex flex-wrap gap-2">
                  {evidences.map((ev, i) => (
                    <button
                      key={ev.id}
                      onClick={() => setLightboxIdx(i)}
                      className="relative group w-14 h-14 rounded-xl overflow-hidden border border-ink-100 hover:border-jade/40 flex-shrink-0"
                    >
                      {ev.type === "image" ? (
                        <img
                          src={ev.url}
                          alt={ev.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-ink-100 flex items-center justify-center">
                          <FileText size={18} className="text-ink-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 flex items-center justify-center transition-all">
                        <ZoomIn
                          size={12}
                          className="text-white opacity-0 group-hover:opacity-100"
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-ink-400 text-xs">
                  Uses Web Share API on supported devices to send images
                  natively.
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
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
                  className="flex items-center gap-1.5 text-xs bg-jade/10 hover:bg-jade/20 text-jade-700 font-semibold px-3 py-1.5 rounded-lg disabled:opacity-60"
                >
                  {aiLoading ? (
                    <>
                      <Spinner size={12} /> Generating...
                    </>
                  ) : (
                    <>✦ AI Generate</>
                  )}
                </button>
              </div>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none"
              />
              {aiError ? (
                <p className="text-coral-500 text-xs mt-1">{aiError}</p>
              ) : (
                <p className="text-ink-400 text-xs mt-1">{msg.length} chars</p>
              )}
            </div>

            <div>
              <p className="text-ink-600 text-sm font-medium mb-3">Send via</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => share("whatsapp")}
                  disabled={shareStatus === "loading"}
                  className="flex flex-col items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 py-4 px-3 rounded-xl group disabled:opacity-70"
                >
                  <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    {shareStatus === "loading" && <Loader2 size={18} className="text-white animate-spin absolute" />}
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
                    <p className="text-[10px] text-ink-500">
                      {shareStatus === "loading"
                        ? "Fetching images..."
                        : evidences.length > 0
                        ? "Message + images"
                        : "Text only"}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => share("sms")}
                  className="flex flex-col items-center gap-2 bg-ink-50 hover:bg-ink-100 border border-ink-200 py-4 px-3 rounded-xl group relative"
                >
                  <div className="w-10 h-10 bg-ink-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    {smsCopied ? (
                      <Check size={18} className="text-white" />
                    ) : (
                      <Phone size={18} className="text-white" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-ink-800">
                      {smsCopied ? "Copied!" : "SMS"}
                    </p>
                    <p className="text-[10px] text-ink-500">
                      {smsCopied
                        ? "Paste in your SMS app"
                        : isMobileDevice()
                        ? evidences.length > 0 ? "Msg + images" : "Opens SMS app"
                        : "Copies message"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {lightboxIdx !== null && (
        <EvidenceLightbox
          evidences={evidences}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
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
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-coral-500 hover:bg-coral-600 text-white font-bold py-3 rounded-xl hover:shadow-lg"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Record Payment modal ─────────────────────────────────────────────────────

function RecordPaymentModal({
  debt,
  onSave,
  onClose,
}: {
  debt: DebtRecord;
  onSave: (
    amount: number,
    note: string,
    method: string,
    receiptFile?: File,
  ) => Promise<void>;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState("cash");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const receiptRef = useRef<HTMLInputElement>(null);

  const needsReceipt = method === "transfer" || method === "cheque";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (val > outstanding) {
      setError(`Exceeds outstanding balance of ${formatNaira(outstanding)}`);
      return;
    }
    setSaving(true);
    try {
      await onSave(val, note, method, receipt ?? undefined);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setSaving(false);
    }
  }

  const quickAmounts = [
    outstanding * 0.25,
    outstanding * 0.5,
    outstanding * 0.75,
    outstanding,
  ].filter(Boolean);

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
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500"
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
                  Payment method *
                </label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.value}
                      type="button"
                      onClick={() => {
                        setMethod(pm.value);
                        setReceipt(null);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all border ${
                        method === pm.value
                          ? "bg-ink-900 text-white border-ink-900"
                          : "bg-ink-50 text-ink-600 border-ink-200 hover:border-ink-300"
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receipt upload for transfer / cheque */}
              {needsReceipt && (
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Upload receipt{" "}
                    <span className="text-ink-400 font-normal">(optional)</span>
                  </label>
                  <input
                    ref={receiptRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  />
                  {receipt ? (
                    <div className="flex items-center justify-between p-3 bg-ink-50 rounded-xl border border-ink-100">
                      <div className="flex items-center gap-2.5">
                        {receipt.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(receipt)}
                            alt="Receipt"
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-ink-200 rounded-lg flex items-center justify-center">
                            <FileText size={18} className="text-ink-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-ink-700 text-xs font-medium max-w-[160px] truncate">
                            {receipt.name}
                          </p>
                          <p className="text-ink-400 text-[10px]">
                            {(receipt.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceipt(null)}
                        className="w-6 h-6 rounded-full bg-ink-200 hover:bg-coral-100 text-ink-400 hover:text-coral-500 flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => receiptRef.current?.click()}
                      className="flex items-center gap-2 w-full bg-ink-50 hover:bg-ink-100 border border-dashed border-ink-200 text-ink-500 font-medium px-4 py-3 rounded-xl text-sm"
                    >
                      <Receipt size={14} />
                      Attach{" "}
                      {method === "transfer"
                        ? "transfer receipt"
                        : "cheque image"}
                    </button>
                  )}
                </div>
              )}

              {/* Note */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cash in hand, transfer ref #123..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                />
              </div>

              {error && (
                <p className="text-coral-500 text-sm font-medium flex items-center gap-1.5">
                  <AlertTriangle size={14} /> {error}
                </p>
              )}
            </form>
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-ink-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="payment-form"
              disabled={saving}
              className="flex-[2] bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Record Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Items breakdown ──────────────────────────────────────────────────────────

function ItemsBreakdown({
  items,
  amount,
  amountPaid,
}: {
  items: any[];
  amount: number;
  amountPaid: number;
}) {
  const outstanding = amount - amountPaid;
  const hasItems = items && items.length > 0;

  return (
    <div className="bg-white border border-ink-100 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 bg-ink-50/50">
        <ShoppingCart size={13} className="text-ink-400" />
        <p className="text-ink-500 text-xs font-semibold uppercase tracking-wide">
          {hasItems ? "Items" : "Debt Summary"}
        </p>
      </div>

      {hasItems ? (
        <>
          <div className="divide-y divide-ink-50">
            {items.map((item: any, i: number) => {
              const lineTotal = item.qty * item.unitPrice;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-ink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-ink-500">
                        {i + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink-800 text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-ink-400 text-xs">
                        {item.qty}
                        {item.unit ? ` ${item.unit}` : ""} ×{" "}
                        {formatNaira(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="text-ink-800 text-sm font-bold ml-3 flex-shrink-0">
                    {formatNaira(lineTotal)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-ink-100 bg-ink-50/50 divide-y divide-ink-100">
            <div className="flex justify-between px-4 py-2.5">
              <p className="text-ink-500 text-sm">Subtotal</p>
              <p className="text-ink-700 text-sm font-semibold">
                {formatNaira(amount)}
              </p>
            </div>
            {amountPaid > 0 && (
              <div className="flex justify-between px-4 py-2.5">
                <p className="text-jade-600 text-sm">Paid</p>
                <p className="text-jade-600 text-sm font-semibold">
                  − {formatNaira(amountPaid)}
                </p>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 bg-ink-900 mx-0 rounded-b-2xl">
              <p className="text-white font-bold text-sm">Outstanding</p>
              <p className="text-white font-bold text-sm">
                {formatNaira(outstanding)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="divide-y divide-ink-50">
          <div className="flex justify-between px-4 py-3">
            <p className="text-ink-500 text-sm">Total debt</p>
            <p className="text-ink-700 text-sm font-semibold">
              {formatNaira(amount)}
            </p>
          </div>
          {amountPaid > 0 && (
            <div className="flex justify-between px-4 py-3">
              <p className="text-jade-600 text-sm">Paid</p>
              <p className="text-jade-600 text-sm font-semibold">
                − {formatNaira(amountPaid)}
              </p>
            </div>
          )}
          <div className="flex justify-between px-4 py-3 bg-ink-900 rounded-b-2xl">
            <p className="text-white font-bold text-sm">Outstanding</p>
            <p className="text-white font-bold text-sm">
              {formatNaira(outstanding)}
            </p>
          </div>
        </div>
      )}
    </div>
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
  const items = (debt as any).items || [];
  const evidences = debt.evidences || [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[94vh] flex flex-col">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 flex-shrink-0"
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
            {/* Hero card */}
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
                  <p className="text-ink-400 text-xs">Total</p>
                  <p className="font-semibold text-ink-200">
                    {formatNaira(debt.amount)}
                  </p>
                </div>
              </div>
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

            {/* Items / breakdown */}
            <ItemsBreakdown
              items={items}
              amount={debt.amount}
              amountPaid={debt.amountPaid}
            />

            {/* Meta grid */}
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
                  <p className="text-ink-400 text-xs font-medium">Payments</p>
                </div>
                <p className="text-ink-700 text-sm font-semibold">
                  {payments.length} recorded
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

            {/* Evidence thumbnails with download */}
            {evCount > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-ink-700 text-sm font-semibold">
                    Evidence Files
                  </p>
                  <button
                    onClick={onEvidence}
                    className="text-xs text-jade-700 font-medium hover:underline flex items-center gap-1"
                  >
                    <Plus size={11} /> Add more
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {evidences.map((ev, i) => (
                    <div
                      key={ev.id}
                      className="rounded-xl overflow-hidden border border-ink-100 bg-ink-50"
                    >
                      {ev.type === "image" ? (
                        <button
                          onClick={() => setLightboxIdx(i)}
                          className="w-full h-20 block overflow-hidden relative group"
                        >
                          <img
                            src={ev.url}
                            alt={ev.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/30 flex items-center justify-center transition-all">
                            <ZoomIn
                              size={16}
                              className="text-white opacity-0 group-hover:opacity-100"
                            />
                          </div>
                        </button>
                      ) : (
                        <div className="w-full h-20 flex flex-col items-center justify-center gap-1 bg-ink-100">
                          <FileText size={22} className="text-ink-400" />
                          <span className="text-[9px] text-ink-400 uppercase">
                            {ev.name.split(".").pop()}
                          </span>
                        </div>
                      )}
                      <div className="flex px-1.5 py-1 gap-1">
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 text-[10px] text-ink-400 hover:text-jade py-1 rounded-lg hover:bg-jade/5 transition-colors"
                        >
                          <Eye size={10} /> View
                        </a>
                        <a
                          href={ev.url}
                          download={ev.name}
                          className="flex-1 flex items-center justify-center gap-1 text-[10px] text-ink-400 hover:text-jade py-1 rounded-lg hover:bg-jade/5 transition-colors"
                        >
                          <Download size={10} /> Save
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment history */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-ink-800 flex items-center gap-2">
                  <TrendingUp size={15} className="text-jade" /> Payment History
                </h3>
                {debt.status !== "cleared" && (
                  <button
                    onClick={onPayment}
                    className="text-xs bg-jade/10 hover:bg-jade/20 text-jade-700 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Plus size={12} /> Add
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
                    <div
                      key={i}
                      className="bg-ink-50 rounded-xl px-4 py-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-ink-800 text-sm font-semibold">
                              {formatNaira(p.amount)}
                            </p>
                            {p.method && (
                              <span className="text-[10px] font-semibold bg-ink-200 text-ink-600 px-2 py-0.5 rounded-full capitalize">
                                {PAYMENT_METHODS.find(
                                  (m) => m.value === p.method,
                                )?.label || p.method}
                              </span>
                            )}
                          </div>
                          {p.note && (
                            <p className="text-ink-400 text-xs mt-0.5 italic">
                              {p.note}
                            </p>
                          )}
                        </div>
                        <p className="text-ink-400 text-xs flex-shrink-0">
                          {new Date(p.recordedAt).toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {/* Receipt attached to payment */}
                      {p.evidence && (
                        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-lg px-2.5 py-1.5">
                          <Receipt
                            size={11}
                            className="text-ink-400 flex-shrink-0"
                          />
                          <p className="text-ink-500 text-xs truncate flex-1">
                            {p.evidence.name}
                          </p>
                          <a
                            href={p.evidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-jade text-[10px] font-medium hover:underline flex items-center gap-0.5"
                          >
                            <Eye size={10} /> View
                          </a>
                          <a
                            href={p.evidence.url}
                            download={p.evidence.name}
                            className="text-ink-400 hover:text-ink-600 flex items-center"
                          >
                            <Download size={10} />
                          </a>
                        </div>
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
                className="w-full bg-jade hover:bg-jade-400 text-ink-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <CreditCard size={16} /> Record Payment
              </button>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {debt.status !== "cleared" && (
                <button
                  onClick={onReminder}
                  className="flex items-center justify-center gap-2 bg-ink-100 hover:bg-ink-200 text-ink-700 font-semibold py-2.5 rounded-xl text-sm"
                >
                  <MessageSquare size={15} /> Send Reminder
                </button>
              )}
              <button
                onClick={onEvidence}
                className={`flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl text-sm
                  ${evCount > 0 ? "bg-amber-50 hover:bg-amber-100 text-amber-700" : "bg-ink-100 hover:bg-ink-200 text-ink-700"}
                  ${debt.status === "cleared" ? "col-span-2" : ""}`}
              >
                <Paperclip size={15} /> Evidence{" "}
                {evCount > 0 ? `(${evCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <EvidenceLightbox
          evidences={evidences}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
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
  initial: DebtForm;
  existingCustomers: string[];
  onSave: (data: DebtForm, files: File[]) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [useExisting, setUseExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (k: keyof DebtForm, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const sel = Array.from(e.target.files || []).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    setPendingFiles((prev) => [...prev, ...sel].slice(0, 5));
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, pendingFiles);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <h2 className="font-heading font-bold text-lg text-ink-900">
              Add Debt Record
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4">
            <form id="debt-form" className="space-y-4" onSubmit={handleSubmit}>
              {existingCustomers.length > 0 && (
                <div className="flex gap-2 p-1 bg-ink-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUseExisting(false)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!useExisting ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
                  >
                    New customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseExisting(true)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${useExisting ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}
                  >
                    Existing customer
                  </button>
                </div>
              )}

              {useExisting ? (
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Select customer *
                  </label>
                  <select
                    required
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                  >
                    <option value="">Choose a customer...</option>
                    {existingCustomers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">
                      Customer name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={form.customerName}
                      onChange={(e) => update("customerName", e.target.value)}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="0801 234 5678"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  What did they buy? *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Bag of rice (50kg) + Semovita x3"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Total (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="15000"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                  />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Paid (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.amountPaid}
                    onChange={(e) => update("amountPaid", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Due date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10"
                />
              </div>

              {/* Evidence at creation */}
              <div>
                <label className="block text-ink-600 text-sm font-medium mb-2">
                  Attach evidence{" "}
                  <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {pendingFiles.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full bg-ink-50 hover:bg-ink-100 border border-dashed border-ink-200 text-ink-500 font-medium px-4 py-3 rounded-xl text-sm"
                  >
                    <Paperclip size={14} /> Attach photos or PDFs (up to 5)
                  </button>
                ) : (
                  <div className="space-y-2">
                    {pendingFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-ink-50 rounded-xl border border-ink-100"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {f.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(f)}
                              alt={f.name}
                              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-ink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText size={14} className="text-ink-500" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-ink-700 text-xs font-medium truncate">
                              {f.name}
                            </p>
                            <p className="text-ink-400 text-[10px]">
                              {(f.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingFiles((prev) =>
                              prev.filter((_, j) => j !== i),
                            )
                          }
                          className="w-6 h-6 rounded-full bg-ink-200 hover:bg-coral-100 text-ink-400 hover:text-coral-500 flex items-center justify-center flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {pendingFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-xs text-jade-700 font-medium hover:underline"
                      >
                        <Plus size={12} /> Add more
                      </button>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-5 py-4 border-t border-ink-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="debt-form"
              disabled={saving}
              className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Spinner />{" "}
                  {pendingFiles.length > 0
                    ? "Saving & uploading..."
                    : "Saving..."}
                </>
              ) : (
                <>
                  <CheckCircle size={16} /> Save
                  {pendingFiles.length > 0
                    ? ` + ${pendingFiles.length} file${pendingFiles.length !== 1 ? "s" : ""}`
                    : ""}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ─── Edit Debtor Modal ────────────────────────────────────────────────────────

function EditDebtorModal({
  debt,
  onSave,
  onClose,
}: {
  debt: DebtRecord;
  onSave: (id: string, data: { phone: string; description: string; dueDate: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState(debt.phone ?? "");
  const [description, setDescription] = useState(debt.description ?? "");
  const [dueDate, setDueDate] = useState(
    debt.dueDate ? debt.dueDate.slice(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) { setError("Phone number is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(debt.id, { phone: phone.trim(), description: description.trim(), dueDate });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-jade/10 rounded-lg flex items-center justify-center">
              <Pencil size={14} className="text-jade" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-ink-900">Edit Debtor</h2>
              <p className="text-ink-400 text-xs">{debt.customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-400 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {error && (
            <p className="text-coral-600 text-xs bg-coral-50 border border-coral-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <AlertTriangle size={13} className="flex-shrink-0" /> {error}
            </p>
          )}

          {/* Phone — the most common thing to fix */}
          <div>
            <label className="block text-ink-700 text-sm font-semibold mb-1.5">
              Phone number <span className="text-coral-500">*</span>
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 08012345678"
                autoFocus
                className="w-full bg-ink-50 border border-ink-200 rounded-xl pl-9 pr-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all outline-none"
              />
            </div>
            <p className="text-ink-400 text-[11px] mt-1">Used for WhatsApp reminders</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-ink-700 text-sm font-semibold mb-1.5">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Goods on credit"
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all outline-none"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="block text-ink-700 text-sm font-semibold mb-1.5">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all outline-none"
            />
          </div>

          {/* Readonly info */}
          <div className="bg-ink-50 rounded-xl px-4 py-3 text-xs text-ink-400 space-y-0.5">
            <p>Amount: <span className="font-semibold text-ink-600">{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(debt.amount)}</span> — to adjust, record a payment</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-2.5 rounded-xl hover:bg-ink-50 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] bg-jade hover:bg-jade-400 disabled:opacity-60 text-ink-900 font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              {saving ? <><Clock size={14} className="animate-spin" /> Saving...</> : <><Check size={14} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DebtorsPage() {
  const {
    debts,
    loading,
    error,
    addDebt,
    editDebt: saveEditDebt,
    removeDebt,
    recordPayment,
    setDebts,
  } = useDebts();

  const [filter, setFilter] = useState<
    "all" | "overdue" | "partial" | "cleared" | "pending"
  >("all");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null);
  const [reminderDebt, setReminderDebt] = useState<DebtRecord | null>(null);
  const [evidenceDebt, setEvidenceDebt] = useState<DebtRecord | null>(null);
  const [paymentDebt, setPaymentDebt] = useState<DebtRecord | null>(null);
  const [detailDebt, setDetailDebt] = useState<DebtRecord | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editDebt, setEditDebt] = useState<DebtRecord | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { usage, debtsAtLimit, refresh: refreshUsage } = usePlanUsage();

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

  const filtered = debts.filter((d) => {
    const mf = filter === "all" || d.status === filter;
    const ms =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const existingCustomers = [...new Set(debts.map((d) => d.customerName))];
  const counts = {
    all: debts.length,
    overdue: debts.filter((d) => d.status === "overdue").length,
    partial: debts.filter((d) => d.status === "partial").length,
    cleared: debts.filter((d) => d.status === "cleared").length,
    pending: debts.filter((d) => d.status === "pending").length,
  };

  // Create debt then upload attached evidence
  async function handleAdd(form: DebtForm, files: File[]) {
    try {
      setActionError(null);
      const newDebt = await addDebt(form);
      setAddOpen(false);
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const token = localStorage.getItem("debtpadi_token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/debts/${newDebt.id}/evidence`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          },
        );
        const data = await res.json();
        if (data.success) {
          setDebts((prev) =>
            prev.map((d) =>
              d.id === newDebt.id ? { ...d, evidences: data.evidences } : d,
            ),
          );
          setToast({
            message: `Debt saved with ${data.uploaded} evidence file${data.uploaded !== 1 ? "s" : ""}!`,
            type: "success",
          });
        } else {
          setToast({
            message:
              "Debt saved. Evidence upload failed — retry via evidence panel.",
            type: "error",
          });
        }
      } else {
        setToast({ message: "Debt record saved!", type: "success" });
      }
      refreshUsage();
    } catch (err: any) {
      if (err?.code === "PLAN_LIMIT_REACHED") {
        setAddOpen(false);
        setShowUpgrade(true);
        refreshUsage();
        return;
      }
      setActionError(err instanceof Error ? err.message : "Failed to add debt");
    }
  }

  async function handleEditSave(
    id: string,
    data: { phone: string; description: string; dueDate: string }
  ) {
    const debt = debts.find(d => d.id === id);
    if (!debt) return;

    // Update the debt record (description + dueDate)
    await saveEditDebt(id, {
      customerName: debt.customerName,
      phone: data.phone,
      description: data.description,
      amount: String(debt.amount),
      amountPaid: String(debt.amountPaid),
      dueDate: data.dueDate,
    });

    // Also patch the customer's phone number via customers API
    if (data.phone && data.phone !== debt.phone && debt.customerId) {
      try {
        const token = localStorage.getItem("debtpadi_token");
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${debt.customerId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ phone: data.phone }),
          }
        );
      } catch {
        // Non-critical — debt is already updated, customer phone patch is best-effort
      }
    }

    setToast({ message: "Debtor info updated successfully!", type: "success" });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setActionError(null);
      await removeDebt(deleteTarget.id);
      setDeleteTarget(null);
      setToast({ message: "Debt deleted", type: "success" });
      refreshUsage(); // sync sidebar count immediately
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  // Handles payment with optional receipt upload via multipart
  async function handleRecordPayment(
    amount: number,
    note: string,
    method: string,
    receiptFile?: File,
  ) {
    if (!paymentDebt) return;
    const token = localStorage.getItem("debtpadi_token");

    if (receiptFile) {
      const fd = new FormData();
      fd.append("amount", String(amount));
      fd.append("method", method);
      if (note) fd.append("note", note);
      fd.append("evidence", receiptFile);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/debts/${paymentDebt.id}/pay`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        },
      );
      const data = await res.json();
      if (data.success) {
        setDebts((prev) =>
          prev.map((d) =>
            d.id === paymentDebt.id ? { ...d, ...data.data } : d,
          ),
        );
        if (detailDebt?.id === paymentDebt.id)
          setDetailDebt((prev) => (prev ? { ...prev, ...data.data } : prev));
      }
    } else {
      await recordPayment(paymentDebt.id, amount, note);
      const updated = debts.find((d) => d.id === paymentDebt.id);
      if (updated && detailDebt?.id === paymentDebt.id) setDetailDebt(updated);
    }
  }

  // Evidence upload already saved by server — just sync local state
  function handleEvidenceUpdate(debtId: string, evidences: Evidence[]) {
    setDebts((prev) =>
      prev.map((d) => (d.id === debtId ? { ...d, evidences } : d)),
    );
    if (evidenceDebt?.id === debtId)
      setEvidenceDebt((prev) => (prev ? { ...prev, evidences } : prev));
    if (detailDebt?.id === debtId)
      setDetailDebt((prev) => (prev ? { ...prev, evidences } : prev));
  }

  function EvidenceBadge({ count }: { count: number }) {
    if (!count) return null;
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
            <button onClick={() => setActionError(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex flex-col items-stretch sm:items-start gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => (debtsAtLimit ? setShowUpgrade(true) : setAddOpen(true))}
              className="flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:shadow-lg w-full sm:w-auto"
            >
              <Plus size={16} /> Add Debt Record
            </button>
            {usage && !usage.isPaid && (
              <p className={`text-xs ${debtsAtLimit ? "text-coral-500 font-medium" : "text-ink-400"}`}>
                {usage.debts.used} / {usage.debts.limit} active debts used
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-ink-100 rounded-xl px-4 py-2.5 mb-4 focus-within:border-jade/40 focus-within:ring-2 focus-within:ring-jade/10 transition-all">
          <Search size={15} className="text-ink-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-ink-700 placeholder-ink-400 w-full"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-ink-400 hover:text-ink-600" />
            </button>
          )}
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-5"
          style={{ scrollbarWidth: "none" }}
        >
          {(["all", "overdue", "partial", "pending", "cleared"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-ink-900 text-white"
                    : "bg-white border border-ink-100 text-ink-500 hover:border-ink-200 hover:text-ink-700"
                }`}
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

        {/* Desktop table */}
        <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  {[
                    "Customer",
                    "Description",
                    "Amount",
                    "Progress",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`${i < 5 ? "text-left" : ""} px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide${i === 5 ? " w-32" : ""}`}
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
                        <p className="text-ink-600 text-sm max-w-[200px] truncate">
                          {debt.description}
                        </p>
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
                        <div className="flex items-center gap-1.5 w-[84px] justify-end">
                          <button
                            onClick={() => setReminderDebt(debt)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              debt.status !== "cleared"
                                ? "bg-jade/10 hover:bg-jade/20 text-jade"
                                : "invisible"
                            }`}
                            title="Send reminder"
                            tabIndex={debt.status === "cleared" ? -1 : 0}
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => setEvidenceDebt(debt)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              (debt.evidences?.length || 0) > 0
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-500"
                                : "bg-ink-50 hover:bg-ink-100 text-ink-400"
                            }`}
                            title="Attach evidence"
                          >
                            <Paperclip size={14} />
                          </button>
                          <ActionMenu
                            onPayment={() => setPaymentDebt(debt)}
                            onDetail={() => setDetailDebt(debt)}
                            onDelete={() => setDeleteTarget(debt)}
                            onEvidence={() => setEvidenceDebt(debt)}
                            onEdit={() => setEditDebt(debt)}
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
                No debts found
              </p>
              <p className="text-ink-400 text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Mobile cards */}
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
                        <EvidenceBadge count={evCount} />
                      </div>
                      <p className="text-ink-400 text-xs truncate">
                        {debt.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setReminderDebt(debt)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        debt.status !== "cleared"
                          ? "bg-jade/10 hover:bg-jade/20 text-jade"
                          : "invisible pointer-events-none"
                      }`}
                      tabIndex={debt.status === "cleared" ? -1 : 0}
                    >
                      <MessageSquare size={14} />
                    </button>
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
                      onEdit={() => setEditDebt(debt)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-heading font-bold text-ink-900 text-lg leading-none">
                      {formatNaira(outstanding)}
                    </p>
                    <p className="text-ink-400 text-xs mt-0.5">
                      of {formatNaira(debt.amount)}
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
                No debts found
              </p>
              <p className="text-ink-400 text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
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
            onUpload={(evidences) =>
              handleEvidenceUpdate(evidenceDebt.id, evidences)
            }
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

      {showUpgrade && (
        <UpgradeModal
          resource="debts"
          limit={usage?.debts.limit ?? 10}
          onClose={() => setShowUpgrade(false)}
        />
      )}

      {editDebt && (
        <EditDebtorModal
          debt={editDebt}
          onSave={handleEditSave}
          onClose={() => setEditDebt(null)}
        />
      )}
    </>
  );
}
