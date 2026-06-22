import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Hash, Copy, Check, TrendingUp, Sparkles, Heart, Share2,
  Trash2, Clock, Download, RefreshCw, Globe, Zap, Users,
  Target, ArrowRight, ChevronDown, ChevronUp, Info, Star
} from 'lucide-react';
import { generateAIHashtags, type AIHashtagSet } from '../../lib/gemini';

/* ─── Types ─────────────────────────────────────── */

type Platform = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'twitter';

interface HistoryItem {
  id: string;
  topic: string;
  platform: Platform;
  hashtags: AIHashtagSet;
  date: string;
}

/* ─── Constants ─────────────────────────────────── */

const PLATFORMS: { id: Platform; name: string; icon: string; color: string; gradient: string }[] = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'pink-400', gradient: 'from-pink-500/20 to-purple-500/20 border-pink-500/30' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'cyan-400', gradient: 'from-cyan-500/20 to-black/10 border-cyan-500/30' },
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'blue-400', gradient: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'red-400', gradient: 'from-red-500/20 to-red-600/20 border-red-500/30' },
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'slate-300', gradient: 'from-slate-400/20 to-slate-500/20 border-slate-400/30' },
];

const HASHTAG_COUNTS = [5, 10, 20, 30];

const EXAMPLE_TOPICS = [
  { text: 'Travel & Adventure', topic: 'Travel adventures and wanderlust photography' },
  { text: 'Food & Cooking', topic: 'Delicious food recipes and cooking tutorials' },
  { text: 'Fitness & Health', topic: 'Fitness motivation and healthy lifestyle tips' },
  { text: 'Business & Marketing', topic: 'Digital marketing and business growth strategies' },
  { text: 'Gaming', topic: 'Gaming content and esports highlights' },
  { text: 'Fashion & Style', topic: 'Fashion trends and outfit inspiration' },
  { text: 'Technology', topic: 'Latest tech gadgets and AI innovations' },
  { text: 'Photography', topic: 'Photography tips and stunning photo editing' },
];

