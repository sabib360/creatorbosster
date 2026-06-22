import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Download, Copy, Check, Share2, RefreshCw, AlertCircle,
  Palette, Wand2, ChevronDown, ChevronUp, Maximize2, X, Trash2,
  Heart, Eye, Clock, BookOpen, Zap, Shield, Smartphone, Brain,
  ArrowRight, Link2, Facebook, Twitter, ImageIcon, Settings,
  TrendingUp, Star, Users, Image, Globe, Type, Sliders,
  Rocket, Target, Award, MessageCircle, Layers, Hash, BarChart3
} from 'lucide-react';
import { generateThumbnailImages, enhanceImagePrompt } from '../../lib/gemini';

/* ═══════════ TYPES ═══════════ */

type ImageStyle = 'realistic' | 'anime' | 'cartoon' | '3d' | 'cinematic' | 'fantasy' | 'pixel-art' | 'watercolor';
type AspectRatio = '1:1' | '16:9' | '9:16' | '3:2';
type Quality = 'standard' | 'hd' | 'ultra';
type ProviderId = 'gemini' | 'huggingface' | 'replicate' | 'openai' | 'stability';

interface Provider {
  id: ProviderId;
  name: string;
  description: string;
  requiresKey: boolean;
  free: boolean;
  models: string[];
}

interface GeneratedImage {
  id: string;
  dataUrl: string;
  prompt: string;
  negativePrompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  provider: ProviderId;
  timestamp: number;
}

interface HistoryEntry {
  id: string;
  prompt: string;
  style: ImageStyle;
  aspectRatio: AspectRatio;
  imageUrl: string;
  timestamp: number;
}

interface CommunityImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style: ImageStyle;
  likes: number;
  views: number;
  timestamp: number;
  author: string;
}

/* ═══════════ CONSTANTS ═══════════ */

const PROVIDERS: Provider[] = [
  { id: 'gemini', name: 'Google Gemini', description: 'Fast, high-quality AI images', requiresKey: false, free: true, models: ['gemini-2.5-flash-image'] },
  { id: 'huggingface', name: 'Hugging Face', description: 'Open source models', requiresKey: true, free: true, models: ['stable-diffusion-xl', 'stable-diffusion-3'] },
  { id: 'replicate', name: 'Replicate', description: 'Multiple AI models', requiresKey: true, free: false, models: ['sdxl', 'flux-schnell'] },
  { id: 'openai', name: 'OpenAI DALL·E', description: 'DALL·E 3 generation', requiresKey: true, free: false, models: ['dall-e-3'] },
  { id: 'stability', name: 'Stability AI', description: 'Stable Diffusion models', requiresKey: true, free: false, models: ['stable-diffusion-3', 'sdxl'] },
];

const STYLES: { value: ImageStyle; label: string; icon: string; desc: string }[] = [
  { value: 'realistic', label: 'Realistic', icon: '📷', desc: 'Photorealistic images' },
  { value: 'anime', label: 'Anime', icon: '🎌', desc: 'Japanese animation style' },
  { value: 'cartoon', label: 'Cartoon', icon: '🎨', desc: 'Fun cartoon illustrations' },
  { value: '3d', label: '3D Render', icon: '🧊', desc: '3D rendered images' },
  { value: 'cinematic', label: 'Cinematic', icon: '🎬', desc: 'Movie-like scenes' },
  { value: 'fantasy', label: 'Fantasy', icon: '🧙', desc: 'Magical fantasy worlds' },
  { value: 'pixel-art', label: 'Pixel Art', icon: '👾', desc: 'Retro pixel art style' },
  { value: 'watercolor', label: 'Watercolor', icon: '🖌️', desc: 'Watercolor paintings' },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; desc: string }[] = [
  { value: '1:1', label: '1:1', desc: 'Square' },
  { value: '16:9', label: '16:9', desc: 'Widescreen' },
  { value: '9:16', label: '9:16', desc: 'Portrait' },
  { value: '3:2', label: '3:2', desc: 'Classic' },
];

const EXAMPLE_PROMPTS = [
  'A majestic mountain landscape at golden hour with a crystal clear lake',
  'Futuristic cyberpunk city with neon lights and flying cars',
  'A cozy coffee shop interior with warm lighting and plants',
  'An astronaut floating in space with Earth in the background',
  'A magical forest with glowing mushrooms and fairy lights',
  'Underwater coral reef with colorful tropical fish',
];

