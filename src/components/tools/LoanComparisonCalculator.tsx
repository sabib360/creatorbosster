import { useState, useMemo } from 'react';
import { Scale, AlertCircle, Trophy, TrendingDown } from 'lucide-react';

interface LoanInput { amount: string; rate: string; tenure: string; name: string; }
const defaultLoan = (name: string): LoanInput => ({ amount: '', rate: '', tenure: '', name });

function calculateEMI(principal: number, annualRate: number, tenureMonths: number) {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return null;
  const r = annualRate / 12 / 100;
  const emi = principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

export default function LoanComparisonCalculator() {
  const [loans, setLoans] = useState<LoanInput[]>([defaultLoan('Loan A'), defaultLoan('Loan B'), defaultLoan('Loan C')]);
  const [activeLoans, setActiveLoans] = useState([true, true, false]);

  const toggleLoan = (i: number) => setActiveLoans(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  const updateLoan = (i: number, field: keyof LoanInput, value: string) => setLoans(prev => { const n = [...prev]; n[i] = { ...n[i], [field]: value }; return n; });

  const results = useMemo(() => {
    return loans.map((loan, i) => {
      if (!activeLoans[i]) return null;
      const p = parseFloat(loan.amount); const r = parseFloat(loan.rate); const t = parseFloat(loan.tenure);
      if (!p || !r || !t) return null;
      return { ...calculateEMI(p, r, t * 12)!, tenureMonths: t * 12, principal: p, rate: r, tenure: t };
    });
  }, [loans, activeLoans]);

  const validResults = results.filter(Boolean) as NonNullable<(typeof results)[0]>[];
  const bestIdx = validResults.length > 0 ? validResults.reduce((best, r, i) => r.totalInterest < validResults[best].totalInterest ? i : best, 0) : -1;

  const formatCurrency = (n: number) => n >= 100000 ? `${(n / 100000).toFixed(2)}L` : n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"><Scale className="w-8 h-8 text-green-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Loan Comparison Calculator</h1>
        <p className="text-ink/60">Compare up to 3 loans side-by-side and find the best deal</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {loans.map((loan, i) => (
          <div key={i} className={`p-5 rounded-2xl border transition-colors ${activeLoans[i] ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900/30 border-slate-800 opacity-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{loan.name}</h3>
              <button onClick={() => toggleLoan(i)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${activeLoans[i] ? 'bg-green-400 text-black' : 'bg-slate-700 text-ink'}`}>{activeLoans[i] ? 'Active' : 'Off'}</button>
            </div>
            {activeLoans[i] && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-ink/60">Loan Amount</label>
                  <input type="number" value={loan.amount} onChange={(e) => updateLoan(i, 'amount', e.target.value)} placeholder="10,00,000" className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-ink/60">Interest Rate (% p.a.)</label>
                  <input type="number" value={loan.rate} onChange={(e) => updateLoan(i, 'rate', e.target.value)} placeholder="8.5" step="0.1" className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-ink/60">Tenure (Years)</label>
                  <input type="number" value={loan.tenure} onChange={(e) => updateLoan(i, 'tenure', e.target.value)} placeholder="20" className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {validResults.length >= 2 && (
        <div className="space-y-6">
          {/* Best Deal */}
          {bestIdx >= 0 && (
            <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-4">
              <Trophy className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-green-400 text-sm uppercase">Best Deal: {loans[results.indexOf(validResults[bestIdx])].name}</h4>
                <p className="text-ink/70 text-sm">Saves {formatCurrency(Math.max(...validResults.map(r => r.totalInterest)) - validResults[bestIdx].totalInterest)} in interest</p>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 text-ink/60 font-bold uppercase tracking-widest text-xs">Metric</th>
                  {validResults.map((_, i) => (
                    <th key={i} className="text-right py-3 text-ink font-bold uppercase tracking-widest text-xs">{loans[results.indexOf(validResults[i])].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Monthly EMI', key: 'emi' as const, best: 'min' as const },
                  { label: 'Total Interest', key: 'totalInterest' as const, best: 'min' as const },
                  { label: 'Total Payment', key: 'totalPayment' as const, best: 'min' as const },
                ].map(({ label, key, best }) => {
                  const values = validResults.map(r => r[key]);
                  const bestVal = best === 'min' ? Math.min(...values) : Math.max(...values);
                  return (
                    <tr key={label} className="border-b border-slate-800">
                      <td className="py-3 text-ink/60 font-bold">{label}</td>
                      {validResults.map((r, i) => (
                        <td key={i} className={`py-3 text-right font-bold ${r[key] === bestVal ? 'text-green-400' : 'text-ink'}`}>
                          ₹{formatCurrency(r[key])}
                          {r[key] === bestVal && <span className="text-[10px] ml-1">✓ BEST</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Visual Bar Comparison */}
          <div className="space-y-3">
            <h4 className="font-bold text-ink uppercase tracking-widest text-sm">EMI Comparison</h4>
            {validResults.map((r, i) => {
              const idx = results.indexOf(validResults[i]);
              const maxEMI = Math.max(...validResults.map(v => v.emi));
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink font-bold">{loans[idx].name}</span>
                    <span className="text-ink/60">₹{formatCurrency(r.emi)}/mo</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${i === bestIdx ? 'bg-green-400' : 'bg-slate-600'}`} style={{ width: `${(r.emi / maxEMI) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {validResults.length < 2 && (
        <div className="p-6 text-center text-ink/40 text-sm">Enter details for at least 2 loans to see comparison</div>
      )}
    </div>
  );
}