const TRENDING_CATEGORIES = [
  { name: 'Travel', icon: '✈️', hashtags: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#travelgram', '#instatravel', '#travelphotography'] },
  { name: 'Fitness', icon: '💪', hashtags: ['#fitness', '#workout', '#gym', '#fit', '#fitnessmotivation', '#health', '#bodybuilding', '#personaltrainer'] },
  { name: 'Food', icon: '🍕', hashtags: ['#food', '#foodie', '#foodporn', '#instafood', '#yummy', '#delicious', '#recipe', '#cooking'] },
  { name: 'Fashion', icon: '👗', hashtags: ['#fashion', '#style', '#ootd', '#fashionblogger', '#fashionista', '#outfitoftheday', '#styleinspo', '#streetwear'] },
  { name: 'Business', icon: '💼', hashtags: ['#business', '#entrepreneur', '#marketing', '#startup', '#smallbusiness', '#hustle', '#motivation', '#success'] },
  { name: 'Tech', icon: '💻', hashtags: ['#tech', '#technology', '#ai', '#artificialintelligence', '#innovation', '#coding', '#programming', '#technews'] },
  { name: 'Gaming', icon: '🎮', hashtags: ['#gaming', '#gamer', '#gamingcommunity', '#esports', '#game', '#twitch', '#pcgaming', '#gamingsetup'] },
  { name: 'Lifestyle', icon: '✨', hashtags: ['#lifestyle', '#daily', '#life', '#aesthetic', '#vibes', '#mood', '#instagood', '#photooftheday'] },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  viral: { bg: 'from-red-500/15 to-orange-500/15', text: 'text-red-400', border: 'border-red-500/25' },
  trending: { bg: 'from-amber-500/15 to-yellow-500/15', text: 'text-amber-400', border: 'border-amber-500/25' },
  niche: { bg: 'from-blue-500/15 to-cyan-500/15', text: 'text-blue-400', border: 'border-blue-500/25' },
  broad: { bg: 'from-purple-500/15 to-pink-500/15', text: 'text-purple-400', border: 'border-purple-500/25' },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  viral: Zap,
  trending: TrendingUp,
  niche: Target,
  broad: Users,
};

/* ─── Component ─────────────────────────────────── */

export default function AIHashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [hashtagCount, setHashtagCount] = useState(20);
  const [language, setLanguage] = useState<'english' | 'bangla'>('english');
  const [hashtags, setHashtags] = useState<AIHashtagSet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'trending'>('generate');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    viral: true, trending: true, niche: true, broad: true
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ai-hashtag-history');
      const savedFavorites = localStorage.getItem('ai-hashtag-favorites');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch {}
  }, []);

  // Save to localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('ai-hashtag-history', JSON.stringify(newHistory));
  }, []);

  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('ai-hashtag-favorites', JSON.stringify(newFavorites));
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or describe your content');
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateAIHashtags(topic, platform, hashtagCount, language);
      setHashtags(result);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        topic,
        platform,
        hashtags: result,
        date: new Date().toISOString(),
      };
      saveHistory([newItem, ...history].slice(0, 50));
    } catch (err) {
      setError('Failed to generate hashtags. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const copyCategory = (category: string, tags: string[]) => {
    copyToClipboard(tags.join(' '));
    setCopiedCategory(category);
    setTimeout(() => setCopiedCategory(null), 2000);
  };

  const copyAll = () => {
    if (!hashtags) return;
    const all = [...hashtags.viral, ...hashtags.trending, ...hashtags.niche, ...hashtags.broad].join(' ');
    copyToClipboard(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const downloadHashtags = () => {
    if (!hashtags) return;
    const content = `AI Hashtag Generator Results\nTopic: ${topic}\nPlatform: ${platform}\nDate: ${new Date().toLocaleDateString()}\n\n` +
      `🔥 Viral:\n${hashtags.viral.join(' ')}\n\n` +
      `📈 Trending:\n${hashtags.trending.join(' ')}\n\n` +
      `🎯 Niche:\n${hashtags.niche.join(' ')}\n\n` +
      `🌐 Broad:\n${hashtags.broad.join(' ')}\n\n` +
      `Engagement Score: ${hashtags.engagementScore}/100\nReach Level: ${hashtags.reachLevel}\n\n` +
      `All Hashtags:\n${[...hashtags.viral, ...hashtags.trending, ...hashtags.niche, ...hashtags.broad].join(' ')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashtags-${topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      saveFavorites(favorites.filter(f => f !== id));
    } else {
      saveFavorites([...favorites, id]);
    }
  };

  const deleteHistoryItem = (id: string) => {
    saveHistory(history.filter(h => h.id !== id));
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setTopic(item.topic);
    setPlatform(item.platform);
    setHashtags(item.hashtags);
    setActiveTab('generate');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const totalHashtags = hashtags
    ? hashtags.viral.length + hashtags.trending.length + hashtags.niche.length + hashtags.broad.length
    : 0;

  const selectedPlatform = PLATFORMS.find(p => p.id === platform);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
          <Hash className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          AI Hashtag Generator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Generate viral hashtags to boost your social media reach. Powered by AI, optimized for every platform.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'generate'
              ? 'bg-primary text-black'
              : 'bg-slate-800/50 text-ink/60 hover:text-ink border border-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Generate
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'trending'
              ? 'bg-primary text-black'
              : 'bg-slate-800/50 text-ink/60 hover:text-ink border border-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trending
        </button>
      </div>

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-ink flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                Content Details
              </h2>

              {/* Topic Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-ink/60">Topic / Content Description *</label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-medium transition-all focus:border-primary/50 resize-none"
                  rows={3}
                  placeholder="Describe your content... (e.g., 'Fitness motivation and workout tips for beginners')"
                />
              </div>

              {/* Quick Example Topics */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-ink/60">Quick Topics</label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TOPICS.map((ex) => (
                    <button
                      key={ex.text}
                      onClick={() => setTopic(ex.topic)}
                      className="px-3 py-1.5 bg-slate-800/30 border border-slate-700 rounded-lg text-xs font-bold text-ink/70 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      {ex.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-ink/60">Platform *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-3 rounded-xl font-bold transition-all text-center ${
                        platform === p.id
                          ? `bg-gradient-to-r ${p.gradient} text-${p.color}`
                          : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-primary/30'
                      }`}
                    >
                      <span className="text-xl mr-1">{p.icon}</span>
                      <span className="text-sm">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Hashtag Count */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">Hashtag Count</label>
                  <div className="flex gap-2">
                    {HASHTAG_COUNTS.map((count) => (
                      <button
                        key={count}
                        onClick={() => setHashtagCount(count)}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                          hashtagCount === count
                            ? 'bg-primary text-black'
                            : 'bg-slate-800/50 text-ink/60 hover:text-ink border border-slate-700'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">Language</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLanguage('english')}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                        language === 'english'
                          ? 'bg-primary text-black'
                          : 'bg-slate-800/50 text-ink/60 hover:text-ink border border-slate-700'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage('bangla')}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                        language === 'bangla'
                          ? 'bg-primary text-black'
                          : 'bg-slate-800/50 text-ink/60 hover:text-ink border border-slate-700'
                      }`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Hashtags...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Hashtags
                  </>
                )}
              </button>
            </div>

            {/* Platform Tips */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                {selectedPlatform?.name} Tips
              </h3>
              <div className="space-y-2 text-sm text-ink/70">
                {platform === 'instagram' && (
                  <>
                    <p>• Use up to 30 hashtags per post</p>
                    <p>• Mix popular and niche hashtags</p>
                    <p>• Place hashtags in first comment or caption</p>
                    <p>• Character limit: 2,200 for caption</p>
                  </>
                )}
                {platform === 'tiktok' && (
                  <>
                    <p>• Use 3-5 hashtags per video</p>
                    <p>• Include trending hashtags like #fyp</p>
                    <p>• Focus on niche-specific tags</p>
                    <p>• Hashtag limit: 150 characters total</p>
                  </>
                )}
                {platform === 'facebook' && (
                  <>
                    <p>• Use 1-3 hashtags per post</p>
                    <p>• Focus on topic-specific tags</p>
                    <p>• Hashtags boost discoverability in search</p>
                    <p>• Don't overuse hashtags</p>
                  </>
                )}
                {platform === 'youtube' && (
                  <>
                    <p>• Use 3-5 hashtags in title/description</p>
                    <p>• Hashtags appear above video title</p>
                    <p>• First 3 hashtags show prominently</p>
                    <p>• Use for search optimization</p>
                  </>
                )}
                {platform === 'twitter' && (
                  <>
                    <p>• Use 1-3 hashtags max</p>
                    <p>• Keep hashtags short and relevant</p>
                    <p>• Jump on trending hashtags</p>
                    <p>• Don't exceed 280 character limit</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {hashtags && (
              <>
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-ink">{totalHashtags}</div>
                    <div className="text-xs text-ink/50">Total Hashtags</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{hashtags.engagementScore}/100</div>
                    <div className="text-xs text-ink/50">Engagement Score</div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{hashtags.reachLevel}</div>
                    <div className="text-xs text-ink/50">Reach Level</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={copyAll}
                    className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2 hover:border-green-500/40 transition-all"
                  >
                    {copiedAll ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-green-400" />}
                    <span className="font-bold text-green-400 text-sm">{copiedAll ? 'Copied!' : 'Copy All'}</span>
                  </button>
                  <button
                    onClick={downloadHashtags}
                    className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-blue-400 text-sm">Download</span>
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center gap-2 hover:border-purple-500/40 transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-purple-400 text-sm">Regenerate</span>
                  </button>
                </div>

                {/* Hashtag Categories */}
                {(['viral', 'trending', 'niche', 'broad'] as const).map((category) => {
                  const tags = hashtags[category];
                  if (!tags || tags.length === 0) return null;
                  const colors = CATEGORY_COLORS[category];
                  const Icon = CATEGORY_ICONS[category];
                  const isExpanded = expandedSections[category];

                  return (
                    <div
                      key={category}
                      className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}
                    >
                      <button
                        onClick={() => toggleSection(category)}
                        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                          <h3 className="text-lg font-bold text-ink capitalize">{category}</h3>
                          <span className="text-xs text-ink/40 bg-slate-800/50 px-2 py-0.5 rounded-full">{tags.length}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); copyCategory(category, tags); }}
                            className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all"
                          >
                            {copiedCategory === category ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-ink/40" />
                            )}
                          </button>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5">
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => copyToClipboard(tag)}
                                className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-full text-sm font-bold text-ink/80 transition-all cursor-pointer"
                                title={`Click to copy ${tag}`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {!hashtags && !isGenerating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Hash className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">Ready to Generate Hashtags?</h3>
                <p className="text-ink/60">
                  Enter your topic, select a platform, and let AI find the perfect hashtags for your content.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <RefreshCw className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-ink mb-2">Generating Hashtags...</h3>
                <p className="text-ink/60">AI is analyzing trends and finding the best hashtags for your content.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRENDING_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-bold text-ink">{cat.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.hashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setTopic(`${cat.name} content ${tag}`); setActiveTab('generate'); }}
                    className="px-2 py-1 bg-slate-800/50 rounded text-xs font-bold text-ink/70 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-ink/40" />
              <h3 className="text-lg font-bold text-ink">Recent Generations</h3>
              <span className="text-xs text-ink/40 bg-slate-800 px-2 py-0.5 rounded-full">{history.length}</span>
            </div>
            <div className="flex items-center gap-3">
              {showHistory && (
                <button
                  onClick={(e) => { e.stopPropagation(); clearHistory(); }}
                  className="text-xs text-red-400 hover:text-red-300 font-bold"
                >
                  Clear All
                </button>
              )}
              {showHistory ? <ChevronUp className="w-5 h-5 text-ink/40" /> : <ChevronDown className="w-5 h-5 text-ink/40" />}
            </div>
          </button>
          {showHistory && (
            <div className="px-6 pb-6 space-y-3">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate">{item.topic}</p>
                    <p className="text-xs text-ink/50 capitalize">{item.platform} • {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadFromHistory(item)}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-1.5 text-ink/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
