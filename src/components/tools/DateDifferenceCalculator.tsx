import { useState, useMemo } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';

export default function DateDifferenceCalculator() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setError('Please enter valid dates'); return null; }
    setError(null);

    const earlier = d1 < d2 ? d1 : d2;
    const later = d1 < d2 ? d2 : d1;
    const diffMs = later.getTime() - earlier.getTime();

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
    let days = later.getDate() - earlier.getDate();
    if (days < 0) { months--; const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0); days += prevMonth.getDate(); }
    const years = Math.floor(months / 12);
    months = months % 12;

    // Business days (Mon-Fri)
    let businessDays = 0;
    const temp = new Date(earlier);
    while (temp <= later) {
      const day = temp.getDay();
      if (day !== 0 && day !== 6) businessDays++;
      temp.setDate(temp.getDate() + 1);
    }
    const weekendDays = totalDays - businessDays;

    return { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, businessDays, weekendDays };
  }, [date1, date2]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto"><Calendar className="w-8 h-8 text-green-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Date Difference Calculator</h1>
        <p className="text-ink/60">Calculate the exact difference between two dates</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">Start Date</label>
            <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
          </div>
          <div className="space-y-2">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">End Date</label>
            <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-green-400" />
          </div>
        </div>
      </div>

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl text-center">
            <div className="text-4xl font-black text-ink">{result.years}y {result.months}m {result.days}d</div>
            <p className="text-ink/60 text-sm mt-1">Exact Difference</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Days', value: result.totalDays.toLocaleString() },
              { label: 'Total Weeks', value: result.totalWeeks.toLocaleString() },
              { label: 'Total Hours', value: result.totalHours.toLocaleString() },
              { label: 'Total Minutes', value: result.totalMinutes.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-slate-800/50 rounded-xl text-center">
                <div className="text-xl font-black text-ink">{value}</div>
                <div className="text-xs text-ink/60 uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <div className="text-xl font-black text-green-400">{result.businessDays}</div>
              <div className="text-xs text-ink/60 uppercase mt-1">Business Days</div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <div className="text-xl font-black text-blue-400">{result.weekendDays}</div>
              <div className="text-xs text-ink/60 uppercase mt-1">Weekend Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
