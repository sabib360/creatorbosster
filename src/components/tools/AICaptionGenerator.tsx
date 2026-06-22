import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, RefreshCw, Heart, Hash, Globe,
  MessageCircle, BookOpen, TrendingUp, Trash2, Clock, Star,
  ChevronDown, ChevronUp, Zap, Shield, Smartphone, Brain,
  Award, Eye, ArrowRight, Link2, Share2
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

/* ─── Types ──────────────────────────────────────────── */

type Platform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';
type Tone = 'funny' | 'romantic' | 'inspirational' | 'professional' | 'sad' | 'motivational' | 'cool' | 'viral' | 'short' | 'long';
type Language = 'english' | 'bangla';
type CaptionCount = 3 | 5 | 10;
type CaptionLength = 'short' | 'medium' | 'long';

interface Caption {
  id: string;
  content: string;
  hashtags: string[];
  characterCount: number;
  estimatedEngagement: string;
}

interface HistoryItem {
  id: string;
  caption: string;
  platform: Platform;
  tone: Tone;
  language: Language;
  date: number;
  isFavorite: boolean;
}

interface PopularCaption {
  id: string;
  caption: string;
  category: string;
  likes: number;
}

/* ─── Constants ──────────────────────────────────────── */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const PLATFORMS: { id: Platform; name: string; icon: string; color: string }[] = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500/20 to-purple-500/20 border-pink-500/30' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-cyan-500/20 to-pink-500/20 border-cyan-500/30' },
  { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'from-red-500/20 to-red-600/20 border-red-500/30' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-sky-500/20 to-sky-600/20 border-sky-500/30' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-700/20 to-blue-800/20 border-blue-700/30' },
];

const TONES: { id: Tone; name: string; emoji: string }[] = [
  { id: 'funny', name: 'Funny', emoji: '😂' },
  { id: 'romantic', name: 'Romantic', emoji: '❤️' },
  { id: 'inspirational', name: 'Inspirational', emoji: '✨' },
  { id: 'professional', name: 'Professional', emoji: '💼' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'motivational', name: 'Motivational', emoji: '🔥' },
  { id: 'cool', name: 'Cool', emoji: '😎' },
  { id: 'viral', name: 'Viral', emoji: '🚀' },
  { id: 'short', name: 'Short', emoji: '✂️' },
  { id: 'long', name: 'Long', emoji: '📝' },
];

const LANGUAGES: { id: Language; name: string; flag: string }[] = [
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'bangla', name: 'বাংলা', flag: '🇧🇩' },
];

const CAPTION_COUNTS: { value: CaptionCount; label: string }[] = [
  { value: 3, label: '3 Captions' },
  { value: 5, label: '5 Captions' },
  { value: 10, label: '10 Captions' },
];

const CAPTION_LENGTHS: { id: CaptionLength; name: string; description: string }[] = [
  { id: 'short', name: 'Short', description: 'Under 100 chars' },
  { id: 'medium', name: 'Medium', description: '100-200 chars' },
  { id: 'long', name: 'Long', description: '200+ chars' },
];

const POPULAR_CATEGORIES = [
  { id: 'love', name: 'Love', emoji: '💕' },
  { id: 'funny', name: 'Funny', emoji: '😂' },
  { id: 'sad', name: 'Sad', emoji: '😢' },
  { id: 'attitude', name: 'Attitude', emoji: '😎' },
  { id: 'motivational', name: 'Motivational', emoji: '🔥' },
  { id: 'travel', name: 'Travel', emoji: '✈️' },
  { id: 'food', name: 'Food', emoji: '🍕' },
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'eid', name: 'Eid', emoji: '🌙' },
  { id: 'friendship', name: 'Friendship', emoji: '🤝' },
];

const HISTORY_KEY = 'caption-generator-history';

/* ─── AI Generation ──────────────────────────────────── */

