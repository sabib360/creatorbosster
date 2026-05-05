import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Hash, Heart, MessageCircle, Share2, Users, TrendingUp, Sparkles, Edit3, BarChart3, Link2, Smile } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

const tools = [
  { name: 'Hashtag Generator', path: '/tools/hashtag-generator', description: 'Generate trending and relevant hashtags for Instagram and TikTok to boost your social media reach', icon: Hash },
  { name: 'Content Idea Generator', path: '/tools/content-idea-generator', description: 'Generate creative content ideas tailored to your platforms and audience preferences', icon: Edit3 },
  { name: 'Instagram Caption Writer', path: '/tools/caption-writer', description: 'Create engaging Instagram captions with the perfect tone and hashtags for maximum reach', icon: Sparkles },
  { name: 'Social Media Analytics', path: '/tools/social-analytics', description: 'Track your social media performance across all platforms with detailed analytics', icon: BarChart3 },
  { name: 'Link Shortener', path: '/tools/link-shortener', description: 'Create short, memorable links and track their performance across platforms', icon: Link2 },
  { name: 'Emoji Picker', path: '/tools/emoji-picker', description: 'Find and copy the perfect emoji for your social media posts and messages', icon: Smile },
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
