import { useState } from 'react';
import { Copy, Check, Type, Sparkles, AlertCircle } from 'lucide-react';
import { generateBlogTitles, type BlogTitleResult } from '../../lib/gemini';

type Tone = 'professional' | 'casual' | 'humorous' | 'informative' | 'urgent';
type Audience = 'general' | 'developers' | 'marketers' | 'entrepreneurs' | 'students';

export default function BlogPostTitleGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [audience, setAudience] = useState<Audience>('general');
  const [titles, setTitles] = useState<BlogTitleResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateBlogTitles(topic, tone, audience); setTitles(r); } catch { setError('Failed to generate titles.'); } finally { setIsGenerating(false); }
  };

  const copyTitle = async (title: string, idx: number) => {
    try { await navigator.clipboard.writeText(title); } catch {
      const t = document.createElement('textarea'); t.value = title; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Type className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Blog Post Title Generator</h1>
        <p className="text-ink/60">Generate 20+ SEO-friendly titles with emotional triggers and power words</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Topic *</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., How to grow a SaaS business" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-ink/60">Tone</label>
            <div className="flex flex-wrap gap-1">
              {(['professional', 'casual', 'humorous', 'informative', 'urgent'] as Tone[]).map(t => (
                <button key={t} onClick={() => setTone(t)} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors capitalize ${tone === t ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/60">Audience</label>
            <div className="flex flex-wrap gap-1">
              {(['general', 'developers', 'marketers', 'entrepreneurs', 'students'] as Audience[]).map(a => (
                <button key={a} onClick={() => setAudience(a)} className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors capitalize ${audience === a ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{a}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Titles</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {titles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{titles.length} Titles Generated</h3>
          {titles.map((t, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-ink font-bold">{t.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-ink/60">
                    <span>{t.charCount} chars</span>
                    {t.emotionalTrigger && <><span>•</span><span className="text-primary">{t.emotionalTrigger}</span></>}
                  </div>
                  {t.powerWords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {t.powerWords.map((w, j) => <span key={j} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">{w}</span>)}
                    </div>
                  )}
                </div>
                <button onClick={() => copyTitle(t.title, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
