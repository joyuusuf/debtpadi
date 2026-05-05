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
  Image,
  FileText,
  Upload,
  Eye,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useEffect, useRef } from "react";
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
// ─── NEW: real-data hook ──────────────────────────────────────────────────────
import { useDebts, type DebtForm } from "@/hooks/useDebts";

// ─── helpers ─────────────────────────────────────────────────────────────────

const EMPTY_FORM: DebtForm = {
  customerName: "",
  phone: "",
  description: "",
  amount: "",
  amountPaid: "",
  dueDate: "",
};

// ─── Action dropdown ──────────────────────────────────────────────────────────

function ActionMenu({
  onEdit,
  onDelete,
  onEvidence,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onEvidence: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 rounded-lg bg-ink-50 hover:bg-ink-100 text-ink-500 hover:text-ink-700 flex items-center justify-center transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 bg-white border border-ink-100 rounded-xl shadow-lg shadow-ink-900/10 w-44 py-1 animate-fade-in">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <Pencil size={14} className="text-ink-400" />
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onEvidence();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition-colors"
          >
            <Paperclip size={14} className="text-ink-400" />
            View Evidence
          </button>
          <div className="mx-3 my-1 h-px bg-ink-100" />
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-coral-600 hover:bg-coral-50 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Reminder modal (WhatsApp + SMS) ─────────────────────────────────────────

function ReminderModal({
  debt,
  onClose,
}: {
  debt: DebtRecord;
  onClose: () => void;
}) {
  const outstanding = debt.amount - debt.amountPaid;
  const evCount = debt.evidences?.length || 0;
  const hasEvidence = evCount > 0;
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

  function sendWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  }

  function sendSMS() {
    window.open(`sms:?body=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
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
          {hasEvidence ? (
            <div className="bg-jade/5 border border-jade/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-jade/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Paperclip size={15} className="text-jade" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-jade-700 text-sm font-semibold">
                    {evCount} evidence file{evCount !== 1 ? "s" : ""} attached
                  </p>
                  <p className="text-jade-700/70 text-xs mt-0.5 leading-relaxed">
                    Evidence is saved and will be linked automatically.
                  </p>
                </div>
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
                  businessName: "Titilayo Farms & Agro Supplies",
                })
              }
              disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs bg-jade/10 hover:bg-jade/20 text-jade-700 font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                onClick={sendWhatsApp}
                className="flex flex-col items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 py-4 px-3 rounded-xl transition-all hover:shadow-md group"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
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
                onClick={sendSMS}
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
  );
}

// ─── Evidence viewer (lightbox) ───────────────────────────────────────────────

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
    <div
      className="fixed inset-0 z-[60] bg-ink-900/95 backdrop-blur-sm flex items-center justify-center p-4"
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
                <p className="text-ink-500 text-sm italic">"{current.note}"</p>
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
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() =>
                setIdx((i) => Math.min(evidences.length - 1, i + 1))
              }
              disabled={idx === evidences.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
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
    const promises = Array.from(files).map(
      (file) =>
        new Promise<Evidence>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: `ev${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
              name: file.name,
              type: file.type.startsWith("image/") ? "image" : "document",
              url: e.target?.result as string,
              uploadedAt: new Date().toISOString().split("T")[0],
            });
          };
          reader.readAsDataURL(file);
        }),
    );
    Promise.all(promises).then((newEvs) => {
      const updated = [...evidences, ...newEvs];
      setEvidences(updated);
      onUpdate(debt.id, updated); // ← persists to backend via useDebts.updateEvidences
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
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
                Upload receipts, photos of goods delivered, written agreements,
                or screenshots of payment conversations. This protects you in
                case of disputes.
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
                className="border-2 border-dashed border-ink-200 hover:border-jade/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-jade/2 group"
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
                  {uploading ? "Uploading..." : "Tap to upload or drag & drop"}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
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
  );
}

// ─── Add / Edit modal ─────────────────────────────────────────────────────────