const TRENDING_PROMPTS = [
  { prompt: 'A steampunk robot reading a book in a Victorian library', style: '3d' as ImageStyle },
  { prompt: 'A mystical dragon perched on a crystal mountain peak', style: 'fantasy' as ImageStyle },
  { prompt: 'Tokyo street at night with cherry blossoms and neon signs', style: 'cinematic' as ImageStyle },
  { prompt: 'A cute cat wearing a tiny astronaut helmet on the moon', style: 'cartoon' as ImageStyle },
  { prompt: 'Ancient ruins overgrown with tropical plants and waterfalls', style: 'realistic' as ImageStyle },
];

const PROMPT_CATEGORIES = [
  { name: 'Anime', icon: '🎌', prompts: ['Anime girl with flowing silver hair standing in a field of stars', 'Chibi characters having a picnic in a magical garden', 'A samurai standing under cherry blossoms at sunset', 'Mech pilot standing next to their giant robot in a hangar'] },
  { name: 'Realistic', icon: '📷', prompts: ['A professional portrait of a person in natural golden hour light', 'A sleek modern kitchen with marble countertops and natural light', 'A vintage car parked on a scenic coastal road at sunset', 'A wildlife photograph of a majestic eagle soaring over mountains'] },
  { name: 'Nature', icon: '🌿', prompts: ['A serene Japanese zen garden with a koi pond and bamboo', 'Northern lights dancing over a snowy mountain landscape', 'A tropical waterfall cascading into a turquoise lagoon', 'A vast lavender field stretching to the horizon under purple sky'] },
  { name: 'Fantasy', icon: '🧙', prompts: ['A wizard casting a spell with glowing runes in a dark tower', 'An enchanted floating island with waterfalls and magical creatures', 'A phoenix rising from magical flames in an ancient temple', 'An armored knight facing a dragon in a volcanic landscape'] },
  { name: 'YouTube', icon: '📺', prompts: ['Shocked face reaction with dramatic red background and bold text area', 'Before and after transformation with split-screen dramatic lighting', 'Top 10 countdown style with numbers and exciting burst effects', 'Epic comparison split screen with VS symbol and fire effects'] },
  { name: 'Product', icon: '🛍️', prompts: ['Sleek wireless headphones floating on a clean white background', 'Artisan perfume bottle on a marble surface with flower petals', 'Premium smartwatch displayed on a minimalist wooden stand', 'Modern sneakers suspended in air with dynamic lighting effects'] },
];

const CONTENT_FAQS = [
  { q: 'What is an AI Image Generator?', a: 'An AI Image Generator is a tool that uses artificial intelligence to create images from text descriptions. You type a prompt describing what you want, and the AI generates a unique image matching your description in seconds.' },
  { q: 'Is this AI Image Generator free to use?', a: 'Yes! Our AI Image Generator is completely free. You can generate unlimited images without any cost. We use Google Gemini which provides free image generation.' },
  { q: 'How does the AI Image Generator work?', a: 'Our tool uses advanced AI models like Google Gemini and Stable Diffusion. When you enter a text prompt, the AI analyzes the description and generates a unique image based on your input, style preference, and aspect ratio.' },
  { q: 'Can I use generated images commercially?', a: 'Yes, you own the output created using our tools. You are free to use the results for personal or commercial purposes including social media posts, YouTube thumbnails, blog posts, and marketing materials.' },
  { q: 'What makes a good image prompt?', a: 'Be specific and descriptive. Include details about the subject, environment, lighting, colors, mood, and style. For example, instead of "a cat," try "a fluffy orange tabby cat sitting on a sunlit windowsill with soft bokeh background."' },
  { q: 'What is a negative prompt?', a: 'A negative prompt tells the AI what to avoid in the generated image. For example, adding "blurry, low quality, distorted" helps the AI produce cleaner, higher-quality results by excluding unwanted elements.' },
  { q: 'How many images can I generate at once?', a: 'You can choose to generate 1, 2, or 4 images at once. Generating multiple variations gives you more options to choose from and find the perfect result.' },
  { q: 'Which style should I choose?', a: 'Choose a style that matches your needs: Realistic for photos, Anime for Japanese art, Cartoon for fun illustrations, 3D Render for modern graphics, Cinematic for movie-like scenes, Fantasy for magical worlds, Pixel Art for retro gaming style, and Watercolor for artistic paintings.' },
  { q: 'Can I regenerate images if I am not satisfied?', a: 'Absolutely! You can click the Regenerate button to create new variations with the same settings, or modify your prompt and settings to try different approaches until you get the perfect result.' },
  { q: 'What AI providers are supported?', a: 'Our tool supports multiple AI providers including Google Gemini (free), Hugging Face (free with API key), Replicate, OpenAI DALL·E 3, and Stability AI. You can switch between providers based on your needs and availability.' },
  { q: 'How do I use trending prompts?', a: 'Simply click on any trending prompt to load it into the generator. You can then customize it further by changing the style, aspect ratio, or modifying the prompt text before generating your image.' },
  { q: 'What aspect ratio should I use?', a: 'Choose based on your use case: 1:1 for social media posts and profile pictures, 16:9 for YouTube thumbnails and banners, 9:16 for Instagram Stories and mobile wallpapers, and 3:2 for classic photo prints.' },
];

