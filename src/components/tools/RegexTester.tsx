import { useState } from 'react';
import { Copy, Check, Search, AlertCircle, BookOpen } from 'lucide-react';

const PATTERNS = [
  { name: 'Email', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Matches email addresses' },
  { name: 'URL', regex: 'https?://[^\\s]+', description: 'Matches HTTP/HTTPS URLs' },
  { name: 'Phone (US)', regex: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', description: 'US phone numbers' },
  { name: 'IP Address', regex: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', description: 'IPv4 addresses' },
  { name: 'Date (MM/DD/YYYY)', regex: '\\d{2}/\\d{2}/\\d{4}', description: 'Date in MM/DD/YYYY format' },
  { name: 'Hex Color', regex: '#[0-9a-fA-F]{3,8}', description: 'HEX color codes' },
  { name: 'HTML Tag', regex: '<[^>]+>', description: 'HTML tags' },
  { name: 'Credit Card', regex: '\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}', description: 'Credit card numbers' },
  { name: 'Username', regex: '^[a-zA-Z0-9_-]{3,16}$', description: 'Valid usernames (3-16 chars)' },
  { name: 'Password Strong', regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Strong password (8+ chars, upper, lower, digit, special)' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact us at support@example.com or sales@company.org for more info.');
  const [matches, setMatches] = useState<{ match: string; index: number; groups: string[] }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testRegex = () => {
    try {
      setError(null);
      const regex = new RegExp(pattern, flags);
      const found: { match: string; index: number; groups: string[] }[] = [];
      let m;
      if (flags.includes('g')) {
        while ((m = regex.exec(testString)) !== null) {
          found.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) break;
        }
      } else {
        m = regex.exec(testString);
        if (m) found.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      setMatches(found);
    } catch (e: any) { setError(e.message); setMatches([]); }
  };

  const getHighlightedText = () => {
    if (matches.length === 0) return testString;
    let result = '';
    let lastIdx = 0;
    const sorted = [...matches].sort((a, b) => a.index - b.index);
    for (const m of sorted) {
      if (m.index >= lastIdx) {
        result += testString.slice(lastIdx, m.index);
        result += `<mark class="bg-purple-400/30 text-purple-300 rounded px-0.5">${testString.slice(m.index, m.index + m.match.length)}</mark>`;
        lastIdx = m.index + m.match.length;
      }
    }
    result += testString.slice(lastIdx);
    return result;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto"><Search className="w-8 h-8 text-purple-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Regex Tester</h1>
        <p className="text-ink/60">Test regular expressions with real-time match highlighting</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="grid grid-cols-[1fr_80px] gap-3">
          <div className="space-y-1">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">Pattern</label>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-sm focus:outline-none focus:border-purple-400" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">Flags</label>
            <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-sm text-center focus:outline-none focus:border-purple-400" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Test String</label>
          <textarea value={testString} onChange={(e) => setTestString(e.target.value)} className="w-full h-24 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-sm resize-none focus:outline-none focus:border-purple-400" />
        </div>
        <button onClick={testRegex} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors flex items-center justify-center gap-2">
          <Search className="w-5 h-5" /> Test Regex
        </button>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="font-bold text-ink text-sm mb-2">Highlighted Matches</h4>
            <p className="text-ink/70 text-sm font-mono" dangerouslySetInnerHTML={{ __html: getHighlightedText() }} />
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
            <h4 className="font-bold text-ink text-sm">{matches.length} Match{matches.length !== 1 ? 'es' : ''}</h4>
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-purple-400 font-bold w-8">#{i + 1}</span>
                <code className="flex-1 text-ink font-mono bg-slate-900 px-2 py-1 rounded">{m.match}</code>
                <span className="text-ink/60">pos {m.index}</span>
                {m.groups.length > 0 && <span className="text-ink/40">groups: {m.groups.join(', ')}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Patterns */}
      <div className="p-5 bg-slate-800/50 rounded-2xl space-y-3">
        <h4 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" /> Common Patterns</h4>
        <div className="space-y-2">
          {PATTERNS.map((p, i) => (
            <button key={i} onClick={() => { setPattern(p.regex); }} className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-900 rounded-xl transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-ink font-bold text-sm">{p.name}</span>
                <code className="text-[10px] text-purple-400 font-mono truncate max-w-[200px]">{p.regex}</code>
              </div>
              <p className="text-ink/60 text-xs mt-0.5">{p.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
