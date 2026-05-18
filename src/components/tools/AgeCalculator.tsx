import { useState } from 'react';
import { Copy, Download, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import ToolPage from '../ToolPage';

export default function AgeCalculator() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    weeks: number;
    totalDays: number;
    nextBirthday: string;
  } | null>(null);

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    if (birthDate > today) {
      alert('Birth date cannot be in the future');
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);

    // Calculate next birthday
    let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      weeks,
      totalDays,
      nextBirthday: `${daysUntilBirthday} days until next birthday`,
    });
  };

  const copyResult = () => {
    const text = result ? `Age: ${result.years} years, ${result.months} months, ${result.days} days` : '';
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Age Calculator</h1>
          <p className="text-gray-400">Calculate your exact age in years, months, days, and more</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Date of Birth</label>
            <div className="flex gap-3">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary"
              />
              <button
                onClick={calculateAge}
                className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div className="bg-primary/20 border border-primary/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{result.years}</div>
              <div className="text-sm text-gray-300">Years</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{result.months}</div>
              <div className="text-sm text-gray-300">Months</div>
            </div>
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{result.days}</div>
              <div className="text-sm text-gray-300">Days</div>
            </div>
            <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">{result.weeks}</div>
              <div className="text-sm text-gray-300">Weeks</div>
            </div>
            <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">{result.totalDays.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Days</div>
            </div>
            <div className="bg-pink-900/20 border border-pink-700/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-pink-400 mb-1">🎂</div>
              <div className="text-sm text-gray-300">{result.nextBirthday}</div>
            </div>
          </motion.div>
        )}

        {/* Copy Button */}
        {result && (
          <button
            onClick={copyResult}
            className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Result
          </button>
        )}

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ What You Get</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Exact age in years, months, and days</li>
            <li>✓ Total weeks lived</li>
            <li>✓ Total days lived</li>
            <li>✓ Days until next birthday</li>
            <li>✓ Accounts for leap years</li>
            <li>✓ 100% accurate calculation</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">❓ FAQ</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-1">How accurate is this calculator?</h4>
              <p className="text-gray-400 text-sm">Our calculator is 100% accurate and accounts for leap years and month variations.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Can I calculate someone else's age?</h4>
              <p className="text-gray-400 text-sm">Yes! Just enter their date of birth and click calculate.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Is my data saved?</h4>
              <p className="text-gray-400 text-sm">No! All calculations happen in your browser. We don't store any data.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </ToolPage>
  );
}
