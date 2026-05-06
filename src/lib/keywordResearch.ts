// Comprehensive Keyword Research Data for CreatorBoost AI
// Based on search volume, competition analysis, and user intent

export interface KeywordData {
  keyword: string;
  monthlyVolume: number;
  difficulty: number;
  intent: 'transactional' | 'informational' | 'commercial';
  category: 'ai' | 'image' | 'pdf' | 'finance' | 'social';
  tool?: string;
}

export interface ToolSEOData {
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  title: string;
  description: string;
  url: string;
  category: string;
}

// AI Tools Category Keywords
export const aiToolsKeywords: KeywordData[] = [
  {
    keyword: 'AI thumbnail generator',
    monthlyVolume: 22000,
    difficulty: 78,
    intent: 'transactional',
    category: 'ai',
    tool: 'thumbnail-generator'
  },
  {
    keyword: 'YouTube thumbnail maker AI',
    monthlyVolume: 18000,
    difficulty: 65,
    intent: 'transactional',
    category: 'ai',
    tool: 'thumbnail-generator'
  },
  {
    keyword: 'AI background remover',
    monthlyVolume: 45000,
    difficulty: 82,
    intent: 'transactional',
    category: 'ai',
    tool: 'background-remover'
  },
  {
    keyword: 'AI image analyzer',
    monthlyVolume: 18000,
    difficulty: 71,
    intent: 'transactional',
    category: 'ai',
    tool: 'image-analyzer'
  },
  {
    keyword: 'AI assistant for content creators',
    monthlyVolume: 15000,
    difficulty: 72,
    intent: 'transactional',
    category: 'ai',
    tool: 'assistant'
  }
];

// Image Tools Category Keywords
export const imageToolsKeywords: KeywordData[] = [
  {
    keyword: 'image resizer',
    monthlyVolume: 201000,
    difficulty: 88,
    intent: 'transactional',
    category: 'image',
    tool: 'resizer'
  },
  {
    keyword: 'image compressor',
    monthlyVolume: 165000,
    difficulty: 85,
    intent: 'transactional',
    category: 'image',
    tool: 'compressor'
  },
  {
    keyword: 'image converter',
    monthlyVolume: 148000,
    difficulty: 86,
    intent: 'transactional',
    category: 'image',
    tool: 'converter'
  },
  {
    keyword: 'image cropper',
    monthlyVolume: 98000,
    difficulty: 81,
    intent: 'transactional',
    category: 'image',
    tool: 'cropper'
  },
  {
    keyword: 'passport size photo maker',
    monthlyVolume: 45000,
    difficulty: 76,
    intent: 'transactional',
    category: 'image',
    tool: 'passport-size'
  }
];

// PDF Tools Category Keywords
export const pdfToolsKeywords: KeywordData[] = [
  {
    keyword: 'PDF converter',
    monthlyVolume: 245000,
    difficulty: 91,
    intent: 'transactional',
    category: 'pdf',
    tool: 'converter'
  },
  {
    keyword: 'PDF compressor',
    monthlyVolume: 89000,
    difficulty: 83,
    intent: 'transactional',
    category: 'pdf',
    tool: 'compressor'
  },
  {
    keyword: 'PDF merger',
    monthlyVolume: 74000,
    difficulty: 79,
    intent: 'transactional',
    category: 'pdf',
    tool: 'merger'
  },
  {
    keyword: 'PDF splitter',
    monthlyVolume: 62000,
    difficulty: 76,
    intent: 'transactional',
    category: 'pdf',
    tool: 'splitter'
  },
  {
    keyword: 'PDF summarizer',
    monthlyVolume: 45000,
    difficulty: 74,
    intent: 'transactional',
    category: 'pdf',
    tool: 'summarizer'
  }
];

