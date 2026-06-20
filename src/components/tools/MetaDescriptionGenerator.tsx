import { useState } from 'react';
import { Copy, Check, Search, Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { generateMetaDescriptions, type MetaDescResult } from '../../lib/gemini';

export default function MetaDescriptionGenerator() {
  const [content, setContent] = useState('');
  const [descriptions, setDescriptions] = useState<MetaDescResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!content.trim()) { setError('Please enter page content or topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateMetaDescriptions(content); setDescriptions(r); } catch { setError('Failed to generate descriptions.'); } finally { setIsGenerating(false); }
  };

  const copyText = async (text: string, idx: number) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Search className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Meta Description Generator</h1>
        <p className="text-ink/60">Generate 5 SEO-optimized meta descriptions (150-160 chars)</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Page Content or Topic *</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your page content or describe the topic..." className="w-full h-32 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-primary" />
        <button onClick={handleGenerate} disabled={isGenerating || !content.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Meta Descriptions</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {descriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">5 Variations</h3>
          {descriptions.map((d, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-ink text-sm">{d.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={d.charCount <= 160 ? 'text-green-400' : 'text-red-400'}>{d.charCount}/160 chars</span>
                    <span className="flex items-center gap-1">{d.hasKeyword ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />} Keyword</span>
                    <span className="flex items-center gap-1">{d.hasCTA ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />} CTA</span>
                  </div>
                </div>
                <button onClick={() => copyText(d.description, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                  {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                </button>
              </div>
              <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${d.charCount <= 160 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${Math.min(d.charCount / 160 * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