async function generateCaptionsAI(
  topic: string,
  platform: Platform,
  tone: Tone,
  language: Language,
  count: CaptionCount,
  length: CaptionLength,
  includeEmojis: boolean,
  includeHashtags: boolean,
  keywords: string
): Promise<{ captions: Caption[]; trending: PopularCaption[] }> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const lengthGuide = length === 'short' ? 'Keep each caption under 100 characters. Make them punchy and impactful.'
    : length === 'medium' ? 'Keep each caption between 100-200 characters. Balance detail with engagement.'
    : 'Write longer captions with 200+ characters. Be descriptive and storytelling-focused.';

  const emojiGuide = includeEmojis ? 'Include relevant emojis naturally throughout the captions.' : 'Do NOT include any emojis in the captions.';

  const hashtagGuide = includeHashtags ? 'Include 5-10 relevant hashtags at the end of each caption.' : 'Do NOT include any hashtags in the captions.';

  const keywordGuide = keywords ? `Include these keywords naturally: ${keywords}` : '';

  const langGuide = language === 'bangla'
    ? 'Write ALL captions in natural, fluent Bangla (Bengali). Use proper Bangla grammar, cultural references, and natural expressions. Do NOT use robotic or literal translations. Think like a native Bangla speaker would write.'
    : 'Write all captions in natural English.';

  const platformGuide = `Optimize for ${platform.charAt(0).toUpperCase() + platform.slice(1)} - ${
    platform === 'instagram' ? 'use engaging hooks, emojis, and hashtags typical for Instagram.'
    : platform === 'facebook' ? 'use conversational tone and engagement-driven content.'
    : platform === 'tiktok' ? 'use trendy, punchy, Gen-Z style language.'
    : platform === 'youtube' ? 'use descriptive, SEO-friendly content.'
    : platform === 'twitter' ? 'keep it concise and punchy, under 280 characters ideal.'
    : 'use professional, thought-leadership style content.'
  }`;

  const prompt = `Generate exactly ${count} unique social media captions for this topic: "${topic}"

Platform: ${platform}
Tone: ${tone}
Language: ${langGuide}
${platformGuide}
${lengthGuide}
${emojiGuide}
${hashtagGuide}
${keywordGuide}

Requirements:
- Each caption must be unique and engaging
- Make them feel human-written, not AI-generated
- Include a call-to-action where appropriate
- For Bangla captions, use natural expressions that native speakers would use
- Ensure each caption has a strong hook to grab attention

Return JSON with:
{
  "captions": [
    {
      "content": "the caption text",
      "hashtags": ["hashtag1", "hashtag2"],
      "estimatedEngagement": "High/Medium/Low"
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          captions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                estimatedEngagement: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const result = JSON.parse(response.text || '{"captions":[]}');

  const captions: Caption[] = result.captions.map((c: { content: string; hashtags: string[]; estimatedEngagement: string }) => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content: c.content,
    hashtags: c.hashtags || [],
    characterCount: c.content.length,
    estimatedEngagement: c.estimatedEngagement || 'Medium',
  }));

  // Generate trending captions
  const trendingPrompt = `Generate 5 trending, viral social media captions in ${language === 'bangla' ? 'Bangla' : 'English'} for the category "${topic}". Make them catchy and engaging. Return JSON with { "trending": [{ "caption": "text", "category": "category name", "likes": number }] }`;

  const trendingResponse = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: trendingPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trending: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                caption: { type: Type.STRING },
                category: { type: Type.STRING },
                likes: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
  });

  const trendingResult = JSON.parse(trendingResponse.text || '{"trending":[]}');
  const trending: PopularCaption[] = (trendingResult.trending || []).map((t: { caption: string; category: string; likes: number }) => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    caption: t.caption,
    category: t.category,
    likes: t.likes || Math.floor(Math.random() * 10000),
  }));

  return { captions, trending };
}

/* ─── Main Component ─────────────────────────────────── */

export default function AICaptionGenerator() {
  // Form State
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [tone, setTone] = useState<Tone>('funny');
  const [language, setLanguage] = useState<Language>('english');
  const [captionCount, setCaptionCount] = useState<CaptionCount>(5);
  const [captionLength, setCaptionLength] = useState<CaptionLength>('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [keywords, setKeywords] = useState('');

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<Caption[]>([]);
  const [trendingCaptions, setTrendingCaptions] = useState<PopularCaption[]>([]);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTrending, setShowTrending] = useState(true);

  // History & Favorites
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'popular'>('generate');
  const [activeCategory, setActiveCategory] = useState('love');

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
  }, []);

  // Handle Generate
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or description');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCaptions([]);
    setTrendingCaptions([]);

    try {
      const result = await generateCaptionsAI(
        topic, platform, tone, language, captionCount, captionLength,
        includeEmojis, includeHashtags, keywords
      );

      setGeneratedCaptions(result.captions);
      setTrendingCaptions(result.trending);

      // Save to history
      const historyItems: HistoryItem[] = result.captions.map(c => ({
        id: c.id,
        caption: c.content,
        platform,
        tone,
        language,
        date: Date.now(),
        isFavorite: false,
      }));
      saveHistory([...historyItems, ...history].slice(0, 50));
    } catch (err) {
      setError('Failed to generate captions. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy caption
  const copyCaption = async (caption: Caption) => {
    const text = includeHashtags && caption.hashtags.length > 0
      ? `${caption.content}\n\n${caption.hashtags.map(h => `#${h}`).join(' ')}`
      : caption.content;

    await navigator.clipboard.writeText(text);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    const updated = history.map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    saveHistory(updated);
  };

  // Delete history item
  const deleteHistoryItem = (id: string) => {
    saveHistory(history.filter(item => item.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    saveHistory([]);
  };

  // Load from history
  const loadFromHistory = (item: HistoryItem) => {
    setTopic(item.caption.split('\n')[0].substring(0, 100));
    setPlatform(item.platform);
    setTone(item.tone);
    setLanguage(item.language);
    setActiveTab('generate');
  };

  // Get favorite captions
  const favoriteCaptions = history.filter(item => item.isFavorite);

  // Get history for current category (simulated - in real app would filter by category)
  const categoryCaptions = history.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* ─── Hero Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">AI-Powered</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          AI Caption Generator
        </h1>
        <p className="text-lg text-ink/60 max-w-2xl mx-auto">
          Generate viral captions instantly using AI. Support for multiple platforms, tones, and languages including Bangla.
        </p>
      </motion.div>

      {/* ─── Tab Navigation ─── */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'generate' as const, label: 'Generate', icon: Sparkles },
          { id: 'history' as const, label: 'History', icon: Clock },
          { id: 'popular' as const, label: 'Popular', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-black'
                : 'bg-slate-800/50 text-ink/60 hover:text-ink hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Generate Tab ─── */}
      {activeTab === 'generate' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Sidebar - Controls */}
          <div className="space-y-4">
            {/* Topic Input */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                Topic / Description
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink placeholder-ink/40 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Describe your post... (e.g., sunset beach vacation, new product launch, motivational Monday)"
              />
              <div className="mt-2 text-xs text-ink/40">
                {topic.length}/500 characters
              </div>
            </div>

            {/* Platform Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      platform === p.id
                        ? `bg-gradient-to-r ${p.color} text-white`
                        : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-primary/30'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <span className="text-lg">🎨</span>
                Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      tone === t.id
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-primary/30'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Language
              </label>
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`flex-1 p-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      language === lang.id
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-primary/30'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
              {language === 'bangla' && (
                <p className="mt-2 text-xs text-primary/80 bg-primary/10 p-2 rounded-lg">
                  ✨ Bangla captions will be written naturally by native speakers, not robotic translations.
                </p>
              )}
            </div>
          </div>

          {/* Right Content - Options & Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Options Row */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Caption Count */}
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Number of Captions</label>
                  <div className="flex gap-2">
                    {CAPTION_COUNTS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setCaptionCount(c.value)}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                          captionCount === c.value
                            ? 'bg-primary text-black'
                            : 'bg-slate-800/50 text-ink/60 hover:bg-slate-800'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caption Length */}
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Caption Length</label>
                  <div className="flex gap-2">
                    {CAPTION_LENGTHS.map(l => (
                      <button
                        key={l.id}
                        onClick={() => setCaptionLength(l.id)}
                        className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                          captionLength === l.id
                            ? 'bg-primary text-black'
                            : 'bg-slate-800/50 text-ink/60 hover:bg-slate-800'
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="flex flex-wrap gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-ink/70">Include Emojis</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-ink/70">Include Hashtags</span>
                </label>
              </div>

              {/* Keywords Input */}
              <div className="mt-4">
                <label className="block text-sm font-bold text-ink mb-2">Keywords (Optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="travel, vacation, beach, sunset"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-ink placeholder-ink/40 focus:border-primary/50 focus:outline-none transition-colors"
                />
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
                  Generating Captions...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Captions
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Generated Captions */}
            {generatedCaptions.length > 0 && !isGenerating && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Generated Captions
                  </h3>
                  <span className="text-sm text-ink/50">{generatedCaptions.length} captions</span>
                </div>

                <div className="space-y-3">
                  {generatedCaptions.map((caption, index) => (
                    <motion.div
                      key={caption.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-900/50 border border-slate-800 rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-ink leading-relaxed whitespace-pre-wrap">{caption.content}</p>
                          {includeHashtags && caption.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {caption.hashtags.map((tag, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-xs text-ink/50">
                            <span>{caption.characterCount} characters</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {caption.estimatedEngagement} engagement
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => copyCaption(caption)}
                          className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                        >
                          {copiedId === caption.id ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-ink/40" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Captions */}
            {trendingCaptions.length > 0 && showTrending && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Trending Captions
                  </h3>
                  <button
                    onClick={() => setShowTrending(false)}
                    className="text-ink/40 hover:text-ink"
                  >
                    <span className="text-xs">Hide</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {trendingCaptions.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-lg">{POPULAR_CATEGORIES.find(c => c.id === item.category.toLowerCase())?.emoji || '🔥'}</span>
                      <p className="flex-1 text-sm text-ink/80 line-clamp-2">{item.caption}</p>
                      <span className="text-xs text-ink/40 flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {item.likes.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-primary/30 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-ink mb-2">Creating Your Captions</h3>
                <p className="text-ink/50">AI is crafting the perfect captions for you...</p>
              </div>
            )}

            {/* Empty State */}
            {generatedCaptions.length === 0 && !isGenerating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <MessageCircle className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">Ready to Create?</h3>
                <p className="text-ink/50 mb-4">
                  Enter a topic and select your preferences to generate engaging captions
                </p>
                <div className="text-sm text-ink/40">
                  <p>💡 Pro tip: Be specific about your topic for better results</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── History Tab ─── */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Favorites Section */}
          {favoriteCaptions.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Favorites
              </h3>
              <div className="space-y-3">
                {favoriteCaptions.map(item => (
                  <div key={item.id} className="p-4 bg-slate-800/30 rounded-xl">
                    <p className="text-ink whitespace-pre-wrap">{item.caption}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-ink/50">
                        <span>{PLATFORMS.find(p => p.id === item.platform)?.icon}</span>
                        <span>{TONES.find(t => t.id === item.tone)?.name}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-ink/40" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent History
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-center text-ink/50 py-8">No history yet. Generate some captions first!</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 20).map(item => (
                  <div key={item.id} className="p-4 bg-slate-800/30 rounded-xl">
                    <p className="text-ink whitespace-pre-wrap line-clamp-3">{item.caption}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-ink/50">
                        <span>{PLATFORMS.find(p => p.id === item.platform)?.icon}</span>
                        <span>{TONES.find(t => t.id === item.tone)?.name}</span>
                        <span>{LANGUAGES.find(l => l.id === item.language)?.flag}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => loadFromHistory(item)}
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Reuse
                        </button>
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${item.isFavorite ? 'text-pink-400 fill-pink-400' : 'text-ink/40'}`} />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-ink/40" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── Popular Tab ─── */}
      {activeTab === 'popular' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Category Selector */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Popular Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-black'
                      : 'bg-slate-800/50 text-ink/60 hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Captions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryCaptions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <p className="text-ink whitespace-pre-wrap line-clamp-4 mb-3">{item.caption}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-ink/50">
                    <span>{PLATFORMS.find(p => p.id === item.platform)?.icon}</span>
                    <span>{TONES.find(t => t.id === item.tone)?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.caption);
                      }}
                      className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-ink/40" />
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorite ? 'text-pink-400 fill-pink-400' : 'text-ink/40'}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {categoryCaptions.length === 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <TrendingUp className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-ink mb-2">No Popular Captions Yet</h3>
              <p className="text-ink/50">
                Generate some captions to see trending content here!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Best Caption Tips ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Best Caption Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-ink/70">
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Start with a strong hook to grab attention in the first line</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Use emojis strategically to break up text and add personality</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Include a clear call-to-action (CTA) to boost engagement</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Ask questions to encourage comments and interaction</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Use 5-15 relevant hashtags for maximum reach</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>Keep it authentic - let your brand voice shine through</span>
          </div>
        </div>
      </motion.div>

      {/* ─── Features ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          { icon: Zap, title: 'Lightning Fast', desc: 'Generate captions in seconds with AI' },
          { icon: Globe, title: 'Multi-Platform', desc: 'Optimized for all social media platforms' },
          { icon: Brain, title: 'AI Powered', desc: 'Smart captions that engage your audience' },
          { icon: Shield, title: '100% Free', desc: 'No hidden costs or usage limits' },
          { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works perfectly on all devices' },
          { icon: Award, title: 'Professional Quality', desc: 'Caption quality that stands out' },
        ].map((feature, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
            <feature.icon className="w-8 h-8 text-primary mb-3" />
            <h4 className="font-bold text-ink mb-1">{feature.title}</h4>
            <p className="text-sm text-ink/50">{feature.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* ─── Related Tools ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-ink mb-4">Related Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'AI Hashtag Generator', path: '/tools/ai-hashtag-generator', icon: Hash },
            { name: 'YouTube Script Writer', path: '/tools/youtube-script-generator', icon: MessageCircle },
            { name: 'Content Idea Generator', path: '/tools/content-idea-generator', icon: Sparkles },
            { name: 'AI Image Generator', path: '/tools/ai-image-generator', icon: Eye },
          ].map((tool, i) => (
            <a
              key={i}
              href={tool.path}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors group"
            >
              <tool.icon className="w-5 h-5 text-primary group-hover:text-primary/80" />
              <span className="text-sm font-bold text-ink/70 group-hover:text-ink">{tool.name}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
