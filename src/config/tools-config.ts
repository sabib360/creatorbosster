/**
 * Tool Configuration Database
 * Single source of truth for all tool configurations
 * Each tool entry contains complete metadata for rendering, SEO, and discovery
 */

import { type ReactNode } from 'react';

/* ─── Types ────────────────────────────────────── */

export interface ToolFAQ {
  q: string;
  a: string;
}

export interface ToolHowToStep {
  title: string;
  description: string;
}

export interface ToolFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ToolBenefit {
  title: string;
  description: string;
}

export interface ToolConfig {
  id: string;
  slug: string;
  toolName: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  faq: ToolFAQ[];
  relatedTools: string[];
  popular: boolean;
  trending: boolean;
  featured: boolean;
  // Extended fields for tool page
  whoIsItFor?: string;
  useCases?: string[];
  howToSteps?: ToolHowToStep[];
  features?: ToolFeature[];
  benefits?: ToolBenefit[];
  apiRequired?: string;
  estimatedSearchVolume?: number;
  estimatedCPC?: number;
}

/* ─── Tool Config Database ─────────────────────── */

export const TOOLS_DATABASE: Record<string, ToolConfig> = {
  // ═══════════════════════════════════════════════
  // 1. AI Image Generator
  // ═══════════════════════════════════════════════
  'ai-image-generator': {
    id: 'ai-image-generator',
    slug: 'ai-image-generator',
    toolName: 'AI Image Generator',
    category: 'ai',
    shortDescription: 'Generate stunning images from text prompts using AI',
    longDescription: 'Our AI Image Generator transforms your text descriptions into high-quality images in seconds. Powered by advanced AI models, it creates unique, royalty-free visuals for social media, presentations, websites, and creative projects. Simply describe what you want, select a style, and watch the AI bring your vision to life.',
    icon: 'ImageIcon',
    featuredImage: '/og/ai-image-generator.png',
    metaTitle: 'Free AI Image Generator - Create Stunning Images from Text | CreatorBoost AI',
    metaDescription: 'Generate beautiful AI images from text descriptions instantly. Free online AI image generator with multiple styles. No signup required. Create unique visuals for social media, presentations, and more.',
    keywords: ['ai image generator', 'text to image', 'ai art generator', 'free ai images', 'ai image maker', 'generate images with ai', 'ai picture generator'],
    faq: [
      { q: 'What is an AI Image Generator?', a: 'An AI Image Generator is a tool that uses artificial intelligence to create images from text descriptions. You type a prompt describing what you want, and the AI generates a unique image based on your description.' },
      { q: 'Is the AI Image Generator free to use?', a: 'Yes! Our AI Image Generator is completely free. You can generate images without any subscription or payment. Some advanced features may require a free account.' },
      { q: 'Can I use the generated images commercially?', a: 'Yes, you own the rights to images created with our tool. You can use them for personal projects, social media, marketing materials, and commercial purposes.' },
      { q: 'What image styles are available?', a: 'We offer multiple styles including photorealistic, digital art, watercolor, oil painting, anime, pixel art, 3D render, and more. Each style produces unique results.' },
      { q: 'How many images can I generate?', a: 'There are no strict limits on image generation. You can create as many images as you need. For optimal performance, we recommend generating one image at a time.' },
      { q: 'What resolution are the generated images?', a: 'Generated images are available in high resolution suitable for web use, social media, and print. You can download in various sizes depending on your needs.' },
      { q: 'Does the AI generate original images?', a: 'Yes, every image generated is unique and original. The AI creates new visuals based on your description rather than copying existing images.' },
      { q: 'Can I refine or modify generated images?', a: 'Yes! You can adjust your prompt, change the style, or use the regeneration feature to get different variations of your idea until you find the perfect image.' },
    ],
    relatedTools: ['ai-text-to-image', 'ai-thumbnail-generator', 'ai-bg-remover', 'image-compressor', 'favicon-generator', 'image-resizer'],
    popular: true,
    trending: true,
    featured: true,
    whoIsItFor: 'Content creators, social media managers, bloggers, designers, marketers, and anyone who needs quick visual content without design skills.',
    useCases: [
      'Create unique social media posts and stories',
      'Generate blog post featured images',
      'Design presentation visuals',
      'Create product mockups and concepts',
      'Generate artwork for personal projects',
      'Produce marketing materials and ad creatives',
    ],
    howToSteps: [
      { title: 'Enter Your Description', description: 'Type a detailed description of the image you want to create. Be specific about the subject, style, colors, and mood.' },
      { title: 'Select a Style', description: 'Choose from various artistic styles like photorealistic, digital art, watercolor, or anime to match your vision.' },
      { title: 'Generate the Image', description: 'Click the generate button and wait a few seconds while the AI creates your unique image.' },
      { title: 'Download or Regenerate', description: 'Download your favorite result or regenerate with the same prompt to get different variations.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Generation', description: 'Create images in seconds with our optimized AI pipeline' },
      { icon: 'shield', title: 'Original Content', description: 'Every image is unique and royalty-free for commercial use' },
      { icon: 'smartphone', title: 'Mobile Friendly', description: 'Generate images on any device with our responsive interface' },
      { icon: 'brain', title: 'Multiple Styles', description: 'Choose from 10+ artistic styles to match your vision' },
      { icon: 'award', title: 'High Quality', description: 'Get high-resolution images suitable for web and print' },
      { icon: 'eye', title: 'No Signup Required', description: 'Start generating images immediately without registration' },
    ],
    benefits: [
      { title: 'Save Time and Money', description: 'Create professional visuals in seconds without hiring designers or purchasing stock photos.' },
      { title: 'Unlimited Creativity', description: 'Describe any concept and the AI will bring it to life, even ideas that would be impossible to photograph.' },
      { title: 'Commercial Use Rights', description: 'Use generated images freely in your business, marketing, and commercial projects.' },
      { title: 'Consistent Branding', description: 'Generate images in your brand style consistently across all your content.' },
    ],
    apiRequired: 'gemini',
    estimatedSearchVolume: 125000,
    estimatedCPC: 1.8,
  },

  // ═══════════════════════════════════════════════
  // 2. Background Remover
  // ═══════════════════════════════════════════════
  'background-remover': {
    id: 'background-remover',
    slug: 'background-remover',
    toolName: 'AI Background Remover',
    category: 'image',
    shortDescription: 'Remove image backgrounds instantly with AI precision',
    longDescription: 'Our AI Background Remover automatically detects and removes backgrounds from images with pixel-perfect accuracy. Perfect for product photos, portraits, and e-commerce listings. Get transparent PNG files ready for design projects, presentations, and professional use.',
    icon: 'Scissors',
    featuredImage: '/og/background-remover.png',
    metaTitle: 'Free AI Background Remover - Remove Image Backgrounds Instantly | CreatorBoost AI',
    metaDescription: 'Remove backgrounds from images instantly with AI precision. Free online background remover for product photos, portraits, and e-commerce. Get transparent PNG files.',
    keywords: ['background remover', 'remove background', 'bg remover', 'transparent background', 'ai background remover', 'remove image background free', 'background eraser'],
    faq: [
      { q: 'How does the AI Background Remover work?', a: 'Our AI uses advanced machine learning to automatically detect the subject in your image and separate it from the background, creating a clean transparent result.' },
      { q: 'What image formats are supported?', a: 'We support JPG, PNG, WebP, and BMP input files. The output is always a transparent PNG file for maximum compatibility.' },
      { q: 'Is my uploaded image stored on your servers?', a: 'No. Your images are processed in real-time and immediately deleted after processing. We never store or share your uploaded files.' },
      { q: 'Can I remove backgrounds from multiple images?', a: 'Yes! You can process as many images as you need. There are no limits on the number of images you can process.' },
      { q: 'How accurate is the background removal?', a: 'Our AI achieves 95%+ accuracy on most images. Complex edges like hair and fur are handled with advanced edge detection algorithms.' },
      { q: 'Can I use this for product photography?', a: 'Absolutely! Our tool is perfect for e-commerce product photos. Get clean, professional images with transparent backgrounds ready for your online store.' },
      { q: 'Is there a file size limit?', a: 'We recommend images under 10MB for optimal processing speed. Larger files may take slightly longer but will still process successfully.' },
      { q: 'Can I customize the result after removal?', a: 'Yes, you can download the transparent PNG and further edit it in any image editor. We also offer options to add new backgrounds.' },
    ],
    relatedTools: ['ai-bg-remover', 'image-compressor', 'image-resizer', 'image-cropper', 'passport-size', 'image-converter'],
    popular: true,
    trending: false,
    featured: true,
    whoIsItFor: 'E-commerce sellers, product photographers, graphic designers, social media creators, and anyone needing professional background removal.',
    useCases: [
      'Create clean product photos for e-commerce',
      'Make professional headshots and portraits',
      'Design marketing materials with transparent elements',
      'Create social media content with custom backgrounds',
      'Prepare images for presentations and documents',
      'Build professional photo composites',
    ],
    howToSteps: [
      { title: 'Upload Your Image', description: 'Click the upload button or drag and drop your image. We support JPG, PNG, WebP, and BMP formats.' },
      { title: 'AI Processes the Image', description: 'Our AI automatically detects the subject and removes the background in seconds.' },
      { title: 'Preview the Result', description: 'Check the transparent preview to ensure the background removal meets your expectations.' },
      { title: 'Download Transparent PNG', description: 'Download your image with a transparent background, ready for any design project.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Processing', description: 'Remove backgrounds in seconds with our optimized AI' },
      { icon: 'shield', title: 'Privacy First', description: 'Images are processed and deleted immediately - never stored' },
      { icon: 'smartphone', title: 'Works Everywhere', description: 'Process images on desktop, tablet, or mobile' },
      { icon: 'brain', title: 'AI Precision', description: '95%+ accuracy with advanced edge detection' },
      { icon: 'award', title: 'Free & Unlimited', description: 'Process as many images as you need at no cost' },
      { icon: 'eye', title: 'Clean Results', description: 'Get professional-quality transparent PNG files' },
    ],
    benefits: [
      { title: 'Professional Product Photos', description: 'Create e-commerce ready product images with clean backgrounds.' },
      { title: 'No Design Skills Needed', description: 'Get professional results without Photoshop or design expertise.' },
      { title: 'Save Hours of Editing', description: 'What takes minutes in Photoshop takes seconds with our AI.' },
      { title: 'Consistent Quality', description: 'Every image gets the same high-quality treatment.' },
    ],
    estimatedSearchVolume: 245000,
    estimatedCPC: 1.2,
  },

  // ═══════════════════════════════════════════════
  // 3. YouTube Thumbnail Downloader
  // ═══════════════════════════════════════════════
  'youtube-thumbnail-downloader': {
    id: 'youtube-thumbnail-downloader',
    slug: 'youtube-thumbnail-downloader',
    toolName: 'YouTube Thumbnail Downloader',
    category: 'social',
    shortDescription: 'Download high-quality YouTube video thumbnails in any resolution',
    longDescription: 'Download high-quality thumbnails from any YouTube video in multiple resolutions. Our YouTube Thumbnail Downloader extracts thumbnail images directly from YouTube servers, providing you with original quality images up to 1280x720. Perfect for inspiration, research, and reference.',
    icon: 'Download',
    featuredImage: '/og/youtube-thumbnail-downloader.png',
    metaTitle: 'YouTube Thumbnail Downloader - Download Video Thumbnails Free | CreatorBoost AI',
    metaDescription: 'Download YouTube video thumbnails in HD quality for free. Supports all YouTube videos and Shorts. Multiple resolutions from 120x90 to 1280x720.',
    keywords: ['youtube thumbnail downloader', 'download youtube thumbnail', 'youtube thumbnail', 'youtube video thumbnail', 'thumbnail grabber', 'get youtube thumbnail'],
    faq: [
      { q: 'What resolution can I download?', a: 'You can download thumbnails in 5 resolutions: Max (1280x720), SD (640x480), HD (480x360), Medium (320x180), and Low (120x90).' },
      { q: 'Does this work with YouTube Shorts?', a: 'Yes. YouTube Shorts thumbnails are accessible through the same img.youtube.com endpoint and can be downloaded in all resolutions.' },
      { q: 'Can I use these thumbnails in my own videos?', a: 'You may use them for reference, inspiration, or fair-use purposes. Always respect copyright and give credit when appropriate.' },
      { q: 'What if the thumbnail is not available?', a: 'Some older videos may not have a max-resolution thumbnail. Try a lower resolution option or check if the video is still available.' },
      { q: 'Is there a limit on how many thumbnails I can download?', a: 'No, there are no limits. You can download as many thumbnails as you need.' },
      { q: 'What formats are the thumbnails in?', a: 'YouTube thumbnails are served as JPG images. You can convert them to other formats using our image converter tool.' },
      { q: 'Can I download private video thumbnails?', a: 'No, we can only access thumbnails from public videos. Private or unlisted videos require you to be signed in to YouTube.' },
      { q: 'Why would I need to download thumbnails?', a: 'Common uses include competitor research, thumbnail inspiration, creating reaction videos, educational content, and design reference.' },
    ],
    relatedTools: ['youtube-downloader', 'youtube-title-generator', 'youtube-tag-generator', 'youtube-script-writer', 'youtube-hashtag-generator', 'youtube-video-ideas'],
    popular: true,
    trending: true,
    featured: true,
    whoIsItFor: 'Content creators, video marketers, thumbnail designers, researchers, and anyone analyzing YouTube content.',
    useCases: [
      'Research competitor thumbnails for inspiration',
      'Save thumbnail designs for reference',
      'Create thumbnail templates based on trending styles',
      'Analyze YouTube thumbnail trends',
      'Download thumbnails for educational content',
      'Archive video thumbnails before deletion',
    ],
    howToSteps: [
      { title: 'Paste YouTube URL', description: 'Copy the YouTube video URL and paste it into the input field.' },
      { title: 'Select Resolution', description: 'Choose from multiple resolutions including Max, HD, SD, Medium, and Low.' },
      { title: 'Preview Thumbnail', description: 'Preview the thumbnail before downloading to ensure it meets your needs.' },
      { title: 'Download Image', description: 'Click the download button to save the thumbnail to your device.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Download', description: 'Get thumbnails in seconds - no waiting required' },
      { icon: 'shield', title: 'Safe & Secure', description: 'No login required, no data stored' },
      { icon: 'smartphone', title: 'Mobile Friendly', description: 'Download thumbnails on any device' },
      { icon: 'brain', title: 'Multiple Resolutions', description: 'Choose from 5 different quality levels' },
      { icon: 'award', title: 'HD Quality', description: 'Get original quality thumbnails up to 1280x720' },
      { icon: 'eye', title: 'Works with Shorts', description: 'Supports both regular videos and YouTube Shorts' },
    ],
    benefits: [
      { title: 'Competitive Research', description: 'Study what works for successful YouTubers in your niche.' },
      { title: 'Design Inspiration', description: 'Build a collection of effective thumbnail designs for reference.' },
      { title: 'Content Creation', description: 'Use thumbnails for reaction videos, compilations, and educational content.' },
      { title: 'Archive & Reference', description: 'Save thumbnails before videos are deleted or modified.' },
    ],
    estimatedSearchVolume: 35000,
    estimatedCPC: 0.6,
  },

  // ═══════════════════════════════════════════════
  // 4. AI Caption Generator
  // ═══════════════════════════════════════════════
  'ai-caption-generator': {
    id: 'ai-caption-generator',
    slug: 'ai-caption-generator',
    toolName: 'AI Caption Generator',
    category: 'social',
    shortDescription: 'Generate engaging captions for social media posts with AI',
    longDescription: 'Our AI Caption Generator creates compelling, engaging captions for your social media posts across Instagram, Facebook, Twitter, and LinkedIn. Simply describe your post or upload an image, and the AI generates multiple caption options with relevant hashtags, emojis, and calls-to-action.',
    icon: 'MessageSquare',
    featuredImage: '/og/ai-caption-generator.png',
    metaTitle: 'Free AI Caption Generator - Create Social Media Captions | CreatorBoost AI',
    metaDescription: 'Generate engaging social media captions with AI. Create Instagram, Facebook, Twitter, and LinkedIn captions with hashtags and emojis. Free and instant.',
    keywords: ['caption generator', 'ai caption generator', 'instagram caption generator', 'social media captions', 'caption maker', 'photo caption generator', 'caption ideas'],
    faq: [
      { q: 'What platforms are supported?', a: 'We generate captions optimized for Instagram, Facebook, Twitter/X, LinkedIn, and TikTok. Each platform gets captions tailored to its audience and format.' },
      { q: 'Can I customize the tone of captions?', a: 'Yes! Choose from professional, casual, humorous, inspiring, and more tones to match your brand voice.' },
      { q: 'Are hashtags included?', a: 'Yes, the AI automatically generates relevant hashtags for each caption. You can also specify custom hashtags to include.' },
      { q: 'Is the generated content original?', a: 'Yes, every caption is unique and generated specifically for your content. We never duplicate or copy existing captions.' },
      { q: 'How many caption variations can I get?', a: 'You can generate multiple variations for each request, typically 5-10 different options to choose from.' },
      { q: 'Can I add emojis to captions?', a: 'Yes! Our AI includes contextually appropriate emojis. You can also request captions with or without emojis.' },
      { q: 'Is this tool free to use?', a: 'Yes, our AI Caption Generator is completely free with no usage limits. Generate as many captions as you need.' },
      { q: 'Can I use these captions for business accounts?', a: 'Absolutely! The captions are generated for both personal and business use. They are original content you can use freely.' },
    ],
    relatedTools: ['bangla-caption-generator', 'hashtag-generator', 'content-idea-generator', 'social-post-generator', 'youtube-title-generator', 'email-subject-generator'],
    popular: true,
    trending: true,
    featured: true,
    whoIsItFor: 'Social media managers, influencers, small business owners, content creators, and anyone looking to boost engagement on social media.',
    useCases: [
      'Create Instagram post captions that drive engagement',
      'Generate Facebook post captions for business pages',
      'Write professional LinkedIn article captions',
      'Craft witty Twitter/X tweet captions',
      'Create TikTok video descriptions with hashtags',
      'Develop consistent brand voice across platforms',
    ],
    howToSteps: [
      { title: 'Describe Your Post', description: 'Enter a brief description of your content, topic, or theme.' },
      { title: 'Select Platform', description: 'Choose the social media platform (Instagram, Facebook, Twitter, LinkedIn).' },
      { title: 'Choose Tone', description: 'Pick the tone that matches your brand - professional, casual, funny, inspiring.' },
      { title: 'Copy & Post', description: 'Copy your favorite caption and paste it directly into your social media post.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Generation', description: 'Get multiple caption options in seconds' },
      { icon: 'shield', title: 'Original Content', description: 'Every caption is unique and plagiarism-free' },
      { icon: 'smartphone', title: 'Multi-Platform', description: 'Optimized captions for all major social platforms' },
      { icon: 'brain', title: 'Smart Hashtags', description: 'Auto-generated relevant hashtags for maximum reach' },
      { icon: 'award', title: 'Emoji Support', description: 'Contextual emojis added for engagement boost' },
      { icon: 'eye', title: 'Tone Control', description: 'Match your brand voice with customizable tones' },
    ],
    benefits: [
      { title: 'Save Hours Weekly', description: 'Stop staring at blank screens - generate captions in seconds.' },
      { title: 'Boost Engagement', description: 'AI-optimized captions with proven engagement tactics.' },
      { title: 'Consistent Brand Voice', description: 'Maintain your unique style across all platforms.' },
      { title: 'Never Run Out of Ideas', description: 'Get fresh caption ideas for any topic or occasion.' },
    ],
    apiRequired: 'gemini',
    estimatedSearchVolume: 68000,
    estimatedCPC: 0.9,
  },

  // ═══════════════════════════════════════════════
  // 5. Bangla Caption Generator
  // ═══════════════════════════════════════════════
  'bangla-caption-generator': {
    id: 'bangla-caption-generator',
    slug: 'bangla-caption-generator',
    toolName: 'Bangla Caption Generator',
    category: 'social',
    shortDescription: 'Generate creative Bangla captions for Facebook, Instagram & more',
    longDescription: 'Our Bangla Caption Generator creates beautiful, engaging captions in Bengali for all social media platforms. Perfect for Facebook posts, Instagram stories, and TikTok videos. Get captions with Bangla quotes, poetry lines, emojis, and trending hashtags that resonate with Bangladeshi and Bengali audiences.',
    icon: 'Languages',
    featuredImage: '/og/bangla-caption-generator.png',
    metaTitle: 'Free Bangla Caption Generator - বাংলা ক্যাপশন জেনারেটর | CreatorBoost AI',
    metaDescription: 'Generate creative Bangla captions for Facebook, Instagram, and TikTok. Free বাংলা ক্যাপশন generator with quotes, emojis, and hashtags.',
    keywords: ['bangla caption', 'bangla caption generator', 'বাংলা ক্যাপশন', 'bangla facebook caption', 'bangla instagram caption', 'bengali caption', 'bangla status'],
    faq: [
      { q: 'What is a Bangla Caption Generator?', a: 'A Bangla Caption Generator creates captions in Bengali language for social media posts. It generates creative text with Bangla quotes, poetry, and emojis.' },
      { q: 'Can I generate captions for Facebook in Bangla?', a: 'Yes! Our generator creates perfect Bangla captions for Facebook posts, stories, and status updates.' },
      { q: 'Are the captions original?', a: 'Yes, every caption is uniquely generated. We create original content rather than copying existing captions.' },
      { q: 'Does it include Bangla hashtags?', a: 'Yes, the AI generates relevant Bangla and English hashtags along with the captions for maximum reach.' },
      { q: 'Can I choose different caption styles?', a: 'Yes! Choose from romantic, funny, motivational, sad, friendship, and many other styles.' },
      { q: 'Is this tool free?', a: 'Yes, our Bangla Caption Generator is completely free with no usage limits.' },
      { q: 'Can I use these for Instagram?', a: 'Absolutely! The captions work perfectly for Instagram posts, stories, and reels.' },
      { q: 'Does it support Bangla quotes?', a: 'Yes, our generator can include famous Bangla quotes and poetry lines in the captions.' },
    ],
    relatedTools: ['ai-caption-generator', 'hashtag-generator', 'social-media-caption-writer', 'emoji-picker', 'social-post-generator', 'content-idea-generator'],
    popular: true,
    trending: true,
    featured: false,
    whoIsItFor: 'Bangladeshi and Bengali content creators, Facebook page admins, Instagram influencers, and anyone posting in Bangla language.',
    useCases: [
      'Create engaging Facebook posts in Bangla',
      'Generate Instagram captions for Bangla audience',
      'Write TikTok video descriptions in Bengali',
      'Add Bangla poetry and quotes to social posts',
      'Create romantic and friendship captions',
      'Generate motivational Bangla content',
    ],
    howToSteps: [
      { title: 'Select Caption Style', description: 'Choose the style that fits your mood - romantic, funny, motivational, sad, or friendship.' },
      { title: 'Enter Topic or Keywords', description: 'Describe the topic or mood of your post for better caption generation.' },
      { title: 'Generate Captions', description: 'Click generate to get multiple Bangla caption options with emojis and hashtags.' },
      { title: 'Copy & Post', description: 'Copy your favorite caption and paste it directly into your social media post.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Bangla Captions', description: 'Generate beautiful Bengali captions in seconds' },
      { icon: 'shield', title: 'Original Content', description: 'Every caption is unique and original' },
      { icon: 'smartphone', title: 'Multi-Platform', description: 'Optimized for Facebook, Instagram, and TikTok' },
      { icon: 'brain', title: 'Style Options', description: 'Choose from 10+ caption styles and moods' },
      { icon: 'award', title: 'Bangla Quotes', description: 'Includes famous Bangla poetry and quotes' },
      { icon: 'eye', title: 'Emoji Support', description: 'Contextual emojis for emotional impact' },
    ],
    benefits: [
      { title: 'Connect with Bangla Audience', description: 'Speak the language of your audience with authentic Bengali captions.' },
      { title: 'Save Creative Time', description: 'No more struggling to find the perfect words.' },
      { title: 'Cultural Relevance', description: 'Captions that understand Bangla culture and trending topics.' },
      { title: 'Boost Engagement', description: 'Bangla captions often get higher engagement from Bengali audiences.' },
    ],
    apiRequired: 'gemini',
    estimatedSearchVolume: 22000,
    estimatedCPC: 0.4,
  },

  // ═══════════════════════════════════════════════
  // 6. QR Code Generator
  // ═══════════════════════════════════════════════
  'qr-code-generator': {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    toolName: 'QR Code Generator',
    category: 'social',
    shortDescription: 'Create custom QR codes for links, text, contacts, and WiFi',
    longDescription: 'Our QR Code Generator creates custom, high-quality QR codes for any purpose. Generate QR codes for URLs, plain text, email addresses, phone numbers, WiFi credentials, and vCard contacts. Customize colors, add logos, and download in PNG or SVG format.',
    icon: 'QrCode',
    featuredImage: '/og/qr-code-generator.png',
    metaTitle: 'Free QR Code Generator - Create Custom QR Codes Online | CreatorBoost AI',
    metaDescription: 'Free QR code generator. Create custom QR codes for URLs, text, WiFi, email, and contacts. Download as PNG or SVG. No signup required.',
    keywords: ['qr code generator', 'create qr code', 'qr code maker', 'free qr code', 'qr code online', 'generate qr code', 'qr code image'],
    faq: [
      { q: 'Can I customize the QR code colors?', a: 'Yes. You can set custom foreground and background colors using presets or the color picker.' },
      { q: 'Which QR code types are supported?', a: 'URLs, plain text, email, phone numbers, WiFi credentials, and vCard contact cards.' },
      { q: 'What format can I download?', a: 'You can download as PNG (raster) or SVG (vector). SVG is recommended for print quality.' },
      { q: 'What does error correction level mean?', a: 'Higher levels add more redundancy, making the QR code readable even if partially damaged or covered. High (30%) is best when adding a logo.' },
      { q: 'Are my QR codes stored on your servers?', a: 'No. All QR codes are generated locally in your browser. We never store or track your QR codes.' },
      { q: 'Can I add a logo to the QR code?', a: 'Yes! With high error correction, you can add a small logo to the center of the QR code while keeping it scannable.' },
      { q: 'Is there a limit to how many QR codes I can create?', a: 'No, there are no limits. Create as many QR codes as you need.' },
      { q: 'Will the QR code expire?', a: 'Static QR codes never expire. They will continue to work indefinitely.' },
    ],
    relatedTools: ['link-shortener', 'youtube-thumbnail-downloader', 'meta-tag-generator', 'bio-link-page-builder', 'email-subject-generator', 'social-post-generator'],
    popular: true,
    trending: false,
    featured: true,
    whoIsItFor: 'Business owners, event organizers, marketers, restaurant owners, and anyone needing QR codes for information sharing.',
    useCases: [
      'Create QR codes for restaurant menus',
      'Generate WiFi QR codes for events and offices',
      'Make vCard QR codes for networking',
      'Add QR codes to marketing materials',
      'Create QR codes for event tickets',
      'Generate QR codes for product packaging',
    ],
    howToSteps: [
      { title: 'Choose QR Code Type', description: 'Select from URL, text, email, phone, WiFi, or vCard type.' },
      { title: 'Enter Content', description: 'Fill in the required information for your chosen type.' },
      { title: 'Customize Design', description: 'Adjust colors, add a logo, and set error correction level.' },
      { title: 'Download QR Code', description: 'Download as PNG for digital use or SVG for print quality.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Generation', description: 'Create QR codes in milliseconds' },
      { icon: 'shield', title: '100% Private', description: 'Generated locally, never stored on servers' },
      { icon: 'smartphone', title: 'Mobile Scanning', description: 'QR codes work with all phone cameras' },
      { icon: 'brain', title: 'Multiple Types', description: 'Support for 6 different QR code types' },
      { icon: 'award', title: 'Custom Design', description: 'Customize colors, logos, and error correction' },
      { icon: 'eye', title: 'Print Ready', description: 'SVG output for perfect print quality' },
    ],
    benefits: [
      { title: 'Professional Quality', description: 'Generate crisp, high-resolution QR codes for any use.' },
      { title: 'Brand Customization', description: 'Match your brand colors and add your logo.' },
      { title: 'Versatile Use Cases', description: 'From business cards to restaurant menus.' },
      { title: 'No Expiration', description: 'Static QR codes work forever.' },
    ],
    estimatedSearchVolume: 62000,
    estimatedCPC: 1.4,
  },

  // ═══════════════════════════════════════════════
  // 7. AI Hashtag Generator
  // ═══════════════════════════════════════════════
  'ai-hashtag-generator': {
    id: 'ai-hashtag-generator',
    slug: 'ai-hashtag-generator',
    toolName: 'AI Hashtag Generator',
    category: 'social',
    shortDescription: 'Generate trending hashtags for Instagram, TikTok & social media',
    longDescription: 'Our AI Hashtag Generator finds the perfect hashtags for your social media posts. Simply describe your content or enter a keyword, and get curated lists of trending, niche, and broad hashtags optimized for Instagram, TikTok, Twitter, and LinkedIn. Boost your reach and engagement with data-driven hashtag strategies.',
    icon: 'Hash',
    featuredImage: '/og/ai-hashtag-generator.png',
    metaTitle: 'Free AI Hashtag Generator - Trending Hashtags for Instagram & TikTok | CreatorBoost AI',
    metaDescription: 'Generate trending hashtags for Instagram, TikTok, Twitter, and LinkedIn. Free AI hashtag generator with reach estimates and copy-all feature.',
    keywords: ['hashtag generator', 'ai hashtag generator', 'instagram hashtags', 'tiktok hashtags', 'trending hashtags', 'hashtag ideas', 'social media hashtags'],
    faq: [
      { q: 'How does the AI Hashtag Generator work?', a: 'Our AI analyzes your keyword or description and generates relevant hashtags based on current trends, popularity, and niche relevance.' },
      { q: 'Which platforms are supported?', a: 'We generate hashtags optimized for Instagram, TikTok, Twitter/X, LinkedIn, and YouTube.' },
      { q: 'How many hashtags do I get?', a: 'You typically get 30-50 hashtag suggestions, organized by category (trending, niche, broad).' },
      { q: 'Are these hashtags actually trending?', a: 'Our AI considers current trends and popularity data to suggest hashtags that are actively being used and searched.' },
      { q: 'Can I copy all hashtags at once?', a: 'Yes! One-click copy feature lets you copy all hashtags instantly for easy pasting into your post.' },
      { q: 'Is the tool free?', a: 'Yes, our AI Hashtag Generator is completely free with no usage limits.' },
      { q: 'Should I use all the suggested hashtags?', a: 'For Instagram, we recommend using 20-30 hashtags. For TikTok, 3-5 relevant hashtags work best.' },
      { q: 'Can I save my favorite hashtag sets?', a: 'Yes, with a free account you can save hashtag sets for quick access and reuse.' },
    ],
    relatedTools: ['youtube-hashtag-generator', 'ai-caption-generator', 'bangla-caption-generator', 'content-idea-generator', 'social-media-caption-writer', 'trend-analyzer'],
    popular: true,
    trending: true,
    featured: true,
    whoIsItFor: 'Instagram influencers, TikTok creators, social media managers, small businesses, and anyone wanting to grow their social media presence.',
    useCases: [
      'Find trending hashtags for Instagram posts',
      'Get TikTok hashtags for viral reach',
      'Discover niche hashtags for targeted audience',
      'Research competitor hashtag strategies',
      'Create hashtag collections for different content types',
      'Optimize hashtag usage for maximum engagement',
    ],
    howToSteps: [
      { title: 'Enter Your Topic', description: 'Type your post topic, keyword, or content description.' },
      { title: 'Select Platform', description: 'Choose the social media platform for platform-specific hashtag suggestions.' },
      { title: 'Browse Categories', description: 'View hashtags organized by trending, niche, broad, and branded categories.' },
      { title: 'Copy & Use', description: 'Click to copy individual hashtags or use the copy-all button for instant pasting.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Results', description: 'Get hashtags in milliseconds with AI analysis' },
      { icon: 'shield', title: 'Data-Driven', description: 'Hashtags based on current trends and popularity' },
      { icon: 'smartphone', title: 'Multi-Platform', description: 'Optimized for all major social platforms' },
      { icon: 'brain', title: 'Smart Categories', description: 'Organized by trending, niche, and broad' },
      { icon: 'award', title: 'Copy All', description: 'One-click copy for easy use' },
      { icon: 'eye', title: 'Reach Estimates', description: 'See potential reach for each hashtag' },
    ],
    benefits: [
      { title: 'Boost Visibility', description: 'Get your content seen by more people with the right hashtags.' },
      { title: 'Save Research Time', description: 'No more manually searching for trending hashtags.' },
      { title: 'Grow Faster', description: 'Strategic hashtag usage accelerates follower growth.' },
      { title: 'Stay Current', description: 'Always get the latest trending hashtags.' },
    ],
    apiRequired: 'gemini',
    estimatedSearchVolume: 55000,
    estimatedCPC: 0.8,
  },

  // ═══════════════════════════════════════════════
  // 8. YouTube Script Generator
  // ═══════════════════════════════════════════════
  'youtube-script-generator': {
    id: 'youtube-script-generator',
    slug: 'youtube-script-generator',
    toolName: 'AI YouTube Script Generator',
    category: 'social',
    shortDescription: 'Generate complete YouTube video scripts with AI',
    longDescription: 'Our AI YouTube Script Generator creates complete, engaging video scripts with hooks, introductions, main content sections, CTAs, and outros. Choose from educational, entertaining, tutorial, or review styles. Get scripts optimized for viewer retention and engagement.',
    icon: 'FileText',
    featuredImage: '/og/youtube-script-generator.png',
    metaTitle: 'Free AI YouTube Script Generator - Write Video Scripts Instantly | CreatorBoost AI',
    metaDescription: 'Generate complete YouTube video scripts with AI. Includes hooks, intro, sections, CTA, and outro. Multiple styles and durations. Free and instant.',
    keywords: ['youtube script generator', 'video script generator', 'youtube script writer', 'video script template', 'youtube content script', 'ai video script'],
    faq: [
      { q: 'What types of scripts can I generate?', a: 'We support educational, entertainment, tutorial, review, vlog, and storytelling script styles.' },
      { q: 'How long are the generated scripts?', a: 'Scripts can be generated for 5-minute, 10-minute, 15-minute, and 20-minute videos.' },
      { q: 'Do scripts include timestamps?', a: 'Yes, scripts include suggested timestamps for each section to help with video editing.' },
      { q: 'Can I customize the script length?', a: 'Yes, you can specify the desired video length and the script will be tailored accordingly.' },
      { q: 'Are the scripts original?', a: 'Yes, every script is uniquely generated based on your topic and style preferences.' },
      { q: 'Do scripts include hook ideas?', a: 'Yes, each script starts with 3-5 compelling hook options to maximize viewer retention.' },
      { q: 'Can I export scripts?', a: 'Yes, you can copy scripts to clipboard or download as a text file.' },
      { q: 'Is this tool free?', a: 'Yes, our YouTube Script Generator is completely free with no usage limits.' },
    ],
    relatedTools: ['youtube-title-generator', 'youtube-description-generator', 'youtube-tag-generator', 'youtube-video-ideas', 'youtube-script-writer', 'youtube-thumbnail-downloader'],
    popular: true,
    trending: true,
    featured: true,
    whoIsItFor: 'YouTubers, content creators, video marketers, educators, and anyone creating video content.',
    useCases: [
      'Create educational video scripts',
      'Write product review scripts',
      'Generate tutorial video outlines',
      'Develop storytelling video scripts',
      'Plan vlog content structure',
      'Create engaging video introductions',
    ],
    howToSteps: [
      { title: 'Enter Video Topic', description: 'Describe your video topic and main points you want to cover.' },
      { title: 'Choose Script Style', description: 'Select from educational, entertainment, tutorial, review, or storytelling style.' },
      { title: 'Set Video Length', description: 'Choose the desired video duration (5, 10, 15, or 20 minutes).' },
      { title: 'Generate & Edit', description: 'Get your complete script and edit it to match your personal style.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Scripts', description: 'Generate complete scripts in seconds' },
      { icon: 'shield', title: 'Original Content', description: 'Every script is unique and plagiarism-free' },
      { icon: 'smartphone', title: 'Multiple Styles', description: 'Educational, entertainment, tutorial, and more' },
      { icon: 'brain', title: 'Retention Optimized', description: 'Scripts designed for maximum viewer retention' },
      { icon: 'award', title: 'Complete Structure', description: 'Includes hook, intro, sections, CTA, and outro' },
      { icon: 'eye', title: 'Timestamps', description: 'Suggested timestamps for easy video editing' },
    ],
    benefits: [
      { title: 'Overcome Writer\'s Block', description: 'Never stare at a blank page again with AI-generated starting points.' },
      { title: 'Save Production Time', description: 'Scripts ready in seconds, not hours.' },
      { title: 'Better Viewer Retention', description: 'Structured scripts keep viewers watching longer.' },
      { title: 'Consistent Quality', description: 'Professional scripts every time.' },
    ],
    apiRequired: 'gemini',
    estimatedSearchVolume: 18000,
    estimatedCPC: 1.3,
  },

  // ═══════════════════════════════════════════════
  // 9. Stylish Name Generator
  // ═══════════════════════════════════════════════
  'stylish-name-generator': {
    id: 'stylish-name-generator',
    slug: 'stylish-name-generator',
    toolName: 'Stylish Name Generator',
    category: 'social',
    shortDescription: 'Create cool stylish names for Instagram, TikTok & gaming',
    longDescription: 'Our Stylish Name Generator creates unique, eye-catching names using special Unicode characters, symbols, and decorative fonts. Perfect for Instagram bios, TikTok profiles, gaming usernames, Discord tags, and more. Stand out from the crowd with a name that gets noticed.',
    icon: 'Sparkles',
    featuredImage: '/og/stylish-name-generator.png',
    metaTitle: 'Free Stylish Name Generator - Cool Fonts & Symbols for Social Media | CreatorBoost AI',
    metaDescription: 'Create stylish names with cool fonts and symbols for Instagram, TikTok, gaming, and Discord. Free online stylish name generator with 50+ font styles.',
    keywords: ['stylish name generator', 'cool name generator', 'fancy text generator', 'instagram name generator', 'stylish fonts', 'cool text generator', 'symbol names'],
    faq: [
      { q: 'What is a Stylish Name Generator?', a: 'A Stylish Name Generator creates names using special Unicode characters, decorative fonts, and symbols to make your username stand out.' },
      { q: 'Where can I use these stylish names?', a: 'You can use them on Instagram, TikTok, Twitter, Facebook, Discord, gaming platforms, and any platform that supports Unicode characters.' },
      { q: 'How many styles are available?', a: 'We offer 50+ different styles including fancy, gothic, cursive, bold, italic, and symbol-decorated variations.' },
      { q: 'Can I copy the stylish names?', a: 'Yes! Simply click on any generated name to copy it to your clipboard instantly.' },
      { q: 'Are these names unique?', a: 'Yes, each name is generated uniquely. However, availability on platforms depends on whether someone else is already using that name.' },
      { q: 'Does this work on all platforms?', a: 'Most platforms support Unicode characters, but some may have limitations. Instagram and TikTok fully support stylish names.' },
      { q: 'Can I add my own text?', a: 'Yes! Enter any name or text and our generator will create stylish variations of it.' },
      { q: 'Is this tool free?', a: 'Yes, our Stylish Name Generator is completely free with no limits.' },
    ],
    relatedTools: ['emoji-picker', 'hashtag-generator', 'ai-caption-generator', 'password-generator', 'slug-generator', 'meta-tag-generator'],
    popular: true,
    trending: true,
    featured: false,
    whoIsItFor: 'Instagram users, TikTok creators, gamers, Discord users, and anyone wanting a unique online identity.',
    useCases: [
      'Create a unique Instagram username',
      'Design a stylish TikTok profile name',
      'Generate gaming usernames with symbols',
      'Create Discord display names',
      'Design social media bio text',
      'Make branded names for online personas',
    ],
    howToSteps: [
      { title: 'Enter Your Name', description: 'Type the name, username, or text you want to stylize.' },
      { title: 'Browse Styles', description: 'Scroll through 50+ different styles and font variations.' },
      { title: 'Click to Copy', description: 'Click on any style to copy it to your clipboard instantly.' },
      { title: 'Paste Anywhere', description: 'Paste your stylish name into Instagram, TikTok, Discord, or any platform.' },
    ],
    features: [
      { icon: 'zap', title: 'Instant Results', description: '50+ styles generated instantly' },
      { icon: 'shield', title: 'Safe to Use', description: 'Unicode characters work across platforms' },
      { icon: 'smartphone', title: 'Mobile Friendly', description: 'Works perfectly on all devices' },
      { icon: 'brain', title: '50+ Styles', description: 'Fancy, gothic, cursive, bold, and more' },
      { icon: 'award', title: 'One-Click Copy', description: 'Copy any style with a single click' },
      { icon: 'eye', title: 'Preview Live', description: 'See exactly how your name looks in each style' },
    ],
    benefits: [
      { title: 'Stand Out', description: 'Create a unique identity that gets noticed.' },
      { title: 'Express Yourself', description: 'Find a style that matches your personality.' },
      { title: 'Universal Compatibility', description: 'Works on all major social platforms.' },
      { title: 'No Design Skills', description: 'Create professional-looking stylish text instantly.' },
    ],
    estimatedSearchVolume: 42000,
    estimatedCPC: 0.5,
  },
};

