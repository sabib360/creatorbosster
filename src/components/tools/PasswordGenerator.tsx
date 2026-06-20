import { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, Lock, Shield } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (excludeSimilar) chars = chars.replace(/[0Il1|]/g, '');
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    const newPasswords: string[] = [];
    for (let n = 0; n < 5; n++) {
      let pw = '';
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      for (let i = 0; i < length; i++) pw += chars[arr[i] % chars.length];
      newPasswords.push(pw);
    }
    setPasswords(newPasswords);
  }, [length, uppercase, lowercase, numbers, symbols, excludeSimilar]);

  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++; if (pw.length >= 12) score++; if (pw.length >= 16) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++; if (/[^a-zA-Z\d]/.test(pw)) score++;
    if (score <= 2) return { label: 'Weak', color: 'text-red-400 bg-red-400/10', width: '25%' };
    if (score <= 3) return { label: 'Fair', color: 'text-yellow-400 bg-yellow-400/10', width: '50%' };
    if (score <= 4) return { label: 'Strong', color: 'text-blue-400 bg-blue-400/10', width: '75%' };
    return { label: 'Very Strong', color: 'text-green-400 bg-green-400/10', width: '100%' };
  };

  const copyPassword = async (pw: string, idx: number) => {
    try { await navigator.clipboard.writeText(pw); } catch {
      const t = document.createElement('textarea'); t.value = pw; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"><Lock className="w-8 h-8 text-green-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Password Generator</h1>
        <p className="text-ink/60">Generate strong, secure passwords with customizable options</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-ink/60">Length: {length}</label>
            <span className="text-sm font-bold text-ink">{length} chars</span>
          </div>
          <input type="range" min="8" max="128" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full accent-green-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Uppercase (A-Z)', value: uppercase, set: setUppercase },
            { label: 'Lowercase (a-z)', value: lowercase, set: setLowercase },
            { label: 'Numbers (0-9)', value: numbers, set: setNumbers },
            { label: 'Symbols (!@#)', value: symbols, set: setSymbols },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl cursor-pointer">
              <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="accent-green-400" />
              <span className="text-sm text-ink">{label}</span>
            </label>
          ))}
        </div>

        <label className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-xl cursor-pointer">
          <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} className="accent-green-400" />
          <span className="text-sm text-ink">Exclude similar characters (0, O, l, 1, I)</span>
        </label>

        <button onClick={generate} className="w-full py-4 bg-green-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-green-400/90 transition-colors flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" /> Generate Passwords
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Generated Passwords</h3>
          {passwords.map((pw, i) => {
            const strength = getStrength(pw);
            return (
              <div key={i} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <code className="flex-1 text-ink font-mono text-sm break-all">{pw}</code>
                  <button onClick={() => copyPassword(pw, i)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                    {copiedIdx === i ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-current transition-all" style={{ width: strength.width }} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${strength.color} px-2 py-0.5 rounded`}>{strength.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
