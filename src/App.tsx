import { useState, useEffect } from 'react';
import { LayoutDashboard, Youtube, Search, CreditCard, Menu, X, Sparkles, Zap, Image as ImageIcon, History, AlertCircle, LogIn, LogOut, User, Settings, Shield, Mail, FileText } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import Generator from './components/Generator';
import Competitor from './components/Competitor';
import Pricing from './components/Pricing';
import HistoryTab from './components/HistoryTab';
import AdBlockerDetector from './components/AdBlockerDetector';
import GoogleAdSense from './components/GoogleAdSense';
import { ThemeToggle } from './components/ThemeToggle';
import TutorialOverlay from './components/TutorialOverlay';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';
import About from './components/About';
import Blog from './components/Blog';
import { PlanId } from './config/pricing';

import AdminDashboard from './components/admin/AdminDashboard';

type View = 'generator' | 'competitor' | 'history' | 'admin' | 'privacy-policy' | 'terms-of-service' | 'contact-us' | 'about' | 'blog';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { user, profile, localCredits, loading: authLoading, login, logout } = useAuth();

  useEffect(() => {
    // Health check not needed for frontend-only Vite app using Gemini API
    setServerStatus('ok');

    // Handle payment callbacks
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setCurrentView('generator');
      setShowSuccessToast(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failed') {
      setCurrentView('pricing');
      alert("Payment failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const navItems = [
    { id: 'generator', label: 'Title & Thumbnail Generator', icon: Sparkles, color: 'bg-primary' },
    { id: 'history', label: 'History', icon: History, color: 'bg-quaternary' },
    { id: 'competitor', label: 'Competitor Analysis', icon: Search, color: 'bg-secondary' },
    { id: 'blog', label: 'Blog', icon: Mail, color: 'bg-secondary' },
    ...(profile?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings, color: 'bg-primary' }] : []),
  ] as const;

  const footerLinks = [
    { id: 'about', label: 'About Us', icon: User },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms-of-service', label: 'Terms of Service', icon: FileText },
    { id: 'contact-us', label: 'Contact Us', icon: Mail },
  ] as const;

  if (user && profile?.role === 'admin' && currentView === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-ink selection:bg-primary selection:text-black">
      <GoogleAdSense />
      <AdBlockerDetector />
      {/* <TutorialOverlay /> - Disabled: Tutorial overlay popup */}
      
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-4 pointer-events-none"
          >
            <div className="bg-primary text-black shadow-2xl shadow-primary/20 p-6 rounded-3xl flex items-center gap-5 pointer-events-auto border border-white/20">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-black fill-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-black uppercase text-xl leading-tight">Payment Successful!</h3>
                <p className="text-sm font-bold opacity-80">Your account has been upgraded.</p>
              </div>
              <button 
                onClick={() => setShowSuccessToast(false)}
                className="p-2 hover:bg-black/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-md"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-80 bg-slate-950 border-r border-slate-800/50 z-[70] transform transition-transform duration-500 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 font-display font-black text-2xl tracking-tighter uppercase text-ink">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Youtube className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ink to-ink/60">CreatorBoost</span>
          </div>
          <button className="md:hidden p-2 bg-slate-900 rounded-xl border border-slate-800" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5 text-ink" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          <div className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-ink/20 mb-4 px-2">Main Menu</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`sidebar-${item.id}`}
              onClick={() => {
                setCurrentView(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-display font-black uppercase tracking-widest transition-all duration-300 group",
                currentView === item.id 
                  ? "bg-slate-900 text-primary border border-slate-800 shadow-xl" 
                  : "text-ink/40 hover:text-ink hover:bg-slate-900/50"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", currentView === item.id ? "text-primary" : "text-ink/20 group-hover:text-ink/40")} />
              <span>{item.label}</span>
              {currentView === item.id && (
                <motion.div 
                  layoutId="active-nav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Credits Status */}
        <div className="p-6 mt-auto space-y-4">
          <div className="p-5 bg-primary/10 border border-primary/20 rounded-3xl relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-widest text-primary">Daily Credits</span>
            </div>
            <div className="text-2xl font-display font-black text-ink mb-1">
              {user ? profile?.credits_remaining : localCredits.available} <span className="text-xs text-ink/30">Credits</span>
            </div>
            <p className="text-[9px] font-bold text-ink/40 uppercase tracking-wider">Resetting in 24h</p>
          </div>

          {user && profile?.role === 'admin' && (
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile.displayName} className="w-12 h-12 rounded-2xl border border-slate-800 shadow-xl" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                      <User className="w-6 h-6 text-ink/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-display font-black uppercase truncate text-ink">{profile?.displayName || 'Admin'}</div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">Admin Access</div>
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="bg-slate-950 border-b border-slate-800 p-6 flex items-center justify-between md:hidden sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
              <Menu className="w-6 h-6 text-ink" />
            </button>
            <div className="flex items-center gap-2 font-display font-black text-xl uppercase tracking-tighter text-ink">
              <Youtube className="w-7 h-7 text-primary fill-primary" />
              <span>CreatorBoost</span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 scrollbar-hide">
          <div className="max-w-7xl mx-auto flex flex-col min-h-full">
            {serverStatus === 'error' && (
              <div className="mb-10 p-5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-4 font-bold animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span className="text-sm uppercase tracking-wide">Warning: Backend server is offline. Some features may be limited.</span>
              </div>
            )}
            <div className="flex justify-end mb-8 hidden md:flex">
              <ThemeToggle />
            </div>
            <div className="flex-1">
              {currentView === 'generator' && <Generator />}
              {currentView === 'history' && <HistoryTab />}
              {currentView === 'competitor' && <Competitor />}
              {currentView === 'blog' && <Blog onNavigate={setCurrentView} />}
              {currentView === 'about' && <About />}
              {currentView === 'privacy-policy' && <PrivacyPolicy />}
              {currentView === 'terms-of-service' && <TermsOfService />}
              {currentView === 'contact-us' && <ContactUs />}
            </div>
            
            <div className="mt-20 pt-10 border-t border-slate-800/50 space-y-8">
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {footerLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setCurrentView(link.id as View);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-black uppercase tracking-widest text-ink/60 hover:text-primary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
