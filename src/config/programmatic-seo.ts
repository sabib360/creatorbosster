/**
 * Programmatic SEO Page Generator
 * Creates 30-50 variations per tool for maximum SEO coverage
 * Example: 1 tool = 50 unique SEO pages
 */

export interface SEOPageVariant {
  id: string;
  toolId: string;
  title: string;
  description: string;
  keywords: string[];
  path: string;
  h1: string;
  shortDescription: string;
  longDescription: string;
  faq: Array<{ q: string; a: string }>;
  internalLinks: Array<{ text: string; path: string }>;
}

// AGE CALCULATOR - 40 variations for programmatic SEO
export const AGE_CALCULATOR_VARIANTS: SEOPageVariant[] = [
  {
    id: 'age-calculator-basic',
    toolId: 'age-calculator',
    title: 'Age Calculator - Calculate Your Exact Age Online',
    description: 'Free age calculator. Find out exactly how old you are in years, months, weeks, and days.',
    keywords: ['age calculator', 'calculate age', 'how old am i', 'age from date'],
    path: '/tools/age-calculator',
    h1: 'Age Calculator - Know Your Exact Age',
    shortDescription: 'Calculate your exact age in years, months, and days instantly.',
    longDescription: `Our free age calculator helps you determine your exact age instantly. Simply enter your date of birth and get comprehensive age information including years, months, weeks, and days. No registration required.`,
    faq: [
      {
        q: 'How do I calculate my exact age?',
        a: 'Enter your date of birth in the calculator and it will instantly show your exact age in years, months, weeks, and days.',
      },
      {
        q: 'Is this calculator accurate?',
        a: 'Yes, our calculator accounts for leap years and provides precise age calculations based on the current date.',
      },
    ],
    internalLinks: [
      { text: 'Date Difference Calculator', path: '/tools/date-difference-calculator' },
      { text: 'Countdown Timer', path: '/tools/countdown-timer' },
    ],
  },
  {
    id: 'age-calculator-birthday',
    toolId: 'age-calculator',
    title: 'Birthday Age Calculator - Years Months Days',
    description: 'Calculate age from birthday. Find years, months, weeks, and days from birth date.',
    keywords: ['birthday age calculator', 'age from birthday', 'calculate age from birthday'],
    path: '/tools/age-calculator-from-birthday',
    h1: 'Birthday Age Calculator - Calculate From Birth Date',
    shortDescription: 'Calculate your exact age based on your birthday date.',
    longDescription: `Calculate your age from your birthday with precision. Our calculator shows your exact age in years, months, and days since you were born.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-calculator-days',
    toolId: 'age-calculator',
    title: 'Calculate Age in Days - How Many Days Old Are You',
    description: 'Calculate how many days you have been alive. Get your age in total days.',
    keywords: ['age in days', 'calculate age in days', 'how many days old'],
    path: '/tools/calculate-age-in-days',
    h1: 'Calculate Age in Days - How Many Days Old Are You',
    shortDescription: 'Find out exactly how many days you have been alive.',
    longDescription: `Discover how many days you have been alive with our age in days calculator. Get your total days lived since birth.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-calculator-months',
    toolId: 'age-calculator',
    title: 'Age Calculator Months - How Many Months Old',
    description: 'Calculate age in months and days. Find total months lived since birth.',
    keywords: ['age in months', 'calculate age in months', 'how many months old'],
    path: '/tools/age-calculator-in-months',
    h1: 'Age Calculator in Months - How Many Months Old',
    shortDescription: 'Calculate your exact age in months and days.',
    longDescription: `Calculate your exact age in months using our simple calculator. Get your total months and days lived.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-calculator-dog-pet',
    toolId: 'age-calculator',
    title: 'Dog Age Calculator - Convert Dog Age to Human Years',
    description: 'Calculate your dog\'s age in human years. Simple dog age converter.',
    keywords: ['dog age calculator', 'dog age in human years', 'pet age calculator'],
    path: '/tools/dog-age-calculator',
    h1: 'Dog Age Calculator - Pet Age to Human Years',
    shortDescription: 'Convert your dog\'s age to human years instantly.',
    longDescription: `Calculate your dog's age in human years using the standard conversion formula. Understand how old your pet really is in human terms.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-calculator-baby',
    toolId: 'age-calculator',
    title: 'Baby Age Calculator - Calculate Baby Age',
    description: 'Calculate your baby\'s exact age. Baby age calculator for parents.',
    keywords: ['baby age calculator', 'calculate baby age', 'infant age calculator'],
    path: '/tools/baby-age-calculator',
    h1: 'Baby Age Calculator - Know Your Baby\'s Exact Age',
    shortDescription: 'Calculate your baby\'s exact age in weeks and months.',
    longDescription: `Track your baby's growth with our baby age calculator. Get age in weeks, months, and days for developmental milestones.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-calculator-future',
    toolId: 'age-calculator',
    title: 'Future Age Calculator - How Old Will I Be',
    description: 'Calculate how old you will be on a future date. Predict future age.',
    keywords: ['future age calculator', 'how old will i be', 'age on a date'],
    path: '/tools/future-age-calculator',
    h1: 'Future Age Calculator - How Old Will I Be',
    shortDescription: 'Find out how old you\'ll be on any future date.',
    longDescription: `Calculate how old you will be on any future date. Perfect for planning milestones and events.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'age-difference-calculator',
    toolId: 'age-calculator',
    title: 'Age Difference Calculator - Calculate Age Gap',
    description: 'Calculate age difference between two people. Age gap calculator.',
    keywords: ['age difference calculator', 'age gap calculator', 'age difference'],
    path: '/tools/age-difference-calculator',
    h1: 'Age Difference Calculator - Calculate Age Gap',
    shortDescription: 'Calculate the age difference between two people instantly.',
    longDescription: `Calculate the exact age difference between you and another person. Shows years, months, and days difference.`,
    faq: [],
    internalLinks: [],
  },
];

