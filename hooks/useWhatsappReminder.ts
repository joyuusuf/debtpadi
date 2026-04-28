import { useState } from "react";

interface ReminderParams {
  customerName: string;
  amountOwed: number;
  daysOverdue: number;
  businessName: string;
}

export function useWhatsappReminder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generate = async (params: ReminderParams) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/whatsapp-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("AI reminder failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return { generate, message, loading, setMessage };
}