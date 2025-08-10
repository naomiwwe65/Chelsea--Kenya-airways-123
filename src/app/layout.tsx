import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kenya Airways MRO Inventory",
  description: "Aviation parts logistics and MRO management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-app-gradient text-white min-h-[100dvh]`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="glow-blob glow-1" />
          <div className="glow-blob glow-2" />
          <div className="bubble red b1" />
          <div className="bubble green b2" />
          <div className="bubble red b3" />
          <div className="bubble green b4" />
          <div className="bubble red b5" />
        </div>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
