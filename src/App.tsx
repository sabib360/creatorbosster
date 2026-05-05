import { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, Image as ImageIcon, FileText, Bot, Menu, X, Settings, Shield, Mail, File, Search, Zap, History, CreditCard, LogIn, LogOut, User, Palette, Calculator, Hash, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { ThemeToggle } from './components/ThemeToggle';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './components/Dashboard';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdBlockerDetector from './components/AdBlockerDetector';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';
import About from './components/About';
import Blog, { BlogPostRoute } from './components/Blog';
import ImageTools from './components/ImageTools';
import PDFTools from './components/PDFTools';
import AITools from './components/AITools';
import Competitor from './components/Competitor';
import ToolPage from './components/ToolPage';
import ImageCompressor from './components/tools/ImageCompressor';
import ImageResizer from './components/tools/ImageResizer';
import ImageCropper from './components/tools/ImageCropper';
import ImageRotator from './components/tools/ImageRotator';
import PassportSizeTool from './components/tools/PassportSizeTool';
import WatermarkTool from './components/tools/WatermarkTool';
import ImageConverter from './components/tools/ImageConverter';
import BulkCompressor from './components/tools/BulkCompressor';
import TargetedCompression from './components/tools/TargetedCompression';
import PDFMerger from './components/tools/PDFMerger';
import PDFSplitter from './components/tools/PDFSplitter';
import PDFRemover from './components/tools/PDFRemover';
import PDFRotator from './components/tools/PDFRotator';
import PDFConverter from './components/tools/PDFConverter';
import PDFCompressor from './components/tools/PDFCompressor';
import PDFToJPG from './components/tools/PDFToJPG';
import JPGToPDF from './components/tools/JPGToPDF';
import PDFSummarizer from './components/tools/PDFSummarizer';
import BackgroundRemover from './components/tools/BackgroundRemover';
import ImageAnalyzer from './components/tools/ImageAnalyzer';
import AIAssistant from './components/tools/AIAssistant';
import ThumbnailGenerator from './components/tools/ThumbnailGenerator';
import AIThumbnailGenerator from './components/tools/AIThumbnailGenerator';
import LoanEMICalculator from './components/tools/LoanEMICalculator';
import HashtagGenerator from './components/tools/HashtagGenerator';
import FinanceTools from './components/FinanceTools';
import SocialMediaTools from './components/SocialMediaTools';
import SIPCalculator from './components/tools/SIPCalculator';
import BudgetPlanner from './components/tools/BudgetPlanner';
import TaxCalculator from './components/tools/TaxCalculator';
import FDCalculator from './components/tools/FDCalculator';
import CurrencyConverter from './components/tools/CurrencyConverter';
import ContentIdeaGenerator from './components/tools/ContentIdeaGenerator';
import CaptionWriter from './components/tools/CaptionWriter';
import SocialAnalytics from './components/tools/SocialAnalytics';
import LinkShortener from './components/tools/LinkShortener';
import EmojiPicker from './components/tools/EmojiPicker';
import HowToUse from './components/HowToUse';

type View = 'dashboard' | 'image-tools' | 'pdf-tools' | 'ai-tools' | 'finance-tools' | 'social-media-tools' | 'privacy-policy' | 'terms-of-service' | 'contact-us' | 'about' | 'blog';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { user, profile, localCredits, loading: authLoading, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Health check not needed for frontend-only Vite app using Gemini API
    setServerStatus('ok');

    // Handle payment callbacks
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setShowSuccessToast(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failed') {
      alert("Payment failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
    { id: 'image-tools', label: 'Image Tools', icon: ImageIcon, path: '/image-tools' },
    { id: 'pdf-tools', label: 'PDF Tools', icon: FileText, path: '/pdf-tools' },
    { id: 'ai-tools', label: 'AI Tools', icon: Bot, path: '/ai-tools' },
    { id: 'finance-tools', label: 'Finance Tools', icon: Calculator, path: '/finance-tools' },
    { id: 'social-media-tools', label: 'Social Media', icon: Hash, path: '/social-media-tools' },
    { id: 'how-to-use', label: 'How to Use', icon: BookOpen, path: '/how-to-use' },
  ] as const;

  const footerLinks = [
    { id: 'about', label: 'About Us', icon: User, path: '/about' },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield, path: '/privacy-policy' },
    { id: 'terms-of-service', label: 'Terms of Service', icon: FileText, path: '/terms-of-service' },
    { id: 'contact-us', label: 'Contact Us', icon: Mail, path: '/contact-us' },
  ] as const;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-ink selection:bg-primary selection:text-black">
      <AdBlockerDetector />
      
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
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-slate-950 border-r border-slate-800/50 z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3 font-display font-black text-2xl tracking-tighter uppercase text-ink">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-black fill-black" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ink to-ink/60">CreatorBoost AI</span>
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
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-display font-black uppercase tracking-widest transition-all duration-300 group ${
                location.pathname === item.path 
                  ? "bg-slate-900 text-primary border border-slate-800 shadow-xl" 
                  : "text-ink/40 hover:text-ink hover:bg-slate-900/50"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${location.pathname === item.path ? "text-primary" : "text-ink/20 group-hover:text-ink/40"}`} />
              <span>{item.label}</span>
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="active-nav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-6 mt-auto space-y-4">
          {user && (
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
                    <div className="text-sm font-display font-black uppercase truncate text-ink">{profile?.displayName || 'User'}</div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">{profile?.role || 'User'}</div>
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
              <Sparkles className="w-7 h-7 text-primary fill-primary" />
              <span>CreatorBoost AI</span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-16 scrollbar-hide">
          <div className="max-w-7xl mx-auto flex flex-col min-h-full">
            {serverStatus === 'error' && (
              <div className="mb-10 p-5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center gap-4 font-bold animate-in fade-in slide-in-from-top-4">
                <Search className="w-6 h-6 shrink-0" />
                <span className="text-sm uppercase tracking-wide">Warning: Backend server is offline. Some features may be limited.</span>
              </div>
            )}
            <div className="flex justify-end mb-8 hidden md:flex">
              <ThemeToggle />
            </div>
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/image-tools" element={<ImageTools />} />
                <Route path="/pdf-tools" element={<PDFTools />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/finance-tools" element={<FinanceTools />} />
                <Route path="/social-media-tools" element={<SocialMediaTools />} />
                
                {/* Image Tools */}
                <Route path="/tools/image-compressor" element={<ToolPage><ImageCompressor /></ToolPage>} />
                <Route path="/tools/image-resizer" element={<ToolPage><ImageResizer /></ToolPage>} />
                <Route path="/tools/image-cropper" element={<ToolPage><ImageCropper /></ToolPage>} />
                <Route path="/tools/image-rotator" element={<ToolPage><ImageRotator /></ToolPage>} />
                <Route path="/tools/passport-size" element={<ToolPage><PassportSizeTool /></ToolPage>} />
                <Route path="/tools/watermark" element={<ToolPage><WatermarkTool /></ToolPage>} />
                <Route path="/tools/image-converter" element={<ToolPage><ImageConverter /></ToolPage>} />
                <Route path="/tools/bulk-compressor" element={<ToolPage><BulkCompressor /></ToolPage>} />
                <Route path="/tools/targeted-compression" element={<ToolPage><TargetedCompression /></ToolPage>} />
                
                {/* PDF Tools */}
                <Route path="/tools/pdf-merger" element={<ToolPage><PDFMerger /></ToolPage>} />
                <Route path="/tools/pdf-splitter" element={<ToolPage><PDFSplitter /></ToolPage>} />
                <Route path="/tools/pdf-remover" element={<ToolPage><PDFRemover /></ToolPage>} />
                <Route path="/tools/pdf-rotator" element={<ToolPage><PDFRotator /></ToolPage>} />
                <Route path="/tools/pdf-converter" element={<ToolPage><PDFConverter /></ToolPage>} />
                <Route path="/tools/pdf-compressor" element={<ToolPage><PDFCompressor /></ToolPage>} />
                <Route path="/tools/pdf-to-jpg" element={<ToolPage><PDFToJPG /></ToolPage>} />
                <Route path="/tools/jpg-to-pdf" element={<ToolPage><JPGToPDF /></ToolPage>} />
                
                {/* AI Tools */}
                <Route path="/tools/pdf-summarizer" element={<ToolPage><PDFSummarizer /></ToolPage>} />
                <Route path="/tools/background-remover" element={<ToolPage><BackgroundRemover /></ToolPage>} />
                <Route path="/tools/image-analyzer" element={<ToolPage><ImageAnalyzer /></ToolPage>} />
                <Route path="/tools/ai-assistant" element={<ToolPage><AIAssistant /></ToolPage>} />
                <Route path="/tools/ai-thumbnail-generator" element={<ToolPage><AIThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/thumbnail-generator" element={<ToolPage><ThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/competitor-analysis" element={<ToolPage><Competitor /></ToolPage>} />
                
                {/* Finance Tools */}
                <Route path="/tools/loan-emi-calculator" element={<ToolPage><LoanEMICalculator /></ToolPage>} />
                <Route path="/tools/sip-calculator" element={<ToolPage><SIPCalculator /></ToolPage>} />
                <Route path="/tools/budget-planner" element={<ToolPage><BudgetPlanner /></ToolPage>} />
                <Route path="/tools/tax-calculator" element={<ToolPage><TaxCalculator /></ToolPage>} />
                <Route path="/tools/fd-calculator" element={<ToolPage><FDCalculator /></ToolPage>} />
                <Route path="/tools/currency-converter" element={<ToolPage><CurrencyConverter /></ToolPage>} />
                
                {/* Social Media Tools */}
                <Route path="/tools/hashtag-generator" element={<ToolPage><HashtagGenerator /></ToolPage>} />
                <Route path="/tools/content-idea-generator" element={<ToolPage><ContentIdeaGenerator /></ToolPage>} />
                <Route path="/tools/caption-writer" element={<ToolPage><CaptionWriter /></ToolPage>} />
                <Route path="/tools/social-analytics" element={<ToolPage><SocialAnalytics /></ToolPage>} />
                <Route path="/tools/link-shortener" element={<ToolPage><LinkShortener /></ToolPage>} />
                <Route path="/tools/emoji-picker" element={<ToolPage><EmojiPicker /></ToolPage>} />
                
                {/* Static Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostRoute />} />
                <Route path="/how-to-use" element={<HowToUse />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            
            <div className="mt-20 pt-10 border-t border-slate-800/50 space-y-8">
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {footerLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      navigate(link.path);
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
