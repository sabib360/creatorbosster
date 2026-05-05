import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Receipt, Percent, Info, TrendingDown, AlertCircle } from 'lucide-react';

interface TaxDetails {
  annualIncome: number;
  ageGroup: 'below60' | '60to80' | 'above80';
  regime: 'old' | 'new';
  deductions: {
    section80C: number;
    section80D: number;
    section80TTA: number;
    hra: number;
    homeLoanInterest: number;
    other: number;
  };
}

interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxPayable: number;
  cess: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
}

const taxSlabsOld = {
  below60: [
    { min: 0, max: 250000, rate: 0 },
    { min: 250001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 }
  ],
  '60to80': [
    { min: 0, max: 300000, rate: 0 },
    { min: 300001, max: 500000, rate: 5 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 }
  ],
  above80: [
    { min: 0, max: 500000, rate: 0 },
    { min: 500001, max: 1000000, rate: 20 },
    { min: 1000001, max: Infinity, rate: 30 }
  ]
};

const taxSlabsNew = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 700000, rate: 5 },
  { min: 700001, max: 1000000, rate: 10 },
  { min: 1000001, max: 1200000, rate: 15 },
  { min: 1200001, max: 1500000, rate: 20 },
  { min: 1500001, max: Infinity, rate: 30 }
];

