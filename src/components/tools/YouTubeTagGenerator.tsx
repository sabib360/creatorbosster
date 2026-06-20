import { useState } from 'react';
import { Copy, Check, Tag, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';
import { generateYouTubeTags, type TagResult } from '../../lib/gemini';

export default function YouTubeTagGenerator() {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<TagResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a video topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateYouTubeTags(topic); setTags(r); } catch { setError('Failed to generate tags.'); } finally { setIsGenerating(false); }
  };

  const copyAll = async () => {
    const text = tags.map(t => t.tag).join(', ');
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const getVolumeColor = (v: string) => v === 'high' ? 'text-green-400 bg-green-400/10' : v === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10';
  const getCompColor = (c: string) => c === 'low' ? 'text-green-400 bg-green-400/10' : c === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><Tag className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube Tag Generator</h1>
        <p className="text-ink/60">Generate 40+ SEO-optimized tags with search volume estimates</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic</label>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Best camera for YouTube 2025" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Tags</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {tags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{tags.length} Tags Generated</h3>
            <button onClick={copyAll} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors flex items-center gap-1">
              {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All as CSV</>}
            </button>
          </div>

          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-xs text-ink/60 mb-2 font-mono break-all">{tags.map(t => t.tag).join(', ')}</p>
          </div>

          <div className="space-y-2">
            {tags.map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-ink/40 font-bold w-8 text-sm">{i + 1}</span>
                <span className="flex-1 text-ink font-bold text-sm">{t.tag}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getVolumeColor(t.searchVolume)}`}>{t.searchVolume}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getCompColor(t.competition)}`}>comp: {t.competition}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
