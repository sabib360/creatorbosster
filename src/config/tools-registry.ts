/**
 * Complete Tools Registry for SEO & Traffic Generation
 * This is the single source of truth for all tools
 * Supports: 300+ tool variants for programmatic SEO
 */

export interface ToolVariant {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  path: string;
  category: string;
  subcategory: string;
  seoTitle: string;
  seoDescription: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedSearchVolume: number; // monthly searches
  estimatedCPC: number; // USD
  apiRequired?: string;
  component?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  tools: ToolVariant[];
}

// PHASE 1: QUICK WIN TOOLS (Next 48 Hours)
export const QUICK_WINS: ToolVariant[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and minify JSON instantly',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json'],
    path: '/tools/json-formatter',
    category: 'Developer Tools',
    subcategory: 'Code Tools',
    seoTitle: 'JSON Formatter Online - Instant JSON Beautifier & Validator',
    seoDescription: 'Free online JSON formatter and validator. Format, beautify, minify, and validate JSON instantly. Support for JSON 5 and comments.',
    difficulty: 'easy',
    estimatedSearchVolume: 22000,
    estimatedCPC: 2.5,
    component: 'JSONFormatter',
  },
  {
    id: 'base64-encoder-decoder',
    name: 'Base64 Encode Decode',
    description: 'Encode and decode Base64 strings',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 encode', 'base64 decode', 'base64 converter'],
    path: '/tools/base64-encoder-decoder',
    category: 'Developer Tools',
    subcategory: 'Encoding',
    seoTitle: 'Base64 Encoder Decoder - Free Online Tool',
    seoDescription: 'Free online Base64 encoder/decoder. Encode text to Base64 or decode Base64 to plain text instantly.',
    difficulty: 'easy',
    estimatedSearchVolume: 18500,
    estimatedCPC: 1.8,
    component: 'Base64EncoderDecoder',
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, days',
    keywords: ['age calculator', 'calculate age', 'age from date', 'how old am i'],
    path: '/tools/age-calculator',
    category: 'Calculator Tools',
    subcategory: 'Time & Date',
    seoTitle: 'Age Calculator - Calculate Your Exact Age Online',
    seoDescription: 'Free age calculator. Find out exactly how old you are in years, months, weeks, and days.',
    difficulty: 'easy',
    estimatedSearchVolume: 85000,
    estimatedCPC: 0.25,
    component: 'AgeCalculator',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    description: 'Convert PDF to Word documents instantly',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc', 'pdf converter'],
    path: '/tools/pdf-to-word',
    category: 'PDF Tools',
    subcategory: 'Conversion',
    seoTitle: 'PDF to Word Converter - Convert PDF to DOCX Online',
    seoDescription: 'Free PDF to Word converter. Convert PDF files to editable Word documents instantly. No registration required.',
    difficulty: 'medium',
    estimatedSearchVolume: 125000,
    estimatedCPC: 1.2,
    apiRequired: 'pdflib',
    component: 'PDFToWord',
  },
  {
    id: 'youtube-video-downloader',
    name: 'YouTube Video Downloader',
    description: 'Download YouTube videos in multiple formats',
    keywords: ['youtube downloader', 'download youtube video', 'youtube to mp4', 'youtube video download'],
    path: '/tools/youtube-downloader',
    category: 'Social Media Tools',
    subcategory: 'Video Download',
    seoTitle: 'YouTube Video Downloader - Download YouTube Videos Online',
    seoDescription: 'Free YouTube video downloader. Download YouTube videos in MP4, 1080p, 720p and more formats instantly.',
    difficulty: 'medium',
    estimatedSearchVolume: 95000,
    estimatedCPC: 0.8,
    apiRequired: 'yt-dlp or similar',
    component: 'YouTubeDownloader',
  },
];

