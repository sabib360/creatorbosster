import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, DollarSign, TrendingUp, PiggyBank, CreditCard, Wallet, Target, Receipt, Shield, Globe } from 'lucide-react';
import SEOHead, { categorySEOData } from './SEOHead';

const tools = [
  { name: 'Loan/EMI Calculator', path: '/tools/loan-emi-calculator', description: 'Calculate monthly EMI, total interest, and payment schedule for any loan', icon: Calculator },
  { name: 'SIP Calculator', path: '/tools/sip-calculator', description: 'Calculate Systematic Investment Plan returns and wealth creation over time', icon: TrendingUp },
  { name: 'Budget Planner', path: '/tools/budget-planner', description: 'Track monthly income and expenses to achieve your financial goals', icon: Wallet },
  { name: 'Income Tax Calculator', path: '/tools/tax-calculator', description: 'Calculate income tax liability under old and new tax regimes', icon: Receipt },
  { name: 'Fixed Deposit Calculator', path: '/tools/fd-calculator', description: 'Calculate returns on fixed deposit investments with compound interest', icon: Shield },
  { name: 'Currency Converter', path: '/tools/currency-converter', description: 'Convert between major world currencies with real-time exchange rates', icon: Globe },
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
