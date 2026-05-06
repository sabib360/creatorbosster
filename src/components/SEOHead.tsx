import { Helmet } from 'react-helmet-async';
import { getToolSEOData, getCategorySEOData } from '../lib/keywordResearch';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: string;
  structuredData?: object;
  toolId?: string;
  categoryId?: string;
}

const categorySEOData = {
  'ai-tools': {
    title: 'Free AI Tools Online | AI Content Generator & Image Creator | CreatorBoost AI',
    description: 'Best free AI tools online: AI content generator, thumbnail creator, image generator. No signup required. Create viral content with AI-powered tools.',
    keywords: 'AI tools online, free AI tools, AI content generator, AI image generator, AI thumbnail creator, artificial intelligence tools, AI writing assistant, AI design tools',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AI Tools Suite - Creator Booster',
      description: 'Free AI-powered tools for content creation, image generation, and thumbnail design',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  },
  'image-tools': {
    title: 'Free Image Tools Online | Image Editor, Compressor & Converter | Creator Booster',
    description: 'Professional image tools: editor, compressor, resizer, converter. Optimize images for web. Free online image processing tools.',
    keywords: 'image editor online, image compression tool, image resizer, image converter, photo editor, image optimizer, free image tools, bulk image editor',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Image Tools Suite - Creator Booster',
      description: 'Free online image editing, compression, and conversion tools',
      applicationCategory: 'GraphicsApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  },
  'pdf-tools': {
    title: 'Free PDF Tools Online | PDF Editor, Merger & Converter | Creator Booster',
    description: 'Complete PDF toolkit: editor, merger, splitter, compressor, converter. Edit PDF files online for free. No watermark.',
    keywords: 'PDF editor online, PDF merger, PDF converter, PDF compressor, PDF splitter, free PDF tools, online PDF editor, PDF file converter',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'PDF Tools Suite - Creator Booster',
      description: 'Free online PDF editing, merging, and conversion tools',
      applicationCategory: 'OfficeApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  },
  'finance-tools': {
    title: 'Free Financial Calculators | Loan, EMI, SIP & Budget Calculator | Creator Booster',
    description: 'Essential financial tools: loan EMI calculator, SIP calculator, budget planner, tax calculator. Make informed financial decisions.',
    keywords: 'financial calculator, loan calculator, EMI calculator, SIP calculator, budget planner, tax calculator, currency converter, finance tools online',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Financial Tools Suite - Creator Booster',
      description: 'Free financial calculators for loans, investments, and budget planning',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  },
  'social-media-tools': {
    title: 'Free Social Media Tools | Hashtag Generator, Content Ideas & Scheduler | Creator Booster',
    description: 'Ultimate social media toolkit: hashtag generator, content ideas, caption writer, analytics, emoji picker. Boost your social media presence.',
    keywords: 'social media tools, hashtag generator, Instagram hashtag generator, content idea generator, social media scheduler, emoji picker, link shortener',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Social Media Tools Suite - Creator Booster',
      description: 'Free social media management and content creation tools',
      applicationCategory: 'SocialMediaApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  }
};

const toolSpecificSEOData = {
  'ai-thumbnail-generator': {
    title: 'Free AI YouTube Thumbnail Generator | Create Viral Thumbnails | Creator Booster',
    description: 'Generate stunning YouTube thumbnails with AI in seconds. Free AI thumbnail creator for content creators. No signup required.',
    keywords: 'AI thumbnail generator, YouTube thumbnail creator, AI image generator, video thumbnail maker, free thumbnail generator, YouTube thumbnail AI'
  },
  'image-compressor': {
    title: 'Free Image Compressor Online | Reduce Image Size Without Quality Loss | Creator Booster',
    description: 'Compress images online for free. Reduce image file size while maintaining quality. Best image optimizer for web.',
    keywords: 'image compressor, compress image online, reduce image size, image optimizer, image compression tool, JPEG compressor, PNG compressor'
  },
  'pdf-merger': {
    title: 'Free PDF Merger Online | Combine Multiple PDF Files | Creator Booster',
    description: 'Merge PDF files online for free. Combine multiple PDFs into one document. No watermark, no registration required.',
    keywords: 'PDF merger, merge PDF files, combine PDF, PDF joiner, concatenate PDF, merge multiple PDFs, free PDF merger'
  },
  'loan-emi-calculator': {
    title: 'Free Loan EMI Calculator | Calculate Monthly EMI Online | CreatorBoost AI',
    description: 'Calculate loan EMI instantly with our free online calculator. Check monthly payments, total interest, and payment schedule. Accurate EMI calculations for home, car, and personal loans.',
    keywords: 'loan EMI calculator, EMI calculator for loan, calculate loan EMI, monthly payment calculator loan, loan interest calculator, EMI calculator online, home loan EMI, car loan EMI, personal loan EMI calculator'
  },
  'ai-background-remover': {
    title: 'Free AI Background Remover | Remove Image Background Online | CreatorBoost AI',
    description: 'Remove image backgrounds instantly with AI. Free online background remover for product photos, portraits, and designs. No signup required.',
    keywords: 'AI background remover, remove background AI, background removal AI free, AI background eraser, remove background from image AI, AI cutout tool, background remover online, AI photo background remover'
  },
  'hashtag-generator': {
    title: 'Free Hashtag Generator | Instagram & TikTok Hashtags | CreatorBoost AI',
    description: 'Generate trending hashtags for Instagram, TikTok, and social media. Free hashtag generator for maximum reach and engagement. Viral hashtags in seconds.',
    keywords: 'hashtag generator, Instagram hashtag generator, free hashtag generator, TikTok hashtag generator, social media hashtag generator, viral hashtag generator, trending hashtags generator, hashtag generator for likes'
  },
  'content-idea-generator': {
    title: 'Free Content Idea Generator | YouTube & Social Media Ideas | CreatorBoost AI',
    description: 'Generate unlimited content ideas for YouTube, Instagram, and social media. Free AI-powered content idea generator for creators. Viral content ideas.',
    keywords: 'content idea generator, YouTube content ideas, content ideas generator, video content ideas, social media content ideas, AI content idea generator, viral content ideas generator, content topic generator'
  },
  'currency-converter': {
    title: 'Free Currency Converter | Real Time Exchange Rates | CreatorBoost AI',
    description: 'Convert currencies with real-time exchange rates. Free online currency converter for USD, EUR, GBP, and more. Live exchange rate calculator.',
    keywords: 'currency converter, exchange rate calculator, convert currency, currency exchange calculator, online currency converter, foreign exchange calculator, money converter, USD to EUR converter, real time currency converter'
  },
  'pdf-converter': {
    title: 'Free PDF Converter | Convert PDF to JPG, Word & More | CreatorBoost AI',
    description: 'Convert PDF to JPG, Word, Excel and more formats. Free online PDF converter with high quality. No email or signup required.',
    keywords: 'PDF converter, convert PDF to JPG, PDF to Word converter, change PDF format, image format converter, PDF file converter, online PDF converter, convert multiple PDF files, PDF converter without email'
  },
  'image-resizer': {
    title: 'Free Image Resizer Online | Change Image Dimensions | CreatorBoost AI',
    description: 'Resize images online for free. Change image dimensions for social media, web, and print. Best image resizer for Instagram, YouTube, and more.',
    keywords: 'image resizer, resize image online, change image size, image size converter, online image resizer, resize image to specific dimensions, image dimensions converter, resize image for social media'
  },
  'budget-planner': {
    title: 'Free Budget Planner | Monthly Budget Calculator | CreatorBoost AI',
    description: 'Plan your monthly budget with our free online budget planner. Track expenses, set savings goals, and manage finances effectively.',
    keywords: 'budget planner, budget calculator, monthly budget planner, personal budget tool, online budget planner, monthly budget calculator, personal budget planner free, budget planning tool, household budget calculator'
  },
  'sip-calculator': {
    title: 'Free SIP Calculator | Systematic Investment Plan | CreatorBoost AI',
    description: 'Calculate SIP returns and plan investments. Free SIP calculator for mutual funds with inflation and tax calculations. Best SIP calculator India.',
    keywords: 'SIP calculator, Systematic Investment Plan calculator, mutual fund SIP calculator, calculate SIP returns, SIP investment calculator, mutual fund SIP return calculator, SIP amount calculator, best SIP calculator online'
  },
  'link-shortener': {
    title: 'Free Link Shortener | Create Custom Short URLs | CreatorBoost AI',
    description: 'Create short links for free with analytics. Best URL shortener for social media, marketing, and tracking. Custom short URLs with click tracking.',
    keywords: 'link shortener, URL shortener, free link shortener, create short link, custom URL shortener, link shortener with analytics, short link generator, URL shortener free'
  },
  'emoji-picker': {
    title: 'Free Emoji Picker | Copy & Paste Emojis Online | CreatorBoost AI',
    description: 'Browse and copy emojis from all categories. Free online emoji picker with search. Best emoji keyboard for social media and messaging.',
    keywords: 'emoji picker, emoji keyboard, copy emoji online, emoji selector, online emoji picker, emoji copy paste, emoji keyboard for computer, emoji picker with search'
  },
  'social-analytics': {
    title: 'Free Social Media Analytics | Instagram Analytics Tool | CreatorBoost AI',
    description: 'Track social media performance with free analytics. Monitor Instagram engagement, follower growth, and content performance. No login required.',
    keywords: 'social media analytics, Instagram analytics tool, social media analytics free, Instagram performance tracker, social media analytics tools, Instagram engagement calculator'
  },
  'caption-writer': {
    title: 'Free AI Caption Writer | Instagram & Social Media Captions | CreatorBoost AI',
    description: 'Generate engaging captions for Instagram and social media with AI. Free caption writer for photos, posts, and content. Viral captions in seconds.',
    keywords: 'caption generator, Instagram caption generator, AI caption writer, social media caption generator, caption maker online, AI caption generator free, photo caption generator'
  }
};

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage = '/og-image.png',
  type = 'website',
  toolId,
  categoryId
}: SEOHeadProps) {
  
  // Get SEO data from keyword research if toolId or categoryId is provided
  const toolSEOData = toolId ? getToolSEOData(toolId) : null;
  const categorySEOData = categoryId ? getCategorySEOData(categoryId) : null;
  
  // Use provided data or fall back to research data
  const seoTitle = title || toolSEOData?.title || categorySEOData?.title || 'CreatorBoost AI';
  const seoDescription = description || toolSEOData?.description || categorySEOData?.description || 'Free online tools for content creators and professionals';
  const seoKeywords = keywords || toolSEOData?.primaryKeyword || categorySEOData?.primaryKeyword || 'online tools, free tools, content creator tools';
  const seoUrl = canonicalUrl || toolSEOData?.url || categorySEOData?.url || 'https://creatorboostai.xyz/';
  const seoStructuredData = structuredData || toolSEOData?.structuredData || categorySEOData?.structuredData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="CreatorBoost AI" />
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={`https://creatorboostai.xyz${ogImage}`} />
      <meta property="og:site_name" content="CreatorBoost AI" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={`https://creatorboostai.xyz${ogImage}`} />
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      {seoStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seoStructuredData)}
        </script>
      )}
      
      {/* Alternate Language */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}

export { categorySEOData, toolSpecificSEOData };
