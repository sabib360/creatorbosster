import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Hash, MessageCircle, Sparkles, Edit3, BarChart3, Link2, Smile, Image as ImageIcon, Type, QrCode, Film, Users, Lightbulb, Tag, FileText, Download } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

const tools = [
  { name: 'YouTube Title Generator', path: '/tools/youtube-title-generator', description: 'Generate catchy, SEO-optimized titles with clickbait scores', icon: Type },
  { name: 'YouTube Description Generator', path: '/tools/youtube-description-generator', description: 'Create SEO descriptions with hashtags and chapters', icon: FileText },
  { name: 'YouTube Tag Generator', path: '/tools/youtube-tag-generator', description: 'Generate 40+ tags with search volume estimates', icon: Tag },
  { name: 'YouTube Hashtag Generator', path: '/tools/youtube-hashtag-generator', description: 'Generate trending hashtags categorized by relevance', icon: Hash },
  { name: 'YouTube Script Writer', path: '/tools/youtube-script-writer', description: 'Generate complete video scripts with hooks and CTAs', icon: Film },
  { name: 'YouTube SEO Checker', path: '/tools/youtube-seo-checker', description: 'Analyze and optimize your video metadata for maximum reach', icon: BarChart3 },
  { name: 'Channel Analyzer', path: '/tools/youtube-channel-analyzer', description: 'Get insights on any YouTube channel performance and growth', icon: Users },
  { name: 'Comment Reply Generator', path: '/tools/youtube-comment-replies', description: 'Generate professional, engaging replies to comments', icon: MessageCircle },
  { name: 'Video Ideas Generator', path: '/tools/youtube-video-ideas', description: 'Generate 50+ video ideas with difficulty and views estimates', icon: Lightbulb },
  { name: 'YouTube Thumbnail Maker', path: '/tools/youtube-thumbnail-maker', description: 'Create attention-grabbing thumbnails with AI-powered design', icon: ImageIcon },
  { name: 'YouTube Thumbnail Downloader', path: '/tools/youtube-thumbnail-downloader', description: 'Download high-quality thumbnails from any YouTube video', icon: Download },
  { name: 'Hashtag Generator', path: '/tools/hashtag-generator', description: 'Generate trending hashtags for Instagram and TikTok', icon: Hash },
  { name: 'Bio Link Page Builder', path: '/tools/bio-link-page-builder', description: 'Build a mobile-friendly link-in-bio landing page', icon: Link2 },
  { name: 'Social Media Caption Writer', path: '/tools/social-media-caption-writer', description: 'Write engaging captions for posts, reels, and stories', icon: Edit3 },
  { name: 'QR Code Generator', path: '/tools/qr-code-generator', description: 'Generate custom QR codes for links and campaigns', icon: QrCode },
];

export default function SocialMediaTools() {
  return (
    <>
      <SEOHead 
        title={categorySEOData['social-media-tools'].title}
        description={categorySEOData['social-media-tools'].description}
        keywords={categorySEOData['social-media-tools'].keywords}
        canonicalUrl="https://creatorboostai.xyz/social-media-tools"
        structuredData={categorySEOData['social-media-tools'].structuredData}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Social Media Tools
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Boost your social media presence with hashtags, content ideas, captions, and analytics.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 space-y-4">
        <p className="text-ink/70 leading-relaxed">
          <strong>Our Social Media Tools</strong> are built for content creators and social media managers who want to grow their audience and increase engagement. Generate viral hashtags, brainstorm engaging content ideas, write compelling captions, track your performance, and optimize your social media strategy - all in one place.
        </p>
        <p className="text-ink/70 leading-relaxed">
          Whether you're managing a personal brand, growing a business account on Instagram, TikTok, or YouTube - these tools are designed to save you time and help you create content that resonates with your audience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={tool.path}
              className="group block p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <tool.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-ink group-hover:text-purple-400 transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-ink/40 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-base text-ink/60 mt-3">{tool.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Social Media Features Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 rounded-3xl"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
            Maximize Your Social Impact
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            Our social media tools help you create engaging content, optimize your posts for maximum reach, 
            and grow your audience across Instagram, TikTok, and other platforms.
          </p>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
