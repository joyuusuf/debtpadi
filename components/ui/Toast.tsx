"use client";
import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
  duration?: number; // ms, default 4000; set to 0 to disable auto-close
}

export function Toast({
  message,
  type = "info",
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const styles = {
    success: "bg-jade text-white",
    error: "bg-coral-500 text-white",
    info: "bg-ink-800 text-white",
  }[type];

  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium min-w-[240px] max-w-xs ${styles} animate-fade-up`}
      role="alert"
    >
      {Icon && <Icon size={18} className="flex-shrink-0" />}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