// Finance Tools Category Keywords
export const financeToolsKeywords: KeywordData[] = [
  {
    keyword: 'currency converter',
    monthlyVolume: 1200000,
    difficulty: 95,
    intent: 'transactional',
    category: 'finance',
    tool: 'currency-converter'
  },
  {
    keyword: 'tax calculator',
    monthlyVolume: 450000,
    difficulty: 88,
    intent: 'transactional',
    category: 'finance',
    tool: 'tax-calculator'
  },
  {
    keyword: 'loan EMI calculator',
    monthlyVolume: 165000,
    difficulty: 82,
    intent: 'transactional',
    category: 'finance',
    tool: 'loan-emi-calculator'
  },
  {
    keyword: 'SIP calculator',
    monthlyVolume: 98000,
    difficulty: 76,
    intent: 'transactional',
    category: 'finance',
    tool: 'sip-calculator'
  },
  {
    keyword: 'budget planner',
    monthlyVolume: 165000,
    difficulty: 81,
    intent: 'transactional',
    category: 'finance',
    tool: 'budget-planner'
  }
];

// Social Media Tools Category Keywords
export const socialMediaToolsKeywords: KeywordData[] = [
  {
    keyword: 'link shortener',
    monthlyVolume: 450000,
    difficulty: 89,
    intent: 'transactional',
    category: 'social',
    tool: 'link-shortener'
  },
  {
    keyword: 'emoji picker',
    monthlyVolume: 450000,
    difficulty: 85,
    intent: 'transactional',
    category: 'social',
    tool: 'emoji-picker'
  },
  {
    keyword: 'hashtag generator',
    monthlyVolume: 165000,
    difficulty: 84,
    intent: 'transactional',
    category: 'social',
    tool: 'hashtag-generator'
  },
  {
    keyword: 'content idea generator',
    monthlyVolume: 98000,
    difficulty: 76,
    intent: 'transactional',
    category: 'social',
    tool: 'content-idea-generator'
  },
  {
    keyword: 'caption generator',
    monthlyVolume: 125000,
    difficulty: 79,
    intent: 'transactional',
    category: 'social',
    tool: 'caption-writer'
  }
];

