import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Users, Share2, Copy, Check,
  Zap, Shield, Smartphone, Brain, Clock, Award, ArrowRight,
  ChevronDown, ChevronUp,
  CheckCircle2, ArrowUpRight, Sparkles, Eye, ThumbsUp,
  Flag, Link2, Facebook, Twitter, TrendingUp as TrendingUpIcon, BarChart3 as BarChart
} from 'lucide-react';
import SEOHead from '../SEOHead';
import Breadcrumb from '../Breadcrumb';
import { toolSoftwareSchema, toolFAQSchema } from '../../lib/schema';
import { SEO_CONFIG } from '../../config/seo-config';
import type { ToolConfig } from '../../config/tools-config';

const SITE_URL = SEO_CONFIG.siteUrl;

/* ─── Category Helpers ─────────────────────────── */

const CATEGORY_MAP: Record<string, { name: string; path: string; color: string }> = {
  image: { name: 'Image Tools', path: '/image-tools', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  pdf: { name: 'PDF Tools', path: '/pdf-tools', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ai: { name: 'AI Tools', path: '/ai-tools', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  finance: { name: 'Finance Tools', path: '/finance-tools', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  social: { name: 'Social Media Tools', path: '/social-media-tools', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  developer: { name: 'Developer Tools', path: '/ai-tools', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
};

/* ─── Feature Icon Map ─────────────────────────── */

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  zap: Zap, shield: Shield, smartphone: Smartphone, brain: Brain,
  award: Award, eye: Eye, clock: Clock, star: Star, users: Users,
  check: CheckCircle2, sparkles: Sparkles, thumbsup: ThumbsUp,
};

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className={className} />;
}

/* ─── Default FAQ ──────────────────────────────── */

const DEFAULT_FAQS = [
  { q: 'Is this tool free to use?', a: 'Yes, this tool is completely free. There are no hidden charges, subscription fees, or usage limits.' },
  { q: 'Do I need to create an account?', a: 'No account is required. Simply visit the tool page and start using it immediately.' },
  { q: 'Is my data secure?', a: 'Absolutely. All processing happens locally in your browser — your files never leave your device.' },
  { q: 'Can I use this on my phone?', a: 'Yes, the tool is fully responsive and works on all devices including smartphones, tablets, and desktops.' },
  { q: 'What browsers are supported?', a: 'The tool works on all modern browsers including Chrome, Firefox, Safari, and Edge.' },
  { q: 'Are there any usage limits?', a: 'There are no enforced usage limits. You can use the tool as many times as you need.' },
  { q: 'How do I report a bug?', a: 'Visit our Contact page and send us a message. We respond to all inquiries within 24-48 hours.' },
  { q: 'Can I use the output commercially?', a: 'Yes, you own the output created using our tools. You are free to use the results for any purpose.' },
];

/* ─── Default Features ─────────────────────────── */

const DEFAULT_FEATURES = [
  { icon: 'zap', title: 'Fast Processing', description: 'Get results instantly with optimized in-browser processing' },
  { icon: 'shield', title: '100% Secure', description: 'Your data stays on your device — never uploaded to servers' },
  { icon: 'smartphone', title: 'Mobile Friendly', description: 'Works perfectly on desktop, tablet, and smartphone' },
  { icon: 'brain', title: 'AI Powered', description: 'Smart algorithms deliver professional-grade results' },
  { icon: 'award', title: 'Free to Use', description: 'No signup, no hidden fees — completely free' },
  { icon: 'eye', title: 'High Quality', description: 'Professional output that meets industry standards' },
];

/* ═══════════════════════════════════════════════ */
/* ─── COMMON TOOL TEMPLATE ─────────────────────── */
/* ═══════════════════════════════════════════════ */

interface CommonToolTemplateProps {
  toolConfig: ToolConfig;
  children: ReactNode;
}

export default function CommonToolTemplate({ toolConfig, children }: CommonToolTemplateProps) {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);

  const category = CATEGORY_MAP[toolConfig.category] || CATEGORY_MAP.ai;
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const allFaqs = toolConfig.faq && toolConfig.faq.length > 0 ? toolConfig.faq : DEFAULT_FAQS;
  const features = toolConfig.features && toolConfig.features.length > 0 ? toolConfig.features : DEFAULT_FEATURES;

  /* Related tools */
  const relatedTools = getRelatedTools(toolConfig, 6);

  /* Schemas */
  const schemas = [
    toolSoftwareSchema({
      id: toolConfig.id,
      name: toolConfig.toolName,
      description: toolConfig.shortDescription,
      seoTitle: toolConfig.metaTitle,
      seoDescription: toolConfig.metaDescription,
      keywords: toolConfig.keywords,
      path: location.pathname,
      category: category.name,
      subcategory: '',
      difficulty: 'easy',
      estimatedSearchVolume: toolConfig.estimatedSearchVolume || 0,
      estimatedCPC: toolConfig.estimatedCPC || 0,
    }, canonicalUrl),
    toolFAQSchema(allFaqs),
  ].filter(Boolean);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(canonicalUrl);
    const text = encodeURIComponent(`Check out ${toolConfig.toolName} on CreatorBoost AI`);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      {/* ─── SEO Head ─── */}
      <SEOHead
        title={toolConfig.metaTitle}
        description={toolConfig.metaDescription}
        keywords={toolConfig.keywords.join(', ')}
        canonicalUrl={canonicalUrl}
      />

      {/* ─── Structured Data ─── */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ═══════════ MAIN CONTENT ═══════════ */}
          <div className="flex-1 min-w-0">

            {/* ─── 1. Breadcrumb ─── */}
            <Breadcrumb
              items={[
                { name: category.name, path: category.path },
                { name: toolConfig.toolName, path: location.pathname },
              ]}
              className="mb-6"
            />

            {/* ─── 2. Hero Section ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${category.color}`}>
                  {category.name}
                </span>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                  <span className="text-xs text-white/50 ml-1">4.8</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">2.5K+ users</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-3">
                {toolConfig.toolName}
              </h1>
              <p className="text-sm sm:text-base text-white/50 max-w-2xl leading-relaxed mb-5">
                {toolConfig.shortDescription}
              </p>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleShare('twitter')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors" aria-label="Share on Twitter">
                  <Twitter className="w-3 h-3" /> Share
                </button>
                <button onClick={() => handleShare('facebook')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors" aria-label="Share on Facebook">
                  <Facebook className="w-3 h-3" /> Share
                </button>
                <button onClick={handleCopyLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg text-xs text-white/50 hover:text-white transition-colors" aria-label="Copy link">
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Link2 className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </motion.section>

            {/* ─── 3. Tool Interface ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-12"
            >
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 sm:p-8 md:p-10">
                {children}
              </div>
            </motion.section>

            {/* ─── 4. What is this Tool ─── */}
            {toolConfig.longDescription && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-4">
                  What is {toolConfig.toolName}?
                </h2>
                <div className="text-sm text-white/50 leading-relaxed space-y-4">
                  <p>{toolConfig.longDescription}</p>
                  {toolConfig.whoIsItFor && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white mb-2">Who Should Use This Tool?</h3>
                      <p className="text-white/50">{toolConfig.whoIsItFor}</p>
                    </div>
                  )}
                  {toolConfig.useCases && toolConfig.useCases.length > 0 && (
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                      <h3 className="text-sm font-bold text-white mb-3">Real Use Cases</h3>
                      <ul className="space-y-2">
                        {toolConfig.useCases.map((uc, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/50">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ─── 5. How To Use ─── */}
            {toolConfig.howToSteps && toolConfig.howToSteps.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
                  How to Use {toolConfig.toolName}
                </h2>
                <div className="space-y-4">
                  {toolConfig.howToSteps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 6. Features ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
                Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feat, i) => (
                  <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <FeatureIcon name={feat.icon} className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ─── 7. Benefits ─── */}
            {toolConfig.benefits && toolConfig.benefits.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
                  Why Choose {toolConfig.toolName}?
                </h2>
                <div className="space-y-3">
                  {toolConfig.benefits.map((ben, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{ben.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{ben.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 8. FAQ ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {allFaqs.map((item, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
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
                          <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ─── 9. Related Tools ─── */}
            {relatedTools.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="mb-12"
              >
                <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
                  Related Tools
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatedTools.map((rt) => (
                    <Link
                      key={rt.id}
                      to={`/tools/${rt.slug}`}
                      className="group p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                          {rt.toolName}
                        </h3>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-primary flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-3">{rt.shortDescription}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                        {rt.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ─── 10. Feedback ─── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-center">
                <p className="text-sm font-bold text-white mb-3">Was this tool helpful?</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFeedbackGiven('up')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      feedbackGiven === 'up'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/[0.04] text-white/50 hover:text-green-400 border border-white/[0.06] hover:border-green-500/30'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Yes
                  </button>
                  <button
                    onClick={() => setFeedbackGiven('down')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                      feedbackGiven === 'down'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-white/[0.04] text-white/50 hover:text-red-400 border border-white/[0.06] hover:border-red-500/30'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" /> Report Issue
                  </button>
                </div>
                {feedbackGiven && (
                  <p className="text-xs text-white/30 mt-3">Thanks for your feedback!</p>
                )}
              </div>
            </motion.section>

          </div>

          {/* ═══════════ SIDEBAR ═══════════ */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">

            {/* Popular Tools */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUpIcon className="w-3.5 h-3.5 text-primary" /> Popular Tools
              </h3>
              <div className="space-y-2">
                {getPopularSidebarTools(5).map((t) => (
                  <Link
                    key={t.id}
                    to={`/tools/${t.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors truncate">{t.toolName}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Tools */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-green-400" /> Trending Now
              </h3>
              <div className="space-y-2">
                {getTrendingSidebarTools(5).map((t) => (
                  <Link
                    key={t.id}
                    to={`/tools/${t.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white/70 group-hover:text-primary transition-colors truncate">{t.toolName}</p>
                      <p className="text-[10px] text-white/30 truncate">{t.shortDescription}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white mb-2">Need More Tools?</h3>
              <p className="text-xs text-white/40 mb-4">Explore 80+ free tools for creators.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-black text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Tools <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

/* ─── Sidebar Helpers ──────────────────────────── */

import { TOOLS_DATABASE } from '../../config/tools-config';

function getRelatedTools(current: ToolConfig, count: number): ToolConfig[] {
  if (!current.relatedTools || current.relatedTools.length === 0) {
    return Object.values(TOOLS_DATABASE).filter(t => t.id !== current.id).slice(0, count);
  }
  return current.relatedTools
    .map(id => TOOLS_DATABASE[id])
    .filter(Boolean)
    .slice(0, count);
}

function getPopularSidebarTools(count: number): ToolConfig[] {
  return Object.values(TOOLS_DATABASE)
    .filter(t => t.popular)
    .sort((a, b) => (b.estimatedSearchVolume || 0) - (a.estimatedSearchVolume || 0))
    .slice(0, count);
}

function getTrendingSidebarTools(count: number): ToolConfig[] {
  return Object.values(TOOLS_DATABASE)
    .filter(t => t.trending)
    .slice(0, count);
}
