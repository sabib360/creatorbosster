import { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, Sparkles, ChevronDown, ChevronUp, Clock,
  Zap, Shield, Smartphone, Brain, Globe, Star, TrendingUp, Tag,
  ImageIcon, FileText, Youtube, SearchCode, ArrowUpRight, X,
  CheckCircle2, Users, Eye, BarChart3, Calendar, ChevronLeft, ChevronRight,
  MessageCircle, Mail, Lock, Flame, Sparkle, BookOpen, Hash,
  Image as ImageIconLucide, Calculator, Bot, FileCode, PenTool,
  ImagePlus, Crop, RotateCw, Stamp, RefreshCw, Package, Target,
  Pipette, Grid3x3, Merge, Split, FileUp, FileDown, FileOutput,
  FileLock, FileSearch, FileText as FileTextIcon, ImageDown, ImageUp,
  FileSignature, QrCode, Code, Binary, Regex, Type, Layout,
  Hash as HashIcon, Sparkle as SparkleIcon, Link2, Smile, LayoutList,
  BarChart, CalendarDays, Mail as MailIcon, Settings, FileCode2,
  Minimize2, Maximize, PenTool as PenToolIcon, Edit3, Share2,
  Download, Filter, Palette, Image as ImageIcon2, FileImage,
  FileUp as FileUpIcon, FileDown as FileDownIcon, FileText as FileTextIcon2,
  CreditCard, DollarSign, TrendingUp as TrendingUpIcon, Award,
  CircleDot, Activity, Layers, Lightbulb, Cpu, Code2, Braces,
  Key, Clock3, Calculator as CalculatorIcon, Percent, Ruler,
  Scale, Heart, FileSpreadsheet, FileBarChart, FileCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getRecentlyUsed } from '../hooks/useRecentlyUsed';
import { BLOG_POSTS } from '../config/blog-data';
import { getTrendingTools, getPopularTools, searchTools, CATEGORIES } from '../config/tools-database';
import SEOHead from './SEOHead';
import { organizationSchema, websiteSchema, homepageFAQSchema } from '../lib/schema';
import Testimonials from './Testimonials';

const SITE_URL = 'https://creatorboostai.xyz';

