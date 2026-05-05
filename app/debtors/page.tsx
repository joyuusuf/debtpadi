"use client";
import { useState } from "react";
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

const EMPTY_FORM: DebtForm = {
  customerName: "",
  phone: "",
  description: "",
  amount: "",
  amountPaid: "",
  dueDate: "",
};

// ─── Portal wrapper so modals never overflow ──────────────────────────────────

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

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
  // ✅ Toast state EXACTLY like SignInPage
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

  const MENU_HEIGHT = 190;

  // ✅ Delete handler with toast feedback
  async function handleDelete() {
    try {
      // Your delete API call here
      // const token = localStorage.getItem("debtpadi_token");
      // await fetch(`${API_BASE_URL}/debts/${debtId}`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setToast({
        message: "Debt deleted successfully",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Failed to delete debt",
        type: "error",
      });
    }

    setOpen(false);
    onDelete();
  }

  function openMenu(e: React.MouseEvent) {
    e.stopPropagation();
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const right = window.innerWidth - rect.right;

    if (spaceBelow < MENU_HEIGHT + 12) {
      setPos({ bottom: window.innerHeight - rect.top + 8, right });
    } else {
      setPos({ top: rect.bottom + 8, right });
    }
    setOpen(true);
  }

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    const id = window.setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  function pick(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <>
      {/* ✅ Menu Trigger */}
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={openMenu}
          className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 hover:text-ink-700 flex items-center justify-center transition-colors"
        >
          <MoreVertical size={15} />
        </button>

        {/* ✅ Dropdown Menu */}
        {open && (
          <Portal>
            <div
              ref={menuRef}
              className="fixed z-[9999] bg-white border border-ink-100 rounded-xl shadow-xl shadow-ink-900/15 w-52 py-1"
              style={pos}
            >
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => pick(onDetail)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 active:bg-ink-100 transition-colors"
              >
                <Eye size={14} className="text-ink-400" />
                View Details
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => pick(onPayment)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 active:bg-ink-100 transition-colors"
              >
                <CreditCard size={14} className="text-ink-400" />
                Record Payment
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => pick(onEvidence)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 active:bg-ink-100 transition-colors"
              >
                <Paperclip size={14} className="text-ink-400" />
                View Evidence
              </button>

              <div className="mx-3 my-1 h-px bg-ink-100" />

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleDelete} // ✅ Uses toast-enabled handler
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-coral-600 hover:bg-coral-50 active:bg-coral-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </Portal>
        )}
      </div>

      {/* ✅ Toast - EXACTLY like SignInPage */}
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
  const evCount = debt.evidences?.length || 0;
  const daysOverdue = debt.dueDate ? getDaysOverdue(debt.dueDate) : 0;
  const [includeEvidence, setIncludeEvidence] = useState(false);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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

  function buildEvidenceText() {
    if (!includeEvidence || !debt.evidences?.length) return "";
    const names = debt.evidences.map((e) => e.name).join(", ");
    return `\n\nAttached evidence: ${names}`;
  }

  function sendWhatsApp() {
    const fullMsg = msg + buildEvidenceText();
    window.open(`https://wa.me/?text=${encodeURIComponent(fullMsg)}`, "_blank");
    onClose();
  }

  function sendSMS() {
    const fullMsg = msg + buildEvidenceText();
    window.open(`sms:?body=${encodeURIComponent(fullMsg)}`, "_blank");
    onClose();
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
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {/* Evidence toggle */}
            {evCount > 0 && (
              <button
                onClick={() => setIncludeEvidence(!includeEvidence)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${includeEvidence ? "border-jade/40 bg-jade/5" : "border-ink-100 bg-ink-50 hover:border-ink-200"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${includeEvidence ? "bg-jade/15" : "bg-ink-100"}`}
                >
                  <Paperclip
                    size={15}
                    className={includeEvidence ? "text-jade" : "text-ink-400"}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-semibold ${includeEvidence ? "text-jade-700" : "text-ink-600"}`}
                  >
                    Include {evCount} evidence file{evCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    File names will be listed in the message
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${includeEvidence ? "border-jade bg-jade" : "border-ink-300"}`}
                >
                  {includeEvidence && (
                    <CheckCircle size={12} className="text-white fill-white" />
                  )}
                </div>
              </button>
            )}

            {evCount === 0 && (
              <div className="bg-ink-50 border border-ink-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 bg-ink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Paperclip size={15} className="text-ink-400" />
                </div>
                <p className="text-ink-500 text-xs">
                  No evidence uploaded — add files via the evidence panel
                </p>
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
                    businessName: "Titilayo Farms & Agro Supplies",
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
                {msg.length} characters
              </p>
            </div>

            <div>
              <p className="text-ink-600 text-sm font-medium mb-3">Send via</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={sendWhatsApp}
                  className="flex flex-col items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 py-4 px-3 rounded-xl transition-all group"
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
                    <p className="text-[10px] text-ink-500">Opens WhatsApp</p>
                  </div>
                </button>
                <button
                  onClick={sendSMS}
                  className="flex flex-col items-center gap-2 bg-ink-50 hover:bg-ink-100 border border-ink-200 py-4 px-3 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-ink-800 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-ink-800">SMS</p>
                    <p className="text-[10px] text-ink-500">Opens messages</p>
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

// ─── Evidence Panel ───────────────────────────────────────────────────────────
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingCount = debt.evidences?.length || 0;
  const maxFiles = 5 - existingCount;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf",
    );

    if (droppedFiles.length > maxFiles) {
      // toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles((prev) => [...prev, ...droppedFiles]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) =>
        file.type.startsWith("image/") || file.type === "application/pdf",
    );

    if (selectedFiles.length > maxFiles) {
      // toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = ""; // Reset input
  }

  async function uploadFiles() {
    if (files.length === 0) {
      // toast.error("Please select files first");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    formData.append("debtId", debt.id);
    formData.append("customerName", debt.customerName);

    try {
      const token = localStorage.getItem("debtpadi_token");
      const response = await fetch(
        `http://localhost:5000/api/debts/${debt.id}/evidence`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // ✅ No Content-Type - let browser set multipart boundary
        },
      );

      const data = await response.json();

      if (data.success) {
        // toast.success(
        //   `${data.uploaded} file${data.uploaded === 1 ? "" : "s"} uploaded successfully!`,
        // );

        alert(
          `${data.uploaded} file${data.uploaded === 1 ? "" : "s"} uploaded successfully!`,
        );
        onUpload(data.evidences); // Update parent with new evidences
        onClose();
      } else {
        // toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      // toast.error("Upload failed - check your connection");
    } finally {
      setUploading(false);
      setFiles([]);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg text-ink-900">
                Upload Evidence ({existingCount + files.length}/5)
              </h2>
              <p className="text-ink-400 text-xs mt-0.5">
                For {debt.customerName} ·{" "}
                {formatNaira(debt.amount - debt.amountPaid)} owed
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 flex items-center justify-center text-ink-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Drop zone */}
            <div
              className={`relative border-2 rounded-2xl p-8 text-center transition-all ${
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
                size={48}
                className={`mx-auto mb-3 ${dragActive ? "text-jade-500" : "text-ink-400"}`}
              />

              <div>
                <p
                  className={`font-semibold mb-1 ${dragActive ? "text-jade-700" : "text-ink-700"}`}
                >
                  {dragActive
                    ? "Drop files here"
                    : "Drag & drop or click to browse"}
                </p>
                <p className="text-xs text-ink-500 mb-4">
                  PNG, JPG, PDF (max {maxFiles} files, 10MB each)
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-jade hover:bg-jade-500 text-ink-900 font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                >
                  <Upload size={14} />
                  Select Files
                </button>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-ink-600 uppercase tracking-wide">
                  Selected Files
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto -mx-5 px-5">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-ink-50 rounded-xl border border-ink-100 hover:bg-ink-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <FileText size={20} className="text-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate text-ink-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-ink-500">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="w-7 h-7 rounded-full bg-ink-200 hover:bg-coral text-coral hover:bg-coral/20 flex items-center justify-center transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress */}
            {uploading && (
              <div className="bg-ink-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-jade-400 border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="font-semibold text-sm text-ink-700">
                    Uploading...
                  </p>
                  <p className="text-xs text-ink-500">Please wait</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-ink-100 flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              disabled={uploading}
              className="flex-1 bg-ink-50 hover:bg-ink-100 text-ink-600 font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={uploadFiles}
              disabled={files.length === 0 || uploading}
              className="flex-1 bg-gradient-to-r from-jade to-emerald text-ink-900 font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:from-jade-500 hover:to-emerald-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
            </button>
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

// ─── Record Payment modal ─────────────────────────────────────────────────────

function RecordPaymentModal({
  debt,
  onSave,
  onClose,
}: {
  debt: DebtRecord;
  onSave: (amount: number, note: string) => Promise<void>;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (val > outstanding) {
      setError(
        `Amount exceeds outstanding balance of ${formatNaira(outstanding)}`,
      );
      return;
    }
    setSaving(true);
    try {
      await onSave(val, note);
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
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
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
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="px-5 py-4 space-y-4"
          >
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
            <div>
              <label className="block text-ink-600 text-sm font-medium mb-2">
                Note (optional)
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
          <div className="flex gap-3 px-5 py-4 border-t border-ink-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors"
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

// ─── Debt Detail panel (slide-over) ──────────────────────────────────────────

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

  return (
    <Portal>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
        <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[94vh] flex flex-col">
          {/* Header */}
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
              <div className="mb-2">
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
                    <div
                      key={i}
                      className="flex items-center justify-between bg-ink-50 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-ink-800 text-sm font-semibold">
                          {formatNaira(p.amount)}
                        </p>
                        {p.note && (
                          <p className="text-ink-400 text-xs mt-0.5 italic">
                            {p.note}
                          </p>
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
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
  initial: DebtForm;
  existingCustomers: string[];
  onSave: (data: DebtForm) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [useExisting, setUseExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const update = (k: keyof DebtForm, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
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
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
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
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-ink-600 text-sm font-medium mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="0801 234 5678"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
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
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-3 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Total amount (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="15000"
                    value={form.amount}
                    onChange={(e) => update("amount", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-ink-600 text-sm font-medium mb-2">
                    Amount paid (₦)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={form.amountPaid}
                    onChange={(e) => update("amountPaid", e.target.value)}
                    className="w-full bg-ink-50 border border-ink-200 rounded-xl px-3 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
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
                  className="w-full bg-ink-50 border border-ink-200 rounded-xl px-4 py-2.5 text-ink-700 text-sm focus:border-jade/50 focus:ring-2 focus:ring-jade/10 transition-all"
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
              disabled={saving}
              className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
                  Save Debt
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
    editDebt,
    removeDebt,
    updateEvidences,
    recordPayment,
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
    const matchesFilter = filter === "all" || d.status === filter;
    const matchesSearch =
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const existingCustomers = [...new Set(debts.map((d) => d.customerName))];

  const counts = {
    all: debts.length,
    overdue: debts.filter((d) => d.status === "overdue").length,
    partial: debts.filter((d) => d.status === "partial").length,
    cleared: debts.filter((d) => d.status === "cleared").length,
    pending: debts.filter((d) => d.status === "pending").length,
  };

  async function handleAdd(form: DebtForm) {
    try {
      setActionError(null);
      await addDebt(form);
      setAddOpen(false);
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
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete debt",
      );
    }
  }

  async function handleRecordPayment(amount: number, note: string) {
    if (!paymentDebt) return;
    await recordPayment(paymentDebt.id, amount, note);
    // Refresh detail panel if open
    if (detailDebt?.id === paymentDebt.id) {
      const updated = debts.find((d) => d.id === paymentDebt.id);
      if (updated) setDetailDebt(updated);
    }
  }

  async function handleEvidenceUpdate(debtId: string, evidences: Evidence[]) {
    try {
      await updateEvidences(debtId, evidences);
      if (evidenceDebt?.id === debtId)
        setEvidenceDebt((prev) => (prev ? { ...prev, evidences } : prev));
      if (detailDebt?.id === debtId)
        setDetailDebt((prev) => (prev ? { ...prev, evidences } : prev));
    } catch (err: unknown) {
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
            <button
              onClick={() => setSearch("")}
              className="text-ink-400 hover:text-ink-600 transition-colors"
            >
              <X size={14} />
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

        {/* Desktop table */}
        <div className="hidden sm:block bg-white border border-ink-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/50">
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">
                    Description
                  </th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">
                    Progress
                  </th>
                  <th className="text-left px-5 py-3.5 text-ink-500 text-xs font-semibold uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3.5 w-32" />
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
                        {evCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-100">
                            <Paperclip size={8} />
                            {evCount}
                          </span>
                        )}
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
                No debts found
              </p>
              <p className="text-ink-400 text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        {/* Modals — all via Portal so they never get clipped */}
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
            onUpload={handleEvidenceUpdate} // ← Match EvidencePanel prop
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
      {/* Toast Notification - Same as SignInPage */}
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
