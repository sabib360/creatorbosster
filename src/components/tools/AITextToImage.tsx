import { useState } from 'react';
import { Download, Sparkles, AlertCircle, Palette, RefreshCw } from 'lucide-react';
import { generateThumbnailImages, enhanceImagePrompt } from '../../lib/gemini';

type ImageStyle = 'realistic' | 'anime' | 'cartoon' | '3d' | 'watercolor' | 'oil-painting';
type AspectRatio = '16:9' | '1:1' | '9:16' | '4:3';

export default function AITextToImage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('realistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

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
    if (!text.trim()) { setError('Please enter a prompt'); return; }
    setIsGenerating(true); setError(null); setImages([]);
    try {
      const fullPrompt = `${text}, ${style} style, ${aspectRatio} aspect ratio, high quality, detailed`;
      const result = await generateThumbnailImages(fullPrompt, 4);
      setImages(result);
    } catch { setError('Failed to generate images. Check your API key and try again.'); } finally { setIsGenerating(false); }
  };

  const downloadImage = (dataUrl: string, idx: number) => {
    const a = document.createElement('a'); a.href = dataUrl; a.download = `ai_image_${idx + 1}.jpg`; a.click();
  };

  const styles: { value: ImageStyle; label: string; icon: string }[] = [
    { value: 'realistic', label: 'Realistic', icon: '📷' }, { value: 'anime', label: 'Anime', icon: '🎌' },
    { value: 'cartoon', label: 'Cartoon', icon: '🎨' }, { value: '3d', label: '3D Render', icon: '🧊' },
    { value: 'watercolor', label: 'Watercolor', icon: '🖌️' }, { value: 'oil-painting', label: 'Oil Painting', icon: '🖼️' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Palette className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Text to Image</h1>
        <p className="text-ink/60">Generate images from text descriptions with multiple style options</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Describe Your Image *</label>
          <textarea value={prompt} onChange={(e) => { setPrompt(e.target.value); setEnhancedPrompt(null); }} placeholder="e.g., A futuristic city at sunset with flying cars and neon lights..." className="w-full h-28 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-tertiary" />
          <button onClick={handleEnhance} disabled={isEnhancing || !prompt.trim()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold text-ink transition-colors flex items-center gap-1">
            {isEnhancing ? 'Enhancing...' : <><Sparkles className="w-3 h-3" /> Enhance Prompt</>}
          </button>
        </div>

        {enhancedPrompt && (
          <div className="p-3 bg-tertiary/5 border border-tertiary/20 rounded-xl">
            <p className="text-xs text-tertiary font-bold uppercase mb-1">Enhanced Prompt</p>
            <p className="text-ink/70 text-sm">{enhancedPrompt}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-ink/60">Alternative prompts:</p>
            <div className="space-y-1">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { setPrompt(s); setEnhancedPrompt(null); }} className="w-full text-left p-2 bg-slate-900/50 rounded-lg text-xs text-ink/70 hover:bg-slate-900 transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-ink/60">Style</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {styles.map(s => (
              <button key={s.value} onClick={() => setStyle(s.value)} className={`py-2 rounded-xl text-xs font-bold transition-colors ${style === s.value ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{s.icon} {s.label}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-ink/60">Aspect Ratio</label>
          <div className="flex gap-2">
            {(['16:9', '1:1', '9:16', '4:3'] as AspectRatio[]).map(r => (
              <button key={r} onClick={() => setAspectRatio(r)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${aspectRatio === r ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{r}</button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={isGenerating || !(enhancedPrompt || prompt).trim()} className="w-full py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating Images...' : <><Sparkles className="w-5 h-5" /> Generate 4 Images</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{images.length} Images Generated</h3>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700 hover:border-tertiary transition-colors">
                <img src={img} alt={`Generated ${i + 1}`} className="w-full aspect-video object-cover bg-slate-800" />
                <button onClick={() => downloadImage(img, i)} className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Download className="w-4 h-4 text-white" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
