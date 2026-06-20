import { useState } from 'react';
import { Copy, Check, Code, Sparkles, AlertCircle, Download } from 'lucide-react';
import { generateCode, type CodeResult } from '../../lib/gemini';

type Language = 'javascript' | 'python' | 'html-css' | 'typescript' | 'java' | 'php' | 'sql' | 'bash';

export default function AICodeGenerator() {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [result, setResult] = useState<CodeResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) { setError('Please describe what code you need'); return; }
    setIsGenerating(true); setError(null);
    try { const r = await generateCode(description, language); setResult(r); } catch { setError('Failed to generate code.'); } finally { setIsGenerating(false); }
  };

  const copyCode = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(result.code); } catch {
      const t = document.createElement('textarea'); t.value = result.code; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    if (!result) return;
    const ext: Record<string, string> = { javascript: 'js', python: 'py', 'html-css': 'html', typescript: 'ts', java: 'java', php: 'php', sql: 'sql', bash: 'sh' };
    const blob = new Blob([result.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `code.${ext[language] || 'txt'}`; a.click(); URL.revokeObjectURL(url);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'javascript', label: 'JavaScript' }, { value: 'python', label: 'Python' },
    { value: 'html-css', label: 'HTML/CSS' }, { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' }, { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' }, { value: 'bash', label: 'Bash' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Code className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Code Generator</h1>
        <p className="text-ink/60">Generate clean, commented code from natural language descriptions</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Describe What You Need *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Create a function that sorts an array of objects by a specific property..." className="w-full h-28 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink resize-none focus:outline-none focus:border-tertiary" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/60">Language</label>
          <div className="flex flex-wrap gap-2">
            {languages.map(l => (
              <button key={l.value} onClick={() => setLanguage(l.value)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${language === l.value ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{l.label}</button>
            ))}
          </div>
        </div>
        <button onClick={handleGenerate} disabled={isGenerating || !description.trim()} className="w-full py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isGenerating ? 'Generating Code...' : <><Sparkles className="w-5 h-5" /> Generate Code</>}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2">{result.language}</h3>
            <div className="flex gap-2">
              <button onClick={copyCode} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
              </button>
              <button onClick={downloadCode} className="px-3 py-1.5 bg-tertiary hover:bg-tertiary/90 rounded-lg text-xs font-bold text-black transition-colors flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-slate-700">
            <pre className="p-5 bg-slate-900 overflow-x-auto text-sm text-ink/80 font-mono leading-relaxed">{result.code}</pre>
          </div>

          <div className="p-5 bg-tertiary/5 border border-tertiary/20 rounded-2xl">
            <h4 className="font-bold text-tertiary text-sm uppercase mb-2">Explanation</h4>
            <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