export default function TaxCalculator() {
  const [taxDetails, setTaxDetails] = useState<TaxDetails>({
    annualIncome: 1200000,
    ageGroup: 'below60',
    regime: 'new',
    deductions: {
      section80C: 150000,
      section80D: 25000,
      section80TTA: 10000,
      hra: 0,
      homeLoanInterest: 200000,
      other: 0
    }
  });

  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateTax = () => {
    const { annualIncome, ageGroup, regime, deductions } = taxDetails;
    
    let totalDeductions = 0;
    let taxableIncome = annualIncome;
    
    if (regime === 'old') {
      // Calculate total deductions for old regime
      const deductionValues = Object.values(deductions);
      totalDeductions = deductionValues.reduce((sum, val) => sum + val, 0);
      
      // Standard deduction
      totalDeductions += 50000;
      
      taxableIncome = Math.max(0, annualIncome - totalDeductions);
    } else {
      // New regime has standard deduction but no other deductions
      totalDeductions = 75000; // Standard deduction under new regime
      taxableIncome = Math.max(0, annualIncome - totalDeductions);
    }
    
    // Calculate tax based on slabs
    let taxPayable = 0;
    const slabs = regime === 'old' ? taxSlabsOld[ageGroup] : taxSlabsNew;
    
    for (const slab of slabs) {
      if (taxableIncome > slab.min) {
        const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
        taxPayable += (taxableInSlab * slab.rate) / 100;
      }
    }
    
    // Add cess (4% of tax)
    const cess = taxPayable * 0.04;
    const totalTax = taxPayable + cess;
    const takeHome = annualIncome - totalTax;
    const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;
    
    setResult({
      grossIncome: annualIncome,
      totalDeductions,
      taxableIncome,
      taxPayable,
      cess,
      totalTax,
      takeHome,
      effectiveRate
    });
  };

  useEffect(() => {
    calculateTax();
  }, [taxDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof TaxDetails, value: string | number) => {
    if (field === 'deductions') return;
    
    if (field === 'annualIncome') {
      setTaxDetails(prev => ({ ...prev, [field]: parseFloat(value as string) || 0 }));
    } else {
      setTaxDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDeductionChange = (deductionType: keyof TaxDetails['deductions'], value: string) => {
    setTaxDetails(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        [deductionType]: parseFloat(value) || 0
      }
    }));
  };

  const getTaxColor = (rate: number) => {
    if (rate <= 10) return 'text-green-400';
    if (rate <= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Income Tax Calculator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Calculate your income tax liability under both old and new tax regimes.
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
              <Receipt className="w-6 h-6 text-primary" />
              Tax Details
            </h2>

            {/* Annual Income */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Annual Income (₹)
              </label>
              <input
                type="number"
                value={taxDetails.annualIncome}
                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                placeholder="Enter annual income"
              />
            </div>

            {/* Age Group */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">Age Group</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'below60', label: 'Below 60' },
                  { value: '60to80', label: '60-80 Years' },
                  { value: 'above80', label: 'Above 80' }
                ].map((age) => (
                  <button
                    key={age.value}
                    onClick={() => handleInputChange('ageGroup', age.value)}
                    className={`p-3 rounded-lg font-bold transition-all ${
                      taxDetails.ageGroup === age.value
                        ? 'bg-primary/20 border border-primary/50 text-primary'
                        : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Regime */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">Tax Regime</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('regime', 'old')}
                  className={`p-3 rounded-lg font-bold transition-all ${
                    taxDetails.regime === 'old'
                      ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  Old Regime
                </button>
                <button
                  onClick={() => handleInputChange('regime', 'new')}
                  className={`p-3 rounded-lg font-bold transition-all ${
                    taxDetails.regime === 'new'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  New Regime
                </button>
              </div>
            </div>

            {/* Deductions (only for old regime) */}
            {taxDetails.regime === 'old' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-ink mb-4">Deductions</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">Section 80C (Max ₹1.5L)</label>
                  <input
                    type="number"
                    value={taxDetails.deductions.section80C}
                    onChange={(e) => handleDeductionChange('section80C', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                    placeholder="Enter 80C deduction"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">Section 80D (Medical)</label>
                  <input
                    type="number"
                    value={taxDetails.deductions.section80D}
                    onChange={(e) => handleDeductionChange('section80D', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                    placeholder="Enter 80D deduction"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">Home Loan Interest (Max ₹2L)</label>
                  <input
                    type="number"
                    value={taxDetails.deductions.homeLoanInterest}
                    onChange={(e) => handleDeductionChange('homeLoanInterest', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                    placeholder="Enter home loan interest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-ink/60">HRA</label>
                  <input
                    type="number"
                    value={taxDetails.deductions.hra}
                    onChange={(e) => handleDeductionChange('hra', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                    placeholder="Enter HRA"
                  />
                </div>
              </div>
            )}
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
                <div className="bg-gradient-to-r from-red-500/10 to-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-red-400/60 uppercase tracking-wider">Total Tax Payable</p>
                      <p className="text-3xl font-display font-black text-red-400 mt-1">
                        {formatCurrency(result.totalTax)}
                      </p>
                      <p className="text-sm text-ink/60 mt-1">
                        Effective Rate: {result.effectiveRate.toFixed(2)}%
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-400/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Take Home</p>
                    <p className="text-xl font-display font-black text-green-400 mt-1">
                      {formatCurrency(result.takeHome)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Taxable Income</p>
                    <p className="text-xl font-display font-black text-ink mt-1">
                      {formatCurrency(result.taxableIncome)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Tax Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Gross Income</span>
                    <span className="text-sm font-bold text-ink">{formatCurrency(result.grossIncome)}</span>
                  </div>
                  {taxDetails.regime === 'old' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-ink/60">Total Deductions</span>
                      <span className="text-sm font-bold text-green-400">-{formatCurrency(result.totalDeductions)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Taxable Income</span>
                    <span className="text-sm font-bold text-ink">{formatCurrency(result.taxableIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Income Tax</span>
                    <span className="text-sm font-bold text-red-400">{formatCurrency(result.taxPayable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Education Cess (4%)</span>
                    <span className="text-sm font-bold text-red-400">{formatCurrency(result.cess)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-3 flex justify-between">
                    <span className="text-sm font-bold text-ink">Total Tax Liability</span>
                    <span className="text-sm font-bold text-red-400">{formatCurrency(result.totalTax)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-bold mb-1">Tax Planning Tips</p>
                  <p className="text-blue-300/80">
                    {taxDetails.regime === 'old' 
                      ? 'Maximize deductions under 80C, 80D, and home loan interest. Consider tax-saving investments.'
                      : 'New regime offers lower rates but fewer deductions. Compare both regimes to choose the best option.'
                    }
                  </p>
                </div>
              </div>

              {/* Regime Comparison */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Quick Regime Switch</h3>
                <button
                  onClick={() => handleInputChange('regime', taxDetails.regime === 'old' ? 'new' : 'old')}
                  className="w-full py-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 text-blue-300 font-bold rounded-xl hover:border-blue-500/50 transition-all"
                >
                  Switch to {taxDetails.regime === 'old' ? 'New' : 'Old'} Regime
                </button>
                <p className="text-xs text-ink/40 mt-2 text-center">
                  Compare tax liability under both regimes
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
