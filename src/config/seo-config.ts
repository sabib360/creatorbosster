/**
 * Global SEO Configuration
 * Single source of truth for all site-wide SEO settings.
 * Every page imports from here automatically.
 */

export const SEO_CONFIG = {
  siteName: 'CreatorBoost AI',
  siteUrl: 'https://creatorboostai.xyz',
  siteUrlNoSlash: 'https://creatorboostai.xyz',

  defaultTitle: 'Free AI Tools Online | Image, PDF, Finance & Social Media Tools | CreatorBoost AI',
  defaultDescription: '100+ free online tools: AI generators, image editors, PDF tools, financial calculators, social media tools. No signup required. Boost productivity with our all-in-one tool suite.',
  defaultKeywords: [
    'AI tools online',
    'free AI tools',
    'image editor',
    'PDF tools',
    'financial calculator',
    'social media tools',
    'hashtag generator',
    'loan calculator',
    'budget planner',
    'image compressor',
    'PDF merger',
    'emoji picker',
    'link shortener',
  ],

  defaultOgImage: 'https://creatorboostai.xyz/og-image.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,

  twitterUsername: '@creatorboostai',
  twitterCard: 'summary_large_image' as const,

  author: 'CreatorBoost AI',
  language: 'en',
  languageName: 'English',

  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  googlebot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  bingbot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  revisitAfter: '7 days',

  googleSearchConsoleVerification: 'dVZCpLRLWi0Ov2XXsAoHKfOPjNUNLpC9pX3A1vpYtAs',
  ga4MeasurementId: 'G-V1ETYXFVKZ',
  adsensePublisherId: 'ca-pub-2121336720951736',

  themeColor: '#0f172a',
  msapplicationTileColor: '#0f172a',

  socialProfiles: {
    facebook: 'https://www.facebook.com/profile.php?id=61572335704389',
    twitter: 'https://twitter.com/creatorboostai',
  },

  contact: {
    email: 'support@creatorboostai.xyz',
  },

  organization: {
    name: 'CreatorBoost AI',
    url: 'https://creatorboostai.xyz',
    logo: 'https://creatorboostai.xyz/favicon.svg',
    description: 'All-in-one toolkit for creators with 100+ tools for image processing, PDF editing, AI-powered content creation, and financial calculations.',
    sameAs: ['https://www.facebook.com/profile.php?id=61572335704389'],
    aggregateRating: {
      ratingValue: '4.8',
      ratingCount: '2500',
      bestRating: '5',
      worstRating: '1',
    },
  },
} as const;

export type SEOConfig = typeof SEO_CONFIG;
