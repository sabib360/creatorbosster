import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, RefreshCw, Heart, Globe, MessageCircle,
  BookOpen, TrendingUp, Trash2, Clock, Star, ChevronDown, ChevronUp,
  Zap, Shield, Smartphone, Brain, Award, Eye, Share2, Hash
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

/* ─── Types ──────────────────────────────────────────── */

type Tone = 'sad' | 'love' | 'funny' | 'attitude' | 'romantic' | 'motivational' | 'emotional' | 'eid' | 'birthday';
type CaptionLength = 'short' | 'medium' | 'long';
type CaptionCount = 3 | 5 | 10;

interface Caption {
  id: string;
  content: string;
  characterCount: number;
  estimatedEngagement: string;
}

interface HistoryItem {
  id: string;
  caption: string;
  tone: Tone;
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

const TONES: { id: Tone; name: string; nameBn: string; emoji: string }[] = [
  { id: 'sad', name: 'Sad', nameBn: 'দুঃখ', emoji: '😢' },
  { id: 'love', name: 'Love', nameBn: 'ভালোবাসা', emoji: '💕' },
  { id: 'funny', name: 'Funny', nameBn: 'মজার', emoji: '😂' },
  { id: 'attitude', name: 'Attitude', nameBn: 'স্টাইল', emoji: '😎' },
  { id: 'romantic', name: 'Romantic', nameBn: 'রোমান্টিক', emoji: '❤️' },
  { id: 'motivational', name: 'Motivational', nameBn: 'অনুপ্রেরণামূলক', emoji: '🔥' },
  { id: 'emotional', name: 'Emotional', nameBn: 'আবেগময়', emoji: '💜' },
  { id: 'eid', name: 'Eid Special', nameBn: 'ঈদ বিশেষ', emoji: '🌙' },
  { id: 'birthday', name: 'Birthday', nameBn: 'জন্মদিন', emoji: '🎂' },
];

const CAPTION_COUNTS: { value: CaptionCount; label: string }[] = [
  { value: 3, label: '3টি' },
  { value: 5, label: '5টি' },
  { value: 10, label: '10টি' },
];

const CAPTION_LENGTHS: { id: CaptionLength; name: string; nameBn: string; description: string }[] = [
  { id: 'short', name: 'Short', nameBn: 'ছোট', description: '১০০ অক্ষরের কম' },
  { id: 'medium', name: 'Medium', nameBn: 'মাঝারি', description: '১০০-২০০ অক্ষর' },
  { id: 'long', name: 'Long', nameBn: 'লম্বা', description: '২০০+ অক্ষর' },
];

const TRENDING_CATEGORIES = [
  { id: 'love', name: 'Love Caption', nameBn: 'ভালোবাসা', emoji: '💕' },
  { id: 'sad', name: 'Sad Caption', nameBn: 'দুঃখ', emoji: '😢' },
  { id: 'attitude', name: 'Attitude Caption', nameBn: 'স্টাইল', emoji: '😎' },
  { id: 'friendship', name: 'Friendship Caption', nameBn: 'বন্ধুত্ব', emoji: '🤝' },
  { id: 'eid', name: 'Eid Caption', nameBn: 'ঈদ', emoji: '🌙' },
  { id: 'birthday', name: 'Birthday Caption', nameBn: 'জন্মদিন', emoji: '🎂' },
  { id: 'funny', name: 'Funny Caption', nameBn: 'মজার', emoji: '😂' },
  { id: 'romantic', name: 'Romantic Caption', nameBn: 'রোমান্টিক', emoji: '❤️' },
];

const EXAMPLE_TOPICS = [
  { topic: 'বৃষ্টির দিনে চায়ের সাথে বই পড়া', tone: 'emotional' as Tone },
  { topic: 'ঈদের নামাজের পর পরিবারের সাথে বেড়াতে যাওয়া', tone: 'eid' as Tone },
  { topic: 'প্রিয়জনের জন্মদিনে শুভেচ্ছা', tone: 'birthday' as Tone },
  { topic: 'বন্ধুদের সাথে হাসিখুশি মুহূর্ত', tone: 'funny' as Tone },
  { topic: 'সকালে ঘুম থেকে উঠে জিমে যাওয়া', tone: 'motivational' as Tone },
  { topic: 'পুরানো ছবি দেখে স্মৃতি তাজা করা', tone: 'sad' as Tone },
];

const HISTORY_KEY = 'bangla-caption-history';

/* ─── AI Generation ──────────────────────────────────── */

async function generateBanglaCaptions(
  topic: string,
  tone: Tone,
  count: CaptionCount,
  length: CaptionLength,
  includeEmojis: boolean,
  keywords: string
): Promise<{ captions: Caption[]; trending: PopularCaption[] }> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const toneGuide = {
    sad: 'দুঃখের এবং আবেগময় টোনে লিখুন। হৃদয়স্পর্শী ও অনুভূতিময় হোক।',
    love: 'ভালোবাসার গভীর অনুভূতি প্রকাশ করুন। সুন্দর ও মধুর ভাষায় লিখুন।',
    funny: 'মজার ও হাস্যকর ভাষায় লিখুন। পাঠককে হাসানোর চেষ্টা করুন।',
    attitude: 'আত্মবিশ্বাসী ও স্টাইলিশ ভাষায় লিখুন। শক্তিশালী ও প্রভাবশালী হোক।',
    romantic: 'রোমান্টিক ও প্রেমময় ভাষায় লিখুন। হৃদয়ে ছোঁয়ার মতো হোক।',
    motivational: 'অনুপ্রেরণামূলক ও শক্তিদায়ক ভাষায় লিখুন। পাঠককে এগিয়ে যেতে উদ্বুদ্ধ করুন।',
    emotional: 'আবেগময় ও হৃদয়স্পর্শী ভাষায় লিখুন। গভীর অনুভূতি প্রকাশ করুন।',
    eid: 'ঈদের শুভেচ্ছা ও আনন্দ প্রকাশ করুন। ধর্মীয় ও সাংস্কৃতিক প্রেক্ষাপটে লিখুন।',
    birthday: 'জন্মদিনের শুভেচ্ছা ও দোয়া প্রকাশ করুন। আনন্দময় ও হৃদয়গ্রাহী হোক।',
  };