// PHASE 2: IMAGE TOOLS (High Traffic)
export const IMAGE_TOOLS: ToolVariant[] = [
  {
    id: 'image-upscaler',
    name: 'Image Upscaler - AI Powered',
    description: 'Enhance and upscale images with AI',
    keywords: ['image upscaler', 'upscale image', 'ai image upscaler', 'enhance image'],
    path: '/tools/image-upscaler',
    category: 'Image Tools',
    subcategory: 'Enhancement',
    seoTitle: 'AI Image Upscaler - Enhance & Enlarge Images Online',
    seoDescription: 'Free AI-powered image upscaler. Enhance and enlarge your images up to 4x without quality loss.',
    difficulty: 'hard',
    estimatedSearchVolume: 32000,
    estimatedCPC: 1.1,
    apiRequired: 'upscayl-api',
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    description: 'Convert images to WebP format',
    keywords: ['webp converter', 'convert to webp', 'jpg to webp', 'png to webp'],
    path: '/tools/webp-converter',
    category: 'Image Tools',
    subcategory: 'Conversion',
    seoTitle: 'WebP Converter - Convert Images to WebP Format',
    seoDescription: 'Free online WebP converter. Convert JPG, PNG, and other formats to WebP instantly.',
    difficulty: 'easy',
    estimatedSearchVolume: 12000,
    estimatedCPC: 0.6,
  },
  {
    id: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    description: 'Convert HEIC images to JPG format',
    keywords: ['heic to jpg', 'heic converter', 'convert heic', 'heic to jpeg'],
    path: '/tools/heic-to-jpg',
    category: 'Image Tools',
    subcategory: 'Conversion',
    seoTitle: 'HEIC to JPG Converter - Convert iPhone Photos Online',
    seoDescription: 'Free HEIC to JPG converter. Convert iPhone HEIC images to JPG instantly.',
    difficulty: 'medium',
    estimatedSearchVolume: 28000,
    estimatedCPC: 0.5,
    apiRequired: 'heic2any',
  },
];

// PHASE 3: CALCULATOR TOOLS (Programmatic SEO Goldmine)
export const CALCULATOR_TOOLS: ToolVariant[] = [
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index',
    keywords: ['bmi calculator', 'calculate bmi', 'body mass index', 'bmi chart'],
    path: '/tools/bmi-calculator',
    category: 'Calculator Tools',
    subcategory: 'Health',
    seoTitle: 'BMI Calculator - Calculate Body Mass Index',
    seoDescription: 'Free BMI calculator. Calculate your body mass index and get health recommendations.',
    difficulty: 'easy',
    estimatedSearchVolume: 42000,
    estimatedCPC: 0.4,
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    description: 'Calculate annual salary from hourly wage',
    keywords: ['salary calculator', 'annual salary calculator', 'hourly to salary', 'wage calculator'],
    path: '/tools/salary-calculator',
    category: 'Calculator Tools',
    subcategory: 'Finance',
    seoTitle: 'Salary Calculator - Calculate Annual Income',
    seoDescription: 'Free salary calculator. Convert hourly wage to annual salary and calculate deductions.',
    difficulty: 'easy',
    estimatedSearchVolume: 35000,
    estimatedCPC: 0.8,
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, discount, markup',
    keywords: ['percentage calculator', 'calculate percentage', 'discount calculator', 'markup calculator'],
    path: '/tools/percentage-calculator',
    category: 'Calculator Tools',
    subcategory: 'Math',
    seoTitle: 'Percentage Calculator - Calculate Percentages Online',
    seoDescription: 'Free percentage calculator. Calculate percentages, discounts, markups, and more instantly.',
    difficulty: 'easy',
    estimatedSearchVolume: 28000,
    estimatedCPC: 0.3,
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest on investments',
    keywords: ['compound interest calculator', 'calculate compound interest', 'investment calculator'],
    path: '/tools/compound-interest-calculator',
    category: 'Calculator Tools',
    subcategory: 'Finance',
    seoTitle: 'Compound Interest Calculator - Investment Calculator',
    seoDescription: 'Free compound interest calculator. Calculate returns on your investments with compound interest.',
    difficulty: 'easy',
    estimatedSearchVolume: 22000,
    estimatedCPC: 1.5,
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments',
    keywords: ['mortgage calculator', 'home loan calculator', 'mortgage payment calculator'],
    path: '/tools/mortgage-calculator',
    category: 'Calculator Tools',
    subcategory: 'Finance',
    seoTitle: 'Mortgage Calculator - Calculate Monthly Payments',
    seoDescription: 'Free mortgage calculator. Calculate monthly mortgage payments based on loan amount and interest rate.',
    difficulty: 'easy',
    estimatedSearchVolume: 38000,
    estimatedCPC: 3.2,
  },
];

