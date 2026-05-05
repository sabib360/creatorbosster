import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Calendar, Percent, TrendingUp, Info, Shield } from 'lucide-react';

interface FDDetails {
  principal: number;
  annualRate: number;
  tenureYears: number;
  tenureMonths: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'halfyearly' | 'yearly';
}

interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  effectiveRate: number;
  quarterlyBreakdown: {
    quarter: number;
    balance: number;
    interest: number;
  }[];
}

export default function FDCalculator() {
  const [fdDetails, setFdDetails] = useState<FDDetails>({
    principal: 100000,
    annualRate: 6.5,
    tenureYears: 2,
    tenureMonths: 0,
    compoundingFrequency: 'quarterly'
  });

  const [result, setResult] = useState<FDResult | null>(null);
  const [errors, setErrors] = useState<Partial<FDDetails>>({});

  const calculateFD = () => {
    const { principal, annualRate, tenureYears, tenureMonths, compoundingFrequency } = fdDetails;
    
    // Validation
    const newErrors: Partial<FDDetails> = {};
    if (principal <= 0) newErrors.principal = 0;
    if (annualRate <= 0 || annualRate > 20) newErrors.annualRate = 0;
    if (tenureYears < 0 || tenureMonths < 0 || (tenureYears === 0 && tenureMonths === 0)) {
      newErrors.tenureYears = 0;
      newErrors.tenureMonths = 0;
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const totalMonths = tenureYears * 12 + tenureMonths;
    const totalYears = totalMonths / 12;
    
    // Calculate compound interest based on frequency
    let n = 1; // compounding frequency per year
    switch (compoundingFrequency) {
      case 'monthly': n = 12; break;
      case 'quarterly': n = 4; break;
      case 'halfyearly': n = 2; break;
      case 'yearly': n = 1; break;
    }
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const ratePerPeriod = annualRate / 100 / n;
    const totalPeriods = totalYears * n;
    const maturityAmount = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
    const totalInterest = maturityAmount - principal;
    const effectiveRate = ((maturityAmount / principal - 1) / totalYears) * 100;
    
    // Generate quarterly breakdown
    const quarterlyBreakdown = [];
    let balance = principal;
    const quarters = Math.ceil(totalMonths / 3);
    
    for (let quarter = 1; quarter <= quarters; quarter++) {
      const monthsElapsed = quarter * 3;
      const yearsElapsed = monthsElapsed / 12;
      const periodsElapsed = yearsElapsed * n;
      const newBalance = principal * Math.pow(1 + ratePerPeriod, Math.min(periodsElapsed, totalPeriods));
      const interestEarned = newBalance - balance;
      
      quarterlyBreakdown.push({
        quarter,
        balance: newBalance,
        interest: interestEarned
      });
      
      balance = newBalance;
    }
    
    setResult({
      maturityAmount,
      totalInterest,
      effectiveRate,
      quarterlyBreakdown
    });
  };

  useEffect(() => {
    calculateFD();
  }, [fdDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof FDDetails, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFdDetails(prev => ({ ...prev, [field]: numValue }));
  };

  const handleFrequencyChange = (frequency: FDDetails['compoundingFrequency']) => {
    setFdDetails(prev => ({ ...prev, compoundingFrequency: frequency }));
  };

  const fdPresets = [
    { name: 'Short Term', principal: 50000, rate: 5.5, years: 1, months: 0 },
    { name: 'Medium Term', principal: 100000, rate: 6.5, years: 2, months: 0 },
    { name: 'Long Term', principal: 200000, rate: 7.0, years: 5, months: 0 },
    { name: 'Senior Citizen', principal: 150000, rate: 7.5, years: 3, months: 0 }
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
          Fixed Deposit Calculator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Calculate returns on your fixed deposit investments with compound interest.
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
              <Shield className="w-6 h-6 text-primary" />
              FD Details
            </h2>

            {/* FD Presets */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Quick FD Options</label>
              <div className="grid grid-cols-2 gap-3">
                {fdPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setFdDetails({
                      principal: preset.principal,
                      annualRate: preset.rate,
                      tenureYears: preset.years,
                      tenureMonths: preset.months,
                      compoundingFrequency: 'quarterly'
                    })}
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-ink/80 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Principal Amount */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Principal Amount (₹)
              </label>
              <input
                type="number"
                value={fdDetails.principal}
                onChange={(e) => handleInputChange('principal', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.principal ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter principal amount"
              />
              {errors.principal && (
                <p className="text-xs text-red-400">Please enter a valid amount</p>
              )}
            </div>

            {/* Interest Rate */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={fdDetails.annualRate}
                onChange={(e) => handleInputChange('annualRate', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.annualRate ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter interest rate"
              />
              {errors.annualRate && (
                <p className="text-xs text-red-400">Please enter a valid rate (0-20%)</p>
              )}
            </div>

            {/* Tenure */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                FD Tenure
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={fdDetails.tenureYears}
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
                    value={fdDetails.tenureMonths}
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
                <p className="text-xs text-red-400">Please enter a valid tenure</p>
              )}
            </div>

            {/* Compounding Frequency */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">Compounding Frequency</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'halfyearly', label: 'Half-Yearly' },
                  { value: 'yearly', label: 'Yearly' }
                ].map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => handleFrequencyChange(freq.value as FDDetails['compoundingFrequency'])}
                    className={`p-3 rounded-lg font-bold transition-all ${
                      fdDetails.compoundingFrequency === freq.value
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
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
                      <p className="text-sm font-bold text-primary/60 uppercase tracking-wider">Maturity Amount</p>
                      <p className="text-3xl font-display font-black text-primary mt-1">
                        {formatCurrency(result.maturityAmount)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Total Interest</p>
                    <p className="text-xl font-display font-black text-green-400 mt-1">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Effective Rate</p>
                    <p className="text-xl font-display font-black text-ink mt-1">
                      {result.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* FD Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-300">
                  <p className="font-bold mb-1">Fixed Deposit Benefits</p>
                  <p className="text-green-300/80">
                    FDs offer guaranteed returns with capital protection. Higher compounding frequency yields better returns. 
                    Senior citizens typically get 0.5% extra interest rate.
                  </p>
                </div>
              </div>

              {/* Quarterly Breakdown */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Quarterly Growth</h3>
                <div className="space-y-3">
                  {result.quarterlyBreakdown.slice(0, 8).map((quarter) => (
                    <div key={quarter.quarter} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-ink/80">Q{quarter.quarter}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-ink">{formatCurrency(quarter.balance)}</div>
                        <div className="text-xs text-green-400">+{formatCurrency(quarter.interest)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {result.quarterlyBreakdown.length > 8 && (
                  <p className="text-xs text-ink/40 mt-3 text-center">
                    Continue for {result.quarterlyBreakdown.length - 8} more quarters
                  </p>
                )}
              </div>

              {/* Investment Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  FD Investment Tips
                </h3>
                <div className="space-y-2 text-sm text-ink/70">
                  <p>• Choose longer tenure for higher interest rates</p>
                  <p>• Quarterly compounding offers better returns than yearly</p>
                  <p>• Consider tax implications on FD interest income</p>
                  <p>• Senior citizens get preferential rates</p>
                  <p>• Ladder your FDs for better liquidity</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
