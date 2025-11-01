import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Inter,
  Playfair_Display,
  JetBrains_Mono,
  Dancing_Script,
} from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import Providers from './providers';

// Force dynamic rendering for all pages in the app
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false, // Only preload fonts that are immediately visible
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false, // Only preload fonts that are immediately visible
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
  preload: false, // Only preload fonts that are immediately visible
});

export const metadata: Metadata = {
  title: 'Buffr Host - The Future of Hospitality, Today',
  description:
    'One platform for every hospitality business. From hotels to standalone restaurants, we bring the sophisticated design language of five-star hotels to businesses of every size.',
  keywords:
    'hospitality, hotel management, restaurant management, AI concierge, guest experience, booking system',
  authors: [{ name: 'Buffr Host Team' }],
  creator: 'Buffr Host',
  publisher: 'Buffr Host',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://buffr.host'),
  openGraph: {
    title: 'Buffr Host - The Future of Hospitality, Today',
    description:
      'One platform for every hospitality business. AI-powered guest experience management.',
    url: 'https://buffr.host',
    siteName: 'Buffr Host',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Buffr Host - Hospitality Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buffr Host - The Future of Hospitality, Today',
    description:
      'One platform for every hospitality business. AI-powered guest experience management.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${dancing.variable}`}
    >
      <head>
        {/* Mobile Optimization Meta Tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Buffr Host" />
        <meta name="theme-color" content="#d18b5c" />
        <meta name="msapplication-TileColor" content="#d18b5c" />

        {/* Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-body antialiased min-h-screen bg-gray-50 text-gray-900">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
