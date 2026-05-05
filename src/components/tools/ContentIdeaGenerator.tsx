import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, Lightbulb, Target, TrendingUp, Calendar, Users, MessageCircle } from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string[];
  hashtags: string[];
  engagement: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timing: string;
}

const contentCategories = [
  { name: 'Educational', icon: '📚', color: 'from-blue-500/20 to-blue-600/20' },
  { name: 'Entertainment', icon: '🎬', color: 'from-purple-500/20 to-purple-600/20' },
  { name: 'Inspirational', icon: '💡', color: 'from-yellow-500/20 to-yellow-600/20' },
  { name: 'Promotional', icon: '📢', color: 'from-green-500/20 to-green-600/20' },
  { name: 'Behind the Scenes', icon: '🎥', color: 'from-pink-500/20 to-pink-600/20' },
  { name: 'User-Generated', icon: '👥', color: 'from-indigo-500/20 to-indigo-600/20' }
];

const platforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube'];

const contentTemplates = [
  {
    category: 'Educational',
    ideas: [
      {
        title: 'How-To Tutorial Series',
        description: 'Create step-by-step tutorials teaching your audience a valuable skill related to your industry',
        platforms: ['youtube', 'instagram', 'tiktok'],
        hashtags: ['tutorial', 'howto', 'learnsomething', 'education'],
        engagement: 'high',
        difficulty: 'medium',
        timing: 'Weekend mornings'
      },
      {
        title: 'Myth-Busting Content',
        description: 'Debunk common misconceptions in your industry with facts and evidence',
        platforms: ['instagram', 'facebook', 'twitter'],
        hashtags: ['mythbusting', 'facts', 'truth', 'debunk'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Tuesday afternoons'
      },
      {
        title: 'Industry News Breakdown',
        description: 'Analyze and explain recent news or trends in your field',
        platforms: ['linkedin', 'twitter', 'facebook'],
        hashtags: ['news', 'trends', 'industry', 'analysis'],
        engagement: 'medium',
        difficulty: 'easy',
        timing: 'Monday mornings'
      }
    ]
  },
  {
    category: 'Entertainment',
    ideas: [
      {
        title: 'Challenge Videos',
        description: 'Participate in trending challenges or create your own unique challenges',
        platforms: ['tiktok', 'instagram', 'youtube'],
        hashtags: ['challenge', 'trending', 'fun', 'viral'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Evening hours'
      },
      {
        title: 'Behind the Scenes Blooper Reel',
        description: 'Share funny mistakes and bloopers from your content creation process',
        platforms: ['instagram', 'tiktok', 'youtube'],
        hashtags: ['bloopers', 'behindthescenes', 'funny', 'reallife'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Friday evenings'
      },
      {
        title: 'Meme Content',
        description: 'Create relatable memes about your industry or daily work life',
        platforms: ['instagram', 'twitter', 'facebook'],
        hashtags: ['memes', 'relatable', 'funny', 'worklife'],
        engagement: 'medium',
        difficulty: 'easy',
        timing: 'Any time'
      }
    ]
  },
  {
    category: 'Inspirational',
    ideas: [
      {
        title: 'Success Story Monday',
        description: 'Share motivational success stories every Monday to start the week strong',
        platforms: ['instagram', 'facebook', 'linkedin'],
        hashtags: ['motivation', 'success', 'mondaymotivation', 'inspiration'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Monday mornings'
      },
      {
        title: 'Day in the Life',
        description: 'Show your audience what a typical day looks like in your profession',
        platforms: ['instagram', 'youtube', 'tiktok'],
        hashtags: ['dayinthelife', 'routine', 'productivity', 'lifestyle'],
        engagement: 'high',
        difficulty: 'medium',
        timing: 'Weekday evenings'
      },
      {
        title: 'Overcoming Failure Stories',
        description: 'Share personal stories of overcoming challenges and learning from mistakes',
        platforms: ['linkedin', 'instagram', 'facebook'],
        hashtags: ['failure', 'learning', 'growth', 'resilience'],
        engagement: 'medium',
        difficulty: 'medium',
        timing: 'Wednesday afternoons'
      }
    ]
  },
  {
    category: 'Promotional',
    ideas: [
      {
        title: 'Product Demo Videos',
        description: 'Create engaging demonstrations of your products or services in action',
        platforms: ['youtube', 'instagram', 'facebook'],
        hashtags: ['demo', 'product', 'showcase', 'new'],
        engagement: 'medium',
        difficulty: 'medium',
        timing: 'Tuesday-Thursday'
      },
      {
        title: 'Limited Time Offers',
        description: 'Create urgency with time-sensitive promotions and flash sales',
        platforms: ['instagram', 'facebook', 'twitter'],
        hashtags: ['sale', 'offer', 'limitedtime', 'deal'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Friday-Sunday'
      },
      {
        title: 'Customer Testimonials',
        description: 'Share authentic customer reviews and success stories with your products',
        platforms: ['facebook', 'instagram', 'linkedin'],
        hashtags: ['testimonial', 'review', 'customer', 'satisfaction'],
        engagement: 'medium',
        difficulty: 'easy',
        timing: 'Mid-week'
      }
    ]
  },
  {
    category: 'Behind the Scenes',
    ideas: [
      {
        title: 'Office Tour',
        description: 'Give viewers a virtual tour of your workspace or production facility',
        platforms: ['instagram', 'youtube', 'tiktok'],
        hashtags: ['officetour', 'workspace', 'behindthescenes', 'team'],
        engagement: 'medium',
        difficulty: 'easy',
        timing: 'Friday afternoons'
      },
      {
        title: 'Team Member Spotlight',
        description: 'Introduce your team members and share their roles and personalities',
        platforms: ['instagram', 'linkedin', 'facebook'],
        hashtags: ['team', 'meettheteam', 'culture', 'workfamily'],
        engagement: 'medium',
        difficulty: 'easy',
        timing: 'Wednesday'
      },
      {
        title: 'Content Creation Process',
        description: 'Show how you create your content from idea to final product',
        platforms: ['youtube', 'instagram', 'tiktok'],
        hashtags: ['contentcreation', 'process', 'makingof', 'creative'],
        engagement: 'high',
        difficulty: 'medium',
        timing: 'Weekend'
      }
    ]
  },
  {
    category: 'User-Generated',
    ideas: [
      {
        title: 'Customer Feature Friday',
        description: 'Feature customers using your products or services every Friday',
        platforms: ['instagram', 'facebook', 'twitter'],
        hashtags: ['customerfeature', 'usergenerated', 'community', 'love'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Friday'
      },
      {
        title: 'Photo Contest',
        description: 'Run a photo contest related to your brand and share user submissions',
        platforms: ['instagram', 'facebook', 'twitter'],
        hashtags: ['contest', 'photocontest', 'win', 'giveaway'],
        engagement: 'high',
        difficulty: 'medium',
        timing: 'Monthly'
      },
      {
        title: 'Ask Me Anything (AMA)',
        description: 'Host Q&A sessions with your audience and answer their questions',
        platforms: ['instagram', 'twitter', 'linkedin'],
        hashtags: ['ama', 'qa', 'askmeanything', 'community'],
        engagement: 'high',
        difficulty: 'easy',
        timing: 'Weekly'
      }
    ]
  }
];

export default function ContentIdeaGenerator() {
  const [selectedCategory, setSelectedCategory] = useState('Educational');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateIdeas = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const category = contentTemplates.find(cat => cat.category === selectedCategory);
      if (!category) return;

      let ideas = category.ideas.filter(idea => 
        idea.platforms.some(platform => selectedPlatforms.includes(platform))
      );

      if (ideas.length === 0) {
        // If no ideas match selected platforms, show all ideas for this category
        ideas = category.ideas;
      }

      // Shuffle and take up to 5 ideas
      const shuffled = ideas.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 5);

      const contentIdeas: ContentIdea[] = selected.map((idea, index) => ({
        id: Date.now().toString() + index,
        title: idea.title,
        description: idea.description,
        category: selectedCategory,
        platform: idea.platforms,
        hashtags: idea.hashtags,
        engagement: idea.engagement as 'high' | 'medium' | 'low',
        difficulty: idea.difficulty as 'easy' | 'medium' | 'hard',
        timing: idea.timing
      }));

      setGeneratedIdeas(contentIdeas);
      setIsGenerating(false);
    }, 1000);
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const copyToClipboard = (idea: ContentIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nPlatforms: ${idea.platform.join(', ')}\nHashtags: ${idea.hashtags.map(tag => '#' + tag).join(' ')}\nBest time: ${idea.timing}`;
    
    navigator.clipboard.writeText(text);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-ink/60';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-ink/60';
    }
  };

  const getCategoryInfo = (category: string) => {
    return contentCategories.find(cat => cat.name === category);
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
          Content Idea Generator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Generate creative content ideas tailored to your platforms and audience preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Category Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              Content Category
            </h2>
            
            <div className="space-y-3">
              {contentCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                    selectedCategory === category.name
                      ? `bg-gradient-to-r ${category.color} border border-current/30 text-white`
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-primary/30'
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              Target Platforms
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`p-3 rounded-lg font-bold capitalize transition-all ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-primary/20 border border-primary/50 text-primary'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateIdeas}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content Ideas
              </>
            )}
          </button>
        </motion.div>

        {/* Generated Ideas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {generatedIdeas.length > 0 && !isGenerating && (
            <>
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${getCategoryInfo(selectedCategory)?.color} border border-current/20 rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getCategoryInfo(selectedCategory)?.icon}</span>
                  <h2 className="text-2xl font-bold text-ink">{selectedCategory} Content Ideas</h2>
                </div>
                <p className="text-ink/80">
                  {generatedIdeas.length} ideas generated for {selectedPlatforms.join(', ')}
                </p>
              </div>

              {/* Ideas List */}
              <div className="space-y-4">
                {generatedIdeas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-ink mb-2">{idea.title}</h3>
                        <p className="text-ink/60 mb-4">{idea.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${getEngagementColor(idea.engagement)} bg-current/10`}>
                            {idea.engagement} engagement
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${getDifficultyColor(idea.difficulty)} bg-current/10`}>
                            {idea.difficulty} difficulty
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full font-bold text-blue-400 bg-blue-400/10">
                            {idea.timing}
                          </span>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-ink/40" />
                          <div className="flex gap-1">
                            {idea.platform.map((platform) => (
                              <span key={platform} className="text-xs px-2 py-1 bg-slate-800/50 rounded text-ink/60 capitalize">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Hashtags */}
                        <div className="flex items-start gap-2">
                          <MessageCircle className="w-4 h-4 text-ink/40 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {idea.hashtags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs px-2 py-1 bg-slate-800/50 rounded text-primary">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(idea)}
                        className="ml-4 p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                      >
                        {copiedId === idea.id ? (
                          <div className="text-green-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <Copy className="w-5 h-5 text-ink/40" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {isGenerating && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <RefreshCw className="w-16 h-16 text-primary/20 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-ink mb-2">Generating Content Ideas</h3>
              <p className="text-ink/60">Creating personalized ideas for your platforms...</p>
            </div>
          )}

          {generatedIdeas.length === 0 && !isGenerating && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <Lightbulb className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">Ready to Generate Ideas?</h3>
              <p className="text-ink/60 mb-4">
                Select a category and platforms to get personalized content ideas
              </p>
              <div className="text-sm text-ink/40">
                <p>💡 Pro tip: Combine different categories for unique content</p>
              </div>
            </div>
          )}

          {/* Content Tips */}
          {!isGenerating && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                Content Creation Tips
              </h3>
              <div className="space-y-2 text-sm text-ink/70">
                <p>• Mix high and low difficulty content for consistent posting</p>
                <p>• Post at recommended times for maximum engagement</p>
                <p>• Use platform-specific hashtags for better reach</p>
                <p>• Repurpose content across different platforms</p>
                <p>• Engage with your audience within the first hour of posting</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