// Tool-specific SEO data generation
export function getToolSEOData(toolId: string): ToolSEOData | null {
  const toolMap: Record<string, ToolSEOData> = {
    'ai-thumbnail-generator': {
      primaryKeyword: 'AI thumbnail generator',
      secondaryKeywords: ['YouTube thumbnail maker AI', 'AI thumbnail creator', 'free AI thumbnail generator'],
      longTailKeywords: ['best AI thumbnail generator for YouTube', 'AI thumbnail generator from video title', 'free AI thumbnail maker no watermark'],
      title: 'Free AI YouTube Thumbnail Generator | Create Viral Thumbnails | CreatorBoost AI',
      description: 'Generate stunning YouTube thumbnails with AI in seconds. Free AI thumbnail creator for content creators. No signup required. Create viral thumbnails that boost engagement.',
      url: '/ai-tools/thumbnail-generator',
      category: 'ai-tools'
    },
    'ai-background-remover': {
      primaryKeyword: 'AI background remover',
      secondaryKeywords: ['remove background AI', 'AI background removal tool', 'free AI background remover'],
      longTailKeywords: ['best AI background remover online', 'free AI background remover no signup', 'AI background remover for product photos'],
      title: 'Free AI Background Remover | Remove Image Background Online | CreatorBoost AI',
      description: 'Remove image backgrounds instantly with AI. Free online background remover for product photos, portraits, and designs. No signup required. Professional results in seconds.',
      url: '/ai-tools/background-remover',
      category: 'ai-tools'
    },
    'image-compressor': {
      primaryKeyword: 'image compressor',
      secondaryKeywords: ['compress image online', 'reduce image file size', 'image size reducer'],
      longTailKeywords: ['best image compressor for web', 'compress multiple images at once', 'image compressor for social media'],
      title: 'Free Image Compressor Online | Reduce Image Size Without Quality Loss | CreatorBoost AI',
      description: 'Compress images online for free. Reduce image file size while maintaining quality. Best image optimizer for web, social media, and email. No watermark.',
      url: '/image-tools/compressor',
      category: 'image-tools'
    },
    'image-resizer': {
      primaryKeyword: 'image resizer',
      secondaryKeywords: ['resize image online', 'change image size', 'image size converter'],
      longTailKeywords: ['resize image for Instagram', 'change image dimensions online', 'resize image without losing quality'],
      title: 'Free Image Resizer Online | Change Image Dimensions | CreatorBoost AI',
      description: 'Resize images online for free. Change image dimensions for social media, web, and print. Best image resizer for Instagram, YouTube, and more. Instant results.',
      url: '/image-tools/resizer',
      category: 'image-tools'
    },
    'pdf-converter': {
      primaryKeyword: 'PDF converter',
      secondaryKeywords: ['convert PDF to', 'PDF to JPG converter', 'change PDF format'],
      longTailKeywords: ['convert PDF to JPG free', 'best PDF converter online', 'convert multiple PDF files'],
      title: 'Free PDF Converter | Convert PDF to JPG, Word & More | CreatorBoost AI',
      description: 'Convert PDF to JPG, Word, Excel and more formats. Free online PDF converter with high quality. No email or signup required. Fast and secure.',
      url: '/pdf-tools/converter',
      category: 'pdf-tools'
    },
    'currency-converter': {
      primaryKeyword: 'currency converter',
      secondaryKeywords: ['exchange rate calculator', 'convert currency', 'currency exchange calculator'],
      longTailKeywords: ['USD to EUR converter', 'best currency converter app', 'real time currency converter'],
      title: 'Free Currency Converter | Real Time Exchange Rates | CreatorBoost AI',
      description: 'Convert currencies with real-time exchange rates. Free online currency converter for USD, EUR, GBP, and more. Live exchange rate calculator. Accurate and fast.',
      url: '/finance-tools/currency-converter',
      category: 'finance-tools'
    },
    'hashtag-generator': {
      primaryKeyword: 'hashtag generator',
      secondaryKeywords: ['Instagram hashtag generator', 'free hashtag generator', 'best hashtags generator'],
      longTailKeywords: ['hashtag generator for Instagram reels', 'viral hashtag generator', 'trending hashtags generator'],
      title: 'Free Hashtag Generator | Instagram & TikTok Hashtags | CreatorBoost AI',
      description: 'Generate trending hashtags for Instagram, TikTok, and social media. Free hashtag generator for maximum reach and engagement. Viral hashtags in seconds. Boost your social media presence.',
      url: '/social-media-tools/hashtag-generator',
      category: 'social-media-tools'
    }
  };

  return toolMap[toolId] || null;
}

