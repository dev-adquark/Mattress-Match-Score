import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mattressmatchscore.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mattress Match Score — Find Your Personalized Mattress Match",
    template: "%s — Mattress Match Score",
  },
  description:
    "Get a transparent, personalized Match Score for mattresses based on your sleep position, weight, firmness preference, and temperature — not just a generic star rating.",
  openGraph: {
    type: "website",
    siteName: "Mattress Match Score",
    title: "Mattress Match Score — Find Your Personalized Mattress Match",
    description:
      "A transparent, personalized Match Score for mattresses — pressure relief, support, cooling, motion isolation, edge support, and risk flags.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mattress Match Score",
    description: "Find a mattress that matches your sleep profile — not just someone else's rating.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
