import { useState } from 'react';
import { Copy, Check, FileText, Sparkles, AlertCircle, Clock, Hash } from 'lucide-react';
import { generateYouTubeDescription, type DescriptionResult } from '../../lib/gemini';

export default function YouTubeDescriptionGenerator() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [timestamps, setTimestamps] = useState('');
  const [result, setResult] = useState<DescriptionResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a video topic'); return; }
    setIsGenerating(true); setError(null);
    try {
      const r = await generateYouTubeDescription(topic, keywords, timestamps);
      setResult(r);
    } catch { setError('Failed to generate description.'); } finally { setIsGenerating(false); }
  };

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setter(true); setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto"><FileText className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">YouTube Description Generator</h1>
        <p className="text-ink/60">Generate SEO-optimized descriptions with hashtags and chapters</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Video Topic *</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., 10 Python tips for beginners" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-red-400" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Target Keywords (optional)</label>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., python, programming, tutorial, beginner" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-red-400" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Timestamps (optional)</label>
          <textarea value={timestamps} onChange={(e) => setTimestamps(e.target.value)} placeholder="0:00 Intro&#10;1:30 Tip 1&#10;3:00 Tip 2" className="w-full h-24 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm resize-none focus:outline-none focus:border-red-400" />
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-red-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-red-400/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Description</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-6">
          <div className="space-y-3 p-6 bg-slate-800/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Description ({result.description.length} chars)</h3>
              <button onClick={() => copyToClipboard(result.description, setCopiedDesc)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                {copiedDesc ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
            </div>
            <div className="text-ink/70 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">{result.description}</div>
          </div>

          {result.chapters.length > 0 && (
            <div className="space-y-3 p-6 bg-slate-800/50 rounded-2xl">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> Chapters</h3>
              <div className="space-y-2">
                {result.chapters.map((ch, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-red-400 font-mono font-bold">{ch.time}</span>
                    <span className="text-ink">{ch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.hashtags.length > 0 && (
            <div className="space-y-3 p-6 bg-slate-800/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2"><Hash className="w-4 h-4" /> Hashtags ({result.hashtags.length})</h3>
                <button onClick={() => copyToClipboard(result.hashtags.join(' '), setCopiedTags)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                  {copiedTags ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy All</>}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((h, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-700 rounded-full text-sm text-ink/80">{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
