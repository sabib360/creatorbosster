import { useState } from 'react';
import { Percent, AlertCircle } from 'lucide-react';

type CalcType = 'of' | 'what' | 'increase' | 'decrease';

export default function PercentageCalculator() {
  const [calcType, setCalcType] = useState<CalcType>('of');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [error, setError] = useState<string | null>(null);

  const calculate = () => {
    const a = parseFloat(x); const b = parseFloat(y);
    if (isNaN(a) || isNaN(b) || b === 0) { setError('Please enter valid numbers'); return null; }
    setError(null);

    switch (calcType) {
      case 'of': return { result: (a / 100) * b, formula: `${a}% of ${b} = ${((a / 100) * b).toFixed(2)}`, explanation: `To find ${a}% of ${b}, multiply ${b} by ${a}/100 = ${(a / 100).toFixed(4)}. Result: ${((a / 100) * b).toFixed(2)}` };
      case 'what': return { result: (a / b) * 100, formula: `${a} is ${((a / b) * 100).toFixed(2)}% of ${b}`, explanation: `Divide ${a} by ${b} and multiply by 100. ${a} ÷ ${b} = ${(a / b).toFixed(4)} × 100 = ${((a / b) * 100).toFixed(2)}%` };
      case 'increase': return { result: b + (a / 100) * b, formula: `${b} + ${a}% = ${(b + (a / 100) * b).toFixed(2)}`, explanation: `Increase ${b} by ${a}%: ${b} × (1 + ${a}/100) = ${b} × ${(1 + a / 100).toFixed(4)} = ${(b + (a / 100) * b).toFixed(2)}` };
      case 'decrease': return { result: b - (a / 100) * b, formula: `${b} - ${a}% = ${(b - (a / 100) * b).toFixed(2)}`, explanation: `Decrease ${b} by ${a}%: ${b} × (1 - ${a}/100) = ${b} × ${(1 - a / 100).toFixed(4)} = ${(b - (a / 100) * b).toFixed(2)}` };
    }
  };

  const result = x && y ? calculate() : null;

  const types: { value: CalcType; label: string; desc: string; fields: [string, string] }[] = [
    { value: 'of', label: 'X% of Y', desc: 'Find percentage of a number', fields: ['Percentage', 'Number'] },
    { value: 'what', label: 'X is what % of Y', desc: 'Find what percent one number is of another', fields: ['Value', 'Total'] },
    { value: 'increase', label: 'Increase by %', desc: 'Add percentage to a number', fields: ['Percentage', 'Number'] },
    { value: 'decrease', label: 'Decrease by %', desc: 'Subtract percentage from a number', fields: ['Percentage', 'Number'] },
  ];

  const currentType = types.find(t => t.value === calcType)!;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"><Percent className="w-8 h-8 text-green-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Percentage Calculator</h1>
        <p className="text-ink/60">Calculate percentages with step-by-step solutions</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="grid grid-cols-2 gap-2">
          {types.map(t => (
            <button key={t.value} onClick={() => { setCalcType(t.value); setX(''); setY(''); }} className={`p-3 rounded-xl text-left transition-colors ${calcType === t.value ? 'bg-green-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
              <div className="text-xs font-bold">{t.label}</div>
              <div className="text-[10px] opacity-70">{t.desc}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-ink/60">{currentType.fields[0]}</label>
            <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/60">{currentType.fields[1]}</label>
            <input type="number" value={y} onChange={(e) => setY(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
          </div>
        </div>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl text-center">
            <div className="text-4xl font-black text-ink">{result.result.toFixed(2)}</div>
            <p className="text-ink/60 text-sm mt-1 font-mono">{result.formula}</p>
          </div>

          <div className="p-5 bg-slate-800/50 rounded-2xl">
            <h4 className="font-bold text-ink text-sm uppercase mb-2">Step-by-Step Solution</h4>
            <p className="text-ink/70 text-sm font-mono leading-relaxed">{result.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