// Category-level SEO data
export function getCategorySEOData(category: string): ToolSEOData | null {
  const categoryMap: Record<string, ToolSEOData> = {
    'ai-tools': {
      primaryKeyword: 'AI tools online',
      secondaryKeywords: ['free AI tools', 'AI content generator', 'AI image generator', 'AI thumbnail creator'],
      longTailKeywords: ['best AI tools 2024', 'AI productivity tools', 'AI marketing tools', 'AI business tools'],
      title: 'Free AI Tools Online | AI Content Generator & Image Creator | CreatorBoost AI',
      description: 'Best free AI tools online: AI content generator, thumbnail creator, image generator. No signup required. Create viral content with AI-powered tools. Professional results.',
      url: '/ai-tools',
      category: 'ai-tools'
    },
    'image-tools': {
      primaryKeyword: 'image tools online',
      secondaryKeywords: ['online image editor', 'image compression tool', 'photo editor free', 'image optimizer'],
      longTailKeywords: ['best image editing software', 'online photo editor', 'image enhancement tools', 'batch image processing'],
      title: 'Free Image Tools Online | Image Editor, Compressor & Converter | CreatorBoost AI',
      description: 'Professional image tools: editor, compressor, resizer, converter. Optimize images for web. Free online image processing tools. No watermark, instant results.',
      url: '/image-tools',
      category: 'image-tools'
    },
    'pdf-tools': {
      primaryKeyword: 'PDF tools online',
      secondaryKeywords: ['PDF editor online', 'PDF merger', 'PDF converter', 'PDF compressor'],
      longTailKeywords: ['best PDF editor software', 'online PDF management', 'PDF processing tools', 'document conversion'],
      title: 'Free PDF Tools Online | PDF Editor, Merger & Converter | CreatorBoost AI',
      description: 'Complete PDF toolkit: editor, merger, splitter, compressor, converter. Edit PDF files online for free. No watermark. Professional PDF processing.',
      url: '/pdf-tools',
      category: 'pdf-tools'
    },
    'finance-tools': {
      primaryKeyword: 'financial calculators',
      secondaryKeywords: ['loan calculator', 'investment calculator', 'budget planner', 'tax calculator'],
      longTailKeywords: ['personal finance tools', 'investment planning calculator', 'financial planning software', 'money management tools'],
      title: 'Free Financial Calculators | Loan, EMI, SIP & Budget Calculator | CreatorBoost AI',
      description: 'Essential financial tools: loan EMI calculator, SIP calculator, budget planner, tax calculator. Make informed financial decisions. Free online calculators for all needs.',
      url: '/finance-tools',
      category: 'finance-tools'
    },
    'social-media-tools': {
      primaryKeyword: 'social media tools',
      secondaryKeywords: ['hashtag generator', 'content idea generator', 'social media scheduler', 'emoji picker'],
      longTailKeywords: ['Instagram marketing tools', 'social media management', 'content creation tools', 'social media analytics'],
      title: 'Free Social Media Tools | Hashtag Generator, Content Ideas & Scheduler | CreatorBoost AI',
      description: 'Ultimate social media toolkit: hashtag generator, content ideas, caption writer, analytics, emoji picker. Boost your social media presence. Free tools for creators.',
      url: '/social-media-tools',
      category: 'social-media-tools'
    }
  };

  return categoryMap[category] || null;
}

// Keyword difficulty and competition analysis
export function getKeywordDifficulty(keyword: string): number {
  const difficultyMap: Record<string, number> = {
    'AI thumbnail generator': 78,
    'image resizer': 88,
    'PDF converter': 91,
    'currency converter': 95,
    'link shortener': 89,
    'hashtag generator': 84
  };

  return difficultyMap[keyword] || 70;
}

// Search volume analysis
export function getSearchVolume(keyword: string): number {
  const volumeMap: Record<string, number> = {
    'AI thumbnail generator': 22000,
    'image resizer': 201000,
    'PDF converter': 245000,
    'currency converter': 1200000,
    'link shortener': 450000,
    'hashtag generator': 165000
  };

  return volumeMap[keyword] || 10000;
}

// Competitor analysis
export const competitorAnalysis = {
  'AI tools': ['Canva AI', 'Adobe Firefly', 'Midjourney', 'DALL-E'],
  'image tools': ['Canva', 'Adobe Photoshop', 'Figma', 'GIMP'],
  'PDF tools': ['Adobe Acrobat', 'SmallPDF', 'iLovePDF', 'PDF24'],
  'finance tools': ['Calculator.net', 'BankBazaar', 'Moneycontrol', 'Investopedia'],
  'social media': ['Hootsuite', 'Buffer', 'Later', 'Sprout Social']
};

// Market trends
export const marketTrends = {
  'AI tools': {
    trend: 'rising',
    growth: '+45%',
    topKeywords: ['AI thumbnail generator', 'AI background remover', 'AI image analyzer']
  },
  'image tools': {
    trend: 'stable',
    growth: '+12%',
    topKeywords: ['image resizer', 'image compressor', 'image converter']
  },
  'PDF tools': {
    trend: 'stable',
    growth: '+8%',
    topKeywords: ['PDF converter', 'PDF merger', 'PDF compressor']
  },
  'finance tools': {
    trend: 'rising',
    growth: '+28%',
    topKeywords: ['currency converter', 'tax calculator', 'loan EMI calculator']
  },
  'social media': {
    trend: 'rising',
    growth: '+35%',
    topKeywords: ['link shortener', 'hashtag generator', 'content idea generator']
  }
};
