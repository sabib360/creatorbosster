import { useState } from 'react';
import { Copy, Check, Link, ArrowRightLeft } from 'lucide-react';

export default function URLEncoderDecoder() {
  const [input, setInput] = useState('https://example.com/search?q=hello world&lang=en&special=!@#$%^&*()');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const process = () => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch { setOutput('Error: Invalid input for decoding'); }
  };

  const copyOutput = async () => {
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto"><Link className="w-8 h-8 text-purple-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">URL Encoder/Decoder</h1>
        <p className="text-ink/60">Encode and decode URL parameters and special characters</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex gap-2">
          <button onClick={() => setMode('encode')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${mode === 'encode' ? 'bg-purple-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Encode</button>
          <button onClick={() => setMode('decode')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${mode === 'decode' ? 'bg-purple-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Decode</button>
        </div>
        <div className="space-y-1">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">{mode === 'encode' ? 'URL to Encode' : 'Encoded URL to Decode'}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-24 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none focus:outline-none focus:border-purple-400" />
        </div>
        <button onClick={process} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors flex items-center justify-center gap-2">
          <ArrowRightLeft className="w-5 h-5" /> {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>
      </div>

      {output && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Result</h3>
            <button onClick={copyOutput} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-ink transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl font-mono text-xs text-ink break-all">{output}</div>
        </div>
      )}
    </div>
  );
}
