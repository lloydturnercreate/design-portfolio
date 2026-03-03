/**
 * Site configuration - supports both startup and enterprise versions
 * Determines which version based on NEXT_PUBLIC_SITE_TYPE environment variable
 */

export type SiteType = 'startup' | 'enterprise';

const getSiteType = (): SiteType => {
  // Default to 'startup' if not set
  return (process.env.NEXT_PUBLIC_SITE_TYPE as SiteType) || 'startup';
};

export const siteConfig = {
  type: getSiteType(),
  domain: getSiteType() === 'enterprise' 
    ? 'https://work.lloydturner.co.uk' 
    : 'https://lloydturner.co.uk',
  title: {
    default: getSiteType() === 'enterprise'
      ? 'Lloyd Turner | Enterprise Design Partner'
      : 'Lloyd Turner | Strategic Design Partner',
    template: '%s | Lloyd Turner',
  },
  description: getSiteType() === 'enterprise'
    ? 'Ex-Google, Ex-MoonPay Enterprise Design Partner helping established companies transform their digital products and design systems.'
    : 'Ex-Google, Ex-MoonPay Strategic Design Partner helping tech & finance teams ship investor-grade products.',
  keywords: getSiteType() === 'enterprise'
    ? [
        'enterprise design',
        'design systems',
        'product design',
        'UX design',
        'enterprise UX',
        'design transformation',
        'Strategic Design Partner',
        'Google',
        'MoonPay',
      ]
    : [
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
} as const;
