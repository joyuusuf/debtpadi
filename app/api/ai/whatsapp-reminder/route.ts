import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { customerName, amountOwed, daysOverdue, businessName } = await req.json();

  const prompt = `You are a helpful assistant for a Nigerian small business owner. 
Write a short, polite WhatsApp payment reminder message in simple English.

Details:
- Customer name: ${customerName}
- Amount owed: ₦${amountOwed}
- Days overdue: ${daysOverdue}
- Business name: ${businessName}

Rules:
- Keep it under 60 words
- Be friendly but firm if overdue is more than 14 days
- Start with a greeting using the customer's first name
- Do not use em-dashes
- End with the business name
- Do not add any explanation, just the message itself`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  return Response.json({ message: text });
}