const allNavTools = [
  { name: 'Image Compressor', path: '/tools/image-compressor', cat: 'image' },
  { name: 'PDF Merger', path: '/tools/pdf-merger', cat: 'pdf' },
  { name: 'Background Remover', path: '/tools/background-remover', cat: 'ai' },
  { name: 'YouTube Title Generator', path: '/tools/youtube-title-generator', cat: 'youtube' },
  { name: 'Hashtag Generator', path: '/tools/hashtag-generator', cat: 'seo' },
  { name: 'QR Code Generator', path: '/tools/qr-code-generator', cat: 'image' },
  { name: 'JSON Formatter', path: '/tools/json-formatter', cat: 'seo' },
  { name: 'Age Calculator', path: '/tools/age-calculator', cat: 'seo' },
  { name: 'BMI Calculator', path: '/tools/bmi-calculator', cat: 'seo' },
  { name: 'Password Generator', path: '/tools/password-generator', cat: 'seo' },
  { name: 'Image Resizer', path: '/tools/image-resizer', cat: 'image' },
  { name: 'Image Cropper', path: '/tools/image-cropper', cat: 'image' },
  { name: 'Image Rotator', path: '/tools/image-rotator', cat: 'image' },
  { name: 'PDF Compressor', path: '/tools/pdf-compressor', cat: 'pdf' },
  { name: 'PDF Splitter', path: '/tools/pdf-splitter', cat: 'pdf' },
  { name: 'PDF to JPG', path: '/tools/pdf-to-jpg', cat: 'pdf' },
  { name: 'JPG to PDF', path: '/tools/jpg-to-pdf', cat: 'pdf' },
  { name: 'PDF Summarizer', path: '/tools/pdf-summarizer', cat: 'ai' },
  { name: 'AI Assistant', path: '/tools/ai-assistant', cat: 'ai' },
  { name: 'Image Analyzer', path: '/tools/image-analyzer', cat: 'ai' },
  { name: 'YouTube Thumbnail Downloader', path: '/tools/youtube-thumbnail-downloader', cat: 'youtube' },
  { name: 'YouTube Tag Generator', path: '/tools/youtube-tag-generator', cat: 'youtube' },
  { name: 'YouTube Description Generator', path: '/tools/youtube-description-generator', cat: 'youtube' },
  { name: 'Meta Tag Generator', path: '/tools/meta-tag-generator', cat: 'seo' },
  { name: 'Word Counter', path: '/tools/word-counter', cat: 'seo' },
  { name: 'Caption Writer', path: '/tools/caption-writer', cat: 'youtube' },
  { name: 'Content Idea Generator', path: '/tools/content-idea-generator', cat: 'seo' },
  { name: 'Blog Title Generator', path: '/tools/blog-title-generator', cat: 'seo' },
  { name: 'Content Paraphraser', path: '/tools/content-paraphraser', cat: 'ai' },
  { name: 'Grammar Checker', path: '/tools/grammar-checker', cat: 'ai' },
  { name: 'Slug Generator', path: '/tools/slug-generator', cat: 'seo' },
  { name: 'Image Converter', path: '/tools/image-converter', cat: 'image' },
  { name: 'PDF Converter', path: '/tools/pdf-converter', cat: 'pdf' },
  { name: 'PDF Unlocker', path: '/tools/pdf-unlocker', cat: 'pdf' },
  { name: 'YouTube SEO Checker', path: '/tools/youtube-seo-checker', cat: 'youtube' },
  { name: 'YouTube Channel Analyzer', path: '/tools/youtube-channel-analyzer', cat: 'youtube' },
  { name: 'Currency Converter', path: '/tools/currency-converter', cat: 'seo' },
  { name: 'Percentage Calculator', path: '/tools/percentage-calculator', cat: 'seo' },
  { name: 'Unit Converter', path: '/tools/unit-converter', cat: 'seo' },
  { name: 'Color Picker', path: '/tools/color-picker', cat: 'image' },
  { name: 'Image Metadata', path: '/tools/image-metadata', cat: 'image' },
  { name: 'Image to Base64', path: '/tools/image-to-base64', cat: 'image' },
  { name: 'Base64 to Image', path: '/tools/base64-to-image', cat: 'image' },
  { name: 'Watermark Tool', path: '/tools/watermark', cat: 'image' },
  { name: 'Passport Size', path: '/tools/passport-size', cat: 'image' },
  { name: 'PDF Watermark', path: '/tools/pdf-watermark', cat: 'pdf' },
  { name: 'PDF Password Protector', path: '/tools/pdf-password-protector', cat: 'pdf' },
  { name: 'PDF Page Numberer', path: '/tools/pdf-page-numberer', cat: 'pdf' },
  { name: 'PDF Metadata Editor', path: '/tools/pdf-metadata-editor', cat: 'pdf' },
  { name: 'Favicon Generator', path: '/tools/favicon-generator', cat: 'image' },
  { name: 'Image Splitter', path: '/tools/image-splitter', cat: 'image' },
  { name: 'Image Merger', path: '/tools/image-merger', cat: 'image' },
  { name: 'Link Shortener', path: '/tools/link-shortener', cat: 'seo' },
  { name: 'Emoji Picker', path: '/tools/emoji-picker', cat: 'youtube' },
  { name: 'Bio Link Page Builder', path: '/tools/bio-link-page-builder', cat: 'youtube' },
  { name: 'YouTube Script Writer', path: '/tools/youtube-script-writer', cat: 'youtube' },
  { name: 'YouTube Comment Replies', path: '/tools/youtube-comment-replies', cat: 'youtube' },
  { name: 'YouTube Video Ideas', path: '/tools/youtube-video-ideas', cat: 'youtube' },
  { name: 'YouTube Hashtag Generator', path: '/tools/youtube-hashtag-generator', cat: 'youtube' },
  { name: 'Blog Outline Generator', path: '/tools/blog-outline-generator', cat: 'seo' },
  { name: 'Meta Description Generator', path: '/tools/meta-description-generator', cat: 'seo' },
  { name: 'Social Post Generator', path: '/tools/social-post-generator', cat: 'seo' },
  { name: 'Email Subject Generator', path: '/tools/email-subject-generator', cat: 'seo' },
  { name: 'Content Calendar', path: '/tools/content-calendar', cat: 'seo' },
  { name: 'Base64 Encoder', path: '/tools/base64-encoder', cat: 'seo' },
  { name: 'HTML to Markdown', path: '/tools/html-to-markdown', cat: 'seo' },
  { name: 'Markdown to HTML', path: '/tools/markdown-to-html', cat: 'seo' },
  { name: 'CSS Minifier', path: '/tools/css-minifier', cat: 'seo' },
  { name: 'JS Minifier', path: '/tools/js-minifier', cat: 'seo' },
  { name: 'URL Encoder', path: '/tools/url-encoder', cat: 'seo' },
  { name: 'Hash Generator', path: '/tools/hash-generator', cat: 'seo' },
  { name: 'Regex Tester', path: '/tools/regex-tester', cat: 'seo' },
  { name: 'Color Converter', path: '/tools/color-converter', cat: 'image' },
  { name: 'Loan EMI Calculator', path: '/tools/loan-emi-calculator', cat: 'seo' },
  { name: 'SIP Calculator', path: '/tools/sip-calculator', cat: 'seo' },
  { name: 'Budget Planner', path: '/tools/budget-planner', cat: 'seo' },
  { name: 'Tax Calculator', path: '/tools/tax-calculator', cat: 'seo' },
  { name: 'FD Calculator', path: '/tools/fd-calculator', cat: 'seo' },
  { name: 'Simple Interest Calculator', path: '/tools/simple-interest-calculator', cat: 'seo' },
  { name: 'Compound Interest Calculator', path: '/tools/compound-interest-calculator', cat: 'seo' },
  { name: 'Date Difference', path: '/tools/date-difference', cat: 'seo' },
  { name: 'Loan Comparison', path: '/tools/loan-comparison', cat: 'seo' },
  { name: 'Bulk Compressor', path: '/tools/bulk-compressor', cat: 'image' },
  { name: 'Targeted Compression', path: '/tools/targeted-compression', cat: 'image' },
  { name: 'Image Filters', path: '/tools/image-filters', cat: 'image' },
  { name: 'YouTube Downloader', path: '/tools/youtube-downloader', cat: 'youtube' },
  { name: 'Thumbnail Generator', path: '/tools/thumbnail-generator', cat: 'image' },
  { name: 'AI Thumbnail Generator', path: '/tools/ai-thumbnail-generator', cat: 'ai' },
  { name: 'AI BG Remover', path: '/tools/ai-bg-remover', cat: 'ai' },
  { name: 'AI Image Upscaler', path: '/tools/ai-image-upscaler', cat: 'ai' },
  { name: 'AI Text to Image', path: '/tools/ai-text-to-image', cat: 'ai' },
  { name: 'AI Document Summarizer', path: '/tools/ai-document-summarizer', cat: 'ai' },
  { name: 'AI Chatbot', path: '/tools/ai-chatbot', cat: 'ai' },
  { name: 'AI Code Generator', path: '/tools/ai-code-generator', cat: 'ai' },
  { name: 'AI Translator', path: '/tools/ai-translator', cat: 'ai' },
  { name: 'AI Sentiment Analyzer', path: '/tools/ai-sentiment-analyzer', cat: 'ai' },
  { name: 'Competitor Analysis', path: '/tools/competitor-analysis', cat: 'ai' },
  { name: 'PDF to Word', path: '/tools/pdf-to-word', cat: 'pdf' },
  { name: 'Social Analytics', path: '/tools/social-analytics', cat: 'youtube' },
];