// IMAGE COMPRESSOR - 35 variations
export const IMAGE_COMPRESSOR_VARIANTS: SEOPageVariant[] = [
  {
    id: 'compress-image-basic',
    toolId: 'image-compressor',
    title: 'Compress Image Online - Reduce Image Size',
    description: 'Free image compressor. Reduce image file size online without losing quality.',
    keywords: ['compress image', 'compress image online', 'reduce image size', 'image compressor'],
    path: '/tools/compress-image',
    h1: 'Compress Image Online - Reduce File Size',
    shortDescription: 'Compress images online while maintaining quality.',
    longDescription: `Compress your images online instantly. Our image compressor reduces file size without sacrificing quality. Perfect for web, email, and social media.`,
    faq: [
      {
        q: 'Will compression affect image quality?',
        a: 'Our advanced algorithm preserves image quality while significantly reducing file size.',
      },
    ],
    internalLinks: [],
  },
  {
    id: 'compress-image-1mb',
    toolId: 'image-compressor',
    title: 'Compress Image to 1MB - Reduce Image Under 1MB',
    description: 'Compress images to exactly 1MB. Reduce image size to 1MB or less.',
    keywords: ['compress image to 1mb', 'reduce image to 1mb', 'compress under 1mb'],
    path: '/tools/compress-image-to-1mb',
    h1: 'Compress Image to 1MB - Image Size Reducer',
    shortDescription: 'Reduce your image size to 1MB instantly.',
    longDescription: `Compress your images down to 1MB or smaller. Perfect for email attachments and storage limits.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-image-500kb',
    toolId: 'image-compressor',
    title: 'Compress Image to 500KB - Reduce to 500KB',
    description: 'Compress images to 500KB. Reduce large images to 500KB size.',
    keywords: ['compress image to 500kb', 'reduce to 500kb', 'compress 500kb'],
    path: '/tools/compress-image-to-500kb',
    h1: 'Compress Image to 500KB - File Size Reducer',
    shortDescription: 'Reduce image to 500KB for web and email.',
    longDescription: `Compress images to exactly 500KB. Ideal for website optimization and file sharing.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-image-100kb',
    toolId: 'image-compressor',
    title: 'Compress Image to 100KB - Reduce to 100KB',
    description: 'Compress images to 100KB. Reduce image file size to 100KB or less.',
    keywords: ['compress image to 100kb', 'reduce to 100kb', 'compress 100kb'],
    path: '/tools/compress-image-to-100kb',
    h1: 'Compress Image to 100KB - Extreme Compression',
    shortDescription: 'Compress images to 100KB for maximum compatibility.',
    longDescription: `Compress images aggressively to 100KB. Perfect for very strict size requirements.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-image-whatsapp',
    toolId: 'image-compressor',
    title: 'Compress Image for WhatsApp - Optimize Images',
    description: 'Compress images for WhatsApp sharing. Optimize image size for instant messaging.',
    keywords: ['compress image for whatsapp', 'whatsapp image compressor', 'optimize for whatsapp'],
    path: '/tools/compress-image-for-whatsapp',
    h1: 'Compress Image for WhatsApp - Share Better',
    shortDescription: 'Optimize images for WhatsApp sharing.',
    longDescription: `Compress images specifically for WhatsApp. Maintain quality while reducing upload time.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-image-email',
    toolId: 'image-compressor',
    title: 'Compress Image for Email - Reduce Email Attachments',
    description: 'Compress images for email. Reduce image size for email attachments.',
    keywords: ['compress image for email', 'email image compressor', 'reduce email attachment'],
    path: '/tools/compress-image-for-email',
    h1: 'Compress Image for Email - Attachment Reducer',
    shortDescription: 'Reduce image size for email attachments.',
    longDescription: `Compress images to optimal size for email. Reduce attachment size without quality loss.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-image-social-media',
    toolId: 'image-compressor',
    title: 'Compress Image for Social Media - Optimize for Instagram, Facebook',
    description: 'Compress images for social media. Optimize for Instagram, Facebook, Twitter.',
    keywords: ['compress image for social media', 'social media image compressor', 'optimize for instagram'],
    path: '/tools/compress-image-for-social-media',
    h1: 'Compress Image for Social Media - Optimize Now',
    shortDescription: 'Optimize images for Instagram, Facebook, and Twitter.',
    longDescription: `Compress images to perfect size for social media platforms. Maximize quality and performance.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-jpg-image',
    toolId: 'image-compressor',
    title: 'Compress JPG Image - JPG Image Compressor',
    description: 'Compress JPG/JPEG images online. Reduce JPG file size quickly.',
    keywords: ['compress jpg', 'jpg compressor', 'compress jpeg', 'reduce jpg size'],
    path: '/tools/compress-jpg-image',
    h1: 'Compress JPG Image - JPEG Compressor',
    shortDescription: 'Compress JPG images efficiently.',
    longDescription: `Compress JPG/JPEG images while maintaining quality. Fast and easy JPG compression online.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-png-image',
    toolId: 'image-compressor',
    title: 'Compress PNG Image - PNG Image Compressor',
    description: 'Compress PNG images online. Reduce PNG file size without quality loss.',
    keywords: ['compress png', 'png compressor', 'reduce png size', 'compress png online'],
    path: '/tools/compress-png-image',
    h1: 'Compress PNG Image - PNG File Reducer',
    shortDescription: 'Compress PNG images effectively.',
    longDescription: `Compress PNG images with lossless compression. Perfect for graphics and transparent images.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'bulk-image-compression',
    toolId: 'image-compressor',
    title: 'Bulk Image Compressor - Compress Multiple Images',
    description: 'Compress multiple images at once. Batch image compression tool.',
    keywords: ['bulk image compressor', 'compress multiple images', 'batch image compression'],
    path: '/tools/bulk-image-compressor',
    h1: 'Bulk Image Compressor - Compress Multiple Images',
    shortDescription: 'Compress multiple images in one go.',
    longDescription: `Compress multiple images at once with our bulk compressor. Save time with batch processing.`,
    faq: [],
    internalLinks: [],
  },
];

