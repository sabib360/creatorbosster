import { useState } from 'react';
import { Copy, Check, Hash, Sparkles, AlertCircle } from 'lucide-react';
import { generateYouTubeHashtags, type HashtagResult } from '../../lib/gemini';

export default function YouTubeHashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState<HashtagResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a video topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateYouTubeHashtags(topic); setHashtags(r); } catch { setError('Failed to generate hashtags.'); } finally { setIsGenerating(false); }
  };

  const copyAll = async () => {
    const text = filteredHashtags.map(h => h.hashtag).join(' ');
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const filteredHashtags = filter === 'all' ? hashtags : hashtags.filter(h => h.category === filter);
  const categories = ['all', ...new Set(hashtags.map(h => h.category))];
  const getReachColor = (r: string) => r === 'high' ? 'text-green-400' : r === 'medium' ? 'text-yellow-400' : 'text-red-400';
  const getCatColor = (c: string) => c === 'trending' ? 'bg-red-400/10 text-red-400' : c === 'niche' ? 'bg-blue-400/10 text-blue-400' : c === 'branded' ? 'bg-purple-400/10 text-purple-400' : 'bg-green-400/10 text-green-400';

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><Hash className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube Hashtag Generator</h1>
        <p className="text-ink/60">Generate trending hashtags categorized by relevance and reach</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic / Niche</label>
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Fitness motivation, home workouts" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Hashtags</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {hashtags.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{filteredHashtags.length} Hashtags</h3>
            <button onClick={copyAll} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors flex items-center gap-1">
              {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize ${filter === c ? 'bg-red-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filteredHashtags.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-ink font-bold text-sm flex-1">{h.hashtag}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getCatColor(h.category)}`}>{h.category}</span>
                <span className={`text-[10px] font-bold uppercase ${getReachColor(h.estimatedReach)}`}>{h.estimatedReach}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
