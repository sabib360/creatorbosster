import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, TrendingUp, Users, Heart, MessageCircle, Share2, Download, RefreshCw, Sparkles, Target, Zap } from 'lucide-react';

interface HashtagSet {
  name: string;
  hashtags: string[];
  category: string;
}

interface GeneratedHashtags {
  popular: string[];
  niche: string[];
  trending: string[];
  branded: string[];
}

export default function HashtagGenerator() {
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'both'>('instagram');
  const [generatedHashtags, setGeneratedHashtags] = useState<GeneratedHashtags | null>(null);
  const [copiedSet, setCopiedSet] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const hashtagCategories = {
    instagram: {
      popular: ['#love', '#instagood', '#photooftheday', '#fashion', '#beautiful', '#happy', '#cute', '#followme', '#like4like', '#tbt'],
      niche: ['#foodie', '#travelgram', '#fitnessmotivation', '#artoftheday', '#naturephotography', '#petsofinstagram', '#styleinspo', '#homedecor', '#bookworm', '#diy'],
      trending: ['#reels', '#explore', '#viral', '#fyp', '#instadaily', '#picoftheday', '#beautifulday', '#nature', '#sunset', '#photography'],
      branded: ['#mybrand', '#customhashtag', '#brandname', '#companytag', '#business', '#entrepreneur', '#startup', '#smallbusiness', '#shoplocal', '#supportsmall']
    },
    tiktok: {
      popular: ['#fyp', '#foryou', '#viral', '#trending', '#tiktok', '#dance', '#comedy', '#duet', '#challenge', '#foryoupage'],
      niche: ['#foodtok', '#beautytok', '#fitnesstok', '#learnontiktok', '#petsoftiktok', '#arttok', '#booktok', '#gametok', '#traveltok', '#diytok'],
      trending: ['#xyzbca', '#bussin', '#sheesh', '#grwm', '#storytime', '#aesthetic', '#mood', '#vibe', '#slay', '#bet'],
      branded: ['#brandchallenge', '#sponsored', '#ad', '#collab', '#partnership', '#tiktokmademebuyit', '#smallbusiness', '#entrepreneur', '#startup', '#business']
    }
  };

  const presetCategories = [
    { name: 'Food & Cooking', keywords: ['food', 'cooking', 'recipe', 'delicious', 'yummy', 'chef', 'kitchen', 'baking'] },
    { name: 'Fashion & Style', keywords: ['fashion', 'style', 'outfit', 'ootd', 'trend', 'clothing', 'accessories', 'runway'] },
    { name: 'Travel & Adventure', keywords: ['travel', 'adventure', 'explore', 'wanderlust', 'vacation', 'destination', 'journey', 'tourism'] },
    { name: 'Fitness & Health', keywords: ['fitness', 'health', 'workout', 'gym', 'exercise', 'wellness', 'training', 'motivation'] },
    { name: 'Beauty & Makeup', keywords: ['beauty', 'makeup', 'skincare', 'cosmetics', 'glam', 'tutorial', 'beautytips', 'routine'] },
    { name: 'Art & Creativity', keywords: ['art', 'creative', 'artist', 'design', 'painting', 'drawing', 'craft', 'inspiration'] },
    { name: 'Business & Entrepreneurship', keywords: ['business', 'entrepreneur', 'startup', 'success', 'marketing', 'boss', 'hustle', 'money'] },
    { name: 'Lifestyle & Daily', keywords: ['lifestyle', 'daily', 'routine', 'mood', 'vibe', 'aesthetic', 'cozy', 'simple'] }
  ];

  const generateHashtags = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const text = inputText.toLowerCase();
      const words = text.split(/\s+/).filter(word => word.length > 2);
      
      let hashtags: GeneratedHashtags = {
        popular: [],
        niche: [],
        trending: [],
        branded: []
      };

      // Generate hashtags based on input text
      if (text) {
        // Extract keywords from input
        const extractedKeywords = words.map(word => word.replace(/[^a-z0-9]/g, ''));
        
        // Generate popular hashtags
        hashtags.popular = [
          ...extractedKeywords.slice(0, 3).map(word => `#${word}`),
          ...hashtagCategories[platform].popular.slice(0, 7)
        ];

        // Generate niche hashtags based on content
        const matchedCategory = presetCategories.find(cat => 
          cat.keywords.some(keyword => extractedKeywords.includes(keyword))
        );
        
        if (matchedCategory) {
          hashtags.niche = matchedCategory.keywords.slice(0, 5).map(word => `#${word}`);
        } else {
          hashtags.niche = extractedKeywords.slice(0, 5).map(word => `#${word}`);
        }
        hashtags.niche.push(...hashtagCategories[platform].niche.slice(0, 5));

        // Generate trending hashtags
        hashtags.trending = [
          ...hashtagCategories[platform].trending.slice(0, 8),
          ...extractedKeywords.slice(3, 5).map(word => `#${word}`)
        ];

        // Generate branded hashtags
        hashtags.branded = [
          ...hashtagCategories[platform].branded.slice(0, 6),
          ...extractedKeywords.slice(0, 4).map(word => `#${word}official`)
        ];
      } else {
        // Default hashtags when no input
        hashtags = {
          popular: hashtagCategories[platform].popular,
          niche: hashtagCategories[platform].niche,
          trending: hashtagCategories[platform].trending,
          branded: hashtagCategories[platform].branded
        };
      }

      // Remove duplicates and limit to 10 per category
      Object.keys(hashtags).forEach(key => {
        hashtags[key as keyof GeneratedHashtags] = [...new Set(hashtags[key as keyof GeneratedHashtags])].slice(0, 10);
      });

      setGeneratedHashtags(hashtags);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (hashtags: string[], setName: string) => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedSet(setName);
    setTimeout(() => setCopiedSet(null), 2000);
  };

  const copyAllHashtags = () => {
    if (!generatedHashtags) return;
    
    const allHashtags = [
      ...generatedHashtags.popular,
      ...generatedHashtags.niche,
      ...generatedHashtags.trending,
      ...generatedHashtags.branded
    ];
    
    const text = allHashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopiedSet('all');
    setTimeout(() => setCopiedSet(null), 2000);
  };

  const downloadHashtags = () => {
    if (!generatedHashtags) return;
    
    const content = `Generated Hashtags for ${platform.toUpperCase()}\n\n` +
      `Popular:\n${generatedHashtags.popular.join(' ')}\n\n` +
      `Niche:\n${generatedHashtags.niche.join(' ')}\n\n` +
      `Trending:\n${generatedHashtags.trending.join(' ')}\n\n` +
      `Branded:\n${generatedHashtags.branded.join(' ')}\n\n` +
      `All Hashtags:\n${[...generatedHashtags.popular, ...generatedHashtags.niche, ...generatedHashtags.trending, ...generatedHashtags.branded].join(' ')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashtags-${platform}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applyPresetCategory = (category: typeof presetCategories[0]) => {
    setInputText(category.keywords.join(' '));
  };

  const getHashtagStats = (hashtags: string[]) => {
    const totalChars = hashtags.join(' ').length;
    const count = hashtags.length;
    const instagramLimit = 2200;
    const tiktokLimit = 150;
    
    return {
      count,
      totalChars,
      instagramRemaining: Math.max(0, instagramLimit - totalChars),
      tiktokRemaining: Math.max(0, tiktokLimit - count),
      instagramValid: totalChars <= instagramLimit,
      tiktokValid: count <= tiktokLimit
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Hashtag Generator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Generate trending and relevant hashtags for Instagram and TikTok to boost your social media reach.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-3">
              <Hash className="w-6 h-6 text-primary" />
              Content Details
            </h2>

            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Select Platform</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPlatform('instagram')}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    platform === 'instagram'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50 text-pink-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-pink-500/30'
                  }`}
                >
                  Instagram
                </button>
                <button
                  onClick={() => setPlatform('tiktok')}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    platform === 'tiktok'
                      ? 'bg-gradient-to-r from-black/20 to-white/10 border border-white/30 text-white'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-white/20'
                  }`}
                >
                  TikTok
                </button>
                <button
                  onClick={() => setPlatform('both')}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    platform === 'both'
                      ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/50 text-blue-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-blue-500/30'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            {/* Content Input */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">Describe Your Content</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50 resize-none"
                rows={4}
                placeholder="Describe your post, video, or content... (e.g., 'delicious homemade pasta recipe cooking tutorial')"
              />
              <p className="text-xs text-ink/40">
                Include keywords about your content for better hashtag suggestions
              </p>
            </div>

            {/* Preset Categories */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Quick Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {presetCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => applyPresetCategory(category)}
                    className="p-2 bg-slate-800/30 border border-slate-700 rounded-lg text-xs font-bold text-ink/70 hover:border-primary/30 hover:text-primary transition-all text-left"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateHashtags}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Generating...
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
              <Target className="w-5 h-5 text-blue-400" />
              Platform Tips
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
                  <p>• Include trending hashtags</p>
                  <p>• Focus on niche-specific tags</p>
                  <p>• Hashtag limit: 150 characters total</p>
                </>
              )}
              {platform === 'both' && (
                <>
                  <p>• Instagram: 30 hashtags, 2,200 chars</p>
                  <p>• TikTok: 3-5 hashtags, 150 chars</p>
                  <p>• Use platform-specific trending tags</p>
                  <p>• Adapt content for each platform</p>
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
          {generatedHashtags && (
            <>
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={copyAllHashtags}
                  className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl flex items-center justify-center gap-2 hover:border-green-500/40 transition-all"
                >
                  <Copy className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-green-400">
                    {copiedSet === 'all' ? 'Copied!' : 'Copy All'}
                  </span>
                </button>
                <button
                  onClick={downloadHashtags}
                  className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all"
                >
                  <Download className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-blue-400">Download</span>
                </button>
              </div>

              {/* Hashtag Categories */}
              {Object.entries(generatedHashtags).map(([category, hashtags]) => {
                const stats = getHashtagStats(hashtags);
                const categoryColors = {
                  popular: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/20',
                  niche: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
                  trending: 'from-red-500/10 to-rose-500/10 border-red-500/20',
                  branded: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20'
                };
                
                const categoryIcons = {
                  popular: TrendingUp,
                  niche: Users,
                  trending: Zap,
                  branded: Target
                };
                
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                
                return (
                  <div
                    key={category}
                    className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} border rounded-2xl p-6`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-ink capitalize flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        {category}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(hashtags, category)}
                        className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all"
                      >
                        <Copy className="w-4 h-4 text-ink/60" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {hashtags.map((hashtag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-800/50 rounded-full text-sm font-bold text-ink/80"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-ink/40">
                      <span>{hashtags.length} hashtags</span>
                      <div className="flex items-center gap-4">
                        <span className={stats.instagramValid ? 'text-green-400' : 'text-orange-400'}>
                          IG: {stats.instagramRemaining} chars
                        </span>
                        <span className={stats.tiktokValid ? 'text-green-400' : 'text-orange-400'}>
                          TT: {stats.tiktokRemaining} left
                        </span>
                      </div>
                    </div>
                    
                    {copiedSet === category && (
                      <div className="mt-2 text-xs text-green-400 font-bold">
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Stats Summary */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Engagement Tips
                </h3>
                <div className="space-y-2 text-sm text-ink/70">
                  <p>• Use a mix of high, medium, and low-competition hashtags</p>
                  <p>• Research your competitors' hashtag strategies</p>
                  <p>• Create a branded hashtag for your business</p>
                  <p>• Update hashtag lists regularly based on trends</p>
                  <p>• Test different hashtag combinations to see what works</p>
                </div>
              </div>
            </>
          )}

          {!generatedHashtags && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <Hash className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">Ready to Generate Hashtags?</h3>
              <p className="text-ink/60">
                Describe your content and select your platform to get started with trending hashtags.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
