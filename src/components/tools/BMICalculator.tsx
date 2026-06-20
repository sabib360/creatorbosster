import { useState, useMemo } from 'react';
import { Heart, AlertCircle, Activity } from 'lucide-react';

type Unit = 'metric' | 'imperial';

export default function BMICalculator() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    let heightM: number, weight: number;
    if (unit === 'metric') {
      const h = parseFloat(heightCm); const w = parseFloat(weightKg);
      if (!h || !w || h <= 0 || w <= 0) return null;
      heightM = h / 100; weight = w;
    } else {
      const ft = parseFloat(heightFt) || 0; const inc = parseFloat(heightIn) || 0;
      const w = parseFloat(weightLbs);
      if ((!ft && !inc) || !w || w <= 0) return null;
      heightM = (ft * 12 + inc) * 0.0254; weight = w * 0.453592;
    }
    if (heightM <= 0) return null;
    setError(null);

    const bmi = weight / (heightM * heightM);
    let category: string, color: string, advice: string;
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400'; advice = 'Consider consulting a nutritionist for a healthy weight gain plan. Focus on nutrient-dense foods and strength training.'; }
    else if (bmi < 25) { category = 'Normal'; color = 'text-green-400'; advice = 'Great! Maintain your healthy weight with balanced nutrition and regular physical activity.'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-400'; advice = 'Consider increasing physical activity and reducing processed foods. Small lifestyle changes can make a big difference.'; }
    else { category = 'Obese'; color = 'text-red-400'; advice = 'Consult a healthcare provider for personalized guidance. Focus on sustainable dietary changes and regular exercise.'; }

    // BMI gauge position (0-100% for range 10-40)
    const gaugePos = Math.min(Math.max((bmi - 10) / 30 * 100, 0), 100);

    return { bmi: bmi.toFixed(1), category, color, advice, gaugePos };
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"><Heart className="w-8 h-8 text-green-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">BMI Calculator</h1>
        <p className="text-ink/60">Calculate your Body Mass Index and get health recommendations</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex gap-2">
          <button onClick={() => setUnit('metric')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${unit === 'metric' ? 'bg-green-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Metric (cm/kg)</button>
          <button onClick={() => setUnit('imperial')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${unit === 'imperial' ? 'bg-green-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Imperial (ft/lbs)</button>
        </div>

        {unit === 'metric' ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Height (cm)</label>
              <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="170" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Weight (kg)</label>
              <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="70" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Height (ft)</label>
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Height (in)</label>
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="7" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Weight (lbs)</label>
              <input type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)} placeholder="154" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl text-center">
            <div className="text-5xl font-black text-ink">{result.bmi}</div>
            <div className={`text-lg font-bold mt-2 ${result.color}`}>{result.category}</div>
          </div>

          {/* BMI Gauge */}
          <div className="p-4 bg-slate-800/50 rounded-2xl">
            <div className="relative h-4 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full overflow-visible">
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-black shadow-lg transition-all duration-500" style={{ left: `${result.gaugePos}%`, transform: `translate(-50%, -50%)` }} />
            </div>
            <div className="flex justify-between text-[10px] text-ink/60 mt-2">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          <div className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl">
            <h4 className="font-bold text-green-400 text-sm uppercase mb-2 flex items-center gap-2"><Activity className="w-4 h-4" /> Health Recommendation</h4>
            <p className="text-ink/70 text-sm leading-relaxed">{result.advice}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { range: '<18.5', label: 'Underweight', color: 'text-blue-400' },
              { range: '18.5-24.9', label: 'Normal', color: 'text-green-400' },
              { range: '25-29.9', label: 'Overweight', color: 'text-yellow-400' },
              { range: '30+', label: 'Obese', color: 'text-red-400' },
            ].map(({ range, label, color }) => (
              <div key={label} className="p-2 bg-slate-800 rounded-lg">
                <div className={`font-bold ${color}`}>{range}</div>
                <div className="text-ink/60">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
