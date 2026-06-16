/**
 * 30+ High-Traffic Calculator Tool Variants
 * Monthly search volume estimates and monetization data
 */

export interface CalculatorTool {
  id: string;
  name: string;
  description: string;
  monthlySearches: number;
  cpc: number; // Cost per click in USD
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  relatedKeywords: string[];
  estimatedCTR: number; // Click-through rate %
}

export const CALCULATOR_TOOLS: CalculatorTool[] = [
  // Finance Calculators (15)
  {
    id: 'simple-interest',
    name: 'Simple Interest Calculator',
    description: 'Calculate simple interest on principal amount',
    monthlySearches: 18000,
    cpc: 1.5,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['simple interest', 'SI calculator', 'interest calculator', 'principal amount'],
    estimatedCTR: 2.5
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest with various frequencies',
    monthlySearches: 22000,
    cpc: 1.8,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['compound interest', 'CI calculator', 'investment calculator'],
    estimatedCTR: 2.8
  },
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments and total interest',
    monthlySearches: 85000,
    cpc: 5.2,
    difficulty: 'medium',
    category: 'Finance',
    relatedKeywords: ['mortgage calculator', 'home loan', 'EMI calculator', 'monthly payment'],
    estimatedCTR: 3.2
  },
  {
    id: 'investment',
    name: 'Investment Calculator',
    description: 'Calculate investment returns and growth',
    monthlySearches: 35000,
    cpc: 2.5,
    difficulty: 'medium',
    category: 'Finance',
    relatedKeywords: ['investment calculator', 'return on investment', 'ROI'],
    estimatedCTR: 2.8
  },
  {
    id: 'retirement',
    name: 'Retirement Calculator',
    description: 'Plan for retirement and calculate savings needed',
    monthlySearches: 28000,
    cpc: 3.5,
    difficulty: 'medium',
    category: 'Finance',
    relatedKeywords: ['retirement calculator', 'retirement planning', 'pension calculator'],
    estimatedCTR: 2.6
  },
  {
    id: 'cagr',
    name: 'CAGR Calculator',
    description: 'Calculate Compound Annual Growth Rate',
    monthlySearches: 15000,
    cpc: 2.2,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['CAGR calculator', 'growth rate', 'annual growth'],
    estimatedCTR: 2.4
  },
  {
    id: 'roi',
    name: 'ROI Calculator',
    description: 'Calculate Return on Investment percentage',
    monthlySearches: 32000,
    cpc: 3.0,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['ROI calculator', 'return calculator', 'profit percentage'],
    estimatedCTR: 2.7
  },
  {
    id: 'gst',
    name: 'GST Calculator',
    description: 'Calculate GST and total amount with tax',
    monthlySearches: 42000,
    cpc: 1.8,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['GST calculator', 'goods and services tax', 'tax calculator'],
    estimatedCTR: 3.1
  },
  {
    id: 'vat',
    name: 'VAT Calculator',
    description: 'Calculate VAT and total price',
    monthlySearches: 38000,
    cpc: 1.6,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['VAT calculator', 'value added tax', 'tax calculation'],
    estimatedCTR: 2.9
  },
  {
    id: 'discount',
    name: 'Discount Calculator',
    description: 'Calculate discount percentage and final price',
    monthlySearches: 65000,
    cpc: 0.8,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['discount calculator', 'percentage off', 'sale price'],
    estimatedCTR: 3.5
  },
  {
    id: 'tip',
    name: 'Tip Calculator',
    description: 'Calculate tip amount and split bill',
    monthlySearches: 55000,
    cpc: 0.9,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['tip calculator', 'gratuity calculator', 'bill splitter'],
    estimatedCTR: 3.3
  },
  {
    id: 'markup',
    name: 'Markup Calculator',
    description: 'Calculate profit margin and selling price',
    monthlySearches: 18000,
    cpc: 1.5,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['markup calculator', 'profit calculator', 'margin calculator'],
    estimatedCTR: 2.3
  },
  {
    id: 'pl',
    name: 'Profit & Loss Calculator',
    description: 'Calculate profit and loss percentage',
    monthlySearches: 28000,
    cpc: 1.2,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['profit loss calculator', 'business calculator', 'margin calculator'],
    estimatedCTR: 2.5
  },
  {
    id: 'salary',
    name: 'Salary Calculator',
    description: 'Calculate net salary after tax and deductions',
    monthlySearches: 52000,
    cpc: 2.5,
    difficulty: 'medium',
    category: 'Finance',
    relatedKeywords: ['salary calculator', 'take home salary', 'net salary'],
    estimatedCTR: 3.0
  },
  {
    id: 'electricity-bill',
    name: 'Electricity Bill Calculator',
    description: 'Calculate monthly electricity bill',
    monthlySearches: 35000,
    cpc: 1.1,
    difficulty: 'easy',
    category: 'Finance',
    relatedKeywords: ['electricity bill calculator', 'power bill', 'energy calculator'],
    estimatedCTR: 2.8
  },

  // Health & Fitness (8)
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index and health category',
    monthlySearches: 95000,
    cpc: 1.2,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['BMI calculator', 'body mass index', 'weight calculator'],
    estimatedCTR: 3.2
  },
  {
    id: 'calorie',
    name: 'Calorie Calculator',
    description: 'Calculate daily calorie intake and needs',
    monthlySearches: 75000,
    cpc: 2.1,
    difficulty: 'medium',
    category: 'Health',
    relatedKeywords: ['calorie calculator', 'TDEE calculator', 'daily calories'],
    estimatedCTR: 3.0
  },
  {
    id: 'pregnancy-week',
    name: 'Pregnancy Week Calculator',
    description: 'Calculate pregnancy week and due date',
    monthlySearches: 48000,
    cpc: 1.5,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['pregnancy calculator', 'due date calculator', 'weeks pregnant'],
    estimatedCTR: 2.9
  },
  {
    id: 'water-intake',
    name: 'Water Intake Calculator',
    description: 'Calculate daily water intake recommendation',
    monthlySearches: 32000,
    cpc: 0.8,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['water intake calculator', 'hydration calculator', 'water needed'],
    estimatedCTR: 2.6
  },
  {
    id: 'ideal-weight',
    name: 'Ideal Weight Calculator',
    description: 'Calculate ideal body weight',
    monthlySearches: 42000,
    cpc: 1.3,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['ideal weight calculator', 'healthy weight', 'weight range'],
    estimatedCTR: 2.7
  },
  {
    id: 'macro',
    name: 'Macro Calculator',
    description: 'Calculate macronutrient distribution',
    monthlySearches: 38000,
    cpc: 1.8,
    difficulty: 'medium',
    category: 'Health',
    relatedKeywords: ['macro calculator', 'macronutrient calculator', 'protein calculator'],
    estimatedCTR: 2.8
  },
  {
    id: 'pregnancy-due-date',
    name: 'Pregnancy Due Date Calculator',
    description: 'Calculate expected due date from conception',
    monthlySearches: 55000,
    cpc: 1.6,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['due date calculator', 'baby due date', 'pregnancy due date'],
    estimatedCTR: 2.9
  },
  {
    id: 'age-in-days',
    name: 'Age in Days Calculator',
    description: 'Calculate total days lived',
    monthlySearches: 28000,
    cpc: 0.7,
    difficulty: 'easy',
    category: 'Health',
    relatedKeywords: ['age in days', 'days lived', 'total days calculator'],
    estimatedCTR: 2.4
  },

  // Unit Converters (7)
  {
    id: 'weight-converter',
    name: 'Weight Unit Converter',
    description: 'Convert between kg, lb, oz, g, stone',
    monthlySearches: 52000,
    cpc: 0.6,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['weight converter', 'kg to lbs', 'unit converter'],
    estimatedCTR: 3.1
  },
  {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, Kelvin',
    monthlySearches: 68000,
    cpc: 0.7,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['temperature converter', 'celsius to fahrenheit', 'temp converter'],
    estimatedCTR: 3.2
  },
  {
    id: 'distance-converter',
    name: 'Distance Unit Converter',
    description: 'Convert between km, miles, meters, feet',
    monthlySearches: 45000,
    cpc: 0.6,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['distance converter', 'km to miles', 'length converter'],
    estimatedCTR: 3.0
  },
  {
    id: 'volume-converter',
    name: 'Volume Unit Converter',
    description: 'Convert between liters, gallons, ml, cups',
    monthlySearches: 38000,
    cpc: 0.6,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['volume converter', 'liter to gallon', 'ml converter'],
    estimatedCTR: 2.8
  },
  {
    id: 'area-converter',
    name: 'Area Unit Converter',
    description: 'Convert between m², km², acres, hectares',
    monthlySearches: 28000,
    cpc: 0.6,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['area converter', 'acre to meter', 'land measurement'],
    estimatedCTR: 2.5
  },
  {
    id: 'speed-converter',
    name: 'Speed Unit Converter',
    description: 'Convert between km/h, mph, m/s, knots',
    monthlySearches: 35000,
    cpc: 0.6,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['speed converter', 'km/h to mph', 'velocity converter'],
    estimatedCTR: 2.8
  },
  {
    id: 'time-converter',
    name: 'Time Unit Converter',
    description: 'Convert between hours, minutes, seconds, days',
    monthlySearches: 42000,
    cpc: 0.5,
    difficulty: 'easy',
    category: 'Converter',
    relatedKeywords: ['time converter', 'hours to minutes', 'time calculator'],
    estimatedCTR: 2.9
  },

  // Education (2)
  {
    id: 'gpa',
    name: 'GPA Calculator',
    description: 'Calculate overall GPA from grades',
    monthlySearches: 58000,
    cpc: 0.9,
    difficulty: 'easy',
    category: 'Education',
    relatedKeywords: ['GPA calculator', 'grade calculator', 'academic calculator'],
    estimatedCTR: 3.0
  },
  {
    id: 'cgpa',
    name: 'CGPA Calculator',
    description: 'Calculate Cumulative GPA across semesters',
    monthlySearches: 35000,
    cpc: 0.8,
    difficulty: 'easy',
    category: 'Education',
    relatedKeywords: ['CGPA calculator', 'cumulative GPA', 'semester calculator'],
    estimatedCTR: 2.8
  }
];

