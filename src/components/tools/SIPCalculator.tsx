import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, Calendar, Percent, Target, Info, ArrowUp } from 'lucide-react';

interface SIPDetails {
  monthlyAmount: number;
  annualReturn: number;
  tenureYears: number;
  tenureMonths: number;
}

interface SIPResult {
  totalInvestment: number;
  wealthGained: number;
  maturityValue: number;
  monthlyBreakdown: {
    month: number;
    invested: number;
    value: number;
    returns: number;
  }[];
}

export default function SIPCalculator() {
  const [sipDetails, setSipDetails] = useState<SIPDetails>({
    monthlyAmount: 5000,
    annualReturn: 12,
    tenureYears: 10,
    tenureMonths: 0
  });

  const [result, setResult] = useState<SIPResult | null>(null);
  const [errors, setErrors] = useState<Partial<SIPDetails>>({});

  const calculateSIP = () => {
    const { monthlyAmount, annualReturn, tenureYears, tenureMonths } = sipDetails;
    
    // Validation
    const newErrors: Partial<SIPDetails> = {};
    if (monthlyAmount <= 0) newErrors.monthlyAmount = 0;
    if (annualReturn <= 0 || annualReturn > 100) newErrors.annualReturn = 0;
    if (tenureYears < 0 || tenureMonths < 0 || (tenureYears === 0 && tenureMonths === 0)) {
      newErrors.tenureYears = 0;
      newErrors.tenureMonths = 0;
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const totalMonths = tenureYears * 12 + tenureMonths;
    const monthlyRate = annualReturn / 12 / 100;
    
    // SIP Formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
    // Where M = Maturity value, P = Monthly investment, i = Monthly interest rate, n = Number of months
    const maturityValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyAmount * totalMonths;
    const wealthGained = maturityValue - totalInvestment;
    
    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let totalInvestedSoFar = 0;
    let currentValue = 0;
    
    for (let month = 1; month <= totalMonths; month++) {
      totalInvestedSoFar += monthlyAmount;
      currentValue = monthlyAmount * ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate);
      const returns = currentValue - totalInvestedSoFar;
      
      monthlyBreakdown.push({
        month,
        invested: totalInvestedSoFar,
        value: currentValue,
        returns
      });
    }
    
    setResult({
      totalInvestment,
      wealthGained,
      maturityValue,
      monthlyBreakdown
    });
  };

  useEffect(() => {
    calculateSIP();
  }, [sipDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof SIPDetails, value: string) => {
    const numValue = parseFloat(value) || 0;
    setSipDetails(prev => ({ ...prev, [field]: numValue }));
  };

  const sipPresets = [
    { name: 'Conservative', amount: 2000, return: 8, years: 15 },
    { name: 'Moderate', amount: 5000, return: 12, years: 10 },
    { name: 'Aggressive', amount: 10000, return: 15, years: 7 },
    { name: 'Retirement', amount: 15000, return: 12, years: 20 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          SIP Calculator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Calculate your Systematic Investment Plan returns and wealth creation over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Investment Details
            </h2>

            {/* SIP Presets */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Quick Investment Plans</label>
              <div className="grid grid-cols-2 gap-3">
                {sipPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setSipDetails({
                      monthlyAmount: preset.amount,
                      annualReturn: preset.return,
                      tenureYears: preset.years,
                      tenureMonths: 0
                    })}
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-ink/80 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Investment */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                value={sipDetails.monthlyAmount}
                onChange={(e) => handleInputChange('monthlyAmount', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.monthlyAmount ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter monthly amount"
              />
              {errors.monthlyAmount && (
                <p className="text-xs text-red-400">Please enter a valid amount</p>
              )}
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={sipDetails.annualReturn}
                onChange={(e) => handleInputChange('annualReturn', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.annualReturn ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter expected return"
              />
              {errors.annualReturn && (
                <p className="text-xs text-red-400">Please enter a valid rate (0-100%)</p>
              )}
            </div>

            {/* Investment Period */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Investment Period
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={sipDetails.tenureYears}
                    onChange={(e) => handleInputChange('tenureYears', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                      errors.tenureYears ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                    }`}
                    placeholder="Years"
                  />
                  <label className="text-xs text-ink/40 mt-1 block">Years</label>
                </div>
                <div>
                  <input
                    type="number"
                    value={sipDetails.tenureMonths}
                    onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                      errors.tenureMonths ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                    }`}
                    placeholder="Months"
                  />
                  <label className="text-xs text-ink/40 mt-1 block">Months</label>
                </div>
              </div>
              {(errors.tenureYears || errors.tenureMonths) && (
                <p className="text-xs text-red-400">Please enter a valid period</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-primary/60 uppercase tracking-wider">Maturity Value</p>
                      <p className="text-3xl font-display font-black text-primary mt-1">
                        {formatCurrency(result.maturityValue)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Total Investment</p>
                    <p className="text-xl font-display font-black text-ink mt-1">
                      {formatCurrency(result.totalInvestment)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Wealth Gained</p>
                    <p className="text-xl font-display font-black text-green-400 mt-1">
                      {formatCurrency(result.wealthGained)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Returns Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-300">
                  <p className="font-bold mb-1">Power of Compounding</p>
                  <p className="text-green-300/80">
                    SIP harnesses the power of rupee cost averaging and compounding to build wealth over time. 
                    Regular investments can create substantial wealth through market growth.
                  </p>
                </div>
              </div>

              {/* Growth Chart Preview */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Investment Growth (Yearly)</h3>
                <div className="space-y-3">
                  {result.monthlyBreakdown.filter((_, index) => index % 12 === 11).slice(0, 5).map((year) => (
                    <div key={year.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-ink/80">Year {Math.floor(year.month / 12)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ink">{formatCurrency(year.value)}</div>
                        <div className="text-xs text-green-400">+{formatCurrency(year.returns)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {result.monthlyBreakdown.length > 60 && (
                  <p className="text-xs text-ink/40 mt-3 text-center">
                    Continue for {Math.floor(result.monthlyBreakdown.length / 12) - 5} more years
                  </p>
                )}
              </div>

              {/* Investment Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-blue-400" />
                  SIP Investment Tips
                </h3>
                <div className="space-y-2 text-sm text-ink/70">
                  <p>• Start early to maximize compounding benefits</p>
                  <p>• Be consistent with your monthly investments</p>
                  <p>• Increase SIP amount with income growth</p>
                  <p>• Stay invested for long-term wealth creation</p>
                  <p>• Review and rebalance portfolio periodically</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
