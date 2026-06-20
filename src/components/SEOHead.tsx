import { Helmet } from 'react-helmet-async';
import { SEO_CONFIG } from '../config/seo-config';
import { organizationSchema } from '../lib/schema';

export const categorySEOData: Record<string, {
  title: string;
  description: string;
  keywords: string;
  structuredData: object;
}> = {
  'ai-tools': {
    title: 'Free AI Tools Online | AI Content Generator & Image Creator | CreatorBoost AI',
    description: 'Best free AI tools online: AI content generator, thumbnail creator, image generator. No signup required.',
    keywords: 'AI tools online, free AI tools, AI content generator',
    structuredData: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'AI Tools Suite', applicationCategory: 'MultimediaApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  },
  'image-tools': {
    title: 'Free Image Tools Online | Image Editor, Compressor & Converter | CreatorBoost AI',
    description: 'Professional image tools: editor, compressor, resizer, converter. Optimize images for web.',
    keywords: 'image editor online, image compression tool, image resizer',
    structuredData: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Image Tools Suite', applicationCategory: 'GraphicsApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  },
  'pdf-tools': {
    title: 'Free PDF Tools Online | PDF Editor, Merger & Converter | CreatorBoost AI',
    description: 'Complete PDF toolkit: editor, merger, splitter, compressor, converter.',
    keywords: 'PDF editor online, PDF merger, PDF converter, PDF compressor',
    structuredData: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'PDF Tools Suite', applicationCategory: 'OfficeApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  },
  'finance-tools': {
    title: 'Free Financial Calculators | Loan, EMI, SIP & Budget Calculator | CreatorBoost AI',
    description: 'Essential financial tools: loan EMI calculator, SIP calculator, budget planner.',
    keywords: 'financial calculator, loan calculator, EMI calculator',
    structuredData: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Financial Tools Suite', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  },
  'social-media-tools': {
    title: 'Free Social Media Tools | Hashtag Generator, Content Ideas & More | CreatorBoost AI',
    description: 'Ultimate social media toolkit: hashtag generator, content ideas, caption writer.',
    keywords: 'social media tools, hashtag generator, content idea generator',
    structuredData: { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Social Media Tools Suite', applicationCategory: 'SocialMediaApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  },
};

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  type?: string;
  structuredData?: object | object[];
  robots?: string;
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export default function SEOHead({
  title,
  description,
  keywords = '',
  canonicalUrl,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  type = 'website',
  structuredData,
  robots,
  noindex = false,
  article,
}: SEOHeadProps) {
  const config = SEO_CONFIG;
  const finalOgImage = ogImage
    ? ogImage.startsWith('http') ? ogImage : `${config.siteUrl}${ogImage}`
    : config.defaultOgImage;
  const finalCanonical = canonicalUrl || `${config.siteUrl}/`;
  const finalRobots = noindex ? 'noindex, nofollow' : (robots || config.robots);

  const orgSchema = organizationSchema();
  const allSchemas = structuredData
    ? Array.isArray(structuredData)
      ? [orgSchema, ...structuredData]
      : [orgSchema, structuredData]
    : [orgSchema];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={config.author} />
      <meta name="language" content={config.languageName} />
      <meta name="revisit-after" content={config.revisitAfter} />

      {/* Robots */}
      <meta name="robots" content={finalRobots} />
      <meta name="googlebot" content={config.googlebot} />
      <meta name="bingbot" content={config.bingbot} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content={String(ogImageWidth || config.ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight || config.ogImageHeight)} />
      <meta property="og:site_name" content={config.siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={config.twitterCard} />
      <meta name="twitter:url" content={finalCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:creator" content={config.twitterUsername} />

      {/* Article-specific Open Graph */}
      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Theme & Mobile */}
      <meta name="theme-color" content={config.themeColor} />
      <meta name="msapplication-TileColor" content={config.msapplicationTileColor} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />

      {/* Hreflang for multi-language */}
      <link rel="alternate" hrefLang="en" href={finalCanonical} />
      <link rel="alternate" hrefLang="x-default" href={finalCanonical} />

      {/* All Structured Data */}
      {allSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}