// Statistics
export const calculateTotalStats = () => {
  const total = CALCULATOR_TOOLS.reduce((acc, tool) => {
    return {
      tools: acc.tools + 1,
      monthlySearches: acc.monthlySearches + tool.monthlySearches,
      estimatedRevenue: acc.estimatedRevenue + (tool.monthlySearches * tool.cpc * (tool.estimatedCTR / 100))
    };
  }, { tools: 0, monthlySearches: 0, estimatedRevenue: 0 });

  return total;
};

// Helper functions
export const getCalculatorsByCategory = (category: string) => {
  return CALCULATOR_TOOLS.filter(tool => tool.category === category);
};

export const getCalculatorsByTraffic = () => {
  return [...CALCULATOR_TOOLS].sort((a, b) => b.monthlySearches - a.monthlySearches);
};

export const getCalculatorsByRevenue = () => {
  return [...CALCULATOR_TOOLS].sort((a, b) => {
    const revenueA = a.monthlySearches * a.cpc * (a.estimatedCTR / 100);
    const revenueB = b.monthlySearches * b.cpc * (b.estimatedCTR / 100);
    return revenueB - revenueA;
  });
};

export const getCalculatorById = (id: string) => {
  return CALCULATOR_TOOLS.find(tool => tool.id === id);
};

// Category list
export const CALCULATOR_CATEGORIES = [
  'Finance',
  'Health',
  'Converter',
  'Education'
];