const MOCK_COMMUNITY: CommunityImage[] = [
  { id: 'c1', prompt: 'A majestic dragon perched on a crystal mountain peak, fantasy art', imageUrl: '', style: 'fantasy', likes: 342, views: 1205, timestamp: Date.now() - 86400000, author: 'ArtLover42' },
  { id: 'c2', prompt: 'Cyberpunk city at night with neon reflections on wet streets', imageUrl: '', style: 'cinematic', likes: 287, views: 980, timestamp: Date.now() - 172800000, author: 'NeonDreamer' },
  { id: 'c3', prompt: 'Cute anime girl sitting under a cherry blossom tree', imageUrl: '', style: 'anime', likes: 456, views: 2100, timestamp: Date.now() - 259200000, author: 'SakuraArtist' },
  { id: 'c4', prompt: 'Steampunk airship floating above Victorian London', imageUrl: '', style: '3d', likes: 198, views: 756, timestamp: Date.now() - 345600000, author: 'GearMaster' },
  { id: 'c5', prompt: 'Magical underwater kingdom with bioluminescent coral', imageUrl: '', style: 'fantasy', likes: 523, views: 1890, timestamp: Date.now() - 432000000, author: 'DeepSeaArtist' },
  { id: 'c6', prompt: 'Pixel art medieval tavern scene with warm lighting', imageUrl: '', style: 'pixel-art', likes: 167, views: 534, timestamp: Date.now() - 518400000, author: 'PixelMaster' },
];

/* ═══════════ UTILITY FUNCTIONS ═══════════ */

const getHistory = (): HistoryEntry[] => {
  try { return JSON.parse(localStorage.getItem('ai-image-history') || '[]'); } catch { return []; }
};

const saveHistory = (history: HistoryEntry[]) => {
  localStorage.setItem('ai-image-history', JSON.stringify(history.slice(0, 50)));
};

const addToHistory = (entry: HistoryEntry) => {
  const history = getHistory();
  saveHistory([entry, ...history]);
};

const deleteHistoryItem = (id: string) => {
  const history = getHistory().filter(h => h.id !== id);
  saveHistory(history);
};

const clearHistory = () => { localStorage.removeItem('ai-image-history'); };

const getProviderKeys = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem('ai-image-provider-keys') || '{}'); } catch { return {}; }
};

const saveProviderKeys = (keys: Record<string, string>) => {
  localStorage.setItem('ai-image-provider-keys', JSON.stringify(keys));
};

/* ═══════════ SHARED COMPONENTS ═══════════ */

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