function DebtModal({
  mode,
  initial,
  existingCustomers,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-ink-900/60 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl animate-fade-up max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 flex-shrink-0">
          <h2 className="font-heading font-bold text-lg text-ink-900">
            {mode === "add" ? "Add Debt Record" : "Edit Debt Record"}
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
            {mode === "add" && existingCustomers.length > 0 && (
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
            {useExisting && mode === "add" ? (
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
            className="flex-1 border border-ink-200 text-ink-600 font-semibold py-3 rounded-xl hover:bg-ink-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="debt-form"
            disabled={saving}
            className="flex-[2] bg-ink-900 hover:bg-ink-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                {mode === "add" ? "Saving..." : "Updating..."}
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {mode === "add" ? "Save Debt" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DebtorsPage() {
  // ── Replace mock state with real API hook ──
  const {
    debts,
    loading,
    error,
    addDebt,
    editDebt,
    removeDebt,
    updateEvidences,
  } = useDebts();

  const [filter, setFilter] = useState<
    "all" | "overdue" | "partial" | "cleared" | "pending"
  >("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DebtRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DebtRecord | null>(null);
  const [reminderDebt, setReminderDebt] = useState<DebtRecord | null>(null);
  const [evidenceDebt, setEvidenceDebt] = useState<DebtRecord | null>(null);
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

  async function handleEdit(form: DebtForm) {
    if (!editTarget) return;
    try {
      setActionError(null);
      await editDebt(editTarget.id, form);
      setEditTarget(null);
    } catch (err: unknown) {
      setActionError(
        err instanceof Error ? err.message : "Failed to update debt",
      );
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

  async function handleEvidenceUpdate(debtId: string, evidences: Evidence[]) {
    try {
      await updateEvidences(debtId, evidences);
      // Keep evidence panel in sync with latest data
      setEvidenceDebt((prev) =>
        prev && prev.id === debtId ? { ...prev, evidences } : prev,
      );
    } catch (err: unknown) {
      // Non-blocking — evidence optimistically updated in UI already
      console.error("Evidence sync failed:", err);
    }
  }

  function toForm(d: DebtRecord): DebtForm {
    return {
      customerName: d.customerName,
      phone: "",
      description: d.description,
      amount: String(d.amount),
      amountPaid: String(d.amountPaid),
      dueDate: d.dueDate || "",
    };
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
        {/* Inline action error banner */}
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

        {/* Header */}
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
                  <th className="px-5 py-3.5 w-28" />
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
                    <tr key={debt.id} className="table-row-hover">
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
                      <td className="px-5 py-4">
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
                            title="Debt evidence"
                          >
                            <Paperclip size={14} />
                          </button>
                          <ActionMenu
                            onEdit={() => setEditTarget(debt)}
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
            return (
              <div
                key={debt.id}
                className="bg-white border border-ink-100 rounded-2xl p-4"
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
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {debt.status !== "cleared" && (
                      <button
                        onClick={() => setReminderDebt(debt)}
                        className="w-8 h-8 rounded-lg bg-jade/10 hover:bg-jade/20 text-jade flex items-center justify-center transition-colors"
                      >
                        <MessageSquare size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setEvidenceDebt(debt)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${evCount > 0 ? "bg-amber-50 text-amber-500" : "bg-ink-50 text-ink-400"}`}
                    >
                      <Paperclip size={14} />
                    </button>
                    <ActionMenu
                      onEdit={() => setEditTarget(debt)}
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

        {/* ── MODALS ── */}
        {addOpen && (
          <DebtModal
            mode="add"
            initial={EMPTY_FORM}
            existingCustomers={existingCustomers}
            onSave={handleAdd}
            onClose={() => setAddOpen(false)}
          />
        )}
        {editTarget && (
          <DebtModal
            mode="edit"
            initial={toForm(editTarget)}
            existingCustomers={existingCustomers}
            onSave={handleEdit}
            onClose={() => setEditTarget(null)}
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
      </div>
    </>
  );
}
