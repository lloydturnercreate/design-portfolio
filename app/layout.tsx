import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { TransitionProvider } from '@/lib/context/TransitionContext';
import TransitionOverlay from './components/transitions/TransitionOverlay';
import LogoTransitionOverlay from './components/transitions/LogoTransitionOverlay';
import { siteConfig } from '@/lib/siteConfig';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'Lloyd Turner', url: siteConfig.domain }],
  creator: 'Lloyd Turner',
  openGraph: {
    title: siteConfig.title.default,
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.domain,
    siteName: 'Lloyd Turner Portfolio',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title.default,
    description: siteConfig.description,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <TransitionProvider>
          <TransitionOverlay />
          <LogoTransitionOverlay />
          {children}
        </TransitionProvider>
        <Analytics />
      </body>
    </html>
  );
}