/* ─── Helper Functions ─────────────────────────── */

export const getToolConfig = (id: string): ToolConfig | undefined => TOOLS_DATABASE[id];

export const getToolConfigBySlug = (slug: string): ToolConfig | undefined => {
  return Object.values(TOOLS_DATABASE).find(tool => tool.slug === slug);
};

export const getToolsByCategory = (category: string): ToolConfig[] => {
  return Object.values(TOOLS_DATABASE).filter(tool => tool.category === category);
};

export const getPopularTools = (count?: number): ToolConfig[] => {
  const tools = Object.values(TOOLS_DATABASE)
    .filter(tool => tool.popular)
    .sort((a, b) => (b.estimatedSearchVolume || 0) - (a.estimatedSearchVolume || 0));
  return count ? tools.slice(0, count) : tools;
};

export const getTrendingTools = (count?: number): ToolConfig[] => {
  const tools = Object.values(TOOLS_DATABASE).filter(tool => tool.trending);
  return count ? tools.slice(0, count) : tools;
};

export const getFeaturedTools = (count?: number): ToolConfig[] => {
  const tools = Object.values(TOOLS_DATABASE).filter(tool => tool.featured);
  return count ? tools.slice(0, count) : tools;
};

export const searchTools = (query: string): ToolConfig[] => {
  const lower = query.toLowerCase();
  return Object.values(TOOLS_DATABASE).filter(tool =>
    tool.toolName.toLowerCase().includes(lower) ||
    tool.shortDescription.toLowerCase().includes(lower) ||
    tool.keywords.some(kw => kw.toLowerCase().includes(lower))
  );
};

export const getAllToolIds = (): string[] => Object.keys(TOOLS_DATABASE);