function SectionBadge({ icon: Icon, text, color = 'text-brand-400' }: { icon: React.FC<{ className?: string }>; text: string; color?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[11px] font-bold uppercase tracking-widest mb-4", color)}>
      <Icon className="w-3 h-3" /> {text}
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl sm:text-3xl font-display font-black tracking-tight text-white", className)}>
      {children}
    </h2>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */

export default function AIImageGenerator() {
  /* ── Generation State ── */
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('realistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<Quality>('standard');
  const [imageCount, setImageCount] = useState<1 | 2 | 4>(1);
  const [creativity, setCreativity] = useState(50);
  const [provider, setProvider] = useState<ProviderId>('gemini');
  const [providerKeys, setProviderKeys] = useState<Record<string, string>>(getProviderKeys);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  /* ── UI State ── */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showProviderSettings, setShowProviderSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'gallery'>('generate');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());
  const [activeCategory, setActiveCategory] = useState(0);
  const [showPromptLibrary, setShowPromptLibrary] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [generatingProgress, setGeneratingProgress] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /* ── Progress Simulation ── */
  useEffect(() => {
    if (!isGenerating) { setGeneratingProgress(0); return; }
    const interval = setInterval(() => {
      setGeneratingProgress(prev => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 15;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  /* ── Actions ── */

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const r = await enhanceImagePrompt(prompt, style);
      setEnhancedPrompt(r.enhanced);
      setSuggestions(r.suggestions);
    } catch { /* silent */ } finally { setIsEnhancing(false); }
  };

  const handleGenerate = async () => {
    const text = enhancedPrompt || prompt;
    if (!text.trim()) { setError('Please enter a prompt describing the image you want to create.'); return; }
    setIsGenerating(true); setError(null); setGeneratedImages([]);
    try {
      const fullPrompt = `${text}, ${style} style, high quality, detailed${negativePrompt ? `, avoid: ${negativePrompt}` : ''}`;
      const result = await generateThumbnailImages(fullPrompt, imageCount);
      setGeneratingProgress(100);
      const newImages: GeneratedImage[] = result.map((dataUrl, i) => ({
        id: `img-${Date.now()}-${i}`,
        dataUrl,
        prompt: text,
        negativePrompt,
        style,
        aspectRatio,
        provider,
        timestamp: Date.now(),
      }));
      setGeneratedImages(newImages);
      addToHistory({
        id: `hist-${Date.now()}`,
        prompt: text,
        style,
        aspectRatio,
        imageUrl: result[0],
        timestamp: Date.now(),
      });
      setHistory(getHistory());
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate images. Check your API key and try again.');
    } finally { setIsGenerating(false); }
  };

  const handleDownload = (dataUrl: string, idx: number) => {
    const a = document.createElement('a'); a.href = dataUrl; a.download = `ai-image-${Date.now()}-${idx + 1}.png`; a.click();
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleShareImage = (dataUrl: string) => {
    if (navigator.share) {
      fetch(dataUrl).then(r => r.blob()).then(blob => {
        const file = new File([blob], 'ai-image.png', { type: 'image/png' });
        navigator.share({ title: 'Check out this AI-generated image!', files: [file] }).catch(() => {});
      });
    }
  };

  const handleLike = (id: string) => {
    setLikedImages(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const saveApiKey = (key: string) => {
    const newKeys = { ...providerKeys, [provider]: key };
    setProviderKeys(newKeys);
    saveProviderKeys(newKeys);
  };

  const selectExample = (ex: string) => {
    setPrompt(ex);
    setEnhancedPrompt(null);
    setSuggestions([]);
    textareaRef.current?.focus();
  };

  const selectTrending = (t: { prompt: string; style: ImageStyle }) => {
    setPrompt(t.prompt);
    setStyle(t.style);
    setEnhancedPrompt(null);
    setSuggestions([]);
  };

  const deleteHistoryItemLocal = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  /* ── Render ── */

  return (
    <div className="space-y-8">

      {/* ═══════════ SECTION 1: PREMIUM HERO ═══════════ */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20"
        >
          <ImageIcon className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tighter text-white">
          AI Image Generator
        </h1>
        <p className="text-white/50 max-w-2xl mx-auto text-sm sm:text-base">
          Transform ideas into stunning AI-generated images. Free, fast, and no signup required.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-2.5 h-2.5" /> Trending
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Star className="w-2.5 h-2.5" /> Popular
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-2.5 h-2.5" /> Free
          </span>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-1.5"><Image className="w-3 h-3 text-purple-400" /> 15K+ Images Today</span>
          <span className="flex items-center gap-1.5"><Palette className="w-3 h-3 text-cyan-400" /> 8 Popular Styles</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-amber-400" /> ~3s Generation</span>
        </div>

        {/* Quick Example Prompts */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              onClick={() => selectExample(ex)}
              className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-full text-xs text-white/60 hover:text-white transition-colors truncate max-w-[200px]"
            >
              {ex.length > 35 ? ex.slice(0, 35) + '...' : ex}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════ SECTION 2: AI CREATION STUDIO ═══════════ */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left Panel: Prompt Controls ── */}
        <div className="flex-1 space-y-4 p-5 sm:p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl">

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            {([
              { id: 'generate' as const, label: 'Generate', icon: Sparkles },
              { id: 'history' as const, label: 'History', icon: Clock },
              { id: 'gallery' as const, label: 'Gallery', icon: Heart },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ═══════ GENERATE TAB ═══════ */}
          {activeTab === 'generate' && (
            <div className="space-y-5">
              {/* SECTION 3: Prompt Input System */}
              <div className="space-y-2">
                <label className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-400" />
                  Describe Your Image
                </label>
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); setEnhancedPrompt(null); setSuggestions([]); }}
                  placeholder="Describe the image you want to create..."
                  className="w-full h-28 px-4 py-3 bg-slate-900/80 border border-white/[0.08] rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500/50 transition-colors text-sm"
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/30">{prompt.length}/500</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setPrompt(''); setEnhancedPrompt(null); setSuggestions([]); }}
                      className="px-2 py-1 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-[10px] font-bold text-white/50 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleEnhance}
                      disabled={isEnhancing || !prompt.trim()}
                      className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] rounded-lg text-xs font-bold text-white/70 hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {isEnhancing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white/70" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      {isEnhancing ? 'Enhancing...' : 'Enhance'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Prompt */}
              <AnimatePresence>
                {enhancedPrompt && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl overflow-hidden"
                  >
                    <p className="text-[10px] text-purple-400 font-bold uppercase mb-1">Enhanced Prompt</p>
                    <p className="text-white/70 text-xs leading-relaxed">{enhancedPrompt}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-white/40 font-medium">Alternative prompts:</p>
                  <div className="space-y-1">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setPrompt(s); setEnhancedPrompt(null); setSuggestions([]); }}
                        className="w-full text-left p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] rounded-lg text-xs text-white/60 hover:text-white transition-colors leading-relaxed"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: Style Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STYLES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                        style === s.value
                          ? 'bg-brand-600 text-white border border-brand-500/30 shadow-lg shadow-brand-500/10'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="block mt-0.5">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Image Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5" /> Aspect Ratio
                  </label>
                  <div className="flex gap-2">
                    {ASPECT_RATIOS.map(r => (
                      <button
                        key={r.value}
                        onClick={() => setAspectRatio(r.value)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          aspectRatio === r.value
                            ? 'bg-brand-600 text-white border border-brand-500/30'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Image Count
                  </label>
                  <div className="flex gap-2">
                    {([1, 2, 4] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setImageCount(c)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          imageCount === c
                            ? 'bg-brand-600 text-white border border-brand-500/30'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quality & Creativity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Quality
                  </label>
                  <div className="flex gap-2">
                    {([
                      { value: 'standard' as const, label: 'Standard' },
                      { value: 'hd' as const, label: 'HD' },
                      { value: 'ultra' as const, label: 'Ultra HD' },
                    ]).map(q => (
                      <button
                        key={q.value}
                        onClick={() => setQuality(q.value)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          quality === q.value
                            ? 'bg-brand-600 text-white border border-brand-500/30'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> Creativity: {creativity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={creativity}
                    onChange={(e) => setCreativity(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/[0.06] rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-white/30">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Advanced Options
                {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Negative Prompt (Optional)</label>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="blurry, low quality, distorted, watermark..."
                        className="w-full h-16 px-4 py-3 bg-slate-900/80 border border-white/[0.08] rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-500/50 transition-colors text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> AI Provider
                      </label>
                      <div className="space-y-2">
                        {PROVIDERS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => setProvider(p.id)}
                            className={`w-full text-left p-3 rounded-xl transition-all ${
                              provider === p.id
                                ? 'bg-brand-500/10 border border-brand-500/30'
                                : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-white">{p.name}</span>
                                <span className="text-[10px] text-white/40 ml-2">{p.description}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {p.free && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">FREE</span>}
                                {p.requiresKey && <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">KEY REQ</span>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      {PROVIDERS.find(p => p.id === provider)?.requiresKey && (
                        <input
                          type="password"
                          value={providerKeys[provider] || ''}
                          onChange={(e) => saveApiKey(e.target.value)}
                          placeholder={`Enter ${PROVIDERS.find(p => p.id === provider)?.name} API key...`}
                          className="w-full px-4 py-2.5 bg-slate-900/80 border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors text-xs"
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SECTION 7: Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !(enhancedPrompt || prompt).trim()}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate {imageCount} Image{imageCount > 1 ? 's' : ''}
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>Generating...</span>
                    <span>{Math.round(generatingProgress)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${generatingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ HISTORY TAB ═══════ */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-400" />
                  Recent Images
                  <span className="text-xs text-white/30">({history.length})</span>
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={() => { clearHistory(); setHistory([]); }}
                    className="flex items-center gap-1 text-xs text-red-400/70 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <div className="text-center py-12 text-white/30">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No generation history yet</p>
                  <p className="text-xs mt-1">Generate your first image to see it here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {history.map(h => (
                    <div key={h.id} className="group relative rounded-xl overflow-hidden border border-white/[0.06] hover:border-brand-500/30 transition-colors">
                      <img src={h.imageUrl} alt={h.prompt} className="w-full aspect-square object-cover bg-white/[0.03]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white/80 line-clamp-2 mb-2">{h.prompt}</p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setPrompt(h.prompt); setStyle(h.style); setAspectRatio(h.aspectRatio); setActiveTab('generate'); }}
                            className="flex-1 py-1 bg-brand-600/80 text-white text-[10px] font-bold rounded-md"
                          >
                            Reuse
                          </button>
                          <button
                            onClick={() => deleteHistoryItemLocal(h.id)}
                            className="p-1 bg-white/10 rounded-md hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3 text-white/70" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ GALLERY TAB ═══════ */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Community Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOCK_COMMUNITY.map(img => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden border border-white/[0.06] hover:border-pink-500/30 transition-colors">
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt={img.prompt} className="w-full aspect-square object-cover bg-white/[0.03]" loading="lazy" />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white/80 line-clamp-2 mb-1">{img.prompt}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(img.id)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            likedImages.has(img.id) ? 'bg-pink-500/30 text-pink-400' : 'bg-white/10 text-white/60'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${likedImages.has(img.id) ? 'fill-pink-400' : ''}`} />
                          {img.likes + (likedImages.has(img.id) ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Eye className="w-3 h-3" /> {img.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Panel: Live Preview Gallery ── */}
        <div className="w-full lg:w-96 space-y-4">
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm flex-1">{error}</span>
                <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 8: Result Gallery */}
          <AnimatePresence>
            {generatedImages.length > 0 && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white uppercase tracking-widest text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                    {generatedImages.length} Image{generatedImages.length > 1 ? 's' : ''} Generated
                  </h3>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg text-xs font-bold text-white/70 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
                <div className={`grid gap-3 ${generatedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {generatedImages.map((img, i) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative group rounded-xl overflow-hidden border border-white/[0.06] hover:border-brand-500/30 transition-all bg-white/[0.03]"
                    >
                      <img
                        src={img.dataUrl}
                        alt={`Generated: ${img.prompt}`}
                        className={`w-full object-cover bg-white/[0.03] ${img.aspectRatio === '1:1' ? 'aspect-square' : img.aspectRatio === '16:9' ? 'aspect-video' : img.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-[3/2]'}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white/70 line-clamp-2">{img.prompt}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => handleDownload(img.dataUrl, i)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-brand-600/80 hover:bg-brand-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </button>
                          <button
                            onClick={() => handleCopyPrompt(img.prompt)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            {copiedPrompt === img.prompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedPrompt === img.prompt ? 'Copied!' : 'Copy'}
                          </button>
                          <button
                            onClick={() => handleShareImage(img.dataUrl)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setFullscreenImage(img.dataUrl)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-colors"
                          >
                            <Maximize2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION 12: Trending Prompts */}
          <div className="space-y-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Trending Prompts
            </h3>
            <div className="space-y-1.5">
              {TRENDING_PROMPTS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => selectTrending(t)}
                  className="w-full text-left p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-amber-500/20 rounded-lg transition-all flex items-center gap-2 group"
                >
                  <div className="w-6 h-6 bg-amber-500/10 rounded-md flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/70 group-hover:text-white transition-colors truncate">{t.prompt}</p>
                    <span className="text-[10px] text-white/30 capitalize">{t.style.replace('-', ' ')}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-amber-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 14: Related Tools */}
          <div className="space-y-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
              <ArrowRight className="w-3.5 h-3.5 text-brand-400" /> Related Tools
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Background Remover', desc: 'Remove backgrounds from images', path: '/tools/background-remover', icon: '✂️' },
                { name: 'Image Compressor', desc: 'Reduce image file size', path: '/tools/image-compressor', icon: '📦' },
                { name: 'AI Caption Generator', desc: 'Generate engaging captions', path: '/tools/caption-writer', icon: '✍️' },
                { name: 'QR Code Generator', desc: 'Create custom QR codes', path: '/tools/qr-code-generator', icon: '📱' },
              ].map((tool, i) => (
                <Link
                  key={i}
                  to={tool.path}
                  className="flex items-center gap-3 p-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] hover:border-brand-500/20 rounded-lg transition-all group"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors">{tool.name}</p>
                    <p className="text-[10px] text-white/30">{tool.desc}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-brand-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ FULLSCREEN VIEW ═══════════ */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ SECTION 15: CONTENT SECTIONS ═══════════ */}

      {/* What is AI Image Generator */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <SectionBadge icon={Eye} text="About This Tool" />
        <SectionTitle>What is AI Image Generator?</SectionTitle>
        <div className="text-sm text-white/50 leading-relaxed space-y-4">
          <p>
            An AI Image Generator is a powerful tool that uses artificial intelligence and machine learning algorithms to create unique, high-quality images from simple text descriptions. By leveraging advanced models like Google Gemini, Stable Diffusion, and DALL·E, our tool transforms your creative ideas into stunning visual content in seconds.
          </p>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" /> Who Should Use This Tool?
            </h3>
            <ul className="space-y-2 text-white/50 text-xs">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> <span>Content creators and YouTubers needing eye-catching thumbnails</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> <span>Social media managers creating engaging visual content</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> <span>Bloggers and writers needing featured images</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> <span>Small businesses creating marketing materials</span></li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> <span>Designers and artists exploring new ideas and concepts</span></li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* How to Use */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <SectionBadge icon={Rocket} text="How It Works" />
        <SectionTitle>How to Use AI Image Generator</SectionTitle>
        <div className="space-y-3">
          {[
            { title: 'Enter Your Prompt', desc: 'Type a detailed description of the image you want to create. Be specific about the subject, environment, lighting, and mood.' },
            { title: 'Choose a Style', desc: 'Select from 8 different art styles: Realistic, Anime, Cartoon, 3D, Cinematic, Fantasy, Pixel Art, or Watercolor.' },
            { title: 'Set Aspect Ratio & Count', desc: 'Pick the right dimensions for your use case and choose how many variations to generate at once.' },
            { title: 'Click Generate', desc: 'Hit the Generate button and wait a few seconds while the AI creates your unique image.' },
            { title: 'Download & Share', desc: 'Preview your generated images, download them in high quality, copy the prompt for reuse, or share directly.' },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 p-4 glass-card rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-brand-400">{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <SectionBadge icon={Sparkles} text="Features" />
        <SectionTitle>Powerful Features</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Generate images in seconds with optimized AI processing' },
            { icon: Shield, title: '100% Free', desc: 'No hidden costs, subscription fees, or usage limits' },
            { icon: Palette, title: '8 Art Styles', desc: 'Choose from realistic, anime, cartoon, 3D, and more' },
            { icon: Brain, title: 'AI Enhanced', desc: 'Smart prompt enhancement for better image quality' },
            { icon: Smartphone, title: 'Mobile First', desc: 'Works perfectly on all devices and screen sizes' },
            { icon: Globe, title: 'Multiple Providers', desc: 'Support for Gemini, Hugging Face, Replicate, and more' },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-4 glass-card rounded-xl hover:border-brand-500/20 transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <feat.icon className="w-4 h-4 text-brand-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{feat.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <SectionBadge icon={Award} text="Why Choose Us" />
        <SectionTitle>Why Choose Our AI Image Generator?</SectionTitle>
        <div className="space-y-3">
          {[
            { title: 'No Design Skills Required', description: 'Anyone can create professional-quality images by simply describing what they want in plain English.' },
            { title: 'Multiple AI Providers', description: 'Access multiple cutting-edge AI models through a single interface, with automatic fallback for reliability.' },
            { title: 'Commercial Use Rights', description: 'All generated images are yours to use freely for personal or commercial projects including social media and marketing.' },
            { title: 'Privacy First', description: 'Your prompts and generated images are processed securely and never stored on our servers without your consent.' },
          ].map((ben, i) => (
            <div key={i} className="flex items-start gap-3 p-4 glass-card rounded-xl">
              <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{ben.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{ben.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 15: FAQ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <SectionBadge icon={MessageCircle} text="FAQ" />
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <div className="space-y-2">
          {CONTENT_FAQS.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}

/* ═══════════ FAQ ITEM COMPONENT ═══════════ */

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-white pr-4">{item.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
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
  );
}