// PHASE 4: AI TOOLS (Viral + Medium Traffic)
export const AI_TOOLS: ToolVariant[] = [
  {
    id: 'ai-email-writer',
    name: 'AI Email Writer',
    description: 'Generate professional emails with AI',
    keywords: ['ai email writer', 'email generator', 'professional email', 'business email writer'],
    path: '/tools/ai-email-writer',
    category: 'AI Tools',
    subcategory: 'Writing',
    seoTitle: 'AI Email Writer - Generate Professional Emails',
    seoDescription: 'Free AI-powered email writer. Generate professional business emails instantly.',
    difficulty: 'medium',
    estimatedSearchVolume: 28000,
    estimatedCPC: 1.2,
    apiRequired: 'gemini',
  },
  {
    id: 'ai-humanizer',
    name: 'AI Text Humanizer',
    description: 'Convert AI-written text to human-like content',
    keywords: ['ai humanizer', 'humanize ai text', 'ai to human text', 'ai detector bypass'],
    path: '/tools/ai-humanizer',
    category: 'AI Tools',
    subcategory: 'Writing',
    seoTitle: 'AI Humanizer - Convert AI Text to Human-Like Content',
    seoDescription: 'Free AI humanizer. Transform AI-generated text to sound more natural and human-like.',
    difficulty: 'hard',
    estimatedSearchVolume: 42000,
    estimatedCPC: 2.1,
    apiRequired: 'gemini',
  },
  {
    id: 'ai-translator',
    name: 'AI Translator',
    description: 'Translate text in 100+ languages',
    keywords: ['ai translator', 'language translator', 'text translator', 'instant translator'],
    path: '/tools/ai-translator',
    category: 'AI Tools',
    subcategory: 'Translation',
    seoTitle: 'AI Translator - Translate Text in 100+ Languages',
    seoDescription: 'Free AI translator. Translate text instantly in 100+ languages with high accuracy.',
    difficulty: 'medium',
    estimatedSearchVolume: 18000,
    estimatedCPC: 0.5,
    apiRequired: 'gemini',
  },
];

// PHASE 5: DEVELOPER TOOLS (High CPC)
export const DEVELOPER_TOOLS: ToolVariant[] = [
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    keywords: ['sql formatter', 'sql beautifier', 'format sql', 'sql query formatter'],
    path: '/tools/sql-formatter',
    category: 'Developer Tools',
    subcategory: 'Code Tools',
    seoTitle: 'SQL Formatter - Format & Beautify SQL Queries',
    seoDescription: 'Free SQL formatter. Format, beautify, and validate SQL queries instantly.',
    difficulty: 'easy',
    estimatedSearchVolume: 16000,
    estimatedCPC: 2.2,
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID values',
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'generate uuid'],
    path: '/tools/uuid-generator',
    category: 'Developer Tools',
    subcategory: 'Utilities',
    seoTitle: 'UUID Generator - Generate Unique IDs Online',
    seoDescription: 'Free UUID generator. Generate UUIDs, GUIDs, and unique identifiers instantly.',
    difficulty: 'easy',
    estimatedSearchVolume: 12000,
    estimatedCPC: 1.5,
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    keywords: ['regex tester', 'regex test', 'regular expression tester', 'regex debugger'],
    path: '/tools/regex-tester',
    category: 'Developer Tools',
    subcategory: 'Code Tools',
    seoTitle: 'Regex Tester - Test Regular Expressions Online',
    seoDescription: 'Free regex tester. Test, debug, and validate regular expressions instantly.',
    difficulty: 'medium',
    estimatedSearchVolume: 14000,
    estimatedCPC: 1.8,
  },
];

// Complete Tools Registry
export const ALL_TOOLS: ToolVariant[] = [
  ...QUICK_WINS,
  ...IMAGE_TOOLS,
  ...CALCULATOR_TOOLS,
  ...AI_TOOLS,
  ...DEVELOPER_TOOLS,
];

// Group tools by category
export const TOOLS_BY_CATEGORY: Record<string, ToolVariant[]> = {
  'Quick Wins': QUICK_WINS,
  'Image Tools': IMAGE_TOOLS,
  'Calculator Tools': CALCULATOR_TOOLS,
  'AI Tools': AI_TOOLS,
  'Developer Tools': DEVELOPER_TOOLS,
};

// Get tool by ID
export const getTool = (id: string): ToolVariant | undefined => {
  return ALL_TOOLS.find(tool => tool.id === id);
};

// Get all tools in category
export const getToolsByCategory = (category: string): ToolVariant[] => {
  return ALL_TOOLS.filter(tool => tool.category === category);
};

// Calculate total estimated monthly traffic
export const getTotalEstimatedTraffic = (): number => {
  return ALL_TOOLS.reduce((total, tool) => total + tool.estimatedSearchVolume, 0);
};

// Get tools sorted by search volume (descending)
export const getToolsByTraffic = (): ToolVariant[] => {
  return [...ALL_TOOLS].sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume);
};

// Get tools sorted by CPC (descending)
export const getToolsByRevenue = (): ToolVariant[] => {
  return [...ALL_TOOLS].sort((a, b) => b.estimatedCPC - a.estimatedCPC);
};
