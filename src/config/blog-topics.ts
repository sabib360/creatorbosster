/**
 * Blog Post Topic Ideas — targeting informational long-tail keywords
 * directly related to existing CreatorBoost AI tools.
 *
 * Each topic includes a slug, target keyword, suggested title, and category.
 * Use these to populate the blogArticles array in Blog.tsx.
 */

export interface BlogTopicIdea {
  slug: string;
  targetKeyword: string;
  suggestedTitle: string;
  category: string;
  relatedTool: string;
}

export const BLOG_TOPIC_IDEAS: BlogTopicIdea[] = [
  // Image Tools
  {
    slug: 'how-to-compress-images-without-losing-quality',
    targetKeyword: 'how to compress images without losing quality',
    suggestedTitle: 'How to Compress Images Without Losing Quality — Complete 2026 Guide',
    category: 'Image Tools',
    relatedTool: '/tools/image-compressor',
  },
  {
    slug: 'best-free-image-resizer-tools-2026',
    targetKeyword: 'best free image resizer tools',
    suggestedTitle: '7 Best Free Image Resizer Tools in 2026 (No Watermark)',
    category: 'Image Tools',
    relatedTool: '/tools/image-resizer',
  },
  {
    slug: 'how-to-remove-background-from-photo-free',
    targetKeyword: 'how to remove background from photo free',
    suggestedTitle: 'How to Remove Background from Any Photo for Free (3 Methods)',
    category: 'AI Tools',
    relatedTool: '/tools/background-remover',
  },
  {
    slug: 'passport-size-photo-maker-online-free',
    targetKeyword: 'passport size photo maker online free',
    suggestedTitle: 'Make Passport Size Photos Online for Free — No Photoshop Needed',
    category: 'Image Tools',
    relatedTool: '/tools/passport-size',
  },
  // PDF Tools
  {
    slug: 'how-to-merge-pdf-files-free-online',
    targetKeyword: 'how to merge pdf files free online',
    suggestedTitle: 'How to Merge PDF Files Online for Free (Step-by-Step)',
    category: 'PDF Tools',
    relatedTool: '/tools/pdf-merger',
  },
  {
    slug: 'reduce-pdf-file-size-without-quality-loss',
    targetKeyword: 'reduce pdf file size without quality loss',
    suggestedTitle: 'How to Reduce PDF File Size Without Losing Quality',
    category: 'PDF Tools',
    relatedTool: '/tools/pdf-compressor',
  },
  {
    slug: 'convert-pdf-to-word-online-free',
    targetKeyword: 'convert pdf to word online free',
    suggestedTitle: 'Convert PDF to Word Online for Free — Editable DOCX in Seconds',
    category: 'PDF Tools',
    relatedTool: '/tools/pdf-to-word',
  },
  {
    slug: 'split-pdf-pages-online-tool',
    targetKeyword: 'split pdf pages online',
    suggestedTitle: 'How to Split PDF Pages Online — Extract Specific Pages Free',
    category: 'PDF Tools',
    relatedTool: '/tools/pdf-splitter',
  },
  // AI Tools
  {
    slug: 'ai-tools-for-youtube-content-creators',
    targetKeyword: 'ai tools for youtube content creators',
    suggestedTitle: '10 AI Tools Every YouTube Content Creator Should Use in 2026',
    category: 'AI Tools',
    relatedTool: '/tools/ai-assistant',
  },
  {
    slug: 'how-to-write-youtube-descriptions-that-rank',
    targetKeyword: 'how to write youtube descriptions that rank',
    suggestedTitle: 'How to Write YouTube Descriptions That Actually Rank in Search',
    category: 'Social Media Tools',
    relatedTool: '/tools/ai-assistant',
  },
  {
    slug: 'ai-thumbnail-generator-vs-canva',
    targetKeyword: 'ai thumbnail generator vs canva',
    suggestedTitle: 'AI Thumbnail Generator vs Canva: Which Creates Better YouTube Thumbnails?',
    category: 'AI Tools',
    relatedTool: '/tools/ai-thumbnail-generator',
  },
  {
    slug: 'summarize-pdf-with-ai-free',
    targetKeyword: 'summarize pdf with ai free',
    suggestedTitle: 'How to Summarize Any PDF with AI for Free (No Signup)',
    category: 'AI Tools',
    relatedTool: '/tools/pdf-summarizer',
  },
  // Social Media Tools
  {
    slug: 'best-hashtag-generator-tools-instagram-tiktok',
    targetKeyword: 'best hashtag generator tools instagram tiktok',
    suggestedTitle: '5 Best Hashtag Generator Tools for Instagram & TikTok (2026)',
    category: 'Social Media Tools',
    relatedTool: '/tools/hashtag-generator',
  },
  {
    slug: 'how-to-create-qr-code-for-business',
    targetKeyword: 'how to create qr code for business',
    suggestedTitle: 'How to Create a QR Code for Your Business in 2 Minutes',
    category: 'Social Media Tools',
    relatedTool: '/tools/qr-code-generator',
  },
  {
    slug: 'youtube-video-download-mp4-guide',
    targetKeyword: 'youtube video download mp4',
    suggestedTitle: 'How to Download YouTube Videos as MP4 — Safe & Free Methods',
    category: 'Social Media Tools',
    relatedTool: '/tools/youtube-downloader',
  },
  {
    slug: 'youtube-thumbnail-download-hd',
    targetKeyword: 'youtube thumbnail download hd',
    suggestedTitle: 'How to Download YouTube Thumbnails in HD (1280x720)',
    category: 'Social Media Tools',
    relatedTool: '/tools/youtube-thumbnail-downloader',
  },
  // Finance Tools
  {
    slug: 'emi-calculator-for-home-loan',
    targetKeyword: 'emi calculator for home loan',
    suggestedTitle: 'EMI Calculator for Home Loan — Calculate Monthly Payments Free',
    category: 'Finance Tools',
    relatedTool: '/tools/loan-emi-calculator',
  },
  {
    slug: 'best-free-budget-planner-app',
    targetKeyword: 'best free budget planner app',
    suggestedTitle: 'Best Free Budget Planner: Take Control of Your Finances Online',
    category: 'Finance Tools',
    relatedTool: '/tools/budget-planner',
  },
  // Developer Tools
  {
    slug: 'json-formatter-online-how-to-use',
    targetKeyword: 'json formatter online',
    suggestedTitle: 'JSON Formatter Online — How to Use It (Beginner Guide)',
    category: 'Developer Tools',
    relatedTool: '/tools/json-formatter',
  },
  {
    slug: 'generate-meta-tags-for-seo-free',
    targetKeyword: 'generate meta tags for seo free',
    suggestedTitle: 'How to Generate Meta Tags for SEO — Free Tool & Best Practices',
    category: 'Developer Tools',
    relatedTool: '/tools/meta-tag-generator',
  },
];
