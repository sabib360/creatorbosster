import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface UnitCategory {
  name: string;
  units: { name: string; factor: number }[];
}

const CATEGORIES: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    units: [
      { name: 'Meter', factor: 1 }, { name: 'Kilometer', factor: 1000 }, { name: 'Centimeter', factor: 0.01 },
      { name: 'Millimeter', factor: 0.001 }, { name: 'Mile', factor: 1609.344 }, { name: 'Yard', factor: 0.9144 },
      { name: 'Foot', factor: 0.3048 }, { name: 'Inch', factor: 0.0254 },
    ],
  },
  weight: {
    name: 'Weight',
    units: [
      { name: 'Kilogram', factor: 1 }, { name: 'Gram', factor: 0.001 }, { name: 'Milligram', factor: 0.000001 },
      { name: 'Pound', factor: 0.453592 }, { name: 'Ounce', factor: 0.0283495 }, { name: 'Ton', factor: 1000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [{ name: 'Celsius', factor: 0 }, { name: 'Fahrenheit', factor: 0 }, { name: 'Kelvin', factor: 0 }],
  },
  volume: {
    name: 'Volume',
    units: [
      { name: 'Liter', factor: 1 }, { name: 'Milliliter', factor: 0.001 }, { name: 'Gallon (US)', factor: 3.78541 },
      { name: 'Quart (US)', factor: 0.946353 }, { name: 'Pint (US)', factor: 0.473176 }, { name: 'Cup (US)', factor: 0.236588 },
      { name: 'Fluid Ounce', factor: 0.0295735 }, { name: 'Cubic Meter', factor: 1000 },
    ],
  },
  area: {
    name: 'Area',
    units: [
      { name: 'Sq Meter', factor: 1 }, { name: 'Sq Kilometer', factor: 1000000 }, { name: 'Sq Centimeter', factor: 0.0001 },
      { name: 'Hectare', factor: 10000 }, { name: 'Acre', factor: 4046.86 }, { name: 'Sq Mile', factor: 2589988 },
      { name: 'Sq Foot', factor: 0.092903 }, { name: 'Sq Inch', factor: 0.00064516 },
    ],
  },
  speed: {
    name: 'Speed',
    units: [
      { name: 'm/s', factor: 1 }, { name: 'km/h', factor: 0.277778 }, { name: 'mph', factor: 0.44704 },
      { name: 'Knot', factor: 0.514444 }, { name: 'ft/s', factor: 0.3048 },
    ],
  },
  data: {
    name: 'Data',
    units: [
      { name: 'Byte', factor: 1 }, { name: 'Kilobyte', factor: 1024 }, { name: 'Megabyte', factor: 1048576 },
      { name: 'Gigabyte', factor: 1073741824 }, { name: 'Terabyte', factor: 1099511627776 },
    ],
  },
  time: {
    name: 'Time',
    units: [
      { name: 'Second', factor: 1 }, { name: 'Millisecond', factor: 0.001 }, { name: 'Minute', factor: 60 },
      { name: 'Hour', factor: 3600 }, { name: 'Day', factor: 86400 }, { name: 'Week', factor: 604800 },
      { name: 'Month (30d)', factor: 2592000 }, { name: 'Year (365d)', factor: 31536000 },
    ],
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [value, setValue] = useState('');

  const cat = CATEGORIES[category];
  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v === 0) return null;
    if (category === 'temperature') {
      const celsius = fromUnit === 0 ? v : fromUnit === 1 ? (v - 32) * 5 / 9 : v - 273.15;
      return toUnit === 0 ? celsius : toUnit === 1 ? celsius * 9 / 5 + 32 : celsius + 273.15;
    }
    const baseValue = v * cat.units[fromUnit].factor;
    return baseValue / cat.units[toUnit].factor;
  }, [value, fromUnit, toUnit, category, cat]);

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Unit Converter</h1>
        <p className="text-ink/60">Convert between length, weight, temperature, volume, and more</p>
      </div>

      <div className="p-6 bg-slate-800/50 rounded-2xl space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <button key={key} onClick={() => { setCategory(key); setFromUnit(0); setToUnit(1); setValue(''); }} className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors capitalize ${category === key ? 'bg-green-400 text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{c.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div className="space-y-2">
            <label className="text-xs text-ink/60 uppercase">From</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(parseInt(e.target.value))} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm">
              {cat.units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
            </select>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-lg font-bold focus:outline-none focus:border-green-400" />
          </div>

          <button onClick={swap} className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors mb-1"><ArrowRightLeft className="w-5 h-5 text-ink" /></button>

          <div className="space-y-2">
            <label className="text-xs text-ink/60 uppercase">To</label>
            <select value={toUnit} onChange={(e) => setToUnit(parseInt(e.target.value))} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm">
              {cat.units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
            </select>
            <div className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink text-lg font-bold min-h-[52px]">
              {result !== null ? (Math.abs(result) < 0.0001 && result !== 0 ? result.toExponential(4) : parseFloat(result.toFixed(6)).toLocaleString()) : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Common conversions */}
      <div className="p-5 bg-slate-800/50 rounded-2xl">
        <h4 className="font-bold text-ink uppercase tracking-widest text-sm mb-3">Common {cat.name} Conversions</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {cat.units.slice(0, 6).map((u, i) => (
            <div key={i} className="p-2 bg-slate-900/50 rounded-lg text-ink/70">
              1 {cat.units[0].name} = {cat.units[0].factor / u.factor < 0.01 ? (cat.units[0].factor / u.factor).toExponential(2) : parseFloat((cat.units[0].factor / u.factor).toFixed(4))} {u.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
