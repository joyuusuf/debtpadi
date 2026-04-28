// hooks/useWhatsappReminder.ts
import { useState } from "react";

interface GenerateParams {
  customerName: string;
  amountOwed: number;
  daysOverdue: number;
  businessName: string;
}

export function useWhatsappReminder() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate({ customerName, amountOwed, daysOverdue, businessName }: GenerateParams) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Write a short, polite but firm WhatsApp payment reminder message in Nigerian English for a small business owner.

Customer name: ${customerName}
Amount owed: ₦${amountOwed.toLocaleString("en-NG")}
Days overdue: ${daysOverdue > 0 ? daysOverdue : "not yet overdue"}
Business name: ${businessName}

Rules:
- Keep it under 100 words
- Friendly but firm tone
- Mention the amount clearly
- No hashtags, no emojis overload (one or two max)
- End with a call to action
- Return ONLY the message text, nothing else`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "";
      setMessage(text.trim());
    } catch (err) {
      console.error("useWhatsappReminder error:", err);
      setMessage("Failed to generate message. Please type your reminder manually.");
    } finally {
      setLoading(false);
    }
  }

  return { generate, message, loading, setMessage };
}