import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: string;
  structuredData?: object;
}

const categorySEOData = {
  'ai-tools': {
    title: 'Free AI Tools Online | AI Content Generator & Image Creator | Creator Booster',
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
    title: 'Free Loan EMI Calculator | Calculate Monthly EMI Online | Creator Booster',
    description: 'Calculate loan EMI instantly with our free online calculator. Check monthly payments, total interest, and payment schedule.',
    keywords: 'loan EMI calculator, EMI calculator, loan calculator, monthly EMI calculation, home loan calculator, personal loan EMI, car loan EMI'
  },
  'hashtag-generator': {
    title: 'Free Instagram Hashtag Generator | Best Hashtags for Posts | Creator Booster',
    description: 'Generate trending hashtags for Instagram and TikTok. Free hashtag generator to boost your social media reach and engagement.',
    keywords: 'Instagram hashtag generator, hashtag generator, best hashtags for Instagram, TikTok hashtag generator, viral hashtags, hashtag research tool'
  }
};

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonicalUrl = 'https://creatorboostai.xyz/', 
  ogImage = '/og-image.png',
  type = 'website',
  structuredData 
}: SEOHeadProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Creator Booster AI" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://creatorboostai.xyz${ogImage}`} />
      <meta property="og:site_name" content="Creator Booster" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`https://creatorboostai.xyz${ogImage}`} />
      <meta property="twitter:creator" content="@creatorboostai" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="theme-color" content="#0f172a" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Alternate Language */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </Helmet>
  );
}

export { categorySEOData, toolSpecificSEOData };
