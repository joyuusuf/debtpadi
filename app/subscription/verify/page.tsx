"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { subscription as subscriptionApi } from "@/lib/api";
import { usePlanUsage } from "@/hooks/usePlanUsage";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = usePlanUsage();
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "cancelled">("loading");
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref") ?? "";
    const transaction_id = searchParams.get("transaction_id") ?? "";
    const flw_status = searchParams.get("status") ?? "";
    const planParam = searchParams.get("plan") ?? "";

    if (flw_status === "cancelled") {
      setStatus("cancelled");
      return;
    }

    if (!tx_ref || !transaction_id) {
      setStatus("failed");
      setError("Missing transaction details. Please contact support.");
      return;
    }

    subscriptionApi
      .verify({ tx_ref, transaction_id, status: flw_status, plan: planParam })
      .then((res) => {
        setPlan(res.data.plan);
        setStatus("success");
        refresh(); // update sidebar usage instantly
        setTimeout(() => router.push("/subscription/success?plan=" + res.data.plan), 1800);
      })
      .catch((err) => {
        setError(err.message || "Verification failed. Contact support if you were charged.");
        setStatus("failed");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-lg p-10 text-center max-w-sm w-full">
        {status === "loading" && (
          <>
            <Loader2 size={40} className="text-jade animate-spin mx-auto mb-4" />
            <p className="font-heading font-bold text-ink-900 text-lg mb-1">Verifying payment</p>
            <p className="text-ink-400 text-sm">Please wait while we confirm your payment with Flutterwave...</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle size={48} className="text-jade mx-auto mb-4" />
            <p className="font-heading font-bold text-ink-900 text-xl mb-1">Payment confirmed!</p>
            <p className="text-ink-400 text-sm">Activating your {plan} plan...</p>
          </>
        )}
        {status === "cancelled" && (
          <>
            <XCircle size={40} className="text-amber-400 mx-auto mb-4" />
            <p className="font-heading font-bold text-ink-900 text-lg mb-2">Payment cancelled</p>
            <p className="text-ink-500 text-sm mb-6">No charge was made. You can try again anytime.</p>
            <button onClick={() => router.push("/subscription")}
              className="w-full bg-ink-900 text-white font-bold py-3 rounded-xl hover:bg-ink-700 transition">
              Back to Plans
            </button>
          </>
        )}
        {status === "failed" && (
          <>
            <XCircle size={40} className="text-coral-500 mx-auto mb-4" />
            <p className="font-heading font-bold text-ink-900 text-lg mb-2">Verification failed</p>
            <p className="text-ink-500 text-sm mb-6">{error}</p>
            <button onClick={() => router.push("/subscription")}
              className="w-full bg-ink-900 text-white font-bold py-3 rounded-xl hover:bg-ink-700 transition">
              Back to Plans
            </button>
          </>
        )}
      </div>
    </div>
  );
}
