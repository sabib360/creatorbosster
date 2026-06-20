import { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, Image as ImageIcon, FileText, Bot, Menu, X, Settings, Shield, Mail, File, Search, Zap, History, CreditCard, LogIn, LogOut, User, Palette, Calculator, Hash, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { useAuth } from './hooks/useAuth';
import { ThemeToggle } from './components/ThemeToggle';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './components/Dashboard';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import UserDashboard from './components/UserDashboard';
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
import ImageFilterApplier from './components/tools/ImageFilterApplier';
import ImageToBase64 from './components/tools/ImageToBase64';
import Base64ToImage from './components/tools/Base64ToImage';
import ImageMetadataViewer from './components/tools/ImageMetadataViewer';
import ColorPickerFromImage from './components/tools/ColorPickerFromImage';
import ImageSplitter from './components/tools/ImageSplitter';
import ImageMerger from './components/tools/ImageMerger';
import FaviconGenerator from './components/tools/FaviconGenerator';
import PDFMerger from './components/tools/PDFMerger';
import PDFSplitter from './components/tools/PDFSplitter';
import PDFRemover from './components/tools/PDFRemover';
import PDFRotator from './components/tools/PDFRotator';
import PDFConverter from './components/tools/PDFConverter';
import PDFCompressor from './components/tools/PDFCompressor';
import PDFToJPG from './components/tools/PDFToJPG';
import JPGToPDF from './components/tools/JPGToPDF';
import PDFPageNumberer from './components/tools/PDFPageNumberer';
import PDFWatermarkAdder from './components/tools/PDFWatermarkAdder';
import PDFPasswordProtector from './components/tools/PDFPasswordProtector';
import PDFUnlocker from './components/tools/PDFUnlocker';
import PDFMetadataEditor from './components/tools/PDFMetadataEditor';
import PDFSummarizer from './components/tools/PDFSummarizer';
import BackgroundRemover from './components/tools/BackgroundRemover';
import ImageAnalyzer from './components/tools/ImageAnalyzer';
import AIAssistant from './components/tools/AIAssistant';
import AIBackgroundRemover from './components/tools/AIBackgroundRemover';
import AIImageUpscaler from './components/tools/AIImageUpscaler';
import AITextToImage from './components/tools/AITextToImage';
import AIDocumentSummarizer from './components/tools/AIDocumentSummarizer';
import AIChatbotAssistant from './components/tools/AIChatbotAssistant';
import AICodeGenerator from './components/tools/AICodeGenerator';
import AITranslator from './components/tools/AITranslator';
import AISentimentAnalyzer from './components/tools/AISentimentAnalyzer';
import ThumbnailGenerator from './components/tools/ThumbnailGenerator';
import AIThumbnailGenerator from './components/tools/AIThumbnailGenerator';
import LoanEMICalculator from './components/tools/LoanEMICalculator';
import SimpleInterestCalculator from './components/tools/SimpleInterestCalculator';
import CompoundInterestCalculator from './components/tools/CompoundInterestCalculator';
import HashtagGenerator from './components/tools/HashtagGenerator';
import FinanceTools from './components/FinanceTools';
import SocialMediaTools from './components/SocialMediaTools';
import SIPCalculator from './components/tools/SIPCalculator';
import BudgetPlanner from './components/tools/BudgetPlanner';
import TaxCalculator from './components/tools/TaxCalculator';
import FDCalculator from './components/tools/FDCalculator';
import CurrencyConverter from './components/tools/CurrencyConverter';
import DateDifferenceCalculator from './components/tools/DateDifferenceCalculator';
import BMICalculator from './components/tools/BMICalculator';
import PercentageCalculator from './components/tools/PercentageCalculator';
import UnitConverter from './components/tools/UnitConverter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import LoanComparisonCalculator from './components/tools/LoanComparisonCalculator';
import ContentIdeaGenerator from './components/tools/ContentIdeaGenerator';
import CaptionWriter from './components/tools/CaptionWriter';
import SocialAnalytics from './components/tools/SocialAnalytics';
import LinkShortener from './components/tools/LinkShortener';
import EmojiPicker from './components/tools/EmojiPicker';
import BioLinkPageBuilder from './components/tools/BioLinkPageBuilder';
import HowToUse from './components/HowToUse';
import DynamicSEOToolPage from './components/DynamicSEOToolPage';
import JSONFormatter from './components/tools/JSONFormatter';
import Base64EncoderDecoder from './components/tools/Base64EncoderDecoder';
import HTMLToMarkdownConverter from './components/tools/HTMLToMarkdownConverter';
import MarkdownToHTMLConverter from './components/tools/MarkdownToHTMLConverter';
import CSSMinifier from './components/tools/CSSMinifier';
import JSMinifier from './components/tools/JSMinifier';
import URLEncoderDecoder from './components/tools/URLEncoderDecoder';
import HashGenerator from './components/tools/HashGenerator';
import RegexTester from './components/tools/RegexTester';
import ColorCodeConverter from './components/tools/ColorCodeConverter';
import AgeCalculator from './components/tools/AgeCalculator';
import PDFToWord from './components/tools/PDFToWord';
import YouTubeDownloader from './components/tools/YouTubeDownloader';
import YouTubeThumbnailDownloader from './components/tools/YouTubeThumbnailDownloader';
import YouTubeTitleGenerator from './components/tools/YouTubeTitleGenerator';
import YouTubeDescriptionGenerator from './components/tools/YouTubeDescriptionGenerator';
import YouTubeTagGenerator from './components/tools/YouTubeTagGenerator';
import YouTubeHashtagGenerator from './components/tools/YouTubeHashtagGenerator';
import YouTubeScriptWriter from './components/tools/YouTubeScriptWriter';
import YouTubeSEOScoreChecker from './components/tools/YouTubeSEOScoreChecker';
import YouTubeChannelAnalyzer from './components/tools/YouTubeChannelAnalyzer';
import YouTubeCommentReplyGenerator from './components/tools/YouTubeCommentReplyGenerator';
import YouTubeVideoIdeasGenerator from './components/tools/YouTubeVideoIdeasGenerator';
import QRCodeGenerator from './components/tools/QRCodeGenerator';
import MetaTagGenerator from './components/tools/MetaTagGenerator';
import BlogPostTitleGenerator from './components/tools/BlogPostTitleGenerator';
import BlogPostOutlineGenerator from './components/tools/BlogPostOutlineGenerator';
import MetaDescriptionGenerator from './components/tools/MetaDescriptionGenerator';
import SocialMediaPostGenerator from './components/tools/SocialMediaPostGenerator';
import ContentParaphraser from './components/tools/ContentParaphraser';
import GrammarSpellingChecker from './components/tools/GrammarSpellingChecker';
import WordCounter from './components/tools/WordCounter';
import SlugGenerator from './components/tools/SlugGenerator';
import EmailSubjectLineGenerator from './components/tools/EmailSubjectLineGenerator';
import ContentCalendarGenerator from './components/tools/ContentCalendarGenerator';
import SEODashboard from './components/SEODashboard';
import CategoryPage from './components/CategoryPage';
import ToolSearch from './components/ToolSearch';
import CookieConsent from './components/CookieConsent';
import { NewsletterPopup, ExitIntentPopup, InlineNewsletter, SidebarNewsletter, FooterNewsletter } from './components/Newsletter';
import CookiePolicy from './components/CookiePolicy';
import Disclaimer from './components/Disclaimer';
import DMCA from './components/DMCA';
import EditorialPolicy from './components/EditorialPolicy';
import SitemapPage from './components/SitemapPage';
import NotFound from './components/NotFound';
import AdminDashboard from './components/AdminDashboard';
import CMSDashboard from './components/admin/CMSDashboard';
import BackToTop from './components/BackToTop';

type View = 'dashboard' | 'image-tools' | 'pdf-tools' | 'ai-tools' | 'finance-tools' | 'social-media-tools' | 'privacy-policy' | 'terms-of-service' | 'contact-us' | 'about' | 'blog';

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
    { id: 'cookie-policy', label: 'Cookie Policy', icon: Settings, path: '/cookie-policy' },
    { id: 'disclaimer', label: 'Disclaimer', icon: AlertCircle, path: '/disclaimer' },
    { id: 'dmca', label: 'DMCA', icon: Shield, path: '/dmca' },
    { id: 'contact-us', label: 'Contact Us', icon: Mail, path: '/contact-us' },
  ] as const;

  return (
    <div className={cn("bg-slate-950 font-sans text-ink selection:bg-primary selection:text-black", isHomePage ? "min-h-screen" : "flex h-screen overflow-hidden")}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-primary focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold">Skip to content</a>
      <AdBlockerDetector />

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-4 pointer-events-none"
          >
            <div className="bg-primary text-black shadow-2xl shadow-primary/20 p-6 rounded-2xl flex items-center gap-5 pointer-events-auto border border-white/20">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-black fill-black" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg leading-tight">Payment Successful!</h3>
                <p className="text-sm opacity-80">Your account has been upgraded.</p>
              </div>
              <button 
                onClick={() => setShowSuccessToast(false)}
                className="p-2 hover:bg-black/10 rounded-xl transition-colors"
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
            className="fixed inset-0 bg-black/70 z-[60] lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      )}

      {/* Sidebar - Hidden on Homepage */}
      {!isHomePage && (
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/60 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-ink truncate">CreatorBoost AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hide" role="navigation" aria-label="Main navigation">
          {/* Search Button */}
          <button
            onClick={() => { setSearchOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink/40 hover:text-ink hover:bg-slate-800/50 transition-all duration-200 mb-2 border border-dashed border-slate-700/50"
          >
            <Search className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="truncate">Search tools...</span>
            <kbd className="ml-auto px-1.5 py-0.5 bg-slate-800 text-[10px] text-ink/30 rounded font-mono">⌘K</kbd>
          </button>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ink/30 mb-2 px-3 pt-1">Menu</div>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                    : "text-ink/50 hover:text-ink hover:bg-slate-800/50"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-ink/30 group-hover:text-ink/50"}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto border-t border-slate-800/50">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName || 'User avatar'} className="w-9 h-9 rounded-lg border border-slate-800 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <User className="w-4 h-4 text-ink/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-ink">{profile?.displayName || 'User'}</div>
                  <div className="text-[10px] font-medium text-primary/80">{profile?.role || 'User'}</div>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-ink/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-black text-sm font-medium rounded-lg hover:bg-primary/90 transition-all"
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
        <header className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 flex items-center justify-between lg:hidden sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-ink" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black fill-black" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-ink">CreatorBoost AI</span>
            </div>
          </div>
          <ThemeToggle />
        </header>
        )}

        <div className={cn("flex-1 overflow-y-auto scrollbar-hide", isHomePage ? "" : "")}>
          <div className={cn(isHomePage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8")}>
            {serverStatus === 'error' && (
              <div className="mb-8 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Backend server is offline. Some features may be limited.</span>
              </div>
            )}
            <div className={cn("flex justify-end mb-6", isHomePage ? "hidden" : "hidden lg:flex")}>
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
                <Route path="/tools/image-filters" element={<ToolPage><ImageFilterApplier /></ToolPage>} />
                <Route path="/tools/image-to-base64" element={<ToolPage><ImageToBase64 /></ToolPage>} />
                <Route path="/tools/base64-to-image" element={<ToolPage><Base64ToImage /></ToolPage>} />
                <Route path="/tools/image-metadata" element={<ToolPage><ImageMetadataViewer /></ToolPage>} />
                <Route path="/tools/color-picker" element={<ToolPage><ColorPickerFromImage /></ToolPage>} />
                <Route path="/tools/image-splitter" element={<ToolPage><ImageSplitter /></ToolPage>} />
                <Route path="/tools/image-merger" element={<ToolPage><ImageMerger /></ToolPage>} />
                <Route path="/tools/favicon-generator" element={<ToolPage><FaviconGenerator /></ToolPage>} />
                
                {/* PDF Tools */}
                <Route path="/tools/pdf-merger" element={<ToolPage faqItems={[
                  { q: 'Is there a limit to how many files I can merge?', a: 'There is no enforced limit. Merging more than 20 large files may slow down your browser.' },
                  { q: 'Will bookmarks and annotations carry over?', a: 'Basic page content is preserved. Bookmarks, annotations, and form fields may not transfer.' },
                  { q: 'Are my files uploaded to a server?', a: 'No. The merging is performed entirely in your browser using pdf-lib.' },
                  { q: 'Can I merge password-protected PDFs?', a: 'PDFs with owner passwords may work. Remove open passwords before attempting to merge.' },
                ]}><PDFMerger /></ToolPage>} />
                <Route path="/tools/pdf-splitter" element={<ToolPage><PDFSplitter /></ToolPage>} />
                <Route path="/tools/pdf-remover" element={<ToolPage><PDFRemover /></ToolPage>} />
                <Route path="/tools/pdf-rotator" element={<ToolPage faqItems={[
                  { q: 'Can I rotate only specific pages?', a: 'This tool rotates all pages. Use PDF Splitter to extract pages, rotate separately, then recombine.' },
                  { q: 'Will rotating change the file size?', a: 'Rotation only modifies page orientation metadata. It does not alter image data or file size.' },
                  { q: 'Is my PDF uploaded anywhere?', a: 'No. The rotation is performed entirely in your browser using pdf-lib.' },
                  { q: 'What if my PDF is password-protected?', a: 'PDFs with owner passwords that allow editing may still work. Remove open passwords first.' },
                ]}><PDFRotator /></ToolPage>} />
                <Route path="/tools/pdf-converter" element={<ToolPage faqItems={[
                  { q: 'Will formatting be preserved during conversion?', a: 'PDF-to-Word conversion retains most layout elements. Complex formatting may shift slightly.' },
                  { q: 'Can I convert a scanned PDF to editable text?', a: 'Image-only PDFs without OCR will convert as blank text. Use an OCR tool first.' },
                  { q: 'Is my document uploaded to a server?', a: 'This tool processes files in-browser wherever possible.' },
                  { q: 'What is the maximum file size?', a: 'There is no hard limit, but files over 50 MB may cause slow performance.' },
                ]}><PDFConverter /></ToolPage>} />
                <Route path="/tools/pdf-compressor" element={<ToolPage faqItems={[
                  { q: 'Does compression reduce text clarity?', a: 'The tool restructures the PDF internal object streams rather than down-sampling images, so text and vector graphics stay sharp.' },
                  { q: 'Is my file uploaded to a server?', a: 'No. Everything happens in your browser using the pdf-lib library. Your PDF never leaves your device.' },
                  { q: 'What is the maximum file size I can compress?', a: 'There is no hard limit from our side, but very large files over 100 MB may slow down your browser.' },
                  { q: 'Can I compress password-protected PDFs?', a: 'If the PDF has an owner password that allows printing and editing, it may still work.' },
                ]}><PDFCompressor /></ToolPage>} />
                <Route path="/tools/pdf-to-jpg" element={<ToolPage faqItems={[
                  { q: 'What resolution do the output images have?', a: 'Pages are rendered at standard screen resolution (150 DPI by default).' },
                  { q: 'Can I convert only specific pages?', a: 'This version converts all pages. Use the PDF Splitter first to extract specific pages.' },
                  { q: 'Are my files uploaded to a server?', a: 'No. The conversion runs entirely in your browser.' },
                  { q: 'Does it preserve colors and formatting?', a: 'The rendered JPGs faithfully reproduce the visual appearance of each PDF page.' },
                ]}><PDFToJPG /></ToolPage>} />
                <Route path="/tools/jpg-to-pdf" element={<ToolPage faqItems={[
                  { q: 'How many images can I combine?', a: 'There is no strict limit. Each image becomes one page in the PDF.' },
                  { q: 'Will the image quality change?', a: 'No. The images are embedded at their original resolution without recompression.' },
                  { q: 'Does it support HEIC or WebP formats?', a: 'Currently only JPG and PNG are supported for direct embedding.' },
                  { q: 'Are my uploaded images stored anywhere?', a: 'No. All processing happens in your browser using the pdf-lib library.' },
                ]}><JPGToPDF /></ToolPage>} />
                <Route path="/tools/pdf-page-numberer" element={<ToolPage><PDFPageNumberer /></ToolPage>} />
                <Route path="/tools/pdf-watermark" element={<ToolPage><PDFWatermarkAdder /></ToolPage>} />
                <Route path="/tools/pdf-password-protector" element={<ToolPage><PDFPasswordProtector /></ToolPage>} />
                <Route path="/tools/pdf-unlocker" element={<ToolPage><PDFUnlocker /></ToolPage>} />
                <Route path="/tools/pdf-metadata-editor" element={<ToolPage><PDFMetadataEditor /></ToolPage>} />
                
                {/* AI Tools */}
                <Route path="/tools/pdf-summarizer" element={<ToolPage faqItems={[
                  { q: 'How accurate are the summaries?', a: 'The AI extracts the most prominent themes and data points. Always verify critical details against the original source.' },
                  { q: 'Does the PDF stay private?', a: 'The file is sent to Google Gemini API for processing. It is not stored on our servers.' },
                  { q: 'What PDF types work best?', a: 'Text-based PDFs produce the best results. Scanned image-only PDFs may yield limited summaries.' },
                  { q: 'Is there a page limit?', a: 'There is no enforced limit, but very large documents over 200 pages may hit API constraints.' },
                ]}><PDFSummarizer /></ToolPage>} />
                <Route path="/tools/background-remover" element={<ToolPage><BackgroundRemover /></ToolPage>} />
                <Route path="/tools/image-analyzer" element={<ToolPage faqItems={[
                  { q: 'Which image formats are supported?', a: 'The tool accepts JPG, PNG, WebP, GIF, and BMP files.' },
                  { q: 'Is the image sent to an external server?', a: 'Yes. The image is transmitted to Google Gemini API for analysis. It is not stored on our servers.' },
                  { q: 'Can it detect faces or people?', a: 'The AI can describe the presence of people but is not designed for facial recognition.' },
                  { q: 'Does image size affect analysis speed?', a: 'Larger files take slightly longer to upload and process. For fastest results, keep images under 5 MB.' },
                ]}><ImageAnalyzer /></ToolPage>} />
                <Route path="/tools/ai-assistant" element={<ToolPage faqItems={[
                  { q: 'What topics can I ask about?', a: 'The assistant is optimized for YouTube content creation — titles, thumbnails, SEO tags, channel growth, and competitor analysis.' },
                  { q: 'Does it cost credits to chat?', a: 'Each message exchange consumes one AI credit from your daily balance.' },
                  { q: 'Is my conversation stored?', a: 'Your chat history is kept in your browser session only and is lost when you close the page.' },
                  { q: 'Can it write full video scripts?', a: 'The assistant can generate outline structures, hook lines, and talking-point bullet lists.' },
                ]}><AIAssistant /></ToolPage>} />
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
                <Route path="/tools/qr-code-generator" element={<ToolPage faqItems={[
                  { q: 'Can I customize the QR code colors?', a: 'Yes. You can set custom foreground and background colors using presets or the color picker.' },
                  { q: 'Which QR code types are supported?', a: 'URLs, plain text, email, phone numbers, WiFi credentials, and vCard contact cards.' },
                  { q: 'What format can I download?', a: 'You can download as PNG (raster) or SVG (vector). SVG is recommended for print quality.' },
                  { q: 'What does error correction level mean?', a: 'Higher levels add more redundancy, making the QR code readable even if partially damaged or covered. High (30%) is best when adding a logo.' },
                ]}><QRCodeGenerator /></ToolPage>} />
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
                <Route path="/tools/json-formatter" element={<ToolPage faqItems={[
                  { q: 'What is JSON?', a: 'JSON (JavaScript Object Notation) is a lightweight data format for storing and exchanging data.' },
                  { q: 'Why format JSON?', a: 'Formatted JSON is easier to read and debug. Minified JSON takes less space.' },
                  { q: 'Is my data safe?', a: 'Yes! All processing happens in your browser. We never upload or store your data.' },
                ]}><JSONFormatter /></ToolPage>} />
                <Route path="/tools/base64-encoder" element={<ToolPage faqItems={[
                  { q: 'Is Base64 the same as encryption?', a: 'No. Base64 is an encoding scheme, not encryption. It is trivially reversible and provides zero security.' },
                  { q: 'Does it handle Unicode text?', a: 'The encoder automatically converts Unicode using encodeURIComponent before encoding.' },
                  { q: 'What is the output size compared to input?', a: 'Base64 encoding increases data size by approximately 33%.' },
                  { q: 'Is my data sent to a server?', a: 'No. All encoding and decoding happens locally in your browser.' },
                ]}><Base64EncoderDecoder /></ToolPage>} />
                <Route path="/tools/html-to-markdown" element={<ToolPage><HTMLToMarkdownConverter /></ToolPage>} />
                <Route path="/tools/markdown-to-html" element={<ToolPage><MarkdownToHTMLConverter /></ToolPage>} />
                <Route path="/tools/css-minifier" element={<ToolPage><CSSMinifier /></ToolPage>} />
                <Route path="/tools/js-minifier" element={<ToolPage><JSMinifier /></ToolPage>} />
                <Route path="/tools/url-encoder" element={<ToolPage><URLEncoderDecoder /></ToolPage>} />
                <Route path="/tools/hash-generator" element={<ToolPage><HashGenerator /></ToolPage>} />
                <Route path="/tools/regex-tester" element={<ToolPage><RegexTester /></ToolPage>} />
                <Route path="/tools/color-converter" element={<ToolPage><ColorCodeConverter /></ToolPage>} />
                <Route path="/tools/age-calculator" element={<ToolPage faqItems={[
                  { q: 'How accurate is this calculator?', a: 'Our calculator is 100% accurate and accounts for leap years and month variations.' },
                  { q: "Can I calculate someone else's age?", a: 'Yes! Just enter their date of birth and click calculate.' },
                  { q: 'Is my data saved?', a: "No! All calculations happen in your browser. We don't store any data." },
                ]}><AgeCalculator /></ToolPage>} />
                <Route path="/tools/pdf-to-word" element={<ToolPage faqItems={[
                  { q: 'Is the conversion accurate?', a: 'Yes, our converter preserves the original formatting, fonts, and layout.' },
                  { q: 'What file formats are supported?', a: 'We convert PDF files to DOCX (Microsoft Word 2007 and later).' },
                  { q: 'How secure is my data?', a: 'All uploads are encrypted. Files are automatically deleted after conversion.' },
                ]}><PDFToWord /></ToolPage>} />
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
                <Route path="/tools/meta-tag-generator" element={<ToolPage faqItems={[
                  { q: 'What are meta tags?', a: 'Meta tags are HTML elements in the <head> of a webpage that provide information to search engines and social media platforms about your page content.' },
                  { q: 'Why are Open Graph tags important?', a: 'OG tags control how your page appears when shared on Facebook, LinkedIn, and other social platforms — including the title, description, and preview image.' },
                  { q: 'Do meta keywords still matter for SEO?', a: 'Google ignores meta keywords, but Bing and Yandex still consider them. It is low priority but harmless to include.' },
                  { q: 'What is the ideal title tag length?', a: '50-60 characters. Google typically displays the first 60 characters and truncates the rest with an ellipsis.' },
                ]}><MetaTagGenerator /></ToolPage>} />
                <Route path="/tools/youtube-thumbnail-downloader" element={<ToolPage faqItems={[
                  { q: 'What resolution can I download?', a: 'You can download thumbnails in 5 resolutions: Max (1280x720), SD (640x480), HD (480x360), Medium (320x180), and Low (120x90).' },
                  { q: 'Does this work with YouTube Shorts?', a: 'Yes. YouTube Shorts thumbnails are accessible through the same img.youtube.com endpoint.' },
                  { q: 'Can I use these thumbnails in my own videos?', a: 'You may use them for reference, inspiration, or fair-use purposes. Always respect copyright and give credit when appropriate.' },
                  { q: 'What if the thumbnail is not available?', a: 'Some older videos may not have a max-resolution thumbnail. Try a lower resolution option.' },
                ]}><YouTubeThumbnailDownloader /></ToolPage>} />
                
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
                <Route path="/blog/:slug" element={<BlogPostRoute />} />
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

                {/* Dynamic SEO Pages Route (must be last before wildcard) */}
                <Route path="/tools/:toolPath" element={<DynamicSEOToolPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>

            {/* Footer - Hidden on Homepage (Dashboard has its own footer) */}
            {!isHomePage && (
            <div className="mt-16 pt-8 border-t border-slate-800/50">
              <div className="flex flex-wrap justify-center gap-6">
                {footerLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      navigate(link.path);
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center gap-2 text-sm text-ink/40 hover:text-ink transition-colors"
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
      <CookieConsent />
      <BackToTop />
      <ToolSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NewsletterPopup />
      <ExitIntentPopup />
    </div>
  );
}
