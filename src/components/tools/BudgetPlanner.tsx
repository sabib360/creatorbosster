import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, TrendingDown, TrendingUp, Plus, Trash2, Wallet, PiggyBank, AlertCircle, Target } from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
}

interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
}

const expenseCategories = [
  'Housing', 'Food', 'Transportation', 'Utilities', 'Healthcare', 
  'Entertainment', 'Shopping', 'Education', 'Insurance', 'Other'
];

const incomeCategories = [
  'Salary', 'Business', 'Investment', 'Freelance', 'Rental', 'Other'
];

export default function BudgetPlanner() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', category: 'Salary', amount: 50000, description: 'Monthly salary', type: 'income' },
    { id: '2', category: 'Housing', amount: 15000, description: 'Rent', type: 'expense' },
    { id: '3', category: 'Food', amount: 8000, description: 'Groceries and dining', type: 'expense' },
    { id: '4', category: 'Transportation', amount: 3000, description: 'Fuel and transport', type: 'expense' }
  ]);

  const [newItem, setNewItem] = useState<Omit<ExpenseItem, 'id'>>({
    category: '',
    amount: 0,
    description: '',
    type: 'expense'
  });

  const [summary, setSummary] = useState<BudgetSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0
  });

  useEffect(() => {
    calculateSummary();
  }, [expenses]);

  const calculateSummary = () => {
    const income = expenses
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const expenses_total = expenses
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const balance = income - expenses_total;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;

    setSummary({
      totalIncome: income,
      totalExpenses: expenses_total,
      balance,
      savingsRate
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const addExpense = () => {
    if (newItem.category && newItem.amount > 0) {
      const expense: ExpenseItem = {
        ...newItem,
        id: Date.now().toString()
      };
      setExpenses([...expenses, expense]);
      setNewItem({
        category: '',
        amount: 0,
        description: '',
        type: 'expense'
      });
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  const getExpensesByCategory = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    expenses
      .filter(item => item.type === 'expense')
      .forEach(item => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
      });
    
    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getBudgetHealthColor = () => {
    if (summary.savingsRate >= 20) return 'text-green-400';
    if (summary.savingsRate >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBudgetHealthText = () => {
    if (summary.savingsRate >= 20) return 'Excellent';
    if (summary.savingsRate >= 10) return 'Good';
    if (summary.savingsRate >= 0) return 'Needs Improvement';
    return 'Critical';
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
          Budget Planner
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Track your monthly income and expenses to achieve your financial goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Item */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
              <Plus className="w-5 h-5 text-primary" />
              Add Transaction
            </h2>

            {/* Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-ink/60 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNewItem({ ...newItem, type: 'income' })}
                  className={`p-2 rounded-lg font-bold transition-all ${
                    newItem.type === 'income'
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setNewItem({ ...newItem, type: 'expense' })}
                  className={`p-2 rounded-lg font-bold transition-all ${
                    newItem.type === 'expense'
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/80'
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-ink/60 mb-2">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
              >
                <option value="">Select category</option>
                {(newItem.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-ink/60 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={newItem.amount || ''}
                onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                placeholder="Enter amount"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-ink/60 mb-2">Description</label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-ink font-bold transition-all focus:border-primary/50"
                placeholder="Enter description"
              />
            </div>

            <button
              onClick={addExpense}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-black font-black rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </motion.div>

        {/* Summary and Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Budget Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xs font-bold text-green-400 uppercase">Income</p>
              </div>
              <p className="text-lg font-display font-black text-ink">{formatCurrency(summary.totalIncome)}</p>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <p className="text-xs font-bold text-red-400 uppercase">Expenses</p>
              </div>
              <p className="text-lg font-display font-black text-ink">{formatCurrency(summary.totalExpenses)}</p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-bold text-blue-400 uppercase">Balance</p>
              </div>
              <p className={`text-lg font-display font-black ${summary.balance >= 0 ? 'text-ink' : 'text-red-400'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-bold text-purple-400 uppercase">Savings</p>
              </div>
              <p className={`text-lg font-display font-black ${getBudgetHealthColor()}`}>
                {summary.savingsRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Budget Health */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Budget Health</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getBudgetHealthColor()} bg-current/20`}>
                {getBudgetHealthText()}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink/60">Savings Rate</span>
                  <span className={getBudgetHealthColor()}>{summary.savingsRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      summary.savingsRate >= 20 ? 'bg-green-400' : 
                      summary.savingsRate >= 10 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, summary.savingsRate * 2))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          {getExpensesByCategory().length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-ink mb-4">Top Expense Categories</h3>
              <div className="space-y-3">
                {getExpensesByCategory().map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-ink/80">{category}</span>
                    <span className="text-sm font-bold text-ink">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-ink mb-4">Recent Transactions</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expenses.slice(-10).reverse().map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'income' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.category}</p>
                      <p className="text-xs text-ink/60">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      item.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </span>
                    <button
                      onClick={() => deleteExpense(item.id)}
                      className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-ink/40" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-bold mb-1">Budget Tips</p>
              <p className="text-blue-300/80">
                Aim to save at least 20% of your income. Track expenses regularly and identify areas where you can cut costs. 
                Build an emergency fund covering 3-6 months of expenses.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
