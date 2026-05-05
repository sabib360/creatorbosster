import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Copy, Sparkles, Heart, MessageCircle, Share2, Bookmark, TrendingUp, Hash, Users, Camera } from 'lucide-react';

interface CaptionTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  hashtags: string[];
  tone: 'casual' | 'professional' | 'funny' | 'inspirational' | 'promotional';
}

interface GeneratedCaption {
  id: string;
  content: string;
  hashtags: string[];
  tone: string;
  category: string;
  engagement: {
    likes: string;
    comments: string;
    shares: string;
  };
}

const captionTemplates: CaptionTemplate[] = [
  {
    id: '1',
    name: 'Product Launch',
    category: 'Promotional',
    template: '🚀 Exciting news! We\'re thrilled to introduce [PRODUCT_NAME]. This game-changing [PRODUCT_FEATURE] will revolutionize how you [BENEFIT]. Available now! Link in bio. 🎉',
    hashtags: ['newproduct', 'launch', 'innovation', 'musthave'],
    tone: 'promotional'
  },
  {
    id: '2',
    name: 'Behind the Scenes',
    category: 'Lifestyle',
    template: '📸 Behind the scenes at [LOCATION]! Creating magic happens when [TEAM_ACTIVITY]. So grateful for this amazing team! 💪 #teamwork #bts',
    hashtags: ['behindthescenes', 'teamwork', 'worklife', 'grateful'],
    tone: 'casual'
  },
  {
    id: '3',
    name: 'Inspirational Quote',
    category: 'Motivation',
    template: '✨ "[QUOTE]" - [AUTHOR]\n\nRemember: [PERSONAL_REFLECTION]. Every day is a new opportunity to [ACTION]. 💫 #motivation #inspiration',
    hashtags: ['motivation', 'inspiration', 'quotes', 'mindset'],
    tone: 'inspirational'
  },
  {
    id: '4',
    name: 'How-To Guide',
    category: 'Educational',
    template: '📚 How to [SKILL] in 3 easy steps:\n\n1️⃣ [STEP_1]\n2️⃣ [STEP_2]\n3️⃣ [STEP_3]\n\nSave this for later! 📲 Tag someone who needs this! 👇',
    hashtags: ['tutorial', 'howto', 'tips', 'learn'],
    tone: 'professional'
  },
  {
    id: '5',
    name: 'Customer Story',
    category: 'Testimonial',
    template: '❤️ "Customer testimonial about [EXPERIENCE]" - [CUSTOMER_NAME]\n\nStories like these make our work worthwhile! Thank you for trusting us. 🙏 #customerlove #testimonials',
    hashtags: ['testimonials', 'customerlove', 'satisfaction', 'grateful'],
    tone: 'inspirational'
  },
  {
    id: '6',
    name: 'Funny Moment',
    category: 'Entertainment',
    template: '😂 When [FUNNY_SITUATION]... relatable? 😅 Tag someone who does this too! We see you! 👀 #funny #relatable #memes',
    hashtags: ['funny', 'relatable', 'memes', 'humor'],
    tone: 'funny'
  },
  {
    id: '7',
    name: 'Achievement Milestone',
    category: 'Business',
    template: '🎯 Milestone unlocked! We\'ve hit [ACHIEVEMENT]! 🎊\n\nThis wouldn\'t be possible without our amazing community. Thank you for being part of our journey! 🚀',
    hashtags: ['milestone', 'achievement', 'success', 'community'],
    tone: 'promotional'
  },
  {
    id: '8',
    name: 'Weekend Vibes',
    category: 'Lifestyle',
    template: '☀️ Weekend mode: ON! ☕\n\nToday\'s plans: [ACTIVITY_1], [ACTIVITY_2], and definitely [ACTIVITY_3]. What are you up to? 👇 #weekend #vibes',
    hashtags: ['weekend', 'vibes', 'relax', 'goodvibes'],
    tone: 'casual'
  }
];

const toneEmojis = {
  casual: '😊',
  professional: '💼',
  funny: '😂',
  inspirational: '✨',
  promotional: '🚀'
};

const toneColors = {
  casual: 'from-green-500/20 to-green-600/20 border-green-500/50',
  professional: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
  funny: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/50',
  inspirational: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
  promotional: 'from-red-500/20 to-red-600/20 border-red-500/50'
};

