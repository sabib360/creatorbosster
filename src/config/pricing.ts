export type PlanId = 'free' | 'premium' | 'pro' | 'agency';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  description: string;
  price: {
    USD: number;
    BDT: number;
    INR: number;
  };
  billingPeriod: 'monthly' | 'yearly';
  credits: {
    monthly: number; // -1 = unlimited
    dailyLimit: number;
  };
  features: {
    titleGenerator: boolean;
    thumbnailText: boolean;
    hookGenerator: boolean;
    descriptionGenerator: boolean;
    tagGenerator: boolean;
    thumbnailIdeas: boolean;
    thumbnailImages: {
      enabled: boolean;
      monthlyLimit: number;
    };
    competitorAnalysis: {
      enabled: boolean;
      monthlyLimit: number;
    };
    viralScore: boolean;
    ctrPrediction: boolean;
    exportCanva: boolean;
    saveHistory: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    teamSeats: number;
    adFree: boolean;
  };
  popular?: boolean;
  badge?: string;
}

export const PLANS: Record<PlanId, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: { USD: 0, BDT: 0, INR: 0 },
    billingPeriod: 'monthly',
    credits: { monthly: 3, dailyLimit: 3 },
    features: {
      titleGenerator: true,
      thumbnailText: true,
      hookGenerator: true,
      descriptionGenerator: false,
      tagGenerator: false,
      thumbnailIdeas: true,
      thumbnailImages: { enabled: false, monthlyLimit: 0 },
      competitorAnalysis: { enabled: false, monthlyLimit: 0 },
      viralScore: false,
      ctrPrediction: false,
      exportCanva: false,
      saveHistory: false,
      prioritySupport: false,
      apiAccess: false,
      teamSeats: 1,
      adFree: false,
    },
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    description: 'Best for growing creators',
    price: { USD: 27, BDT: 299, INR: 249 },
    billingPeriod: 'monthly',
    credits: { monthly: 100, dailyLimit: 20 },
    features: {
      titleGenerator: true,
      thumbnailText: true,
      hookGenerator: true,
      descriptionGenerator: true,
      tagGenerator: true,
      thumbnailIdeas: true,
      thumbnailImages: { enabled: true, monthlyLimit: 20 },
      competitorAnalysis: { enabled: true, monthlyLimit: 10 },
      viralScore: true,
      ctrPrediction: false,
      exportCanva: true,
      saveHistory: true,
      prioritySupport: true,
      apiAccess: false,
      teamSeats: 1,
      adFree: true,
    },
    popular: true,
    badge: 'Most Popular',
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious content creators',
    price: { USD: 54, BDT: 599, INR: 499 },
    billingPeriod: 'monthly',
    credits: { monthly: 500, dailyLimit: 50 },
    features: {
      titleGenerator: true,
      thumbnailText: true,
      hookGenerator: true,
      descriptionGenerator: true,
      tagGenerator: true,
      thumbnailIdeas: true,
      thumbnailImages: { enabled: true, monthlyLimit: 100 },
      competitorAnalysis: { enabled: true, monthlyLimit: 50 },
      viralScore: true,
      ctrPrediction: true,
      exportCanva: true,
      saveHistory: true,
      prioritySupport: true,
      apiAccess: true,
      teamSeats: 3,
      adFree: true,
    },
  },

  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'For teams & agencies',
    price: { USD: 90, BDT: 999, INR: 899 },
    billingPeriod: 'monthly',
    credits: { monthly: -1, dailyLimit: -1 }, // unlimited
    features: {
      titleGenerator: true,
      thumbnailText: true,
      hookGenerator: true,
      descriptionGenerator: true,
      tagGenerator: true,
      thumbnailIdeas: true,
      thumbnailImages: { enabled: true, monthlyLimit: -1 },
      competitorAnalysis: { enabled: true, monthlyLimit: -1 },
      viralScore: true,
      ctrPrediction: true,
      exportCanva: true,
      saveHistory: true,
      prioritySupport: true,
      apiAccess: true,
      teamSeats: 10,
      adFree: true,
    },
  },
};

// Yearly discount (2 months free = ~17% off)
export const YEARLY_DISCOUNT = 0.83;

export function getYearlyPrice(plan: SubscriptionPlan): number {
  return Math.round(plan.price.BDT * 12 * YEARLY_DISCOUNT);
}

export function getYearlyPriceUSD(plan: SubscriptionPlan): number {
  return Math.round(plan.price.USD * 12 * YEARLY_DISCOUNT);
}
