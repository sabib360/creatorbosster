import { useState } from 'react';
import { Copy, Check, Minimize2, Maximize2, AlertCircle } from 'lucide-react';

function minifyCSS(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').replace(/^\s+|\s+$/g, '');
}

function beautifyCSS(css: string): string {
  let result = css.replace(/\{/g, ' {\n  ').replace(/\}/g, '\n}\n').replace(/;/g, ';\n  ').replace(/^\s+/gm, (m) => m);
  result = result.replace(/\n\s*\n/g, '\n').trim();
  return result;
}

export default function CSSMinifier() {
  const [input, setInput] = useState('.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\n.header {\n  background-color: #333;\n  color: white;\n  padding: 10px 20px;\n}\n\n/* This is a comment */\n.button {\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify');

  const process = () => {
    try {
      setError(null);
      setOutput(mode === 'minify' ? minifyCSS(input) : beautifyCSS(input));
    } catch { setError('Failed to process CSS'); }
  };

  const reduction = input && output ? ((1 - output.length / input.length) * 100).toFixed(1) : null;

  const copyOutput = async () => {
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto"><Minimize2 className="w-8 h-8 text-purple-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">CSS Minifier</h1>
        <p className="text-ink/60">Minify or beautify CSS code with size reduction stats</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex gap-2">
          <button onClick={() => setMode('minify')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${mode === 'minify' ? 'bg-purple-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}><Minimize2 className="w-4 h-4 inline mr-1" /> Minify</button>
          <button onClick={() => setMode('beautify')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${mode === 'beautify' ? 'bg-purple-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}><Maximize2 className="w-4 h-4 inline mr-1" /> Beautify</button>
        </div>
        <div className="space-y-1">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">CSS Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-48 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none focus:outline-none focus:border-purple-400" />
          <p className="text-xs text-ink/60">{input.length} characters</p>
        </div>
        <button onClick={process} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors">
          {mode === 'minify' ? 'Minify CSS' : 'Beautify CSS'}
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Output ({output.length} chars)</h3>
            <div className="flex items-center gap-3">
              {reduction && <span className={`text-xs font-bold ${parseFloat(reduction) > 0 ? 'text-green-400' : 'text-red-400'}`}>{parseFloat(reduction) > 0 ? '-' : '+'}{reduction}% size</span>}
              <button onClick={copyOutput} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
            </div>
          </div>
          <textarea value={output} readOnly className="w-full h-48 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none" />
        </div>
      )}
    </div>
  );
}
