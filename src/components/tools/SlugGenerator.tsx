import { useState } from 'react';
import { Copy, Check, Link, Sparkles } from 'lucide-react';

interface SlugVariation {
  slug: string;
  label: string;
}

function generateSlugs(title: string): SlugVariation[] {
  if (!title.trim()) return [];
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const words = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  const short = words.slice(0, 5).join('-');
  const noStopWords = words.filter(w => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(w)).join('-');
  const withYear = base + '-' + new Date().getFullYear();
  const initials = words.slice(0, 8).map(w => w[0]).join('');

  return [
    { slug: base, label: 'Full Slug' },
    { slug: short, label: 'Short (5 words)' },
    { slug: noStopWords, label: 'No Stop Words' },
    { slug: withYear, label: 'With Year' },
    { slug: words.slice(0, 3).join('-'), label: '3 Words' },
    { slug: words.slice(0, 2).join('-'), label: '2 Words' },
  ].filter(s => s.slug.length > 0);
}

export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [slugs, setSlugs] = useState<SlugVariation[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = () => {
    setSlugs(generateSlugs(input));
  };

  const copySlug = async (slug: string, idx: number) => {
    try { await navigator.clipboard.writeText(slug); } catch {
      const t = document.createElement('textarea'); t.value = slug; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><Link className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">SEO Slug Generator</h1>
        <p className="text-ink/60">Generate SEO-friendly URL slugs from any title or text</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <label className="font-bold text-ink uppercase tracking-widest text-sm">Page Title or Text *</label>
        <input type="text" value={input} onChange={(e) => { setInput(e.target.value); if (e.target.value.trim()) setSlugs(generateSlugs(e.target.value)); else setSlugs([]); }} placeholder="e.g., 10 Best SEO Practices for 2025" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary" />
      </div>

      {slugs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Slug Variations</h3>
          {slugs.map((s, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{s.label}</span>
                  <p className="text-ink font-mono text-sm mt-1 truncate">/{s.slug}</p>
                  <p className="text-ink/40 text-xs mt-0.5">{s.slug.length} characters</p>
                </div>
                <button onClick={() => copySlug(s.slug, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
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
