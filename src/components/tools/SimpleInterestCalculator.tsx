import { useState } from 'react';
import { Calculator, Copy, Download } from 'lucide-react';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('2');
  const [interest, setInterest] = useState(0);
  const [amount, setAmount] = useState(0);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    
    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      alert('Please enter valid numbers');
      return;
    }
    
    const si = (p * r * t) / 100;
    const total = p + si;
    
    setInterest(si);
    setAmount(total);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    const content = `Simple Interest Calculator Result\n\nPrincipal Amount: ₹${parseFloat(principal).toLocaleString()}\nRate of Interest: ${rate}% per annum\nTime Period: ${time} years\n\nSimple Interest: ₹${interest.toLocaleString('en-IN', {maximumFractionDigits: 2})}\nTotal Amount: ₹${amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'simple-interest-result.txt');
    element.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-ink p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Simple Interest Calculator</h1>
          </div>
          
          <p className="text-ink/60 mb-8">Calculate simple interest on your principal amount</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Principal Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink focus:border-primary outline-none transition"
                placeholder="Enter principal amount"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Rate of Interest (% per annum)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                step="0.01"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink focus:border-primary outline-none transition"
                placeholder="Enter rate"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Time Period (years)</label>
              <input
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                step="0.1"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-ink focus:border-primary outline-none transition"
                placeholder="Enter time period"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Calculate Interest
            </button>

            {interest > 0 && (
              <div className="space-y-4 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-ink/60 text-sm mb-1">Principal Amount</p>
                    <p className="text-xl font-bold">₹{parseFloat(principal).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-ink/60 text-sm mb-1">Interest Rate</p>
                    <p className="text-xl font-bold">{rate}% p.a.</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-ink/60 text-sm mb-1">Time Period</p>
                    <p className="text-xl font-bold">{time} years</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-ink/60 text-sm mb-1">Simple Interest</p>
                    <p className="text-xl font-bold text-secondary">₹{interest.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-primary/30">
                  <p className="text-ink/60 text-sm mb-1">Total Amount (Principal + Interest)</p>
                  <p className="text-3xl font-bold text-primary">₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(`Principal: ${principal}, Interest: ${interest.toLocaleString('en-IN', {maximumFractionDigits: 2})}, Total: ${amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadResult}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 space-y-4">
            <h3 className="font-bold text-lg">Formula</h3>
            <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-sm">
              <p>Simple Interest = (Principal × Rate × Time) / 100</p>
              <p className="mt-2">Total Amount = Principal + Simple Interest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