// PDF COMPRESSOR - 30 variations
export const PDF_COMPRESSOR_VARIANTS: SEOPageVariant[] = [
  {
    id: 'compress-pdf-basic',
    toolId: 'pdf-compressor',
    title: 'Compress PDF Online - Reduce PDF File Size',
    description: 'Free PDF compressor. Reduce PDF file size online without quality loss.',
    keywords: ['compress pdf', 'pdf compressor', 'reduce pdf size', 'compress pdf online'],
    path: '/tools/compress-pdf',
    h1: 'Compress PDF Online - Reduce File Size',
    shortDescription: 'Compress PDFs instantly while maintaining quality.',
    longDescription: `Compress your PDF files online. Our tool reduces file size significantly while preserving document quality. No registration required.`,
    faq: [
      {
        q: 'How much can I compress a PDF?',
        a: 'Compression ratio depends on content, but typically 30-70% size reduction is achieved.',
      },
    ],
    internalLinks: [],
  },
  {
    id: 'compress-pdf-1mb',
    toolId: 'pdf-compressor',
    title: 'Compress PDF to 1MB - Reduce PDF Under 1MB',
    description: 'Compress PDF files to 1MB. Reduce large PDFs to 1MB or less.',
    keywords: ['compress pdf to 1mb', 'reduce pdf to 1mb', 'pdf under 1mb'],
    path: '/tools/compress-pdf-to-1mb',
    h1: 'Compress PDF to 1MB - PDF Size Reducer',
    shortDescription: 'Reduce PDF size to 1MB or smaller.',
    longDescription: `Compress your PDF documents down to 1MB. Perfect for email and document sharing.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-pdf-500kb',
    toolId: 'pdf-compressor',
    title: 'Compress PDF to 500KB - Reduce PDF Size',
    description: 'Compress PDF to 500KB. Reduce large PDF files to 500KB.',
    keywords: ['compress pdf to 500kb', 'reduce pdf to 500kb', 'pdf to 500kb'],
    path: '/tools/compress-pdf-to-500kb',
    h1: 'Compress PDF to 500KB - File Size Reducer',
    shortDescription: 'Reduce PDF to 500KB for easy sharing.',
    longDescription: `Compress PDFs to exactly 500KB. Ideal for document management systems.`,
    faq: [],
    internalLinks: [],
  },
  {
    id: 'compress-pdf-email',
    toolId: 'pdf-compressor',
    title: 'Compress PDF for Email - Reduce Email Attachment',
    description: 'Compress PDF for email attachments. Reduce PDF size for email sharing.',
    keywords: ['compress pdf for email', 'pdf email compressor', 'reduce email attachment'],
    path: '/tools/compress-pdf-for-email',
    h1: 'Compress PDF for Email - Attachment Optimizer',
    shortDescription: 'Optimize PDFs for email sharing.',
    longDescription: `Compress PDFs to ideal size for email attachments. Fast uploads and downloads.`,
    faq: [],
    internalLinks: [],
  },
];

import { NICHES_20, nicheSlug } from './niche-templates';
import { ALL_TOOLS, ToolVariant } from './tools-registry';

const SEO_TITLE_BASE = (toolName: string, niche: string) => `${toolName} for ${niche} - ${toolName} Online`;

const makeVariant = (baseTool: ToolVariant, niche: string, idx: number): SEOPageVariant => {
  const toolName = baseTool.name;
  const base = baseTool.id;
  const nicheSlugified = nicheSlug(niche);

  const path = `/tools/${nicheSlugified}-${base}`;

  const title = SEO_TITLE_BASE(toolName, niche);
  const description = `Use ${toolName} for ${niche}. Generate results instantly with a free online ${toolName.toLowerCase()} tool.`;
  const keywords = [
    `${toolName}`.toLowerCase(),
    `${toolName} for ${niche}`.toLowerCase(),
    niche.toLowerCase(),
    baseTool.category.toLowerCase(),
    ...baseTool.keywords,
  ].filter(Boolean) as string[];

  const h1 = `${toolName} for ${niche} - Online ${toolName}`;
  const shortDescription = `Fast ${toolName} for ${niche}.`;
  const longDescription = `Our online ${toolName} helps you get the output you need for ${niche}. Choose your inputs, run the tool instantly, and download your results. Built for creators, teams, and professionals who want speed and reliability.`;

  const faq: SEOPageVariant['faq'] = [
    {
      q: `How does ${toolName} help with ${niche}?`,
      a: `This tool is designed to process your input for ${niche} use-cases. Enter your content, run the conversion/analysis/generation, and download the result.`,
    },
    {
      q: `Is this ${toolName} free to use?`,
      a: `Yes—this is an online free tool. You can use it without installing software.`,
    },
  ];

  const internalLinks: SEOPageVariant['internalLinks'] = [
    { text: 'Blog', path: '/blog' },
    { text: 'How to Use', path: '/how-to-use' },
  ];

  return {
    id: `${nicheSlugified}-${base}-${idx}`,
    toolId: base,
    title,
    description,
    keywords,
    path,
    h1,
    shortDescription,
    longDescription,
    faq,
    internalLinks,
  };
};

// Base tools => 20 niche variations
export const ALL_PROGRAMMATIC_VARIANTS: SEOPageVariant[] = (() => {
  const toolsWithComponent = ALL_TOOLS.filter(t => Boolean(t.component));

  // Keep existing hand-authored variants for the three tools
  const legacy = [...AGE_CALCULATOR_VARIANTS, ...IMAGE_COMPRESSOR_VARIANTS, ...PDF_COMPRESSOR_VARIANTS];

  const generated: SEOPageVariant[] = [];

  for (const tool of toolsWithComponent) {
    for (let i = 0; i < NICHES_20.length; i++) {
      const niche = NICHES_20[i];
      generated.push(makeVariant(tool, niche, i));
    }
  }

  // Prefer generated variants for /tools/:... patterns; keep legacy as-is
  return [...legacy, ...generated];
})();

export const getSEOPageVariants = (toolId: string): SEOPageVariant[] => {
  return ALL_PROGRAMMATIC_VARIANTS.filter(variant => variant.toolId === toolId);
};

export const getTotalSEOPages = (): number => {
  return ALL_PROGRAMMATIC_VARIANTS.length;
};

export const getAllSEOVariants = () => {
  return ALL_PROGRAMMATIC_VARIANTS;
};

export const getSitemapEntries = () => {
  return ALL_PROGRAMMATIC_VARIANTS.map(variant => ({
    path: variant.path,
    priority: 0.8,
    changefreq: 'monthly' as const,
  }));
};

