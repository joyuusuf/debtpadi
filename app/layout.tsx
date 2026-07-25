import type { Metadata } from "next";
import "./globals.css";
import { AvatarProvider } from "@/context/AvatarContext";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "DebtPadi — Smart Credit Tracker for Nigerian Businesses",
  description:
    "Track who owes you, send reminders, and get paid faster. Built for Nigerian small business owners.",
  icons: {
    icon: "/logo-mark.svg",
    shortcut: "/logo-mark.svg",
    apple: "/logo-mark.svg",
  },
  openGraph: {
    title: "DebtPadi — Smart Credit Tracker",
    description: "Track debts, send WhatsApp reminders, and collect faster.",
    images: [{ url: "/logo.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        {/* ✅ Wrap with both providers - order matters! */}
        <AuthProvider>
          <AvatarProvider>{children}</AvatarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
