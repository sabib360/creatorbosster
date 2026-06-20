import { useState } from 'react';
import { Copy, Check, FileText, Sparkles, AlertCircle, Download } from 'lucide-react';
import { generateBlogOutline, type BlogOutlineResult } from '../../lib/gemini';

export default function BlogPostOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('2000');
  const [outline, setOutline] = useState<BlogOutlineResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateBlogOutline(topic, wordCount); setOutline(r); } catch { setError('Failed to generate outline.'); } finally { setIsGenerating(false); }
  };

  const toMarkdown = (): string => {
    if (!outline) return '';
    let md = `# ${outline.title}\n\n## Introduction\n${outline.introduction}\n\n`;
    outline.sections.forEach(s => {
      md += s.level === 'h2' ? `## ${s.heading}\n` : `### ${s.heading}\n`;
      s.points.forEach(p => { md += `- ${p}\n`; });
      md += '\n';
    });
    md += `## Conclusion\n${outline.conclusion}\n\n## FAQ\n`;
    outline.faq.forEach(f => { md += `**Q: ${f.question}**\nA: ${f.answer}\n\n`; });
    return md;
  };

  const copyMarkdown = async () => {
    const md = toMarkdown();
    try { await navigator.clipboard.writeText(md); } catch {
      const t = document.createElement('textarea'); t.value = md; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([toMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `outline_${topic.replace(/\s+/g, '_').substring(0, 30)}.md`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"><FileText className="w-8 h-8 text-primary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Blog Post Outline Generator</h1>
        <p className="text-ink/60">Generate detailed outlines with H2/H3 headings, key points, and FAQs</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Topic *</label>
          <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Complete guide to email marketing" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Target Word Count</label>
          <div className="flex gap-2">
            {['1000', '1500', '2000', '3000', '5000'].map(w => (
              <button key={w} onClick={() => setWordCount(w)} className={`px-3 py-2 rounded-xl text-sm font-bold transition-colors ${wordCount === w ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{w}</button>
            ))}
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating...' : <><Sparkles className="w-5 h-5" /> Generate Outline</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {outline && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Outline</h3>
            <div className="flex gap-2">
              <button onClick={copyMarkdown} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy MD</>}
              </button>
              <button onClick={downloadMarkdown} className="px-3 py-1.5 bg-primary hover:bg-primary/90 rounded-lg text-xs font-bold text-black transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
            </div>
          </div>

          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl">
            <h2 className="text-xl font-bold text-ink">{outline.title}</h2>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-bold text-primary text-sm uppercase mb-2">Introduction</h4>
            <p className="text-ink/70 text-sm leading-relaxed">{outline.introduction}</p>
          </div>

          {outline.sections.map((s, i) => (
            <div key={i} className={`p-5 rounded-xl border border-slate-700 ${s.level === 'h2' ? 'bg-slate-800/50' : 'bg-slate-900/50 ml-4'}`}>
              <h4 className={`font-bold text-ink ${s.level === 'h2' ? 'text-lg' : 'text-sm'}`}>{s.heading}</h4>
              <ul className="mt-2 space-y-1">
                {s.points.map((p, j) => <li key={j} className="text-ink/70 text-sm flex gap-2"><span className="text-primary">•</span>{p}</li>)}
              </ul>
            </div>
          ))}

          <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="font-bold text-primary text-sm uppercase mb-2">Conclusion</h4>
            <p className="text-ink/70 text-sm leading-relaxed">{outline.conclusion}</p>
          </div>

          {outline.faq.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-ink uppercase tracking-widest text-sm">FAQ</h4>
              {outline.faq.map((f, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="font-bold text-ink text-sm">{f.question}</p>
                  <p className="text-ink/60 text-sm mt-1">{f.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
