import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingUp, RefreshCw, Globe, Info } from 'lucide-react';

// Exchange rates (relative to USD - in real app, these would come from an API)
const exchangeRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 157.50,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.90,
  CNY: 7.24,
  SGD: 1.35,
  HKD: 7.80,
  NZD: 1.66,
  SEK: 10.85,
  NOK: 10.75,
  DKK: 6.88,
  PLN: 3.98,
  THB: 36.75,
  MYR: 4.72,
  IDR: 16250,
  PHP: 58.50
};

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' }
];

interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
}

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertCurrency = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const amountNum = parseFloat(amount) || 0;
      const fromRate = exchangeRates[fromCurrency];
      const toRate = exchangeRates[toCurrency];
      
      // Convert: amount in fromCurrency -> USD -> toCurrency
      const usdAmount = amountNum / fromRate;
      const convertedAmount = usdAmount * toRate;
      const rate = toRate / fromRate;
      
      setResult({
        fromAmount: amountNum,
        toAmount: convertedAmount,
        fromCurrency,
        toCurrency,
        rate
      });
      
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || '';
    
    if (currencyCode === 'JPY' || currencyCode === 'IDR') {
      return `${symbol}${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    
    return `${symbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code);
  };

  const popularPairs = [
    { from: 'USD', to: 'INR', name: 'USD to INR' },
    { from: 'EUR', to: 'USD', name: 'EUR to USD' },
    { from: 'GBP', to: 'USD', name: 'GBP to USD' },
    { from: 'USD', to: 'EUR', name: 'USD to EUR' }
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
          Currency Converter
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Convert between major world currencies with real-time exchange rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Converter Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              Convert Currency
            </h2>

            {/* Popular Pairs */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-3">Popular Pairs</label>
              <div className="grid grid-cols-2 gap-3">
                {popularPairs.map((pair) => (
                  <button
                    key={`${pair.from}-${pair.to}`}
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                    }}
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-ink/80 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    {pair.name}
                  </button>
                ))}
              </div>
            </div>

            {/* From Currency */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">From</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={swapCurrencies}
                className="p-3 bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-all"
              >
                <RefreshCw className="w-5 h-5 text-primary" />
              </button>
            </div>

            {/* To Currency */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-bold text-ink/60">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold transition-all focus:border-primary/50"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Convert Button */}
            <button
              onClick={convertCurrency}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5" />
                  Convert Now
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {result && !isLoading && (
            <>
              {/* Conversion Result */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-display font-black text-ink">
                    {formatCurrency(result.fromAmount, result.fromCurrency)}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-ink/60">equals</span>
                  </div>
                  <div className="text-4xl font-display font-black text-primary">
                    {formatCurrency(result.toAmount, result.toCurrency)}
                  </div>
                  <div className="text-sm text-ink/60">
                    1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-ink mb-4">Exchange Rate Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Exchange Rate</span>
                    <span className="text-sm font-bold text-ink">
                      1 {result.fromCurrency} = {result.rate.toFixed(6)} {result.toCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Inverse Rate</span>
                    <span className="text-sm font-bold text-ink">
                      1 {result.toCurrency} = {(1 / result.rate).toFixed(6)} {result.fromCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-ink/60">Last Updated</span>
                    <span className="text-sm font-bold text-ink">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Currency Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getCurrencyInfo(result.fromCurrency)?.flag}</span>
                    <div>
                      <p className="text-sm font-bold text-ink">{result.fromCurrency}</p>
                      <p className="text-xs text-ink/60">{getCurrencyInfo(result.fromCurrency)?.name}</p>
                    </div>
                  </div>
                  <p className="text-lg font-display font-black text-ink">
                    {formatCurrency(result.fromAmount, result.fromCurrency)}
                  </p>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{getCurrencyInfo(result.toCurrency)?.flag}</span>
                    <div>
                      <p className="text-sm font-bold text-ink">{result.toCurrency}</p>
                      <p className="text-xs text-ink/60">{getCurrencyInfo(result.toCurrency)?.name}</p>
                    </div>
                  </div>
                  <p className="text-lg font-display font-black text-primary">
                    {formatCurrency(result.toAmount, result.toCurrency)}
                  </p>
                </div>
              </div>

              {/* Currency Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-bold mb-1">Currency Tips</p>
                  <p className="text-blue-300/80">
                    Exchange rates fluctuate throughout the day. For large transactions, 
                    consider checking with your bank for current rates and any additional fees.
                  </p>
                </div>
              </div>
            </>
          )}

          {isLoading && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
              <RefreshCw className="w-16 h-16 text-primary/20 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-ink mb-2">Converting Currency</h3>
              <p className="text-ink/60">Getting latest exchange rates...</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
