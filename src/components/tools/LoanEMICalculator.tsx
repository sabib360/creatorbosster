import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Calendar, Percent, TrendingUp, Info } from 'lucide-react';

interface LoanDetails {
  principal: number;
  annualRate: number;
  tenureYears: number;
  tenureMonths: number;
}

interface EMIDetails {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  startDate: Date;
  monthlyBreakdown: {
    month: number;
    date: Date;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function LoanEMICalculator() {
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    principal: 100000,
    annualRate: 8.5,
    tenureYears: 5,
    tenureMonths: 0
  });

  const [emiDetails, setEmiDetails] = useState<EMIDetails | null>(null);
  const [errors, setErrors] = useState<Partial<LoanDetails>>({});
  const [startDate, setStartDate] = useState<Date>(new Date());

  const calculateEMI = () => {
    const { principal, annualRate, tenureYears, tenureMonths } = loanDetails;
    
    // Validation
    const newErrors: Partial<LoanDetails> = {};
    if (principal <= 0) newErrors.principal = 0;
    if (annualRate <= 0 || annualRate > 100) newErrors.annualRate = 0;
    if (tenureYears < 0 || tenureMonths < 0 || (tenureYears === 0 && tenureMonths === 0)) {
      newErrors.tenureYears = 0;
      newErrors.tenureMonths = 0;
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const totalMonths = tenureYears * 12 + tenureMonths;
    const monthlyRate = annualRate / 12 / 100;
    
    // EMI calculation using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                 (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - principal;
    
    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let remainingBalance = principal;
    const paymentDate = new Date(startDate);
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;
      
      // Calculate payment date (add 1 month for each payment)
      const currentDate = new Date(paymentDate);
      currentDate.setMonth(currentDate.getMonth() + month - 1);
      
      monthlyBreakdown.push({
        month,
        date: currentDate,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      });
    }
    
    setEmiDetails({
      emi,
      totalPayment,
      totalInterest,
      startDate,
      monthlyBreakdown
    });
  };

  useEffect(() => {
    calculateEMI();
  }, [loanDetails, startDate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleInputChange = (field: keyof LoanDetails, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLoanDetails(prev => ({ ...prev, [field]: numValue }));
  };

  const presetLoans = [
    { name: 'Home Loan', principal: 5000000, rate: 8.5, years: 20 },
    { name: 'Car Loan', principal: 800000, rate: 9.5, years: 5 },
    { name: 'Personal Loan', principal: 500000, rate: 12, years: 3 },
    { name: 'Education Loan', principal: 1500000, rate: 10, years: 10 }
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
          Loan/EMI Calculator
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Calculate your monthly EMI, total interest, and payment schedule for any loan.
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
              <Calculator className="w-6 h-6 text-primary" />
              Loan Details
            </h2>

            {/* Preset Loans */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Quick Select</label>
              <div className="grid grid-cols-2 gap-3">
                {presetLoans.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setLoanDetails({
                      principal: preset.principal,
                      annualRate: preset.rate,
                      tenureYears: preset.years,
                      tenureMonths: 0
                    })}
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-ink/80 hover:border-primary/50 hover:text-primary transition-all"
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
                Loan Amount
              </label>
              <input
                type="number"
                value={loanDetails.principal}
                onChange={(e) => handleInputChange('principal', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.principal ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter loan amount"
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
                value={loanDetails.annualRate}
                onChange={(e) => handleInputChange('annualRate', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-ink font-bold transition-all ${
                  errors.annualRate ? 'border-red-500/50' : 'border-slate-700 focus:border-primary/50'
                }`}
                placeholder="Enter interest rate"
              />
              {errors.annualRate && (
                <p className="text-xs text-red-400">Please enter a valid rate (0-100%)</p>
              )}
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Loan Tenure
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={loanDetails.tenureYears}
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
                    value={loanDetails.tenureMonths}
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

            {/* Start Date */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Loan Start Date
              </label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
              />
              <p className="text-xs text-ink/40">
                First EMI will be due one month after this date
              </p>
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
          {emiDetails && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-primary/60 uppercase tracking-wider">Monthly EMI</p>
                      <p className="text-3xl font-display font-black text-primary mt-1">
                        {formatCurrency(emiDetails.emi)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Total Payment</p>
                    <p className="text-xl font-display font-black text-ink mt-1">
                      {formatCurrency(emiDetails.totalPayment)}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                    <p className="text-xs font-bold text-ink/60 uppercase tracking-wider">Total Interest</p>
                    <p className="text-xl font-display font-black text-ink mt-1">
                      {formatCurrency(emiDetails.totalInterest)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interest Info */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-bold mb-1">Interest Calculation</p>
                  <p className="text-blue-300/80">
                    Calculated using reducing balance method. EMI remains constant throughout the loan tenure.
                  </p>
                </div>
              </div>

              {/* Payment Schedule Preview */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Payment Schedule (First 6 months)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 text-ink/60 font-bold">Payment Date</th>
                        <th className="text-right py-2 text-ink/60 font-bold">EMI</th>
                        <th className="text-right py-2 text-ink/60 font-bold">Principal</th>
                        <th className="text-right py-2 text-ink/60 font-bold">Interest</th>
                        <th className="text-right py-2 text-ink/60 font-bold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiDetails.monthlyBreakdown.slice(0, 6).map((payment) => (
                        <tr key={payment.month} className="border-b border-slate-800/50">
                          <td className="py-2 text-ink/80">
                            {payment.date.toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </td>
                          <td className="text-right py-2 text-ink">{formatCurrency(emiDetails.emi)}</td>
                          <td className="text-right py-2 text-green-400">{formatCurrency(payment.principal)}</td>
                          <td className="text-right py-2 text-orange-400">{formatCurrency(payment.interest)}</td>
                          <td className="text-right py-2 text-ink/60">{formatCurrency(payment.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {emiDetails.monthlyBreakdown.length > 6 && (
                  <p className="text-xs text-ink/40 mt-3 text-center">
                    ... and {emiDetails.monthlyBreakdown.length - 6} more months
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
