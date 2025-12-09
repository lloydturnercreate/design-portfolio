import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TransitionProvider } from '@/lib/context/TransitionContext';
import TransitionOverlay from './components/transitions/TransitionOverlay';
import LogoTransitionOverlay from './components/transitions/LogoTransitionOverlay';

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
  metadataBase: new URL('https://lloydturner.co.uk'),
  title: {
    default: 'Lloyd Turner | Strategic Design Partner',
    template: '%s | Lloyd Turner',
  },
  description: 'Ex-Google, Ex-MoonPay Strategic Design Partner helping fintech & Web3 teams ship investor-grade products.',
  keywords: [
    'product design',
    'fintech',
    'Web3',
    'design systems',
    'UX design',
    'Strategic Design Partner',
    'Google',
    'MoonPay',
    'startup design',
  ],
  authors: [{ name: 'Lloyd Turner', url: 'https://lloydturner.co.uk' }],
  creator: 'Lloyd Turner',
  openGraph: {
    title: 'Lloyd Turner | Strategic Design Partner',
    description: 'Ex-Google, Ex-MoonPay Strategic Design Partner helping fintech & Web3 teams ship investor-grade products.',
    type: 'website',
    url: 'https://lloydturner.co.uk',
    siteName: 'Lloyd Turner Portfolio',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lloyd Turner | Strategic Design Partner',
    description: 'Ex-Google, Ex-MoonPay Strategic Design Partner helping fintech & Web3 teams ship investor-grade products.',
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
      </body>
    </html>
  );
}
