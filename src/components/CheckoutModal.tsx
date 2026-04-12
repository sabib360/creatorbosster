import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlanId, PLANS, getYearlyPrice, getYearlyPriceUSD } from '../config/pricing';
import { cn } from '../lib/utils';

interface CheckoutModalProps {
  planId: PlanId;
  billingPeriod: 'monthly' | 'yearly';
  region: 'BD' | 'Global';
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ planId, billingPeriod, region, userId, onClose, onSuccess }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile' | 'sslcommerz'>(region === 'BD' ? 'sslcommerz' : 'card');
  const plan = PLANS[planId];

  const price = region === 'BD' 
    ? (billingPeriod === 'monthly' ? plan.price.BDT : getYearlyPrice(plan))
    : (billingPeriod === 'monthly' ? plan.price.USD : getYearlyPriceUSD(plan));

  const currency = region === 'BD' ? 'BDT' : 'USD';

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingPeriod,
          paymentMethod,
          region,
          amount: price,
          userId
        })
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to the gateway (simulated or real)
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-surface brutal-border brutal-shadow w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Plan Info */}
        <div className="w-full md:w-5/12 bg-base p-8 border-b-4 md:border-b-0 md:border-r-4 border-outline">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <h2 className="text-xl font-display font-black uppercase tracking-tight">Checkout</h2>
            <button onClick={onClose} className="p-2 hover:bg-primary brutal-border rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Selected Plan</span>
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-primary">{plan.name}</h3>
            </div>

            <div className="p-4 bg-white brutal-border rounded-xl">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-display font-black">{currency} {price}</span>
                <span className="text-xs font-bold opacity-50">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="text-[10px] font-bold mt-1 opacity-60">Billed {billingPeriod}</p>
            </div>

            <ul className="space-y-3">
              {plan.features.thumbnailImages.enabled && (
                <li className="flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {plan.credits.monthly === -1 ? 'Unlimited' : plan.credits.monthly} AI Credits
                </li>
              )}
              <li className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                No Ads & Priority Support
              </li>
              <li className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Advanced Analytics
              </li>
            </ul>

            <div className="pt-6 border-t-2 border-outline/10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                <ShieldCheck className="w-4 h-4" />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Methods */}
        <div className="flex-1 p-8 bg-surface relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-primary brutal-border rounded-lg transition-colors hidden md:block">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-display font-black uppercase tracking-tight mb-8">Payment Method</h2>

          <div className="space-y-4 mb-8">
            {region === 'BD' ? (
              <>
                <button 
                  onClick={() => setPaymentMethod('sslcommerz')}
                  className={cn(
                    "w-full p-4 brutal-border rounded-2xl flex items-center justify-between transition-all group",
                    paymentMethod === 'sslcommerz' ? "bg-primary border-black brutal-shadow-sm" : "bg-base hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl brutal-border flex items-center justify-center">
                      <img src="https://raw.githubusercontent.com/sslcommerz/SSLCommerz-PHP/master/sslcommerz-logo.png" alt="SSLCommerz" className="w-8 h-auto" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left">
                      <p className="font-display font-black uppercase text-sm">SSLCommerz</p>
                      <p className="text-[10px] font-bold opacity-60">bKash, Nagad, Rocket, Cards</p>
                    </div>
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 border-black flex items-center justify-center", paymentMethod === 'sslcommerz' ? "bg-black" : "bg-white")}>
                    {paymentMethod === 'sslcommerz' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={cn(
                    "w-full p-4 brutal-border rounded-2xl flex items-center justify-between transition-all group",
                    paymentMethod === 'card' ? "bg-indigo-600 text-white border-black brutal-shadow-sm" : "bg-base hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl brutal-border flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-display font-black uppercase text-sm">Credit / Debit Card</p>
                      <p className="text-[10px] font-bold opacity-60">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 border-black flex items-center justify-center", paymentMethod === 'card' ? "bg-white" : "bg-white/20")}>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('mobile')}
                  className={cn(
                    "w-full p-4 brutal-border rounded-2xl flex items-center justify-between transition-all group",
                    paymentMethod === 'mobile' ? "bg-black text-white border-black brutal-shadow-sm" : "bg-base hover:bg-white"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl brutal-border flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-black" />
                    </div>
                    <div className="text-left">
                      <p className="font-display font-black uppercase text-sm">Apple / Google Pay</p>
                      <p className="text-[10px] font-bold opacity-60">One-tap checkout</p>
                    </div>
                  </div>
                  <div className={cn("w-6 h-6 rounded-full border-2 border-black flex items-center justify-center", paymentMethod === 'mobile' ? "bg-white" : "bg-white/20")}>
                    {paymentMethod === 'mobile' && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>
                </button>
              </>
            )}
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={cn(
              "w-full py-5 rounded-2xl font-display font-black uppercase tracking-widest text-lg brutal-btn flex items-center justify-center gap-3",
              region === 'BD' ? "bg-primary text-black" : "bg-indigo-600 text-white"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Pay {currency} {price}
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] font-bold mt-6 opacity-40">
            By upgrading, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