  const lengthGuide = length === 'short'
    ? 'প্রতিটি ক্যাপশন ১০০ অক্ষরের কম রাখুন। সংক্ষিপ্ত ও প্রভাবশালী হোক।'
    : length === 'medium'
    ? 'প্রতিটি ক্যাপশন ১০০-২০০ অক্ষরের মধ্যে রাখুন। বিস্তারিত ও আকর্ষণীয় হোক।'
    : 'প্রতিটি ক্যাপশন ২০০+ অক্ষরের হোক। গল্পের মতো বিস্তারিত ও আবেগময় হোক।';

  const emojiGuide = includeEmojis
    ? 'প্রাসঙ্গিক ইমোজি স্বাভাবিকভাবে ব্যবহার করুন।'
    : 'কোনো ইমোজি ব্যবহার করবেন না।';

  const keywordGuide = keywords ? `এই কীওয়ার্ডগুলো স্বাভাবিকভাবে অন্তর্ভুক্ত করুন: ${keywords}` : '';

  const prompt = `আপনি একজন দক্ষ বাংলা কন্টেন্ট রাইটার। নিচের বিষয়ে ${count}টি সুন্দর ও আকর্ষণীয় বাংলা ক্যাপশন তৈরি করুন।

বিষয়: "${topic}"
টোন: ${toneGuide[tone]}
দৈর্ঘ্য: ${lengthGuide}
${emojiGuide}
${keywordGuide}

গুরুত্বপূর্ণ নিয়ম:
- প্রতিটি ক্যাপশন অনন্য ও আকর্ষণীয় হতে হবে
- স্বাভাবিক বাংলা ভাষায় লিখুন - যেন কোনো মানুষ লিখেছে
- মেশিন ট্রান্সলেশনের মতো না হয়ে স্বাভাবিক গল্পের মতো হোক
- সোশ্যাল মিডিয়ায় শেয়ার করার উপযোগী হোক
- সাধারণ মানুষের ভাষায় লিখুন
- প্রতিটি ক্যাপশনে একটি শক্তিশালী হুক থাকতে হবে

JSON ফরম্যাটে রিটার্ন করুন:
{
  "captions": [
    {
      "content": "ক্যাপশন টেক্সট",
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
                estimatedEngagement: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
  });

  const result = JSON.parse(response.text || '{"captions":[]}');

  const captions: Caption[] = result.captions.map((c: { content: string; estimatedEngagement: string }) => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content: c.content,
    characterCount: c.content.length,
    estimatedEngagement: c.estimatedEngagement || 'Medium',
  }));

  // Generate trending captions
  const trendingPrompt = `বাংলা সোশ্যাল মিডিয়ায় জনপ্রিয় ৫টি ক্যাপশন তৈরি করুন। বিভিন্ন ক্যাটাগরি থেকে দিন। প্রতিটি ক্যাপশন আকর্ষণীয় ও ভাইরাল হওয়া উচিত।

JSON ফরম্যাটে রিটার্ন করুন:
{
  "trending": [
    {
      "caption": "ক্যাপশন টেক্সট",
      "category": "ক্যাটাগরি নাম",
      "likes": 5000
    }
  ]
}`;

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

export default function BanglaCaptionGenerator() {
  // Form State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('love');
  const [captionCount, setCaptionCount] = useState<CaptionCount>(5);
  const [captionLength, setCaptionLength] = useState<CaptionLength>('medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
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
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'trending'>('generate');
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
      setError('অনুগ্রহ করে একটি বিষয় বা বর্ণনা লিখুন');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCaptions([]);
    setTrendingCaptions([]);

    try {
      const result = await generateBanglaCaptions(
        topic, tone, captionCount, captionLength, includeEmojis, keywords
      );

      setGeneratedCaptions(result.captions);
      setTrendingCaptions(result.trending);

      // Save to history
      const historyItems: HistoryItem[] = result.captions.map(c => ({
        id: c.id,
        caption: c.content,
        tone,
        date: Date.now(),
        isFavorite: false,
      }));
      saveHistory([...historyItems, ...history].slice(0, 50));
    } catch (err) {
      setError('ক্যাপশন তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy caption
  const copyCaption = async (caption: Caption) => {
    await navigator.clipboard.writeText(caption.content);
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

  // Get favorite captions
  const favoriteCaptions = history.filter(item => item.isFavorite);

  // Get history for current category
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
          <span className="text-sm font-semibold text-primary">AI পাওয়ার্ড</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          বাংলা ক্যাপশন জেনারেটর
        </h1>
        <p className="text-lg text-ink/60 max-w-2xl mx-auto">
          AI দিয়ে সুন্দর ও ভাইরাল Bangla caption তৈরি করুন। Facebook, Instagram, TikTok এবং YouTube এর জন্য।
        </p>
      </motion.div>

      {/* ─── Tab Navigation ─── */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'generate' as const, label: 'তৈরি করুন', icon: Sparkles },
          { id: 'history' as const, label: 'ইতিহাস', icon: Clock },
          { id: 'trending' as const, label: 'ট্রেন্ডিং', icon: TrendingUp },
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
                বিষয় / বর্ণনা
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink placeholder-ink/40 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="আপনার পোস্ট সম্পর্কে লিখুন... (যেমন: বৃষ্টির দিনে চায়ের সাথে বই পড়া, ঈদের শুভেচ্ছা, প্রিয়জনের জন্মদিন)"
              />
              <div className="mt-2 text-xs text-ink/40">
                {topic.length}/৫০০ অক্ষর
              </div>

              {/* Example Topics */}
              <div className="mt-3 space-y-2">
                <p className="text-xs text-ink/50 font-medium">উদাহরণ:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TOPICS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => { setTopic(ex.topic); setTone(ex.tone); }}
                      className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-xs text-ink/60 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      {ex.topic.substring(0, 20)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3 flex items-center gap-2">
                <span className="text-lg">🎨</span>
                টোন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                      tone === t.id
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-primary/30'
                    }`}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span className="text-xs">{t.nameBn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Caption Count */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3">কতগুলো ক্যাপশন চান?</label>
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <label className="block text-sm font-bold text-ink mb-3">ক্যাপশনের দৈর্ঘ্য</label>
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
                    {l.nameBn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Options & Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Options */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-ink/70">ইমোজি যোগ করুন</span>
                </label>
              </div>

              {/* Keywords Input */}
              <div className="mt-4">
                <label className="block textং font-bold text-ink mb-2">কীওয়ার্ড (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="ভালোবাসা, বন্ধুত্ব, ঈদ, জন্মদিন"
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
                  ক্যাপশন তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  ক্যাপশন তৈরি করুন
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
                    তৈরি করা ক্যাপশন
                  </h3>
                  <span className="text-sm text-ink/50">{generatedCaptions.length}টি ক্যাপশন</span>
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
                          <div className="flex items-center gap-4 mt-3 text-xs text-ink/50">
                            <span>{caption.characterCount} অক্ষর</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {caption.estimatedEngagement === 'High' ? 'বেশি' : caption.estimatedEngagement === 'Medium' ? 'মাঝারি' : 'কম'} এনগেজমেন্ট
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
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
                          <button
                            onClick={() => {
                              const text = encodeURIComponent(caption.content);
                              window.open(`https://www.facebook.com/sharer/sharer.php?quote=${text}`, '_blank');
                            }}
                            className="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
                          >
                            <Share2 className="w-5 h-5 text-ink/40" />
                          </button>
                        </div>
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
                    ট্রেন্ডিং ক্যাপশন
                  </h3>
                  <button
                    onClick={() => setShowTrending(false)}
                    className="text-ink/40 hover:text-ink"
                  >
                    <span className="text-xs">লুকান</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {trendingCaptions.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-lg">{TRENDING_CATEGORIES.find(c => c.id === item.category.toLowerCase())?.emoji || '🔥'}</span>
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
                <h3 className="text-xl font-bold text-ink mb-2">আপনার ক্যাপশন তৈরি হচ্ছে</h3>
                <p className="text-ink/50">AI আপনার জন্য সেরা ক্যাপশন লিখছে...</p>
              </div>
            )}

            {/* Empty State */}
            {generatedCaptions.length === 0 && !isGenerating && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <MessageCircle className="w-16 h-16 text-ink/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-ink mb-2">তৈরি করতে প্রস্তুত?</h3>
                <p className="text-ink/50 mb-4">
                  একটি বিষয় লিখুন এবং আপনার পছন্দের সেটিংস নির্বাচন করুন
                </p>
                <div className="text-sm text-ink/40">
                  <p>💡 টিপস: ভালো ফলাফলের জন্য বিষয়টি বিস্তারিত লিখুন</p>
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
                পছন্দের ক্যাপশন
              </h3>
              <div className="space-y-3">
                {favoriteCaptions.map(item => (
                  <div key={item.id} className="p-4 bg-slate-800/30 rounded-xl">
                    <p className="text-ink whitespace-pre-wrap">{item.caption}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-ink/50">
                        <span>{TONES.find(t => t.id === item.tone)?.emoji}</span>
                        <span>{TONES.find(t => t.id === item.tone)?.nameBn}</span>
                        <span>{new Date(item.date).toLocaleDateString('bn-BD')}</span>
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
                সাম্প্রতিক ইতিহাস
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  সব মুছুন
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-center text-ink/50 py-8">এখনো কোনো ইতিহাস নেই। প্রথমে কিছু ক্যাপশন তৈরি করুন!</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 20).map(item => (
                  <div key={item.id} className="p-4 bg-slate-800/30 rounded-xl">
                    <p className="text-ink whitespace-pre-wrap line-clamp-3">{item.caption}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-ink/50">
                        <span>{TONES.find(t => t.id === item.tone)?.emoji}</span>
                        <span>{TONES.find(t => t.id === item.tone)?.nameBn}</span>
                        <span>{new Date(item.date).toLocaleDateString('bn-BD')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTopic(item.caption.split('\n')[0].substring(0, 100));
                            setTone(item.tone);
                            setActiveTab('generate');
                          }}
                          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          পুনরায় ব্যবহার
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

      {/* ─── Trending Tab ─── */}
      {activeTab === 'trending' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Category Selector */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              জনপ্রিয় ক্যাটাগরি
            </h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_CATEGORIES.map(cat => (
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
                  <span>{cat.nameBn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Captions Grid */}
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
                    <span>{TONES.find(t => t.id === item.tone)?.emoji}</span>
                    <span>{TONES.find(t => t.id === item.tone)?.nameBn}</span>
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
              <h3 className="text-xl font-bold text-ink mb-2">এখনো কোনো জনপ্রিয় ক্যাপশন নেই</h3>
              <p className="text-ink/50">
                কিছু ক্যাপশন তৈরি করুন এবং এখানে দেখুন!
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Best Bangla Caption Ideas ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          সেরা বাংলা ক্যাপশন আইডিয়া
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-ink/70">
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>শুরুতেই একটি শক্তিশালী হুক দিন</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>ইমোজি ব্যবহার করুন টেক্সট ভাঙতে এবং মেজাজ যোগ করতে</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>প্রশ্ন করুন যাতে কমেন্ট বাড়ে</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>স্থানীয় ভাষা ও সংস্কৃতি ব্যবহার করুন</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>হ্যাশট্যাগ ব্যবহার করুন বেশি রিচের জন্য</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span>আসল হন - আপনার ব্র্যান্ডের কণ্ঠস্বর দেখান</span>
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
          { icon: Zap, title: 'দ্রুততম', desc: 'সেকেন্ডের মধ্যে ক্যাপশন তৈরি করুন' },
          { icon: Globe, title: 'বহু প্ল্যাটফর্ম', desc: 'Facebook, Instagram, TikTok, YouTube' },
          { icon: Brain, title: 'AI পাওয়ার্ড', desc: 'স্মার্ট AI যা স্বাভাবিক বাংলা লেখে' },
          { icon: Shield, title: '১০০% বিনামূল্যে', desc: 'কোনো লুকানো খরচ নেই' },
          { icon: Smartphone, title: 'মোবাইল ফ্রেন্ডলি', desc: 'সব ডিভাইসে পারফেক্ট' },
          { icon: Award, title: 'প্রফেশনাল মান', desc: 'মানসম্মত ক্যাপশন যা আলাদা হয়' },
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
        <h3 className="text-lg font-bold text-ink mb-4">সম্পর্কিত টুলস</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'AI Caption Generator', path: '/tools/ai-caption-generator', icon: MessageCircle },
            { name: 'Hashtag Generator', path: '/tools/hashtag-generator', icon: Hash },
            { name: 'Content Idea Generator', path: '/tools/content-idea-generator', icon: Sparkles },
            { name: 'Social Media Post Generator', path: '/tools/social-post-generator', icon: Globe },
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
