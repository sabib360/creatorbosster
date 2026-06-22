import { useState, useEffect, Suspense, lazy } from 'react';
import { LayoutDashboard, Sparkles, Menu, X, Search, Zap, LogIn, LogOut, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { useAuth } from './hooks/useAuth';
import { ThemeToggle } from './components/ThemeToggle';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CommandPalette from './components/CommandPalette';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';

// ═══════════════════════════════════════════════════════════════════
// LAZY LOADING — Route-based code splitting
// Reduces initial bundle from ~2.6MB to ~300KB
// ═══════════════════════════════════════════════════════════════════

const Dashboard = lazy(() => import('./components/Dashboard'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CMSDashboard = lazy(() => import('./components/admin/CMSDashboard'));
const SEODashboard = lazy(() => import('./components/SEODashboard'));

// Tool Pages
const ImageTools = lazy(() => import('./components/ImageTools'));
const PDFTools = lazy(() => import('./components/PDFTools'));
const AITools = lazy(() => import('./components/AITools'));
const FinanceTools = lazy(() => import('./components/FinanceTools'));
const SocialMediaTools = lazy(() => import('./components/SocialMediaTools'));
const ToolPage = lazy(() => import('./components/ToolPage'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const DynamicSEOToolPage = lazy(() => import('./components/DynamicSEOToolPage'));

// Blog
const Blog = lazy(() => import('./components/Blog').then(m => ({ default: m.BlogPostRoute })));

// Static Pages
const About = lazy(() => import('./components/About'));
const ContactUs = lazy(() => import('./components/ContactUs'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const Disclaimer = lazy(() => import('./components/Disclaimer'));
const DMCA = lazy(() => import('./components/DMCA'));
const EditorialPolicy = lazy(() => import('./components/EditorialPolicy'));
const SitemapPage = lazy(() => import('./components/SitemapPage'));
const HowToUse = lazy(() => import('./components/HowToUse'));
const NotFound = lazy(() => import('./components/NotFound'));
const BackToTop = lazy(() => import('./components/BackToTop'));
const ToolSearch = lazy(() => import('./components/ToolSearch'));
const AdBlockerDetector = lazy(() => import('./components/AdBlockerDetector'));

// Tools — Lazy loaded individually
const ImageCompressor = lazy(() => import('./components/tools/ImageCompressor'));
const ImageResizer = lazy(() => import('./components/tools/ImageResizer'));
const ImageCropper = lazy(() => import('./components/tools/ImageCropper'));
const ImageRotator = lazy(() => import('./components/tools/ImageRotator'));
const PassportSizeTool = lazy(() => import('./components/tools/PassportSizeTool'));
const WatermarkTool = lazy(() => import('./components/tools/WatermarkTool'));
const ImageConverter = lazy(() => import('./components/tools/ImageConverter'));
const BulkCompressor = lazy(() => import('./components/tools/BulkCompressor'));
const TargetedCompression = lazy(() => import('./components/tools/TargetedCompression'));
const ImageFilterApplier = lazy(() => import('./components/tools/ImageFilterApplier'));
const ImageToBase64 = lazy(() => import('./components/tools/ImageToBase64'));
const Base64ToImage = lazy(() => import('./components/tools/Base64ToImage'));
const ImageMetadataViewer = lazy(() => import('./components/tools/ImageMetadataViewer'));
const ColorPickerFromImage = lazy(() => import('./components/tools/ColorPickerFromImage'));
const ImageSplitter = lazy(() => import('./components/tools/ImageSplitter'));
const ImageMerger = lazy(() => import('./components/tools/ImageMerger'));
const FaviconGenerator = lazy(() => import('./components/tools/FaviconGenerator'));
const PDFMerger = lazy(() => import('./components/tools/PDFMerger'));
const PDFSplitter = lazy(() => import('./components/tools/PDFSplitter'));
const PDFRemover = lazy(() => import('./components/tools/PDFRemover'));
const PDFRotator = lazy(() => import('./components/tools/PDFRotator'));
const PDFConverter = lazy(() => import('./components/tools/PDFConverter'));
const PDFCompressor = lazy(() => import('./components/tools/PDFCompressor'));
const PDFToJPG = lazy(() => import('./components/tools/PDFToJPG'));
const JPGToPDF = lazy(() => import('./components/tools/JPGToPDF'));
const PDFPageNumberer = lazy(() => import('./components/tools/PDFPageNumberer'));
const PDFWatermarkAdder = lazy(() => import('./components/tools/PDFWatermarkAdder'));
const PDFPasswordProtector = lazy(() => import('./components/tools/PDFPasswordProtector'));
const PDFUnlocker = lazy(() => import('./components/tools/PDFUnlocker'));
const PDFMetadataEditor = lazy(() => import('./components/tools/PDFMetadataEditor'));
const PDFSummarizer = lazy(() => import('./components/tools/PDFSummarizer'));
const BackgroundRemover = lazy(() => import('./components/tools/BackgroundRemover'));
const ImageAnalyzer = lazy(() => import('./components/tools/ImageAnalyzer'));
const AIAssistant = lazy(() => import('./components/tools/AIAssistant'));
const AIBackgroundRemover = lazy(() => import('./components/tools/AIBackgroundRemover'));
const AIImageUpscaler = lazy(() => import('./components/tools/AIImageUpscaler'));
const AITextToImage = lazy(() => import('./components/tools/AITextToImage'));
const AIImageGenerator = lazy(() => import('./components/tools/AIImageGenerator'));
const AIDocumentSummarizer = lazy(() => import('./components/tools/AIDocumentSummarizer'));
const AIChatbotAssistant = lazy(() => import('./components/tools/AIChatbotAssistant'));
const AICodeGenerator = lazy(() => import('./components/tools/AICodeGenerator'));
const AITranslator = lazy(() => import('./components/tools/AITranslator'));
const AISentimentAnalyzer = lazy(() => import('./components/tools/AISentimentAnalyzer'));
const ThumbnailGenerator = lazy(() => import('./components/tools/ThumbnailGenerator'));
const AIThumbnailGenerator = lazy(() => import('./components/tools/AIThumbnailGenerator'));
const LoanEMICalculator = lazy(() => import('./components/tools/LoanEMICalculator'));
const SimpleInterestCalculator = lazy(() => import('./components/tools/SimpleInterestCalculator'));
const CompoundInterestCalculator = lazy(() => import('./components/tools/CompoundInterestCalculator'));
const HashtagGenerator = lazy(() => import('./components/tools/HashtagGenerator'));
const AIHashtagGenerator = lazy(() => import('./components/tools/AIHashtagGenerator'));
const SIPCalculator = lazy(() => import('./components/tools/SIPCalculator'));
const BudgetPlanner = lazy(() => import('./components/tools/BudgetPlanner'));
const TaxCalculator = lazy(() => import('./components/tools/TaxCalculator'));
const FDCalculator = lazy(() => import('./components/tools/FDCalculator'));
const CurrencyConverter = lazy(() => import('./components/tools/CurrencyConverter'));
const DateDifferenceCalculator = lazy(() => import('./components/tools/DateDifferenceCalculator'));
const BMICalculator = lazy(() => import('./components/tools/BMICalculator'));
const PercentageCalculator = lazy(() => import('./components/tools/PercentageCalculator'));
const UnitConverter = lazy(() => import('./components/tools/UnitConverter'));
const PasswordGenerator = lazy(() => import('./components/tools/PasswordGenerator'));
const LoanComparisonCalculator = lazy(() => import('./components/tools/LoanComparisonCalculator'));
const ContentIdeaGenerator = lazy(() => import('./components/tools/ContentIdeaGenerator'));
const StylishNameGenerator = lazy(() => import('./components/tools/StylishNameGenerator'));
const CaptionWriter = lazy(() => import('./components/tools/CaptionWriter'));
const AICaptionGenerator = lazy(() => import('./components/tools/AICaptionGenerator'));
const BanglaCaptionGenerator = lazy(() => import('./components/tools/BanglaCaptionGenerator'));
const SocialAnalytics = lazy(() => import('./components/tools/SocialAnalytics'));
const LinkShortener = lazy(() => import('./components/tools/LinkShortener'));
const EmojiPicker = lazy(() => import('./components/tools/EmojiPicker'));
const BioLinkPageBuilder = lazy(() => import('./components/tools/BioLinkPageBuilder'));
const JSONFormatter = lazy(() => import('./components/tools/JSONFormatter'));
const Base64EncoderDecoder = lazy(() => import('./components/tools/Base64EncoderDecoder'));
const HTMLToMarkdownConverter = lazy(() => import('./components/tools/HTMLToMarkdownConverter'));
const MarkdownToHTMLConverter = lazy(() => import('./components/tools/MarkdownToHTMLConverter'));
const CSSMinifier = lazy(() => import('./components/tools/CSSMinifier'));
const JSMinifier = lazy(() => import('./components/tools/JSMinifier'));
const URLEncoderDecoder = lazy(() => import('./components/tools/URLEncoderDecoder'));
const HashGenerator = lazy(() => import('./components/tools/HashGenerator'));
const RegexTester = lazy(() => import('./components/tools/RegexTester'));
const ColorCodeConverter = lazy(() => import('./components/tools/ColorCodeConverter'));
const AgeCalculator = lazy(() => import('./components/tools/AgeCalculator'));
const PDFToWord = lazy(() => import('./components/tools/PDFToWord'));
const YouTubeDownloader = lazy(() => import('./components/tools/YouTubeDownloader'));
const YouTubeThumbnailDownloader = lazy(() => import('./components/tools/YouTubeThumbnailDownloader'));
const YouTubeTitleGenerator = lazy(() => import('./components/tools/YouTubeTitleGenerator'));
const YouTubeDescriptionGenerator = lazy(() => import('./components/tools/YouTubeDescriptionGenerator'));
const YouTubeTagGenerator = lazy(() => import('./components/tools/YouTubeTagGenerator'));
const YouTubeHashtagGenerator = lazy(() => import('./components/tools/YouTubeHashtagGenerator'));
const YouTubeScriptWriter = lazy(() => import('./components/tools/YouTubeScriptWriter'));
const YouTubeScriptGenerator = lazy(() => import('./components/tools/YouTubeScriptGenerator'));
const YouTubeSEOScoreChecker = lazy(() => import('./components/tools/YouTubeSEOScoreChecker'));
const YouTubeChannelAnalyzer = lazy(() => import('./components/tools/YouTubeChannelAnalyzer'));
const YouTubeCommentReplyGenerator = lazy(() => import('./components/tools/YouTubeCommentReplyGenerator'));
const YouTubeVideoIdeasGenerator = lazy(() => import('./components/tools/YouTubeVideoIdeasGenerator'));
const QRCodeGenerator = lazy(() => import('./components/tools/QRCodeGenerator'));
const MetaTagGenerator = lazy(() => import('./components/tools/MetaTagGenerator'));
const BlogPostTitleGenerator = lazy(() => import('./components/tools/BlogPostTitleGenerator'));
const BlogPostOutlineGenerator = lazy(() => import('./components/tools/BlogPostOutlineGenerator'));
const MetaDescriptionGenerator = lazy(() => import('./components/tools/MetaDescriptionGenerator'));
const SocialMediaPostGenerator = lazy(() => import('./components/tools/SocialMediaPostGenerator'));
const ContentParaphraser = lazy(() => import('./components/tools/ContentParaphraser'));
const GrammarSpellingChecker = lazy(() => import('./components/tools/GrammarSpellingChecker'));
const WordCounter = lazy(() => import('./components/tools/WordCounter'));
const SlugGenerator = lazy(() => import('./components/tools/SlugGenerator'));
const EmailSubjectLineGenerator = lazy(() => import('./components/tools/EmailSubjectLineGenerator'));
const ContentCalendarGenerator = lazy(() => import('./components/tools/ContentCalendarGenerator'));
const Competitor = lazy(() => import('./components/Competitor'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const NewsletterPopup = lazy(() => import('./components/Newsletter').then(m => ({ default: m.NewsletterPopup })));
const ExitIntentPopup = lazy(() => import('./components/Newsletter').then(m => ({ default: m.ExitIntentPopup })));

type View = 'dashboard' | 'image-tools' | 'pdf-tools' | 'ai-tools' | 'finance-tools' | 'social-media-tools' | 'privacy-policy' | 'terms-of-service' | 'contact-us' | 'about' | 'blog';

// ═══════════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════════

function RouteLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, profile, localCredits, loading: authLoading, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

  useEffect(() => {
    setServerStatus('ok');
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

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/' },
    { id: 'user-dashboard', label: 'My Dashboard', icon: User, path: '/dashboard/tools' },
    { id: 'image-tools', label: 'Image Tools', icon: Sparkles, path: '/image-tools' },
    { id: 'pdf-tools', label: 'PDF Tools', icon: Zap, path: '/pdf-tools' },
    { id: 'ai-tools', label: 'AI Tools', icon: Sparkles, path: '/ai-tools' },
    { id: 'finance-tools', label: 'Finance Tools', icon: Zap, path: '/finance-tools' },
    { id: 'social-media-tools', label: 'Social Media', icon: Sparkles, path: '/social-media-tools' },
    { id: 'how-to-use', label: 'How to Use', icon: Zap, path: '/how-to-use' },
  ] as const;

  const footerLinks = [
    { id: 'about', label: 'About Us', icon: User, path: '/about' },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Zap, path: '/privacy-policy' },
    { id: 'terms-of-service', label: 'Terms of Service', icon: Zap, path: '/terms-of-service' },
    { id: 'cookie-policy', label: 'Cookie Policy', icon: Zap, path: '/cookie-policy' },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle, path: '/disclaimer' },
    { id: 'dmca', label: 'DMCA', icon: Zap, path: '/dmca' },
    { id: 'contact-us', label: 'Contact Us', icon: Zap, path: '/contact-us' },
  ] as const;

  return (
    <div className={cn("bg-background font-sans text-foreground selection:bg-brand-500/30 selection:text-white", isHomePage ? "min-h-screen" : "flex h-screen overflow-hidden")}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-brand-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">Skip to content</a>
      <Suspense fallback={null}><AdBlockerDetector /></Suspense>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Premium Navbar for Homepage */}
      {isHomePage && <Navbar onSearchOpen={() => setSearchOpen(true)} />}

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-4 pointer-events-none"
          >
            <div className="glass-strong text-white shadow-2xl shadow-black/30 p-6 rounded-2xl flex items-center gap-5 pointer-events-auto border border-white/[0.08]">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg leading-tight text-white">Payment Successful!</h3>
                <p className="text-sm text-white/50">Your account has been upgraded.</p>
              </div>
              <button
                onClick={() => setShowSuccessToast(false)}
                className="p-2 hover:bg-white/[0.06] rounded-xl transition-colors text-white/40 hover:text-white"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay - Hidden on Homepage */}
      {!isHomePage && (
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      )}

      {/* Sidebar - Hidden on Homepage */}
      {!isHomePage && (
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-strong z-[70] transform transition-transform duration-300 ease-in-out flex flex-col border-r border-white/[0.06] ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-base tracking-tight text-white truncate">CreatorBoost<span className="text-brand-400">AI</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide" role="navigation" aria-label="Main navigation">
          {/* Search Button */}
          <button
            onClick={() => { setSearchOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/[0.05] transition-all duration-200 mb-3 border border-dashed border-white/[0.08]"
          >
            <Search className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="truncate">Search tools...</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-white/[0.06] text-[10px] text-white/30 rounded-lg font-mono border border-white/[0.08]">⌘K</kbd>
          </button>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/20 mb-2 px-3 pt-1">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                id={`sidebar-${item.id}`}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-600/15 text-brand-400 font-medium border border-brand-500/20"
                    : "text-white/40 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? "text-brand-400" : "text-white/25 group-hover:text-white/50"}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto border-t border-white/[0.06]">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName || 'User avatar'} className="w-9 h-9 rounded-xl border border-white/[0.08] object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 bg-white/[0.06] rounded-xl flex items-center justify-center border border-white/[0.08]">
                    <User className="w-4 h-4 text-white/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-white">{profile?.displayName || 'User'}</div>
                  <div className="text-[10px] font-medium text-brand-400">{profile?.role || 'User'}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-brand-600/20 btn-glow"
              aria-label="Login"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </aside>
      )}

      {/* Main Content */}
      <main id="main-content" className={cn("flex-1 flex flex-col min-w-0 relative", isHomePage ? "" : "h-screen overflow-hidden")} role="main">
        {/* Mobile Header - Hidden on Homepage */}
        {!isHomePage && (
        <header className="glass-strong border-b border-white/[0.06] px-4 py-3 flex items-center justify-between lg:hidden sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/[0.06] rounded-xl transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">CreatorBoost<span className="text-brand-400">AI</span></span>
            </div>
          </div>
          <ThemeToggle />
        </header>
        )}

        <div className={cn("flex-1 overflow-y-auto scrollbar-hide", isHomePage ? "" : "")}>
          <div className={cn(isHomePage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8")}>
            {serverStatus === 'error' && (
              <div className="mb-8 p-4 glass rounded-xl border border-red-500/20 flex items-center gap-3 text-sm font-medium text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Backend server is offline. Some features may be limited.</span>
              </div>
            )}
            <div className={cn("flex justify-end mb-6", isHomePage ? "hidden" : "hidden lg:flex")}>
              <ThemeToggle />
            </div>
            <div className="flex-1">
              <Suspense fallback={<RouteLoader />}>
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
                <Route path="/tools/image-filters" element={<ToolPage><ImageFilterApplier /></ToolPage>} />
                <Route path="/tools/image-to-base64" element={<ToolPage><ImageToBase64 /></ToolPage>} />
                <Route path="/tools/base64-to-image" element={<ToolPage><Base64ToImage /></ToolPage>} />
                <Route path="/tools/image-metadata" element={<ToolPage><ImageMetadataViewer /></ToolPage>} />
                <Route path="/tools/color-picker" element={<ToolPage><ColorPickerFromImage /></ToolPage>} />
                <Route path="/tools/image-splitter" element={<ToolPage><ImageSplitter /></ToolPage>} />
                <Route path="/tools/image-merger" element={<ToolPage><ImageMerger /></ToolPage>} />
                <Route path="/tools/favicon-generator" element={<ToolPage><FaviconGenerator /></ToolPage>} />

                {/* PDF Tools */}
                <Route path="/tools/pdf-merger" element={<ToolPage><PDFMerger /></ToolPage>} />
                <Route path="/tools/pdf-splitter" element={<ToolPage><PDFSplitter /></ToolPage>} />
                <Route path="/tools/pdf-remover" element={<ToolPage><PDFRemover /></ToolPage>} />
                <Route path="/tools/pdf-rotator" element={<ToolPage><PDFRotator /></ToolPage>} />
                <Route path="/tools/pdf-converter" element={<ToolPage><PDFConverter /></ToolPage>} />
                <Route path="/tools/pdf-compressor" element={<ToolPage><PDFCompressor /></ToolPage>} />
                <Route path="/tools/pdf-to-jpg" element={<ToolPage><PDFToJPG /></ToolPage>} />
                <Route path="/tools/jpg-to-pdf" element={<ToolPage><JPGToPDF /></ToolPage>} />
                <Route path="/tools/pdf-page-numberer" element={<ToolPage><PDFPageNumberer /></ToolPage>} />
                <Route path="/tools/pdf-watermark" element={<ToolPage><PDFWatermarkAdder /></ToolPage>} />
                <Route path="/tools/pdf-password-protector" element={<ToolPage><PDFPasswordProtector /></ToolPage>} />
                <Route path="/tools/pdf-unlocker" element={<ToolPage><PDFUnlocker /></ToolPage>} />
                <Route path="/tools/pdf-metadata-editor" element={<ToolPage><PDFMetadataEditor /></ToolPage>} />

                {/* AI Tools */}
                <Route path="/tools/pdf-summarizer" element={<ToolPage><PDFSummarizer /></ToolPage>} />
                <Route path="/tools/background-remover" element={<ToolPage><BackgroundRemover /></ToolPage>} />
                <Route path="/tools/image-analyzer" element={<ToolPage><ImageAnalyzer /></ToolPage>} />
                <Route path="/tools/ai-assistant" element={<ToolPage><AIAssistant /></ToolPage>} />
                <Route path="/tools/ai-thumbnail-generator" element={<ToolPage><AIThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/thumbnail-generator" element={<ToolPage><ThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/ai-bg-remover" element={<ToolPage><AIBackgroundRemover /></ToolPage>} />
                <Route path="/tools/ai-image-upscaler" element={<ToolPage><AIImageUpscaler /></ToolPage>} />
                <Route path="/tools/ai-text-to-image" element={<ToolPage><AITextToImage /></ToolPage>} />
                <Route path="/tools/ai-document-summarizer" element={<ToolPage><AIDocumentSummarizer /></ToolPage>} />
                <Route path="/tools/ai-chatbot" element={<ToolPage><AIChatbotAssistant /></ToolPage>} />
                <Route path="/tools/ai-code-generator" element={<ToolPage><AICodeGenerator /></ToolPage>} />
                <Route path="/tools/ai-translator" element={<ToolPage><AITranslator /></ToolPage>} />
                <Route path="/tools/ai-sentiment-analyzer" element={<ToolPage><AISentimentAnalyzer /></ToolPage>} />
                <Route path="/tools/competitor-analysis" element={<ToolPage><Competitor /></ToolPage>} />

                {/* Finance Tools */}
                <Route path="/tools/loan-emi-calculator" element={<ToolPage><LoanEMICalculator /></ToolPage>} />
                <Route path="/tools/simple-interest-calculator" element={<ToolPage><SimpleInterestCalculator /></ToolPage>} />
                <Route path="/tools/compound-interest-calculator" element={<ToolPage><CompoundInterestCalculator /></ToolPage>} />
                <Route path="/tools/sip-calculator" element={<ToolPage><SIPCalculator /></ToolPage>} />
                <Route path="/tools/budget-planner" element={<ToolPage><BudgetPlanner /></ToolPage>} />
                <Route path="/tools/tax-calculator" element={<ToolPage><TaxCalculator /></ToolPage>} />
                <Route path="/tools/fd-calculator" element={<ToolPage><FDCalculator /></ToolPage>} />
                <Route path="/tools/currency-converter" element={<ToolPage><CurrencyConverter /></ToolPage>} />
                <Route path="/tools/date-difference" element={<ToolPage><DateDifferenceCalculator /></ToolPage>} />
                <Route path="/tools/bmi-calculator" element={<ToolPage><BMICalculator /></ToolPage>} />
                <Route path="/tools/percentage-calculator" element={<ToolPage><PercentageCalculator /></ToolPage>} />
                <Route path="/tools/unit-converter" element={<ToolPage><UnitConverter /></ToolPage>} />
                <Route path="/tools/password-generator" element={<ToolPage><PasswordGenerator /></ToolPage>} />
                <Route path="/tools/loan-comparison" element={<ToolPage><LoanComparisonCalculator /></ToolPage>} />

                {/* Social Media Tools */}
                <Route path="/tools/hashtag-generator" element={<ToolPage><HashtagGenerator /></ToolPage>} />
                <Route path="/tools/youtube-thumbnail-maker" element={<ToolPage><AIThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/instagram-post-resizer" element={<ToolPage><ImageResizer /></ToolPage>} />
                <Route path="/tools/tiktok-watermark-remover" element={<ToolPage><WatermarkTool /></ToolPage>} />
                <Route path="/tools/bio-link-page-builder" element={<ToolPage><BioLinkPageBuilder /></ToolPage>} />
                <Route path="/tools/youtube-title-tag-generator" element={<ToolPage><AIThumbnailGenerator /></ToolPage>} />
                <Route path="/tools/social-media-caption-writer" element={<ToolPage><CaptionWriter /></ToolPage>} />
                <Route path="/tools/qr-code-generator" element={<ToolPage><QRCodeGenerator /></ToolPage>} />
                <Route path="/tools/content-idea-generator" element={<ToolPage><ContentIdeaGenerator /></ToolPage>} />
                <Route path="/tools/caption-writer" element={<ToolPage><CaptionWriter /></ToolPage>} />
                <Route path="/tools/social-analytics" element={<ToolPage><SocialAnalytics /></ToolPage>} />
                <Route path="/tools/link-shortener" element={<ToolPage><LinkShortener /></ToolPage>} />
                <Route path="/tools/emoji-picker" element={<ToolPage><EmojiPicker /></ToolPage>} />

                {/* Content Creator Tools */}
                <Route path="/tools/blog-title-generator" element={<ToolPage><BlogPostTitleGenerator /></ToolPage>} />
                <Route path="/tools/blog-outline-generator" element={<ToolPage><BlogPostOutlineGenerator /></ToolPage>} />
                <Route path="/tools/meta-description-generator" element={<ToolPage><MetaDescriptionGenerator /></ToolPage>} />
                <Route path="/tools/social-post-generator" element={<ToolPage><SocialMediaPostGenerator /></ToolPage>} />
                <Route path="/tools/content-paraphraser" element={<ToolPage><ContentParaphraser /></ToolPage>} />
                <Route path="/tools/grammar-checker" element={<ToolPage><GrammarSpellingChecker /></ToolPage>} />
                <Route path="/tools/word-counter" element={<ToolPage><WordCounter /></ToolPage>} />
                <Route path="/tools/slug-generator" element={<ToolPage><SlugGenerator /></ToolPage>} />
                <Route path="/tools/email-subject-generator" element={<ToolPage><EmailSubjectLineGenerator /></ToolPage>} />
                <Route path="/tools/content-calendar" element={<ToolPage><ContentCalendarGenerator /></ToolPage>} />

                {/* Quick-Win Tools */}
                <Route path="/tools/json-formatter" element={<ToolPage><JSONFormatter /></ToolPage>} />
                <Route path="/tools/base64-encoder" element={<ToolPage><Base64EncoderDecoder /></ToolPage>} />
                <Route path="/tools/html-to-markdown" element={<ToolPage><HTMLToMarkdownConverter /></ToolPage>} />
                <Route path="/tools/markdown-to-html" element={<ToolPage><MarkdownToHTMLConverter /></ToolPage>} />
                <Route path="/tools/css-minifier" element={<ToolPage><CSSMinifier /></ToolPage>} />
                <Route path="/tools/js-minifier" element={<ToolPage><JSMinifier /></ToolPage>} />
                <Route path="/tools/url-encoder" element={<ToolPage><URLEncoderDecoder /></ToolPage>} />
                <Route path="/tools/hash-generator" element={<ToolPage><HashGenerator /></ToolPage>} />
                <Route path="/tools/regex-tester" element={<ToolPage><RegexTester /></ToolPage>} />
                <Route path="/tools/color-converter" element={<ToolPage><ColorCodeConverter /></ToolPage>} />
                <Route path="/tools/age-calculator" element={<ToolPage><AgeCalculator /></ToolPage>} />
                <Route path="/tools/pdf-to-word" element={<ToolPage><PDFToWord /></ToolPage>} />
                <Route path="/tools/youtube-downloader" element={<ToolPage><YouTubeDownloader /></ToolPage>} />
                <Route path="/tools/youtube-title-generator" element={<ToolPage><YouTubeTitleGenerator /></ToolPage>} />
                <Route path="/tools/youtube-description-generator" element={<ToolPage><YouTubeDescriptionGenerator /></ToolPage>} />
                <Route path="/tools/youtube-tag-generator" element={<ToolPage><YouTubeTagGenerator /></ToolPage>} />
                <Route path="/tools/youtube-hashtag-generator" element={<ToolPage><YouTubeHashtagGenerator /></ToolPage>} />
                <Route path="/tools/youtube-script-writer" element={<ToolPage><YouTubeScriptWriter /></ToolPage>} />
                <Route path="/tools/youtube-seo-checker" element={<ToolPage><YouTubeSEOScoreChecker /></ToolPage>} />
                <Route path="/tools/youtube-channel-analyzer" element={<ToolPage><YouTubeChannelAnalyzer /></ToolPage>} />
                <Route path="/tools/youtube-comment-replies" element={<ToolPage><YouTubeCommentReplyGenerator /></ToolPage>} />
                <Route path="/tools/youtube-video-ideas" element={<ToolPage><YouTubeVideoIdeasGenerator /></ToolPage>} />
                <Route path="/tools/meta-tag-generator" element={<ToolPage><MetaTagGenerator /></ToolPage>} />
                <Route path="/tools/youtube-thumbnail-downloader" element={<ToolPage><YouTubeThumbnailDownloader /></ToolPage>} />

                {/* Static Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/dmca" element={<DMCA />} />
                <Route path="/editorial-policy" element={<EditorialPolicy />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Blog />} />
                <Route path="/how-to-use" element={<HowToUse />} />

                {/* SEO Dashboard */}
                <Route path="/seo-dashboard" element={<SEODashboard />} />

                {/* User Dashboard */}
                <Route path="/dashboard/tools" element={<UserDashboard />} />

                {/* Category Pages */}
                <Route path="/category/:categoryId" element={<CategoryPage />} />

                {/* Admin Dashboard */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* CMS Dashboard */}
                <Route path="/cms" element={<CMSDashboard />} />

                {/* Dynamic SEO Pages Route */}
                <Route path="/tools/:toolPath" element={<DynamicSEOToolPage />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </div>

            {/* Footer - Hidden on Homepage (Dashboard has its own footer) */}
            {!isHomePage && (
            <div className="mt-16 pt-8 border-t border-white/[0.04]">
              <div className="flex flex-wrap justify-center gap-6">
                {footerLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      navigate(link.path);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-400 transition-colors duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </main>

      {/* Premium Footer for Homepage */}
      {isHomePage && <Footer />}

      <Suspense fallback={null}>
        <CookieConsent />
        <BackToTop />
        <ToolSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <NewsletterPopup />
        <ExitIntentPopup />
      </Suspense>
    </div>
  );
}
