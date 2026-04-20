"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "success" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const enter = setTimeout(() => setVisible(true), 10);
        // Auto-dismiss after 4s
        const exit = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 4000);

        return () => {
            clearTimeout(enter);
            clearTimeout(exit);
        };
    }, [onClose]);

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] transition-all duration-300 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
        >
            <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-2xl border backdrop-blur-xl min-w-[280px] max-w-[420px] ${type === "success"
                    ? "bg-ink-900/95 border-jade/20"
                    : "bg-ink-900/95 border-red-500/20"
                    }`}
            >
                {/* Icon */}
                {type === "success" ? (
                    <CheckCircle size={18} className="text-jade flex-shrink-0" />
                ) : (
                    <XCircle size={18} className="text-red-400 flex-shrink-0" />
                )}

                {/* Message */}
                <p className="text-sm font-medium text-white flex-1 leading-snug">
                    {message}
                </p>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl overflow-hidden">
                    <div
                        className={`h-full animate-shrink ${type === "success" ? "bg-jade" : "bg-red-400"
                            }`}
                    />
                </div>

                {/* Close */}
                <button
                    onClick={() => {
                        setVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-ink-500 hover:text-white transition-colors flex-shrink-0 ml-1"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}