import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buffr Host - Hospitality Ecosystem Management Platform",
  description:
    "Unified hospitality management platform for hotels and restaurants with AI-powered insights and next-gen loyalty",
  keywords: [
    "hospitality",
    "hotel management",
    "restaurant management",
    "spa management",
    "conference management",
    "transportation",
    "loyalty system",
    "cross-business",
    "ai insights",
    "hospitality ecosystem",
    "namibia",
    "southern africa",
    "pos system",
    "inventory management",
    "analytics",
    "booking system",
  ],
  authors: [{ name: "Buffr Host Team" }],
  creator: "Buffr Host",
  publisher: "Buffr Host",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Buffr Host - Hospitality Ecosystem Management Platform",
    description:
      "Unified hospitality management platform for hotels and restaurants with AI-powered insights and next-gen loyalty",
    url: "/",
    siteName: "Buffr Host",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Buffr Host Hospitality Ecosystem Management Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buffr Host - Hospitality Ecosystem Management Platform",
    description:
      "Unified hospitality management platform for hotels and restaurants with AI-powered insights and next-gen loyalty",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
