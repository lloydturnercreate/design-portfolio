import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnimationProvider from './components/AnimationProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lloydturner.co.uk'),
  title: {
    default: 'Lloyd Turner | Senior Product Designer',
    template: '%s | Lloyd Turner',
  },
  description: 'Ex-Google, Ex-MoonPay Senior Product Designer helping fintech & Web3 teams ship investor-grade products.',
  keywords: [
    'product design',
    'fintech',
    'Web3',
    'design systems',
    'UX design',
    'Senior Product Designer',
    'Google',
    'MoonPay',
    'startup design',
  ],
  authors: [{ name: 'Lloyd Turner', url: 'https://lloydturner.co.uk' }],
  creator: 'Lloyd Turner',
  openGraph: {
    title: 'Lloyd Turner | Senior Product Designer',
    description: 'Ex-Google, Ex-MoonPay Senior Product Designer helping fintech & Web3 teams ship investor-grade products.',
    type: 'website',
    url: 'https://lloydturner.co.uk',
    siteName: 'Lloyd Turner Portfolio',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lloyd Turner | Senior Product Designer',
    description: 'Ex-Google, Ex-MoonPay Senior Product Designer helping fintech & Web3 teams ship investor-grade products.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
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
        <AnimationProvider>{children}</AnimationProvider>
      </body>
    </html>
  );
}