export default function CaptionWriter() {
  const [selectedTone, setSelectedTone] = useState<CaptionTemplate['tone']>('casual');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customInput, setCustomInput] = useState('');
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Promotional', 'Lifestyle', 'Motivation', 'Educational', 'Testimonial', 'Business', 'Entertainment'];

  const generateCaptions = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let filteredTemplates = captionTemplates.filter(template => template.tone === selectedTone);
      
      if (selectedCategory !== 'All') {
        filteredTemplates = filteredTemplates.filter(template => template.category === selectedCategory);
      }

      // If no templates match, use all templates of the selected tone
      if (filteredTemplates.length === 0) {
        filteredTemplates = captionTemplates.filter(template => template.tone === selectedTone);
      }

      // Generate captions based on templates or custom input
      const captions: GeneratedCaption[] = filteredTemplates.slice(0, 3).map((template, index) => {
        let content = template.template;
        
        // Replace placeholders with custom input if provided
        if (customInput) {
          content = content.replace(/\[PRODUCT_NAME\]/g, customInput)
                        .replace(/\[PRODUCT_FEATURE\]/g, 'amazing feature')
                        .replace(/\[BENEFIT\]/g, 'achieve your goals')
                        .replace(/\[LOCATION\]/g, 'our workspace')
                        .replace(/\[TEAM_ACTIVITY\]/g, 'collaborate and create')
                        .replace(/\[SKILL\]/g, customInput)
                        .replace(/\[STEP_1\]/g, 'Start with the basics')
                        .replace(/\[STEP_2\]/g, 'Practice consistently')
                        .replace(/\[STEP_3\]/g, 'Master the technique')
                        .replace(/\[QUOTE\]/g, 'Success is not final, failure is not fatal')
                        .replace(/\[AUTHOR\]/g, 'Winston Churchill')
                        .replace(/\[PERSONAL_REFLECTION\]/g, 'growth comes from challenges')
                        .replace(/\[ACTION\]/g, 'learn and improve')
                        .replace(/\[EXPERIENCE\]/g, 'their amazing experience')
                        .replace(/\[CUSTOMER_NAME\]/g, 'Happy Customer')
                        .replace(/\[FUNNY_SITUATION\]/g, 'you try to be productive but get distracted')
                        .replace(/\[ACHIEVEMENT\]/g, '10K followers')
                        .replace(/\[ACTIVITY_1\]/g, 'coffee and relaxation')
                        .replace(/\[ACTIVITY_2\]/g, 'catching up with friends')
                        .replace(/\[ACTIVITY_3\]/g, 'enjoying nature');
        }

        return {
          id: Date.now().toString() + index,
          content,
          hashtags: template.hashtags,
          tone: template.tone,
          category: template.category,
          engagement: {
            likes: Math.floor(Math.random() * 9000 + 1000).toString(),
            comments: Math.floor(Math.random() * 500 + 50).toString(),
            shares: Math.floor(Math.random() * 200 + 20).toString()
          }
        };
      });

      setGeneratedCaptions(captions);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (caption: GeneratedCaption) => {
    const text = `${caption.content}\n\n${caption.hashtags.map(tag => '#' + tag).join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getWordCount = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
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
          Instagram Caption Writer
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Create engaging Instagram captions with the perfect tone and hashtags for maximum reach.
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
          {/* Tone Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-primary" />
              Caption Tone
            </h2>
            
            <div className="space-y-3">
              {Object.entries(toneEmojis).map(([tone, emoji]) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone as CaptionTemplate['tone'])}
                  className={`w-full p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                    selectedTone === tone
                      ? `bg-gradient-to-r ${toneColors[tone as keyof typeof toneColors]} text-white`
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-primary/30'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="capitalize">{tone}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Hash className="w-5 h-5 text-primary" />
              Content Category
            </h2>
            
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-lg font-bold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary/20 border border-primary/50 text-primary'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Camera className="w-5 h-5 text-primary" />
              Custom Details
            </h2>
            
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50 resize-none"
              rows={3}
              placeholder="Enter your product name, topic, or main focus..."
            />
            <p className="text-xs text-ink/40 mt-2">
              This will replace placeholders in the templates
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCaptions}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Generating Captions...
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Generate Captions
              </>
            )}
          </button>
        </motion.div>

        {/* Generated Captions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {generatedCaptions.length > 0 && !isGenerating && (
            <>
              {/* Results Header */}
              <div className={`bg-gradient-to-r ${toneColors[selectedTone]} border border-current/20 rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{toneEmojis[selectedTone]}</span>
                  <h2 className="text-2xl font-bold text-ink capitalize">
                    {selectedTone} Captions Generated
                  </h2>
                </div>
                <p className="text-ink/80">
                  {generatedCaptions.length} captions ready to use
                </p>
              </div>

              {/* Captions List */}
              <div className="space-y-4">
                {generatedCaptions.map((caption, index) => (
                  <motion.div
                    key={caption.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm px-2 py-1 bg-primary/20 rounded-full text-primary font-bold capitalize">
                            {caption.tone}
                          </span>
                          <span className="text-sm px-2 py-1 bg-slate-800/50 rounded-full text-ink/60">
                            {caption.category}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-ink leading-relaxed whitespace-pre-wrap">{caption.content}</p>
                        </div>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {caption.hashtags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-sm px-3 py-1 bg-slate-800/50 rounded-full text-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-ink/60">{caption.engagement.likes} likes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-ink/60">{caption.engagement.comments} comments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-ink/60">{caption.engagement.shares} shares</span>
                          </div>
                        </div>

                        {/* Character/Word Count */}
                        <div className="flex items-center gap-4 text-xs text-ink/40">
                          <span>{getCharacterCount(caption.content)} characters</span>
                          <span>{getWordCount(caption.content)} words</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(caption)}
                          className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                        >
                          {copiedId === caption.id ? (
                            <div className="text-green-400">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <Copy className="w-5 h-5 text-ink/40" />
                          )}
                        </button>
                        <button className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
                          <Bookmark className="w-5 h-5 text-ink/40" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {isGenerating && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <Sparkles className="w-16 h-16 text-primary/20 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-ink mb-2">Creating Captions</h3>
              <p className="text-ink/60">Writing the perfect captions for your content...</p>
            </div>
          )}

          {generatedCaptions.length === 0 && !isGenerating && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <Edit3 className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">Ready to Write Captions?</h3>
              <p className="text-ink/60 mb-4">
                Select a tone and category to generate engaging Instagram captions
              </p>
              <div className="text-sm text-ink/40">
                <p>💡 Pro tip: Add custom details for personalized captions</p>
              </div>
            </div>
          )}

          {/* Caption Tips */}
          {!isGenerating && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Caption Writing Tips
              </h3>
              <div className="space-y-2 text-sm text-ink/70">
                <p>• Start with a hook to grab attention in the first 2 lines</p>
                <p>• Use 5-15 relevant hashtags for better reach</p>
                <p>• Keep captions under 125 characters for optimal engagement</p>
                <p>• Include a call-to-action to encourage interaction</p>
                <p>• Use emojis to add personality and break up text</p>
                <p>• Ask questions to boost comments and engagement</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