const popularSearches = [
  'Image Compressor', 'PDF Merger', 'Background Remover', 'QR Code Generator',
  'YouTube Title Generator', 'Hashtag Generator', 'JSON Formatter'
];

const popularTools = [
  { name: 'Image Compressor', desc: 'Reduce image file size while maintaining quality', path: '/tools/image-compressor', icon: Minimize2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'PDF Merger', desc: 'Combine multiple PDF files into one document', path: '/tools/pdf-merger', icon: Merge, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'Background Remover', desc: 'Remove image backgrounds with AI instantly', path: '/tools/background-remover', icon: ImagePlus, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'YouTube Title Generator', desc: 'Create catchy SEO-optimized video titles', path: '/tools/youtube-title-generator', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/10' },
  { name: 'QR Code Generator', desc: 'Create custom QR codes for links and text', path: '/tools/qr-code-generator', icon: QrCode, color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'Hashtag Generator', desc: 'Generate trending hashtags for social media', path: '/tools/hashtag-generator', icon: Hash, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { name: 'JSON Formatter', desc: 'Format, validate, and beautify JSON data', path: '/tools/json-formatter', icon: Braces, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'PDF Compressor', desc: 'Reduce PDF file size without losing quality', path: '/tools/pdf-compressor', icon: FileDown, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { name: 'Age Calculator', desc: 'Calculate your exact age in years, months, days', path: '/tools/age-calculator', icon: Clock3, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const categories = [
  {
    id: 'ai-tools',
    name: 'AI Tools',
    icon: Brain,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
    path: '/ai-tools',
    tools: [
      { name: 'AI Caption Generator', path: '/tools/caption-writer' },
      { name: 'AI Hashtag Generator', path: '/tools/hashtag-generator' },
      { name: 'AI Story Generator', path: '/tools/ai-assistant' },
      { name: 'AI Emoji Generator', path: '/tools/emoji-picker' },
      { name: 'AI Prompt Generator', path: '/tools/ai-assistant' },
    ],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: ImageIcon2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    gradient: 'from-blue-500/20 to-blue-500/5',
    path: '/image-tools',
    tools: [
      { name: 'Image Compressor', path: '/tools/image-compressor' },
      { name: 'Image Resizer', path: '/tools/image-resizer' },
      { name: 'Background Remover', path: '/tools/background-remover' },
      { name: 'JPG to PNG', path: '/tools/image-converter' },
      { name: 'PNG to JPG', path: '/tools/image-converter' },
      { name: 'QR Code Generator', path: '/tools/qr-code-generator' },
    ],
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    gradient: 'from-purple-500/20 to-purple-500/5',
    path: '/pdf-tools',
    tools: [
      { name: 'PDF Merge', path: '/tools/pdf-merger' },
      { name: 'PDF Split', path: '/tools/pdf-splitter' },
      { name: 'PDF Compress', path: '/tools/pdf-compressor' },
      { name: 'JPG to PDF', path: '/tools/jpg-to-pdf' },
      { name: 'PDF to JPG', path: '/tools/pdf-to-jpg' },
      { name: 'PDF Watermark', path: '/tools/pdf-watermark' },
    ],
  },
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    icon: SearchCode,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    gradient: 'from-green-500/20 to-green-500/5',
    path: '/ai-tools',
    tools: [
      { name: 'Meta Tag Generator', path: '/tools/meta-tag-generator' },
      { name: 'Keyword Density Checker', path: '/tools/word-counter' },
      { name: 'Robots.txt Generator', path: '/tools/meta-tag-generator' },
      { name: 'Sitemap Generator', path: '/tools/meta-tag-generator' },
      { name: 'Schema Generator', path: '/tools/meta-tag-generator' },
    ],
  },
  {
    id: 'youtube-tools',
    name: 'YouTube Tools',
    icon: Youtube,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    gradient: 'from-red-500/20 to-red-500/5',
    path: '/social-media-tools',
    tools: [
      { name: 'Thumbnail Downloader', path: '/tools/youtube-thumbnail-downloader' },
      { name: 'Title Generator', path: '/tools/youtube-title-generator' },
      { name: 'Description Generator', path: '/tools/youtube-description-generator' },
      { name: 'Tag Extractor', path: '/tools/youtube-tag-generator' },
      { name: 'Channel ID Finder', path: '/tools/youtube-channel-analyzer' },
    ],
  },
];

const trendingTools = [
  { name: 'Background Remover', path: '/tools/background-remover', usage: '12.4K', desc: 'Remove image backgrounds instantly with AI', icon: ImagePlus, color: 'text-cyan-400' },
  { name: 'YouTube Title Generator', path: '/tools/youtube-title-generator', usage: '9.8K', desc: 'Generate catchy, SEO-optimized video titles', icon: Youtube, color: 'text-red-400' },
  { name: 'Image Compressor', path: '/tools/image-compressor', usage: '8.2K', desc: 'Reduce image file size without quality loss', icon: Minimize2, color: 'text-blue-400' },
  { name: 'QR Code Generator', path: '/tools/qr-code-generator', usage: '7.5K', desc: 'Create custom QR codes for any URL or text', icon: QrCode, color: 'text-green-400' },
  { name: 'PDF Merger', path: '/tools/pdf-merger', usage: '6.9K', desc: 'Combine multiple PDFs into a single document', icon: Merge, color: 'text-purple-400' },
  { name: 'Hashtag Generator', path: '/tools/hashtag-generator', usage: '5.3K', desc: 'Find trending hashtags for maximum reach', icon: Hash, color: 'text-pink-400' },
];

const newTools = [
  { name: 'AI Sentiment Analyzer', path: '/tools/ai-sentiment-analyzer', desc: 'Analyze text sentiment with AI-powered detection', icon: Activity, color: 'text-cyan-400' },
  { name: 'Content Calendar Generator', path: '/tools/content-calendar', desc: 'Generate 30-day content calendars with topics', icon: CalendarDays, color: 'text-purple-400' },
  { name: 'Email Subject Line Generator', path: '/tools/email-subject-generator', desc: 'Create high-converting email subject lines', icon: MailIcon, color: 'text-blue-400' },
  { name: 'AI Code Generator', path: '/tools/ai-code-generator', desc: 'Generate code snippets in any programming language', icon: Code2, color: 'text-green-400' },
  { name: 'AI Translator', path: '/tools/ai-translator', desc: 'Translate text in 100+ languages instantly', icon: Globe, color: 'text-amber-400' },
  { name: 'Social Media Post Generator', path: '/tools/social-post-generator', desc: 'Create platform-specific posts with hashtags', icon: PenTool, color: 'text-pink-400' },
];

const features = [
  { icon: Zap, title: '100% Free', desc: 'All tools are completely free to use with no hidden charges', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Clock, title: 'Fast Processing', desc: 'Instant results with in-browser processing', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Lock, title: 'No Registration', desc: 'Use any tool immediately without creating an account', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Fully responsive design works on all devices', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Shield, title: 'Privacy Focused', desc: 'Your files stay on your device - never uploaded', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Brain, title: 'AI Powered', desc: 'Smart tools powered by cutting-edge AI technology', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

const faqData = [
  { q: 'Are all tools free?', a: 'Yes, every tool on CreatorBoost AI is completely free to use. There are no hidden charges, subscription fees, or premium tiers. You can use all tools without spending a penny.' },
  { q: 'Do I need an account to use the tools?', a: 'No, you do not need to create an account. All tools work instantly without registration. Simply visit any tool page and start using it right away.' },
  { q: 'Are my uploaded files secure?', a: 'Absolutely. Most of our tools process files entirely in your browser using client-side JavaScript. Your files are never uploaded to our servers. For AI-powered tools, files are processed via secure API calls and immediately discarded.' },
  { q: 'Which AI tools are most popular?', a: 'Our most popular AI tools include the Background Remover, YouTube Title Generator, AI Assistant, PDF Summarizer, and Image Analyzer. These tools use advanced AI to deliver instant, high-quality results.' },
  { q: 'Can I use the tools on my mobile phone?', a: 'Yes, all tools are fully responsive and work perfectly on smartphones, tablets, and desktops. No app download is required - just open any tool in your mobile browser.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CreatorBoost AI',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'Free AI-powered toolkit for creators with 80+ tools for image processing, PDF editing, content creation, and more.',
  sameAs: ['https://www.facebook.com/profile.php?id=61572335704389'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'support@creatorboostai.xyz',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ],
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

function ToolCard({ tool, index }: { tool: typeof popularTools[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={tool.path}
        className="group block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
      >
        <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 transition-colors group-hover:scale-110", tool.bg)}>
          <tool.icon className={cn("w-5 h-5", tool.color)} />
        </div>
        <h3 className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
        <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{tool.desc}</p>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary/60 group-hover:text-primary transition-colors">
          Use Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [recentTools, setRecentTools] = useState(getRecentlyUsed);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => setRecentTools(getRecentlyUsed());
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, []);

  const filteredTools = searchQuery.length > 0
    ? searchTools(searchQuery).slice(0, 8).map(t => ({ name: t.name, path: `/tools/${t.slug}`, cat: t.category.replace('-tools', '') }))
    : [];

  const latestPosts = [...BLOG_POSTS].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length > 0) navigate(filteredTools[0].path);
    else if (searchQuery.trim()) navigate(`/tools/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <SEOHead
        title="Free AI Tools Online | Image, PDF, Finance & Social Media Tools | CreatorBoost AI"
        description="100+ free online tools: AI generators, image editors, PDF tools, financial calculators, social media tools. No signup required. Boost productivity with our all-in-one tool suite."
        keywords="AI tools online, free AI tools, image editor, PDF tools, financial calculator, social media tools"
        canonicalUrl={SITE_URL}
        structuredData={[organizationSchema(), websiteSchema(), homepageFAQSchema()]}
      />

      <div className="space-y-0">

        {/* ═══════════ HERO ═══════════ */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/8 via-purple-500/4 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                80+ Free Online Tools
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-white leading-[1.1]">
                Free AI Tools for{' '}
                <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Creators
                </span>
              </h1>
              <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mt-6">
                Generate Images, Create Content, Edit PDFs and Grow Faster with Powerful Free AI Tools.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <form onSubmit={handleSearch}>
                <div className={cn(
                  "relative group rounded-2xl transition-all duration-300",
                  searchFocused ? "ring-2 ring-primary/40 shadow-lg shadow-primary/10" : ""
                )}>
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors" />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search 80+ tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="w-full pl-14 pr-32 py-4 sm:py-5 bg-white/[0.06] border border-white/[0.1] rounded-2xl text-white placeholder:text-white/30 focus:outline-none text-sm sm:text-base"
                    aria-label="Search tools"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchFocused && searchQuery.length > 0 && filteredTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl z-50"
                  >
                    {filteredTools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors"
                      >
                        <Search className="w-4 h-4 text-white/30" />
                        <span className="text-sm text-white/80">{tool.name}</span>
                        <ArrowRight className="w-3 h-3 text-white/20 ml-auto" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Popular Searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-xs text-white/30">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      searchRef.current?.focus();
                    }}
                    className="text-xs text-white/40 hover:text-primary bg-white/[0.04] hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/ai-tools"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <Sparkles className="w-4 h-4" />
                Explore Tools
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/[0.06] border border-white/[0.1] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Visit Blog
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="border-y border-white/[0.06] bg-white/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { value: 80, suffix: '+', label: 'Free Tools', color: 'text-blue-400' },
              { value: 50, suffix: 'K+', label: 'Monthly Users', color: 'text-purple-400' },
              { value: 1, suffix: 'M+', label: 'Files Processed', color: 'text-cyan-400' },
              { value: 4, suffix: '.8/5', label: 'User Rating', color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={stat.label} className={cn("py-6 text-center border-r border-white/[0.06] last:border-r-0", i >= 2 && "border-t md:border-t-0")}>
                <div className={cn("text-2xl sm:text-3xl font-display font-black", stat.color)}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-white/40 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ POPULAR TOOLS ═══════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <TrendingUp className="w-3 h-3" /> Most Popular
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Popular Tools
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                The most used tools by creators worldwide. Try them for free.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.map((tool, i) => (
                <ToolCard key={tool.path} tool={tool} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ TOOL CATEGORIES ═══════════ */}
        <section className="py-16 sm:py-20 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Layout className="w-3 h-3" /> Browse by Category
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Tool Categories
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Find the right tools organized by what you need to do.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className={cn(
                    "rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg",
                    cat.border, cat.gradient,
                    "hover:-translate-y-1"
                  )}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.bg)}>
                      <cat.icon className={cn("w-5 h-5", cat.color)} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{cat.name}</h3>
                      <p className="text-xs text-white/40">{cat.tools.length} tools</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                        {tool.name}
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={cat.path}
                    className={cn(
                      "mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border",
                      cat.border, cat.color, "hover:bg-white/[0.04]"
                    )}
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ TRENDING TOOLS ═══════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Flame className="w-3 h-3" /> Trending Now
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Trending Tools
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Tools that creators are using the most right now.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTools.map((tool, i) => (
                <motion.div
                  key={tool.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={tool.path}
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <tool.icon className={cn("w-5 h-5", tool.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                        <span className="flex-shrink-0 px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-full uppercase">Trending</span>
                      </div>
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">{tool.desc}</p>
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-white/30">
                        <Users className="w-3 h-3" /> {tool.usage} uses this month
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary flex-shrink-0 mt-2 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ NEW TOOLS ═══════════ */}
        <section className="py-16 sm:py-20 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkle className="w-3 h-3" /> Just Added
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                New Tools
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Fresh tools just added to help you work smarter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newTools.map((tool, i) => (
                <motion.div
                  key={tool.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={tool.path}
                    className="group block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform")}>
                        <tool.icon className={cn("w-5 h-5", tool.color)} />
                      </div>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full uppercase">New</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-1">{tool.name}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ BLOG SECTION ═══════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
                  <BookOpen className="w-3 h-3" /> Latest Articles
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                  From the Blog
                </h2>
              </div>
              <Link
                to="/blog"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latestPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-44 bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="relative text-4xl opacity-30">
                        {post.category === 'youtube' ? '🎬' : post.category === 'seo' ? '🔍' : post.category === 'content' ? '✍️' : '📊'}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-lg">
                          {post.category === 'youtube' ? 'YouTube' : post.category === 'seo' ? 'SEO' : post.category === 'content' ? 'Content' : 'Marketing'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.publishDate}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary/60 group-hover:text-primary transition-colors">
                        Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                View All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ WHY CHOOSE US ═══════════ */}
        <section className="py-16 sm:py-20 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Award className="w-3 h-3" /> Why Choose Us
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Why Creators Love Us
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                Built for creators, by creators. Here is what makes us different.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feat.bg)}>
                    <feat.icon className={cn("w-6 h-6", feat.color)} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <MessageCircle className="w-3 h-3" /> FAQ
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqData.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-sm font-bold text-white pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-white/40 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/[0.04] pt-4">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-500/10 border border-primary/20 p-8 sm:p-12 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
              <div className="relative space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                  Ready to Start Creating?
                </h2>
                <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base">
                  Join thousands of creators using our free tools to produce professional content every day.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/ai-tools"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Explore All Tools
                  </Link>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.06] border border-white/[0.1] text-white text-sm font-bold rounded-xl hover:bg-white/[0.1] transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Our Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ TESTIMONIALS ═══════════ */}
        <section className="py-16 sm:py-20 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                <Star className="w-3 h-3" /> User Reviews
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white">
                Trusted by Creators Worldwide
              </h2>
              <p className="text-white/40 mt-3 max-w-lg mx-auto text-sm sm:text-base">
                See what our users have to say about CreatorBoost AI.
              </p>
            </div>
            <Testimonials variant="grid" showStats={true} />
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="border-t border-white/[0.06] bg-white/[0.01]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {/* Brand */}
              <div className="col-span-2 sm:col-span-3 lg:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-black fill-black" />
                  </div>
                  <span className="font-display font-bold text-sm text-white">CreatorBoost AI</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                  Free AI-powered toolkit for creators. 80+ tools for image processing, PDF editing, content creation, and more.
                </p>
              </div>

              {/* Tools */}
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Tools</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'AI Tools', path: '/ai-tools' },
                    { label: 'Image Tools', path: '/image-tools' },
                    { label: 'PDF Tools', path: '/pdf-tools' },
                    { label: 'SEO Tools', path: '/ai-tools' },
                    { label: 'YouTube Tools', path: '/social-media-tools' },
                  ].map(link => (
                    <li key={link.path + link.label}>
                      <Link to={link.path} className="text-xs text-white/40 hover:text-primary transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Resources</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Blog', path: '/blog' },
                    { label: 'How to Use', path: '/how-to-use' },
                    { label: 'Sitemap', path: '/' },
                  ].map(link => (
                    <li key={link.label}>
                      <Link to={link.path} className="text-xs text-white/40 hover:text-primary transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Company</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'About Us', path: '/about' },
                    { label: 'Contact Us', path: '/contact-us' },
                  ].map(link => (
                    <li key={link.label}>
                      <Link to={link.path} className="text-xs text-white/40 hover:text-primary transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Privacy Policy', path: '/privacy-policy' },
                    { label: 'Terms & Conditions', path: '/terms-of-service' },
                    { label: 'Disclaimer', path: '/disclaimer' },
                    { label: 'Cookie Policy', path: '/cookie-policy' },
                    { label: 'DMCA', path: '/dmca' },
                  ].map(link => (
                    <li key={link.label}>
                      <Link to={link.path} className="text-xs text-white/40 hover:text-primary transition-colors">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/30">
                &copy; {new Date().getFullYear()} CreatorBoost AI. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/profile.php?id=61572335704389" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-primary transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com/creatorboostai" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-primary transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
