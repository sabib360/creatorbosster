import { useState } from 'react';
import { Copy, Check, Minimize2, AlertCircle, AlertTriangle } from 'lucide-react';

function minifyJS(js: string): string {
  let result = js;
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  result = result.replace(/\/\/(?!["']).*$/gm, '');
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1');
  result = result.replace(/;\s*}/g, '}');
  return result.trim();
}

function validateJS(js: string): { valid: boolean; error?: string } {
  try {
    new Function(js);
    return { valid: true };
  } catch (e: any) {
    return { valid: false, error: e.message };
  }
}

export default function JSMinifier() {
  const [input, setInput] = useState('// Calculate the sum of two numbers\nfunction add(a, b) {\n  // Return the result\n  return a + b;\n}\n\nconst result = add(5, 3);\nconsole.log("Result:", result);');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [syntaxValid, setSyntaxValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      setError(null);
      const validation = validateJS(input);
      setSyntaxValid(validation.valid);
      if (!validation.valid) { setError(`Syntax Error: ${validation.error}`); setOutput(''); return; }
      setOutput(minifyJS(input));
    } catch { setError('Failed to process JavaScript'); }
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
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">JavaScript Minifier</h1>
        <p className="text-ink/60">Minify and validate JavaScript code with syntax checking</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">JavaScript Input</label>
            {syntaxValid !== null && (
              <span className={`flex items-center gap-1 text-xs font-bold ${syntaxValid ? 'text-green-400' : 'text-red-400'}`}>
                {syntaxValid ? <><Check className="w-3 h-3" /> Valid Syntax</> : <><AlertTriangle className="w-3 h-3" /> Invalid Syntax</>}
              </span>
            )}
          </div>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); setSyntaxValid(null); }} className="w-full h-48 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none focus:outline-none focus:border-purple-400" />
          <p className="text-xs text-ink/60">{input.length} characters</p>
        </div>
        <button onClick={process} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors">
          <Minimize2 className="w-5 h-5 inline mr-2" /> Minify JavaScript
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Output ({output.length} chars)</h3>
            <div className="flex items-center gap-3">
              {reduction && <span className="text-xs font-bold text-green-400">-{reduction}% size</span>}
              <button onClick={copyOutput} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
            </div>
          </div>
          <textarea value={output} readOnly className="w-full h-48 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none" />
        </div>
      )}
    </div>
  );
}
