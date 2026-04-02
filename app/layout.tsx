import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DebtPadi - Smart Credit Tracker for Nigerian Businesses",
  description: "Track who owes you, send reminders, and get paid faster. Built for Nigerian small business owners.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
