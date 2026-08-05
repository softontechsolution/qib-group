import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QIB Group Limited",
  description: "QIB Group is a diversified conglomerate driving sustainable growth across multiple industries.",
};

import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="min-h-full bg-white text-black selection:bg-[#0096c7]/30 selection:text-[#0096c7]">
        <AuthProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </AuthProvider>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </body>
    </html>
  );
}