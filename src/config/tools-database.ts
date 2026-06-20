/**
 * CreatorBoost AI — Central Tools Database
 * Single source of truth for ALL tools. Add new tools here only.
 */

/* ─── Types ────────────────────────────────────── */

export interface ToolEntry {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedToolIds: string[];
  publishDate: string;
  featured: boolean;
  trending: boolean;
  popular: boolean;
  isNew?: boolean;
}

export type ToolCategory =
  | 'ai-tools'
  | 'image-tools'
  | 'pdf-tools'
  | 'seo-tools'
  | 'youtube-tools'
  | 'social-media-tools'
  | 'finance-tools'
  | 'developer-tools';

export interface CategoryEntry {
  id: ToolCategory;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faqs: Array<{ q: string; a: string }>;
}

/* ─── Categories ───────────────────────────────── */

export const CATEGORIES: CategoryEntry[] = [
  {
    id: 'ai-tools',
    name: 'AI Tools',
    shortName: 'AI',
    description: 'AI-powered tools for content creation, image analysis, and smart automation.',
    longDescription: 'Our AI Tools leverage cutting-edge artificial intelligence to help you create content, analyze images, generate code, translate text, and automate repetitive tasks. Powered by Google Gemini and advanced machine learning models, these tools deliver professional-grade results instantly. Whether you need to generate captions, analyze sentiment, remove backgrounds, or summarize documents, our AI tools do the heavy lifting so you can focus on what matters.',
    icon: 'Brain',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    metaTitle: 'Free AI Tools Online | Content Generation, Image Analysis & More | CreatorBoost AI',
    metaDescription: 'Access 15+ free AI tools: caption generators, hashtag generators, image analyzers, background removers, and more. No signup required.',
    keywords: ['ai tools', 'free ai tools', 'ai generator', 'ai content creator', 'ai tools online'],
    faqs: [
      { q: 'What AI tools do you offer?', a: 'We offer AI caption generators, hashtag generators, image analyzers, background removers, translators, sentiment analyzers, code generators, and more.' },
      { q: 'Are the AI tools free?', a: 'Yes, all AI tools are completely free to use with no hidden charges.' },
      { q: 'Do AI tools require an account?', a: 'No, all AI tools work instantly without any registration.' },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    shortName: 'Image',
    description: 'Compress, resize, crop, convert, and enhance images — all in your browser.',
    longDescription: 'Our Image Tools provide a complete solution for image processing without installing any software. Compress images for faster web loading, resize photos for social media, crop to perfect dimensions, convert between formats (JPG, PNG, WebP, HEIC), and enhance quality — all processing happens securely in your browser. Your images never leave your device, ensuring complete privacy. Perfect for web designers, photographers, social media managers, and anyone working with digital images.',
    icon: 'ImageIcon',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    gradient: 'from-blue-500/20 to-blue-500/5',
    metaTitle: 'Free Image Tools Online | Compressor, Resizer, Converter & More | CreatorBoost AI',
    metaDescription: 'Free online image tools: compress, resize, crop, convert, and enhance images. JPG, PNG, WebP supported. No upload, no signup.',
    keywords: ['image tools', 'image compressor', 'image resizer', 'image converter', 'free image editor'],
    faqs: [
      { q: 'What image formats are supported?', a: 'We support JPG, PNG, WebP, GIF, BMP, HEIC, and TIFF formats.' },
      { q: 'Are my images uploaded to a server?', a: 'No. All processing happens in your browser. Your images never leave your device.' },
      { q: 'Is there a file size limit?', a: 'Most tools handle files up to 50MB. For larger files, use our bulk processing tools.' },
    ],
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDF',
    description: 'Merge, split, compress, convert, and edit PDF documents online.',
    longDescription: 'Our PDF Tools let you manipulate PDF documents entirely in your browser using the pdf-lib library. Merge multiple PDFs into one, split documents into pages, compress file sizes, convert between PDF and other formats, add watermarks, protect with passwords, and edit metadata — all without uploading files to any server. Essential for professionals, students, and anyone who works with PDF documents regularly.',
    icon: 'FileText',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    gradient: 'from-purple-500/20 to-purple-500/5',
    metaTitle: 'Free PDF Tools Online | Merge, Split, Compress & Convert PDF | CreatorBoost AI',
    metaDescription: 'Free online PDF tools: merge, split, compress, convert, rotate, and watermark PDFs. No upload required. Runs in your browser.',
    keywords: ['pdf tools', 'pdf merger', 'pdf compressor', 'pdf converter', 'merge pdf online'],
    faqs: [
      { q: 'Are my PDF files uploaded?', a: 'No. All PDF processing happens in your browser using pdf-lib. Your files never leave your device.' },
      { q: 'What is the maximum file size?', a: 'There is no hard limit, but files over 100MB may slow down your browser.' },
      { q: 'Can I merge password-protected PDFs?', a: 'PDFs with owner passwords that allow editing may work. Remove open passwords first.' },
    ],
  },
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    shortName: 'SEO',
    description: 'Optimize your website with meta tag generators, keyword checkers, and SEO utilities.',
    longDescription: 'Our SEO Tools help you optimize your website for search engines. Generate meta tags, create XML sitemaps, write robots.txt files, check keyword density, generate Open Graph tags, create schema markup, and analyze content readability. These tools are essential for webmasters, bloggers, and digital marketers who want to improve their search engine rankings and drive more organic traffic.',
    icon: 'SearchCode',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    gradient: 'from-green-500/20 to-green-500/5',
    metaTitle: 'Free SEO Tools Online | Meta Tags, Sitemap & Keyword Tools | CreatorBoost AI',
    metaDescription: 'Free SEO tools: meta tag generator, sitemap generator, keyword density checker, schema generator, and more. Boost your rankings.',
    keywords: ['seo tools', 'meta tag generator', 'sitemap generator', 'keyword checker', 'seo optimization'],
    faqs: [
      { q: 'What SEO tools do you offer?', a: 'Meta tag generator, sitemap generator, robots.txt generator, keyword density checker, Open Graph generator, schema generator, slug generator, and word counter.' },
      { q: 'Are these tools free?', a: 'Yes, all SEO tools are completely free with no usage limits.' },
    ],
  },
  {
    id: 'youtube-tools',
    name: 'YouTube Tools',
    shortName: 'YouTube',
    description: 'Grow your YouTube channel with thumbnail downloaders, title generators, and SEO tools.',
    longDescription: 'Our YouTube Tools help content creators optimize their channels and grow their audience. Download thumbnails in any resolution, generate catchy SEO-optimized titles, create compelling descriptions, extract tags from any video, analyze channel performance, and get video ideas for your niche. Whether you are just starting out or looking to scale, these tools give you the competitive edge.',
    icon: 'Youtube',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    gradient: 'from-red-500/20 to-red-500/5',
    metaTitle: 'Free YouTube Tools | Thumbnail Downloader, Title Generator & More | CreatorBoost AI',
    metaDescription: 'Free YouTube tools: thumbnail downloader, title generator, description generator, tag extractor, channel analyzer. Grow your channel.',
    keywords: ['youtube tools', 'youtube thumbnail downloader', 'youtube title generator', 'youtube seo', 'youtube tags'],
    faqs: [
      { q: 'Can I download any YouTube thumbnail?', a: 'Yes, you can download thumbnails from any public YouTube video in multiple resolutions.' },
      { q: 'Are the YouTube tools free?', a: 'Yes, all YouTube tools are completely free to use.' },
    ],
  },
  {
    id: 'social-media-tools',
    name: 'Social Media Tools',
    shortName: 'Social',
    description: 'Create captions, hashtags, and content for Instagram, TikTok, Facebook, and more.',
    longDescription: 'Our Social Media Tools help you create engaging content for all major platforms. Generate captions for Instagram and TikTok, create Facebook bios, find trending hashtags, generate usernames, and plan content calendars. Whether you are a social media manager, influencer, or small business owner, these tools save you hours of content creation time.',
    icon: 'Share2',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    gradient: 'from-pink-500/20 to-pink-500/5',
    metaTitle: 'Free Social Media Tools | Caption Generator, Hashtag Finder & More | CreatorBoost AI',
    metaDescription: 'Free social media tools: Instagram caption generator, TikTok caption generator, hashtag generator, bio generator, username generator.',
    keywords: ['social media tools', 'instagram caption generator', 'hashtag generator', 'tiktok caption', 'bio generator'],
    faqs: [
      { q: 'What social media platforms do you support?', a: 'We support Instagram, TikTok, Facebook, Twitter/X, LinkedIn, and YouTube.' },
      { q: 'Can I generate hashtags for any niche?', a: 'Yes, our hashtag generator works for any topic or niche.' },
    ],
  },
  {
    id: 'finance-tools',
    name: 'Finance Tools',
    shortName: 'Finance',
    description: ' calculators for loans, SIP, budget, tax, and currency conversion.',
    longDescription: 'Our Finance Tools help you make informed financial decisions. Calculate loan EMIs, compare interest rates, plan budgets, compute taxes, convert currencies, and track your financial goals. These calculators use standard financial formulas and are designed for educational and informational purposes.',
    icon: 'Calculator',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    metaTitle: 'Free Finance Calculators | Loan, SIP, Budget & Tax Calculator | CreatorBoost AI',
    metaDescription: 'Free finance calculators: loan EMI, SIP, budget planner, tax calculator, currency converter. Plan your finances better.',
    keywords: ['finance calculator', 'loan calculator', 'emi calculator', 'sip calculator', 'budget planner'],
    faqs: [
      { q: 'Are financial calculations accurate?', a: 'Calculations use standard formulas for educational purposes. Always consult a financial advisor for important decisions.' },
      { q: 'Is my financial data stored?', a: 'No. All calculations happen in your browser. No data is stored or transmitted.' },
    ],
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Dev',
    description: 'JSON formatter, Base64 encoder, regex tester, and other developer utilities.',
    longDescription: 'Our Developer Tools help developers and technical users work more efficiently. Format and validate JSON, encode and decode Base64, test regular expressions, convert between HTML and Markdown, minify CSS and JavaScript, encode URLs, generate hashes, and convert color codes. All tools run in your browser for instant results.',
    icon: 'Code',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    gradient: 'from-amber-500/20 to-amber-500/5',
    metaTitle: 'Free Developer Tools | JSON Formatter, Base64 Encoder & More | CreatorBoost AI',
    metaDescription: 'Free developer tools: JSON formatter, Base64 encoder, regex tester, HTML to Markdown converter, CSS minifier, and more.',
    keywords: ['developer tools', 'json formatter', 'base64 encoder', 'regex tester', 'code tools'],
    faqs: [
      { q: 'What developer tools do you offer?', a: 'JSON formatter, Base64 encoder/decoder, HTML-Markdown converter, CSS/JS minifier, URL encoder, hash generator, regex tester, and color converter.' },
      { q: 'Is my code data secure?', a: 'Yes, all processing happens in your browser. No code is sent to any server.' },
    ],
  },
];

