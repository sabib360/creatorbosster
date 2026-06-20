import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, DollarSign, TrendingUp, PiggyBank, CreditCard, Wallet, Target, Receipt, Shield, Globe, Calendar, Heart, Percent, Ruler, Lock, Scale } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

const tools = [
  { name: 'Loan/EMI Calculator', path: '/tools/loan-emi-calculator', description: 'Calculate monthly EMI, total interest, and payment schedule', icon: Calculator },
  { name: 'SIP Calculator', path: '/tools/sip-calculator', description: 'Calculate SIP returns and wealth creation over time', icon: TrendingUp },
  { name: 'Loan Comparison', path: '/tools/loan-comparison', description: 'Compare up to 3 loans side-by-side to find the best deal', icon: Scale },
  { name: 'Budget Planner', path: '/tools/budget-planner', description: 'Track monthly income and expenses', icon: Wallet },
  { name: 'Tax Calculator', path: '/tools/tax-calculator', description: 'Calculate income tax under old and new regimes', icon: Receipt },
  { name: 'FD Calculator', path: '/tools/fd-calculator', description: 'Calculate fixed deposit returns', icon: Shield },
  { name: 'Currency Converter', path: '/tools/currency-converter', description: 'Convert between major world currencies', icon: Globe },
  { name: 'Age Calculator', path: '/tools/age-calculator', description: 'Calculate exact age in years, months, and days', icon: Calendar },
  { name: 'Date Difference', path: '/tools/date-difference', description: 'Calculate difference between two dates', icon: Calendar },
  { name: 'BMI Calculator', path: '/tools/bmi-calculator', description: 'Calculate Body Mass Index with health recommendations', icon: Heart },
  { name: 'Percentage Calculator', path: '/tools/percentage-calculator', description: 'Calculate percentages with step-by-step solutions', icon: Percent },
  { name: 'Unit Converter', path: '/tools/unit-converter', description: 'Convert between length, weight, temperature, and more', icon: Ruler },
  { name: 'Password Generator', path: '/tools/password-generator', description: 'Generate strong, secure passwords with strength indicator', icon: Lock },
];

export default function FinanceTools() {
  return (
    <>
      <SEOHead 
        title={categorySEOData['finance-tools'].title}
        description={categorySEOData['finance-tools'].description}
        keywords={categorySEOData['finance-tools'].keywords}
        canonicalUrl="https://creatorboostai.xyz/finance-tools"
        structuredData={categorySEOData['finance-tools'].structuredData}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Finance Tools
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Financial calculators and tools to help you make informed money decisions.
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 space-y-4">
        <p className="text-ink/70 leading-relaxed">
          <strong>Our Finance Tools</strong> empower you to take control of your financial future. Whether you're planning to buy a home, invest in stocks through SIP, manage your budget, calculate taxes, or make international currency conversions - our suite of financial calculators provides accurate, instant results.
        </p>
        <p className="text-ink/70 leading-relaxed">
          Designed for individual investors, salaried professionals, and entrepreneurs in India and beyond. Make informed financial decisions with our transparent, easy-to-use calculators that require no special expertise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={tool.path}
              className="group block p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-green-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <tool.icon className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-ink group-hover:text-green-400 transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-ink/40 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-base text-ink/60 mt-3">{tool.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Finance Features Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-8 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 rounded-3xl"
      >
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
            Smart Financial Planning
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            Our finance tools help you make informed decisions about loans, investments, and budgeting. 
            Calculate EMIs, compare loan options, and plan your financial future with confidence.
          </p>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
