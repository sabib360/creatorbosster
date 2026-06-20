import { useState } from 'react';
import { Upload, Copy, Check, FileText, Sparkles, AlertCircle, Download } from 'lucide-react';
import { summarizeDocument, type SummaryResult } from '../../lib/gemini';

type SummaryLength = 'short' | 'medium' | 'long';

export default function AIDocumentSummarizer() {
  const [inputText, setInputText] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setInputText(ev.target?.result as string); setResult(null); };
    reader.readAsText(file);
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) { setError('Please enter or upload text to summarize'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await summarizeDocument(inputText, length); setResult(r); } catch { setError('Failed to summarize.'); } finally { setIsGenerating(false); }
  };

  const copySummary = async () => {
    if (!result) return;
    const text = `Summary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `• ${p}`).join('\n')}`;
    try { await navigator.clipboard.writeText(text); } catch {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadSummary = () => {
    if (!result) return;
    const text = `Summary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.map(p => `• ${p}`).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'summary.txt'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><FileText className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Document Summarizer</h1>
        <p className="text-ink/60">Summarize documents, articles, or text with AI extraction</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex items-center justify-between">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Content *</label>
          <label className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" /> Upload .txt
            <input type="file" accept=".txt,.md,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
        <textarea value={inputText} onChange={(e) => { setInputText(e.target.value); setResult(null); }} placeholder="Paste your text here or upload a file..." className="w-full h-40 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-tertiary text-sm" />
        <div className="flex items-center justify-between text-xs text-ink/60">
          <span>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
          <div className="flex gap-2">
            {(['short', 'medium', 'long'] as SummaryLength[]).map(l => (
              <button key={l} onClick={() => setLength(l)} className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${length === l ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{l}</button>
            ))}
          </div>
        </div>
        <button onClick={handleSummarize} disabled={isGenerating || !inputText.trim()} className="w-full py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Summarizing...' : <><Sparkles className="w-5 h-5" /> Summarize</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-800 rounded-xl"><div className="text-lg font-bold text-ink">{result.wordCount}</div><div className="text-xs text-ink/60">Original Words</div></div>
            <div className="p-3 bg-slate-800 rounded-xl"><div className="text-lg font-bold text-ink">{result.readingTime}</div><div className="text-xs text-ink/60">Reading Time</div></div>
          </div>

          <div className="p-5 bg-tertiary/5 border border-tertiary/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-tertiary text-sm uppercase">Summary</h4>
              <div className="flex gap-2">
                <button onClick={copySummary} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">{copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-ink/60" />}</button>
                <button onClick={downloadSummary} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"><Download className="w-3.5 h-3.5 text-ink/60" /></button>
              </div>
            </div>
            <p className="text-ink/70 text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-2xl space-y-3">
            <h4 className="font-bold text-ink text-sm uppercase">Key Points</h4>
            <ul className="space-y-2">
              {result.keyPoints.map((p, i) => <li key={i} className="flex gap-2 text-ink/70 text-sm"><span className="text-tertiary">•</span>{p}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