/* ─── Tool Database ────────────────────────────── */

export const TOOLS_DATABASE: ToolEntry[] = [

  // ═══════════ AI TOOLS ═══════════
  {
    id: 'ai-caption-generator',
    slug: 'ai-caption-generator',
    name: 'AI Caption Generator',
    shortDescription: 'Generate engaging captions for social media posts with AI',
    longDescription: 'Our AI Caption Generator creates compelling, engaging captions for your social media posts across Instagram, Facebook, Twitter, and LinkedIn. Simply describe your post or upload an image, and the AI generates multiple caption options with hashtags, emojis, and call-to-actions. Perfect for influencers, brands, and content creators who want to save time while maintaining a consistent posting schedule.',
    category: 'ai-tools',
    icon: 'PenTool',
    metaTitle: 'Free AI Caption Generator | Create Social Media Captions Instantly',
    metaDescription: 'Generate engaging social media captions with AI. Create Instagram, Facebook, and Twitter captions with hashtags and emojis. Free, no signup.',
    keywords: ['caption generator', 'ai caption', 'instagram caption generator', 'social media caption', 'ai content'],
    faqs: [
      { q: 'What platforms are captions optimized for?', a: 'Captions are optimized for Instagram, Facebook, Twitter/X, LinkedIn, and TikTok.' },
      { q: 'Can I customize the tone?', a: 'Yes, you can choose from professional, casual, humorous, and enthusiastic tones.' },
      { q: 'Are captions unique?', a: 'Yes, each generation produces unique captions based on your input.' },
    ],
    relatedToolIds: ['ai-hashtag-generator', 'social-media-post-generator', 'caption-writer'],
    publishDate: '2026-03-15',
    featured: true,
    trending: true,
    popular: true,
  },
  {
    id: 'ai-hashtag-generator',
    slug: 'ai-hashtag-generator',
    name: 'AI Hashtag Generator',
    shortDescription: 'Find trending hashtags for maximum reach on social media',
    longDescription: 'Our AI Hashtag Generator analyzes your content and generates relevant, trending hashtags that maximize your reach on Instagram, TikTok, Twitter, and YouTube. Get categorized hashtags by reach level — broad, niche, and trending — along with estimated engagement potential. Stop guessing which hashtags work and let AI find the perfect mix for every post.',
    category: 'ai-tools',
    icon: 'Hash',
    metaTitle: 'Free AI Hashtag Generator | Trending Hashtags for Instagram & TikTok',
    metaDescription: 'Generate trending hashtags for Instagram, TikTok, and Twitter. AI-powered hashtag suggestions for maximum reach and engagement.',
    keywords: ['hashtag generator', 'ai hashtags', 'instagram hashtags', 'tiktok hashtags', 'trending hashtags'],
    faqs: [
      { q: 'How many hashtags are generated?', a: 'Each search generates 30+ hashtags categorized by reach level and relevance.' },
      { q: 'Are hashtags updated for current trends?', a: 'Yes, hashtags are based on current trending data and updated regularly.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'social-media-post-generator', 'youtube-hashtag-generator'],
    publishDate: '2026-03-15',
    featured: false,
    trending: true,
    popular: true,
  },
  {
    id: 'ai-prompt-generator',
    slug: 'ai-prompt-generator',
    name: 'AI Prompt Generator',
    shortDescription: 'Generate effective AI prompts for ChatGPT, Midjourney, and more',
    longDescription: 'Our AI Prompt Generator helps you craft effective prompts for AI tools like ChatGPT, Midjourney, DALL-E, and Stable Diffusion. Get structured, detailed prompts that produce better results. Whether you need prompts for content creation, image generation, code writing, or data analysis, this tool ensures you get the most out of AI.',
    category: 'ai-tools',
    icon: 'Sparkles',
    metaTitle: 'Free AI Prompt Generator | Create Better ChatGPT & Midjourney Prompts',
    metaDescription: 'Generate effective AI prompts for ChatGPT, Midjourney, DALL-E, and more. Get better results from AI tools with structured prompts.',
    keywords: ['ai prompt generator', 'chatgpt prompts', 'midjourney prompts', 'ai prompts', 'prompt engineering'],
    faqs: [
      { q: 'Which AI tools are prompts optimized for?', a: 'Prompts are optimized for ChatGPT, Midjourney, DALL-E, Stable Diffusion, and Claude.' },
      { q: 'Can I customize prompt style?', a: 'Yes, choose from detailed, concise, creative, and technical prompt styles.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'ai-story-generator', 'ai-code-generator'],
    publishDate: '2026-04-01',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'ai-story-generator',
    slug: 'ai-story-generator',
    name: 'AI Story Generator',
    shortDescription: 'Create creative stories and narratives with AI assistance',
    longDescription: 'Our AI Story Generator creates original stories, narratives, and creative content based on your prompts. Choose a genre, set the mood, and let the AI craft compelling stories with well-developed characters and plotlines. Perfect for writers seeking inspiration, content creators needing story ideas, or anyone who enjoys creative storytelling.',
    category: 'ai-tools',
    icon: 'BookOpen',
    metaTitle: 'Free AI Story Generator | Create Stories & Narratives Instantly',
    metaDescription: 'Generate creative stories with AI. Choose genre, characters, and plot. Perfect for writers, bloggers, and content creators.',
    keywords: ['story generator', 'ai story writer', 'creative writing ai', 'narrative generator', 'story creator'],
    faqs: [
      { q: 'What genres are supported?', a: 'Sci-fi, fantasy, romance, mystery, horror, adventure, comedy, and more.' },
      { q: 'Can I control the story length?', a: 'Yes, you can generate short stories, medium narratives, or longer chapters.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'blog-title-generator', 'content-idea-generator'],
    publishDate: '2026-04-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'ai-emoji-generator',
    slug: 'ai-emoji-generator',
    name: 'AI Emoji Generator',
    shortDescription: 'Find the perfect emojis for any message or post',
    longDescription: 'Our AI Emoji Generator analyzes your text and suggests the most relevant emojis to make your messages more expressive and engaging. Whether you are writing social media captions, emails, or text messages, this tool helps you find the right emojis to convey your tone and emotion.',
    category: 'ai-tools',
    icon: 'Smile',
    metaTitle: 'Free AI Emoji Generator | Find Perfect Emojis for Any Message',
    metaDescription: 'AI-powered emoji generator. Find the perfect emojis for social media, messages, and content. Free and instant.',
    keywords: ['emoji generator', 'ai emoji', 'emoji finder', 'emoji suggestions', 'emoji picker'],
    faqs: [
      { q: 'How does the emoji generator work?', a: 'AI analyzes your text and suggests contextually relevant emojis based on tone and content.' },
      { q: 'Can I copy emojis directly?', a: 'Yes, click any emoji to copy it to your clipboard instantly.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'emoji-picker', 'social-media-post-generator'],
    publishDate: '2026-04-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'ai-bio-generator',
    slug: 'ai-bio-generator',
    name: 'AI Bio Generator',
    shortDescription: 'Create professional bios for social media profiles',
    longDescription: 'Our AI Bio Generator creates compelling, professional bios for Instagram, TikTok, Twitter, LinkedIn, and other social media platforms. Enter your niche, personality, and goals, and get multiple bio options optimized for each platform. Stand out from the crowd with a bio that captures who you are and what you do.',
    category: 'ai-tools',
    icon: 'User',
    metaTitle: 'Free AI Bio Generator | Create Social Media Bios Instantly',
    metaDescription: 'Generate professional social media bios with AI. Optimized for Instagram, TikTok, Twitter, and LinkedIn. Free and instant.',
    keywords: ['bio generator', 'instagram bio generator', 'social media bio', 'ai bio creator', 'profile bio'],
    faqs: [
      { q: 'Which platforms are bios optimized for?', a: 'Instagram, TikTok, Twitter/X, LinkedIn, and Facebook.' },
      { q: 'Can I set the tone?', a: 'Yes, choose from professional, casual, creative, and minimalist styles.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'bio-link-page-builder', 'username-generator'],
    publishDate: '2026-04-15',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'ai-tweet-generator',
    slug: 'ai-tweet-generator',
    name: 'AI Tweet Generator',
    shortDescription: 'Generate viral tweets and Twitter threads with AI',
    longDescription: 'Our AI Tweet Generator creates engaging tweets and Twitter threads that drive engagement. Choose a topic, set the tone, and get multiple tweet options optimized for retweets and likes. Perfect for personal branding, business marketing, and content creators who want to maintain an active Twitter presence.',
    category: 'ai-tools',
    icon: 'MessageCircle',
    metaTitle: 'Free AI Tweet Generator | Create Viral Tweets & Threads',
    metaDescription: 'Generate viral tweets and Twitter threads with AI. Create engaging content for Twitter/X. Free and instant.',
    keywords: ['tweet generator', 'ai tweet', 'twitter content', 'tweet ideas', 'twitter thread generator'],
    faqs: [
      { q: 'Can I generate Twitter threads?', a: 'Yes, the tool generates both single tweets and multi-part threads.' },
      { q: 'Are tweets character-count compliant?', a: 'Yes, all tweets stay within the 280 character limit.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'social-media-post-generator', 'content-idea-generator'],
    publishDate: '2026-05-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'ai-script-generator',
    slug: 'ai-script-generator',
    name: 'AI Script Generator',
    shortDescription: 'Generate video scripts for YouTube, TikTok, and reels',
    longDescription: 'Our AI Script Generator creates complete video scripts with hooks, intros, main sections, CTAs, and outros. Choose a format (YouTube, TikTok, Instagram Reel), set the duration, and get a structured script ready for recording. Perfect for content creators who want to save time on pre-production.',
    category: 'ai-tools',
    icon: 'FileText',
    metaTitle: 'Free AI Script Generator | Video Scripts for YouTube & TikTok',
    metaDescription: 'Generate video scripts with AI. Create YouTube, TikTok, and Instagram Reel scripts with hooks and CTAs. Free.',
    keywords: ['script generator', 'video script', 'youtube script', 'tiktok script', 'ai scriptwriter'],
    faqs: [
      { q: 'What video formats are supported?', a: 'YouTube long-form, YouTube Shorts, TikTok, Instagram Reels, and Facebook Stories.' },
      { q: 'Can I set the video length?', a: 'Yes, choose from 30 seconds, 1 minute, 5 minutes, 10 minutes, or custom duration.' },
    ],
    relatedToolIds: ['youtube-title-generator', 'youtube-description-generator', 'youtube-script-writer'],
    publishDate: '2026-05-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'ai-product-description-generator',
    slug: 'ai-product-description-generator',
    name: 'AI Product Description Generator',
    shortDescription: 'Create compelling product descriptions that convert',
    longDescription: 'Our AI Product Description Generator creates persuasive, SEO-optimized product descriptions for e-commerce. Enter your product name, features, and target audience, and get multiple description options. Perfect for Shopify, Amazon, Etsy, and any online store.',
    category: 'ai-tools',
    icon: 'ShoppingBag',
    metaTitle: 'Free AI Product Description Generator | E-commerce Copywriting',
    metaDescription: 'Generate product descriptions with AI. Create SEO-optimized copy for Shopify, Amazon, and Etsy. Free and instant.',
    keywords: ['product description generator', 'ecommerce copywriting', 'ai product copy', 'shopify description'],
    faqs: [
      { q: 'Which e-commerce platforms are descriptions optimized for?', a: 'Shopify, Amazon, Etsy, WooCommerce, and generic e-commerce.' },
      { q: 'Can I set the tone?', a: 'Yes, choose from professional, casual, luxury, and budget-friendly tones.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'blog-title-generator', 'meta-description-generator'],
    publishDate: '2026-05-15',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'ai-email-generator',
    slug: 'ai-email-generator',
    name: 'AI Email Generator',
    shortDescription: 'Write professional emails for any occasion with AI',
    longDescription: 'Our AI Email Generator creates professional, well-structured emails for business communications, cold outreach, follow-ups, newsletters, and more. Choose the email type, provide context, and get a polished email ready to send. Save hours on email writing while maintaining a professional tone.',
    category: 'ai-tools',
    icon: 'Mail',
    metaTitle: 'Free AI Email Generator | Professional Email Writer',
    metaDescription: 'Generate professional emails with AI. Create business emails, cold outreach, follow-ups, and newsletters. Free and instant.',
    keywords: ['email generator', 'ai email writer', 'professional email', 'cold email generator', 'email template'],
    faqs: [
      { q: 'What email types are supported?', a: 'Business, cold outreach, follow-up, newsletter, thank you, apology, and custom types.' },
      { q: 'Can I set the formality level?', a: 'Yes, choose from formal, semi-formal, and casual tones.' },
    ],
    relatedToolIds: ['email-subject-generator', 'ai-caption-generator', 'content-paraphraser'],
    publishDate: '2026-06-01',
    featured: false,
    trending: false,
    popular: false,
  },

  // ═══════════ IMAGE TOOLS ═══════════
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Reduce image file size while maintaining quality',
    longDescription: 'Our Image Compressor reduces file sizes by up to 80% without visible quality loss. Supports JPG, PNG, WebP, and GIF formats. Adjust compression quality and maximum file size with intuitive sliders. Perfect for web developers, bloggers, and anyone who needs to optimize images for faster loading.',
    category: 'image-tools',
    icon: 'Minimize2',
    metaTitle: 'Free Image Compressor Online | Reduce Photo Size Without Losing Quality',
    metaDescription: 'Compress images online free. Reduce JPG, PNG, WebP file size by up to 80% without quality loss. No upload, no signup.',
    keywords: ['image compressor', 'compress photo', 'reduce image size', 'image optimizer', 'photo compressor'],
    faqs: [
      { q: 'What image formats are supported?', a: 'JPG, PNG, WebP, and GIF formats are supported.' },
      { q: 'How much can I reduce file size?', a: 'Typically 50-80% reduction depending on the quality setting.' },
      { q: 'Are my images uploaded?', a: 'No, all compression happens in your browser. Images never leave your device.' },
    ],
    relatedToolIds: ['image-resizer', 'image-cropper', 'bulk-compressor', 'targeted-compression'],
    publishDate: '2026-01-15',
    featured: true,
    trending: true,
    popular: true,
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    shortDescription: 'Change image dimensions with custom or preset sizes',
    longDescription: 'Our Image Resizer lets you resize images to any dimension with precision. Choose from social media presets (Instagram, Facebook, Twitter, YouTube) or enter custom dimensions. Maintain aspect ratio or stretch to fit. Perfect for optimizing images for different platforms.',
    category: 'image-tools',
    icon: 'Maximize',
    metaTitle: 'Free Image Resizer Online | Resize Photos for Social Media',
    metaDescription: 'Resize images online free. Custom dimensions and social media presets for Instagram, Facebook, Twitter. No quality loss.',
    keywords: ['image resizer', 'resize photo', 'image dimensions', 'social media image size', 'photo resizer'],
    faqs: [
      { q: 'Can I maintain aspect ratio?', a: 'Yes, lock the aspect ratio to prevent distortion while resizing.' },
      { q: 'What social media presets are available?', a: 'Instagram post, story, Facebook cover, Twitter header, YouTube thumbnail, and more.' },
    ],
    relatedToolIds: ['image-compressor', 'image-cropper', 'image-converter'],
    publishDate: '2026-01-15',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper',
    shortDescription: 'Trim and crop images with interactive controls',
    longDescription: 'Our Image Cropper provides an intuitive interface for cropping images to any aspect ratio or custom dimensions. Drag to select the crop area, preview the result in real-time, and download the cropped image. Perfect for profile photos, thumbnails, and social media content.',
    category: 'image-tools',
    icon: 'Crop',
    metaTitle: 'Free Image Cropper Online | Crop Photos to Any Size',
    metaDescription: 'Crop images online free. Interactive crop tool with aspect ratio presets. JPG, PNG, WebP supported. No signup.',
    keywords: ['image cropper', 'crop photo', 'image trim', 'photo cropper', 'crop tool'],
    faqs: [
      { q: 'What aspect ratios are supported?', a: 'Free-form, 1:1, 4:3, 16:9, 9:16, and custom ratios.' },
      { q: 'Can I preview before downloading?', a: 'Yes, real-time preview shows the cropped result before download.' },
    ],
    relatedToolIds: ['image-compressor', 'image-resizer', 'passport-size'],
    publishDate: '2026-01-15',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    shortDescription: 'Remove image backgrounds with AI instantly',
    longDescription: 'Our AI Background Remover automatically detects and removes backgrounds from images, leaving clean cutouts of people, products, or objects. Works on photos, product images, and portraits. Download transparent PNG files ready for use in designs, presentations, and e-commerce listings.',
    category: 'image-tools',
    icon: 'ImagePlus',
    metaTitle: 'Free AI Background Remover | Remove Image Backgrounds Instantly',
    metaDescription: 'Remove image backgrounds with AI. Auto-detect subjects and create transparent PNGs. Free, no signup, instant results.',
    keywords: ['background remover', 'remove background', 'ai background removal', 'transparent image', 'cutout tool'],
    faqs: [
      { q: 'What image types work best?', a: 'Photos with clear subjects (people, products, objects) produce the best results.' },
      { q: 'What format is the output?', a: 'Transparent PNG format ready for use in any design tool.' },
      { q: 'Is the background removal accurate?', a: 'AI accuracy is 95%+ for clear subjects. Complex edges may need manual touchup.' },
    ],
    relatedToolIds: ['image-compressor', 'image-resizer', 'ai-thumbnail-generator'],
    publishDate: '2026-02-01',
    featured: true,
    trending: true,
    popular: true,
  },
  {
    id: 'jpg-to-png',
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    shortDescription: 'Convert JPG images to PNG format with transparency support',
    longDescription: 'Our JPG to PNG Converter transforms JPG images into PNG format, enabling transparency support and lossless quality. Perfect for designers who need transparent backgrounds or higher quality images. The conversion happens entirely in your browser.',
    category: 'image-tools',
    icon: 'RefreshCw',
    metaTitle: 'Free JPG to PNG Converter | Convert JPEG to PNG Online',
    metaDescription: 'Convert JPG to PNG online free. Lossless conversion with transparency support. No upload, instant results.',
    keywords: ['jpg to png', 'jpeg to png', 'image converter', 'png converter', 'convert jpg'],
    faqs: [
      { q: 'Will quality be preserved?', a: 'PNG is lossless, so quality is fully preserved during conversion.' },
      { q: 'Does JPG support transparency?', a: 'JPG does not support transparency. Converting to PNG enables transparent backgrounds.' },
    ],
    relatedToolIds: ['png-to-jpg', 'image-converter', 'webp-to-jpg'],
    publishDate: '2026-01-20',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'png-to-jpg',
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    shortDescription: 'Convert PNG images to JPG format for smaller file sizes',
    longDescription: 'Our PNG to JPG Converter transforms PNG images into JPG format with adjustable quality settings. Reduce file sizes while maintaining visual quality. Perfect for web optimization, email attachments, and situations where transparency is not needed.',
    category: 'image-tools',
    icon: 'RefreshCw',
    metaTitle: 'Free PNG to JPG Converter | Convert PNG to JPEG Online',
    metaDescription: 'Convert PNG to JPG online free. Adjustable quality settings for optimal file size. Instant, no signup.',
    keywords: ['png to jpg', 'png to jpeg', 'convert png', 'image converter', 'jpg converter'],
    faqs: [
      { q: 'Can I control the quality?', a: 'Yes, adjust the quality slider from 10% to 100% to balance size and quality.' },
      { q: 'Does PNG transparency work in JPG?', a: 'No, transparent areas become white or a chosen background color in JPG format.' },
    ],
    relatedToolIds: ['jpg-to-png', 'image-converter', 'webp-to-jpg'],
    publishDate: '2026-01-20',
    featured: false,
    trending: false,
    popular: true,
  },
  {
    id: 'webp-to-jpg',
    slug: 'webp-to-jpg',
    name: 'WEBP to JPG Converter',
    shortDescription: 'Convert WebP images to universally supported JPG format',
    longDescription: 'Our WEBP to JPG Converter transforms modern WebP images into widely supported JPG format. Perfect when you need to use WebP images in applications or platforms that do not support the WebP format. Fast, browser-based conversion.',
    category: 'image-tools',
    icon: 'RefreshCw',
    metaTitle: 'Free WEBP to JPG Converter | Convert WebP to JPEG Online',
    metaDescription: 'Convert WebP to JPG online free. Universal compatibility with JPG format. Fast, no upload required.',
    keywords: ['webp to jpg', 'webp converter', 'convert webp', 'webp to jpeg', 'image format converter'],
    faqs: [
      { q: 'Why convert WebP to JPG?', a: 'JPG has universal compatibility. Some platforms and software do not support WebP format.' },
      { q: 'Is quality preserved?', a: 'JPG uses lossy compression, so there may be slight quality reduction depending on settings.' },
    ],
    relatedToolIds: ['jpg-to-webp', 'jpg-to-png', 'image-converter'],
    publishDate: '2026-02-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'jpg-to-webp',
    slug: 'jpg-to-webp',
    name: 'JPG to WEBP Converter',
    shortDescription: 'Convert JPG images to modern WebP format for faster loading',
    longDescription: 'Our JPG to WEBP Converter transforms JPG images into the modern WebP format, offering superior compression and smaller file sizes. WebP provides 25-35% smaller files compared to JPG at similar quality levels. Perfect for web optimization and faster page loading.',
    category: 'image-tools',
    icon: 'RefreshCw',
    metaTitle: 'Free JPG to WEBP Converter | Convert JPEG to WebP Online',
    metaDescription: 'Convert JPG to WebP online free. 25-35% smaller files with better quality. Perfect for web optimization.',
    keywords: ['jpg to webp', 'jpeg to webp', 'webp converter', 'image optimization', 'webp format'],
    faqs: [
      { q: 'Why use WebP over JPG?', a: 'WebP offers 25-35% smaller file sizes at comparable quality, improving page load speed.' },
      { q: 'Is WebP supported by browsers?', a: 'Yes, WebP is supported by Chrome, Firefox, Safari, Edge, and all modern browsers.' },
    ],
    relatedToolIds: ['webp-to-jpg', 'image-compressor', 'image-converter'],
    publishDate: '2026-02-01',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'image-to-base64',
    slug: 'image-to-base64',
    name: 'Image to Base64 Converter',
    shortDescription: 'Convert images to Base64 encoded strings',
    longDescription: 'Our Image to Base64 Converter transforms any image into a Base64 encoded string. Useful for embedding images directly in HTML, CSS, or JSON without external file references. Supports JPG, PNG, WebP, and GIF formats. Copy the encoded string or download as a text file.',
    category: 'image-tools',
    icon: 'Binary',
    metaTitle: 'Free Image to Base64 Converter | Encode Images Online',
    metaDescription: 'Convert images to Base64 strings online free. Embed images in HTML, CSS, or JSON. JPG, PNG, WebP supported.',
    keywords: ['image to base64', 'base64 image encoder', 'encode image', 'base64 converter', 'image encoding'],
    faqs: [
      { q: 'What is Base64 encoding?', a: 'Base64 encodes binary data as ASCII text, allowing images to be embedded in text-based formats.' },
      { q: 'How much does the file size increase?', a: 'Base64 encoding increases file size by approximately 33%.' },
    ],
    relatedToolIds: ['base64-to-image', 'image-converter', 'image-compressor'],
    publishDate: '2026-01-20',
    featured: false,
    trending: false,
    popular: false,
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    shortDescription: 'Create custom QR codes for links, text, contacts, and WiFi',
    longDescription: 'Our QR Code Generator creates custom QR codes for URLs, plain text, email addresses, phone numbers, WiFi credentials, and vCard contact cards. Customize colors, add logos, choose error correction levels, and download as PNG or SVG. Perfect for businesses, events, and personal use.',
    category: 'image-tools',
    icon: 'QrCode',
    metaTitle: 'Free QR Code Generator | Create Custom QR Codes Online',
    metaDescription: 'Generate custom QR codes free. Support URLs, text, email, WiFi, and vCard. Custom colors and logo. Download PNG or SVG.',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code', 'qr code online'],
    faqs: [
      { q: 'What QR code types are supported?', a: 'URLs, text, email, phone numbers, WiFi credentials, and vCard contact cards.' },
      { q: 'Can I customize colors?', a: 'Yes, set custom foreground and background colors with presets or color picker.' },
      { q: 'What format can I download?', a: 'Download as PNG (raster) or SVG (vector). SVG is recommended for print quality.' },
    ],
    relatedToolIds: ['image-compressor', 'favicon-generator', 'link-shortener'],
    publishDate: '2026-02-15',
    featured: true,
    trending: true,
    popular: true,
  },

  // ═══════════ PDF TOOLS ═══════════
  {
    id: 'pdf-merger', slug: 'pdf-merger', name: 'PDF Merger', shortDescription: 'Combine multiple PDF files into one document',
    longDescription: 'Our PDF Merger combines multiple PDF files into a single document. Drag and drop to reorder pages, preview the merged result, and download instantly. All processing happens in your browser using pdf-lib — no files are uploaded to any server.',
    category: 'pdf-tools', icon: 'Merge',
    metaTitle: 'Free PDF Merger Online | Combine Multiple PDFs Into One',
    metaDescription: 'Merge PDF files online free. Combine multiple PDFs into one document. No upload, no signup. Runs in your browser.',
    keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'pdf joiner', 'merge pdf online'],
    faqs: [
      { q: 'Is there a file limit?', a: 'No enforced limit, but merging more than 20 large files may slow your browser.' },
      { q: 'Will bookmarks carry over?', a: 'Basic page content is preserved. Bookmarks and annotations may not transfer.' },
    ],
    relatedToolIds: ['pdf-splitter', 'pdf-compressor', 'pdf-rotator'],
    publishDate: '2026-01-10', featured: true, trending: true, popular: true,
  },
  {
    id: 'pdf-splitter', slug: 'pdf-splitter', name: 'PDF Splitter', shortDescription: 'Extract specific pages from a PDF document',
    longDescription: 'Our PDF Splitter extracts pages from a PDF document. Choose specific pages, page ranges, or split into individual pages. Preview each page before extracting. Perfect for extracting chapters, specific pages, or dividing large documents.',
    category: 'pdf-tools', icon: 'Scissors',
    metaTitle: 'Free PDF Splitter Online | Extract Pages from PDF',
    metaDescription: 'Split PDF files online free. Extract specific pages or ranges. No upload, instant results. Browser-based.',
    keywords: ['pdf splitter', 'split pdf', 'extract pdf pages', 'pdf page extractor', 'divide pdf'],
    faqs: [
      { q: 'Can I extract specific page ranges?', a: 'Yes, specify exact pages or ranges like 1-5, 8, 10-12.' },
      { q: 'Will the quality change?', a: 'No, pages are extracted without re-encoding, maintaining original quality.' },
    ],
    relatedToolIds: ['pdf-merger', 'pdf-remover', 'pdf-to-jpg'],
    publishDate: '2026-01-10', featured: false, trending: false, popular: true,
  },
  {
    id: 'pdf-compressor', slug: 'pdf-compressor', name: 'PDF Compressor', shortDescription: 'Reduce PDF file size without losing quality',
    longDescription: 'Our PDF Compressor reduces PDF file sizes by restructuring internal object streams. Text and vector graphics stay sharp while file sizes shrink significantly. No image resampling means no quality loss for text-heavy documents.',
    category: 'pdf-tools', icon: 'Minimize2',
    metaTitle: 'Free PDF Compressor Online | Reduce PDF Size Without Losing Quality',
    metaDescription: 'Compress PDF files online free. Reduce size by up to 80% without quality loss. No upload, no signup.',
    keywords: ['pdf compressor', 'compress pdf', 'reduce pdf size', 'pdf optimizer', 'shrink pdf'],
    faqs: [
      { q: 'Does compression reduce text clarity?', a: 'No, text and vector graphics stay sharp. Only internal object streams are restructured.' },
      { q: 'What is the maximum file size?', a: 'No hard limit, but files over 100MB may slow your browser.' },
    ],
    relatedToolIds: ['pdf-merger', 'pdf-to-jpg', 'image-compressor'],
    publishDate: '2026-01-10', featured: true, trending: true, popular: true,
  },
  {
    id: 'pdf-to-jpg', slug: 'pdf-to-jpg', name: 'PDF to JPG', shortDescription: 'Convert PDF pages to JPG images',
    longDescription: 'Our PDF to JPG converter renders each PDF page as a separate JPG image. Pages are rendered at standard screen resolution. Perfect for extracting visual content from PDFs or sharing PDF pages as images.',
    category: 'pdf-tools', icon: 'ImageDown',
    metaTitle: 'Free PDF to JPG Converter | Convert PDF Pages to Images',
    metaDescription: 'Convert PDF to JPG online free. Extract PDF pages as images. No upload, browser-based conversion.',
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to jpg', 'pdf pages to images', 'extract images from pdf'],
    faqs: [
      { q: 'What resolution are output images?', a: 'Pages are rendered at standard screen resolution (150 DPI).' },
      { q: 'Can I convert specific pages?', a: 'This version converts all pages. Use PDF Splitter first for specific pages.' },
    ],
    relatedToolIds: ['jpg-to-pdf', 'pdf-merger', 'pdf-splitter'],
    publishDate: '2026-01-10', featured: false, trending: false, popular: true,
  },
  {
    id: 'jpg-to-pdf', slug: 'jpg-to-pdf', name: 'JPG to PDF', shortDescription: 'Convert JPG and PNG images to PDF documents',
    longDescription: 'Our JPG to PDF converter combines multiple images into a single PDF document. Each image becomes one page. Supports JPG and PNG formats. Customize page size, orientation, and margins before downloading.',
    category: 'pdf-tools', icon: 'ImageUp',
    metaTitle: 'Free JPG to PDF Converter | Convert Images to PDF Online',
    metaDescription: 'Convert JPG to PDF online free. Combine multiple images into one PDF. No upload, no signup required.',
    keywords: ['jpg to pdf', 'image to pdf', 'convert jpg to pdf', 'png to pdf', 'photos to pdf'],
    faqs: [
      { q: 'How many images can I combine?', a: 'No strict limit. Each image becomes one page in the PDF.' },
      { q: 'Will image quality change?', a: 'Images are embedded at original resolution without recompression.' },
    ],
    relatedToolIds: ['pdf-to-jpg', 'pdf-merger', 'pdf-compressor'],
    publishDate: '2026-01-10', featured: false, trending: false, popular: true,
  },
  {
    id: 'pdf-rotator', slug: 'pdf-rotator', name: 'PDF Rotator', shortDescription: 'Rotate PDF pages by 90, 180, or 270 degrees',
    longDescription: 'Our PDF Rotator changes the orientation of all pages in a PDF. Rotate by 90°, 180°, or 270° to fix sideways scans and upside-down documents. All processing happens in your browser.',
    category: 'pdf-tools', icon: 'RotateCw',
    metaTitle: 'Free PDF Rotator Online | Rotate PDF Pages',
    metaDescription: 'Rotate PDF pages online free. Fix sideways and upside-down PDFs. 90°, 180°, 270° rotation. No upload.',
    keywords: ['pdf rotator', 'rotate pdf', 'rotate pdf pages', 'fix pdf orientation', 'flip pdf'],
    faqs: [
      { q: 'Can I rotate specific pages?', a: 'This tool rotates all pages. Use PDF Splitter to extract pages first.' },
      { q: 'Will rotation change file size?', a: 'No, rotation only modifies page orientation metadata.' },
    ],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'pdf-remover'],
    publishDate: '2026-01-10', featured: false, trending: false, popular: false,
  },
  {
    id: 'pdf-watermark', slug: 'pdf-watermark', name: 'PDF Watermark', shortDescription: 'Add text watermarks to PDF documents',
    longDescription: 'Our PDF Watermark tool adds text watermarks to PDF pages. Customize text, font size, color, opacity, rotation, and position. Apply to all or specific pages. Perfect for branding, copyright protection, and document marking.',
    category: 'pdf-tools', icon: 'Stamp',
    metaTitle: 'Free PDF Watermark Tool | Add Text Watermarks to PDF',
    metaDescription: 'Add watermarks to PDF files online free. Custom text, font, color, and position. No upload, browser-based.',
    keywords: ['pdf watermark', 'add watermark to pdf', 'pdf stamp', 'watermark pdf', 'brand pdf'],
    faqs: [
      { q: 'Can I add image watermarks?', a: 'Currently text watermarks are supported. Image watermarks coming soon.' },
      { q: 'Can I apply to specific pages?', a: 'Yes, choose all pages or specify page ranges.' },
    ],
    relatedToolIds: ['pdf-password-protector', 'pdf-merger', 'pdf-compressor'],
    publishDate: '2026-02-01', featured: false, trending: false, popular: false,
  },
  {
    id: 'pdf-unlocker', slug: 'pdf-unlocker', name: 'PDF Unlocker', shortDescription: 'Remove password protection from PDF files',
    longDescription: 'Our PDF Unlocker removes password protection from PDF files. Enter the password and download an unlocked version. Supports owner password removal for editing and printing restrictions.',
    category: 'pdf-tools', icon: 'Unlock',
    metaTitle: 'Free PDF Unlocker Online | Remove PDF Password Protection',
    metaDescription: 'Unlock PDF files online free. Remove password protection instantly. No upload, browser-based.',
    keywords: ['pdf unlocker', 'unlock pdf', 'remove pdf password', 'decrypt pdf', 'open locked pdf'],
    faqs: [
      { q: 'Can I remove any password?', a: 'Owner passwords (print/edit restrictions) can be removed. Open passwords require the password.' },
      { q: 'Is this legal?', a: 'Only unlock PDFs you own or have authorization to modify.' },
    ],
    relatedToolIds: ['pdf-password-protector', 'pdf-merger', 'pdf-compressor'],
    publishDate: '2026-02-01', featured: false, trending: false, popular: false,
  },

  // ═══════════ SEO TOOLS ═══════════
  {
    id: 'meta-tag-generator', slug: 'meta-tag-generator', name: 'Meta Tag Generator', shortDescription: 'Generate SEO meta tags, Open Graph, and Twitter Card tags',
    longDescription: 'Our Meta Tag Generator creates complete HTML meta tags including title, description, keywords, Open Graph, and Twitter Card tags. Preview how your page will appear in Google search results and social media. Copy the generated HTML or download as a file.',
    category: 'seo-tools', icon: 'Code',
    metaTitle: 'Free Meta Tag Generator | SEO, Open Graph & Twitter Tags',
    metaDescription: 'Generate SEO meta tags online free. Create title, description, OG, and Twitter tags with live preview. Copy or download HTML.',
    keywords: ['meta tag generator', 'seo meta tags', 'open graph generator', 'twitter card generator', 'meta description'],
    faqs: [
      { q: 'What meta tags are generated?', a: 'Title, description, keywords, Open Graph (Facebook/LinkedIn), Twitter Card, and canonical URL.' },
      { q: 'Can I preview the result?', a: 'Yes, live preview shows how your page appears in Google and social media.' },
    ],
    relatedToolIds: ['meta-description-generator', 'slug-generator', 'schema-generator'],
    publishDate: '2026-02-01', featured: true, trending: true, popular: true,
  },
  {
    id: 'meta-description-generator', slug: 'meta-description-generator', name: 'Meta Description Generator', shortDescription: 'Generate SEO-optimized meta descriptions',
    longDescription: 'Our Meta Description Generator creates 5 SEO-optimized meta description variations for any page. Each description is optimized for 150-160 characters, includes primary keywords, and has a compelling call-to-action.',
    category: 'seo-tools', icon: 'FileText',
    metaTitle: 'Free Meta Description Generator | 150-160 Char Optimized',
    metaDescription: 'Generate meta descriptions optimized for 150-160 characters. Includes keyword check and CTA analysis. Free.',
    keywords: ['meta description generator', 'seo description', 'meta tag generator', 'description optimizer'],
    faqs: [
      { q: 'How many descriptions are generated?', a: '5 unique variations optimized for different tones and approaches.' },
      { q: 'What is the ideal length?', a: '150-160 characters. Google typically displays up to 160 characters.' },
    ],
    relatedToolIds: ['meta-tag-generator', 'blog-title-generator', 'slug-generator'],
    publishDate: '2026-02-01', featured: false, trending: false, popular: true,
  },
  {
    id: 'slug-generator', slug: 'slug-generator', name: 'Slug Generator', shortDescription: 'Generate SEO-friendly URL slugs from any title',
    longDescription: 'Our Slug Generator converts any title into clean, SEO-friendly URL slugs. Generate multiple variations including short, no stop words, and with year. Perfect for WordPress, Shopify, and any CMS.',
    category: 'seo-tools', icon: 'Link2',
    metaTitle: 'Free SEO Slug Generator | Clean URL Slugs Online',
    metaDescription: 'Generate SEO-friendly URL slugs from any title. Multiple variations. Free and instant.',
    keywords: ['slug generator', 'url slug', 'seo slug', 'url generator', 'permalink generator'],
    faqs: [
      { q: 'What slug variations are generated?', a: 'Full slug, short slug, no-stop-words slug, and with-year slug.' },
      { q: 'Are slugs SEO-friendly?', a: 'Yes, slugs use lowercase, hyphens, and include primary keywords.' },
    ],
    relatedToolIds: ['meta-tag-generator', 'meta-description-generator', 'word-counter'],
    publishDate: '2026-02-01', featured: false, trending: false, popular: true,
  },
  {
    id: 'word-counter', slug: 'word-counter', name: 'Word Counter', shortDescription: 'Count words, characters, sentences, and analyze text',
    longDescription: 'Our Word Counter counts words, characters (with and without spaces), sentences, paragraphs, and calculates reading and speaking time. Analyze keyword density and readability. Essential for writers, students, and content creators.',
    category: 'seo-tools', icon: 'Type',
    metaTitle: 'Free Word Counter Online | Words, Characters & Reading Time',
    metaDescription: 'Count words, characters, sentences, and paragraphs. Calculate reading time and keyword density. Free tool.',
    keywords: ['word counter', 'word count tool', 'character counter', 'reading time calculator', 'text analysis'],
    faqs: [
      { q: 'What metrics are counted?', a: 'Words, characters (with/without spaces), sentences, paragraphs, reading time, and speaking time.' },
      { q: 'Does it analyze keyword density?', a: 'Yes, paste text and keywords to get density percentages.' },
    ],
    relatedToolIds: ['slug-generator', 'grammar-checker', 'content-paraphraser'],
    publishDate: '2026-01-15', featured: false, trending: false, popular: true,
  },

  // ═══════════ YOUTUBE TOOLS ═══════════
  {
    id: 'youtube-thumbnail-downloader', slug: 'youtube-thumbnail-downloader', name: 'YouTube Thumbnail Downloader', shortDescription: 'Download high-quality YouTube video thumbnails',
    longDescription: 'Our YouTube Thumbnail Downloader downloads thumbnails from any YouTube video in multiple resolutions: Max (1280x720), SD, HD, Medium, and Low. Works with regular videos and YouTube Shorts. Copy the URL and download instantly.',
    category: 'youtube-tools', icon: 'ImageDown',
    metaTitle: 'Free YouTube Thumbnail Downloader | Download Video Thumbnails',
    metaDescription: 'Download YouTube video thumbnails free. Multiple resolutions up to 1280x720. Works with Shorts. No signup.',
    keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'youtube thumbnail', 'video thumbnail'],
    faqs: [
      { q: 'What resolutions are available?', a: 'Max (1280x720), SD (640x480), HD (480x360), Medium (320x180), Low (120x90).' },
      { q: 'Does it work with YouTube Shorts?', a: 'Yes, Shorts thumbnails are accessible through the same endpoint.' },
    ],
    relatedToolIds: ['youtube-title-generator', 'youtube-tag-generator', 'thumbnail-generator'],
    publishDate: '2026-01-20', featured: true, trending: true, popular: true,
  },
  {
    id: 'youtube-title-generator', slug: 'youtube-title-generator', name: 'YouTube Title Generator', shortDescription: 'Generate catchy, SEO-optimized YouTube titles',
    longDescription: 'Our YouTube Title Generator creates 15+ catchy, SEO-optimized titles with clickbait scores. Choose from curiosity, list, how-to, emotional, and question styles. Each title is optimized for maximum click-through rate.',
    category: 'youtube-tools', icon: 'Sparkles',
    metaTitle: 'Free YouTube Title Generator | Create Catchy SEO Titles',
    metaDescription: 'Generate 15+ catchy YouTube titles with clickbait scores. Multiple styles. Free and instant.',
    keywords: ['youtube title generator', 'youtube title ideas', 'catchy youtube titles', 'video title generator'],
    faqs: [
      { q: 'How many titles are generated?', a: '15+ titles across different styles: curiosity, list, how-to, emotional, and question.' },
      { q: 'What is a clickbait score?', a: 'A 1-10 rating indicating how compelling the title is for driving clicks.' },
    ],
    relatedToolIds: ['youtube-description-generator', 'youtube-tag-generator', 'youtube-hashtag-generator'],
    publishDate: '2026-01-15', featured: true, trending: true, popular: true,
  },
  {
    id: 'youtube-description-generator', slug: 'youtube-description-generator', name: 'YouTube Description Generator', shortDescription: 'Generate SEO-optimized video descriptions with hashtags',
    longDescription: 'Our YouTube Description Generator creates 500+ word SEO-optimized descriptions with hashtags, chapters, timestamps, and call-to-actions. Each description is structured for maximum search visibility and viewer engagement.',
    category: 'youtube-tools', icon: 'FileText',
    metaTitle: 'Free YouTube Description Generator | SEO-Optimized Descriptions',
    metaDescription: 'Generate YouTube descriptions with hashtags, chapters, and CTAs. SEO-optimized. Free and instant.',
    keywords: ['youtube description generator', 'youtube description template', 'video description seo'],
    faqs: [
      { q: 'How long are generated descriptions?', a: '500+ words with structured sections, hashtags, and timestamps.' },
      { q: 'Are descriptions SEO-optimized?', a: 'Yes, keywords are naturally included and structured for search visibility.' },
    ],
    relatedToolIds: ['youtube-title-generator', 'youtube-tag-generator', 'youtube-script-writer'],
    publishDate: '2026-01-15', featured: false, trending: false, popular: true,
  },
  {
    id: 'youtube-tag-generator', slug: 'youtube-tag-generator', name: 'YouTube Tag Generator', shortDescription: 'Generate 40+ SEO-optimized tags with search volume',
    longDescription: 'Our YouTube Tag Generator generates 40+ tags with search volume and competition estimates. Tags are categorized by relevance and reach. Copy all tags as CSV for easy paste into YouTube Studio.',
    category: 'youtube-tools', icon: 'Tags',
    metaTitle: 'Free YouTube Tag Generator | SEO Tags with Search Volume',
    metaDescription: 'Generate 40+ YouTube tags with search volume estimates. Copy as CSV. Free and instant.',
    keywords: ['youtube tag generator', 'youtube tags', 'video tags seo', 'youtube keyword tool'],
    faqs: [
      { q: 'How many tags are generated?', a: '40+ tags categorized by broad, specific, and long-tail relevance.' },
      { q: 'Is search volume accurate?', a: 'Volumes are estimates based on available data and trending patterns.' },
    ],
    relatedToolIds: ['youtube-title-generator', 'youtube-description-generator', 'youtube-hashtag-generator'],
    publishDate: '2026-01-15', featured: false, trending: false, popular: true,
  },
  {
    id: 'youtube-hashtag-generator', slug: 'youtube-hashtag-generator', name: 'YouTube Hashtag Generator', shortDescription: 'Generate trending hashtags for YouTube videos',
    longDescription: 'Our YouTube Hashtag Generator creates 30+ hashtags categorized as trending, niche, broad, or branded with reach estimates. Optimize your video discoverability with the right hashtag mix.',
    category: 'youtube-tools', icon: 'Hash',
    metaTitle: 'Free YouTube Hashtag Generator | Trending Hashtags for Videos',
    metaDescription: 'Generate trending YouTube hashtags. Categorized by reach and relevance. Free and instant.',
    keywords: ['youtube hashtag generator', 'youtube hashtags', 'trending youtube hashtags', 'video hashtags'],
    faqs: [
      { q: 'How many hashtags are generated?', a: '30+ hashtags categorized as trending, niche, broad, and branded.' },
      { q: 'How many hashtags should I use?', a: 'YouTube allows up to 15 hashtags, but 3-5 relevant ones are recommended.' },
    ],
    relatedToolIds: ['youtube-title-generator', 'youtube-tag-generator', 'hashtag-generator'],
    publishDate: '2026-01-15', featured: false, trending: false, popular: false,
  },
  {
    id: 'youtube-channel-analyzer', slug: 'youtube-channel-analyzer', name: 'YouTube Channel Analyzer', shortDescription: 'Get insights on any YouTube channel performance',
    longDescription: 'Our YouTube Channel Analyzer provides insights on subscribers, views, video count, upload frequency, estimated earnings, and top videos for any YouTube channel. Great for competitor research and channel benchmarking.',
    category: 'youtube-tools', icon: 'BarChart3',
    metaTitle: 'Free YouTube Channel Analyzer | Get Channel Insights',
    metaDescription: 'Analyze any YouTube channel: subscribers, views, earnings, and top videos. Free and instant.',
    keywords: ['youtube channel analyzer', 'channel stats', 'youtube analytics tool', 'channel growth tracker'],
    faqs: [
      { q: 'What data is analyzed?', a: 'Subscribers, total views, video count, upload frequency, estimated earnings, and top performing videos.' },
      { q: 'Can I analyze any public channel?', a: 'Yes, any public YouTube channel can be analyzed.' },
    ],
    relatedToolIds: ['youtube-seo-checker', 'youtube-title-generator', 'youtube-tag-generator'],
    publishDate: '2026-02-01', featured: false, trending: false, popular: false,
  },

  // ═══════════ SOCIAL MEDIA TOOLS ═══════════
  {
    id: 'social-media-post-generator', slug: 'social-media-post-generator', name: 'Social Media Post Generator', shortDescription: 'Generate platform-specific posts with hashtags and emojis',
    longDescription: 'Our Social Media Post Generator creates platform-specific posts for Twitter, Instagram, Facebook, and LinkedIn. Each post is optimized for the platform character limits, best practices, and engagement patterns.',
    category: 'social-media-tools', icon: 'Share2',
    metaTitle: 'Free Social Media Post Generator | All Platforms',
    metaDescription: 'Generate social media posts for Twitter, Instagram, Facebook, and LinkedIn. Includes hashtags and emojis. Free.',
    keywords: ['social media post generator', 'facebook post generator', 'instagram caption generator', 'linkedin post generator'],
    faqs: [
      { q: 'Which platforms are supported?', a: 'Twitter/X, Instagram, Facebook, and LinkedIn with platform-specific optimizations.' },
      { q: 'Are posts unique each time?', a: 'Yes, each generation produces unique content based on your input.' },
    ],
    relatedToolIds: ['ai-caption-generator', 'ai-hashtag-generator', 'content-idea-generator'],
    publishDate: '2026-03-01', featured: false, trending: true, popular: true,
  },
  {
    id: 'content-idea-generator', slug: 'content-idea-generator', name: 'Content Idea Generator', shortDescription: 'Generate unlimited content ideas for any niche',
    longDescription: 'Our Content Idea Generator creates unlimited content ideas for blogs, videos, social media, and podcasts. Enter your niche and get categorized ideas with title suggestions, target keywords, and content type recommendations.',
    category: 'social-media-tools', icon: 'Lightbulb',
    metaTitle: 'Free Content Idea Generator | Unlimited Blog & Video Ideas',
    metaDescription: 'Generate unlimited content ideas for blogs, videos, and social media. Any niche. Free and instant.',
    keywords: ['content idea generator', 'blog ideas', 'video ideas', 'content ideas', 'niche content'],
    faqs: [
      { q: 'How many ideas are generated?', a: '20+ ideas per search, categorized by content type and difficulty.' },
      { q: 'Does it include keyword suggestions?', a: 'Yes, each idea includes target keywords and search intent.' },
    ],
    relatedToolIds: ['blog-title-generator', 'youtube-video-ideas', 'content-calendar'],
    publishDate: '2026-03-01', featured: false, trending: false, popular: true,
  },
  {
    id: 'hashtag-generator', slug: 'hashtag-generator', name: 'Hashtag Generator', shortDescription: 'Find trending hashtags for maximum social media reach',
    longDescription: 'Our Hashtag Generator finds the best hashtags for Instagram, TikTok, Twitter, and YouTube. Get hashtags categorized by reach level, relevance, and trending status. Maximize your content discoverability.',
    category: 'social-media-tools', icon: 'Hash',
    metaTitle: 'Free Hashtag Generator | Trending Hashtags for All Platforms',
    metaDescription: 'Find trending hashtags for Instagram, TikTok, Twitter, and YouTube. Categorized by reach. Free tool.',
    keywords: ['hashtag generator', 'trending hashtags', 'instagram hashtags', 'tiktok hashtags', 'social media hashtags'],
    faqs: [
      { q: 'Which platforms are hashtags for?', a: 'Instagram, TikTok, Twitter/X, YouTube, and LinkedIn.' },
      { q: 'How are hashtags categorized?', a: 'By reach level: high (1M+), medium (100K-1M), niche (10K-100K), and micro (under 10K).' },
    ],
    relatedToolIds: ['ai-hashtag-generator', 'youtube-hashtag-generator', 'social-media-post-generator'],
    publishDate: '2026-01-20', featured: false, trending: true, popular: true,
  },
];

/* ─── Helper Functions ─────────────────────────── */

export function getToolById(id: string): ToolEntry | undefined {
  return TOOLS_DATABASE.find(t => t.id === id);
}

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return TOOLS_DATABASE.find(t => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolEntry[] {
  return TOOLS_DATABASE.filter(t => t.category === category);
}

export function getFeaturedTools(): ToolEntry[] {
  return TOOLS_DATABASE.filter(t => t.featured);
}

export function getTrendingTools(): ToolEntry[] {
  return TOOLS_DATABASE.filter(t => t.trending);
}

export function getPopularTools(): ToolEntry[] {
  return TOOLS_DATABASE.filter(t => t.popular);
}

export function getNewTools(): ToolEntry[] {
  return TOOLS_DATABASE.filter(t => t.isNew);
}

export function getCategoryById(id: ToolCategory): CategoryEntry | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function searchTools(query: string): ToolEntry[] {
  const q = query.toLowerCase();
  return TOOLS_DATABASE.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.shortDescription.toLowerCase().includes(q) ||
    t.keywords.some(k => k.toLowerCase().includes(q))
  );
}

export function getAllToolIds(): string[] {
  return TOOLS_DATABASE.map(t => t.id);
}
