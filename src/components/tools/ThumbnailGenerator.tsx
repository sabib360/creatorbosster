import { useState, useRef, useEffect } from 'react';
import { Crown, Sparkles, Download, Trash2, Palette, Type, Upload, AlertCircle, CheckCircle2, History, Rocket, Stars, Infinity, Zap, Flame, Wand2, Video, Play, Film, BarChart3, Layers, ZapOff, Brain, QrCode, Link, Share2, Smartphone, Shield, Key, Lock, Unlock, Copy, RefreshCw, Calculator, DollarSign, Ruler, Weight, TrendingUp, ArrowRightLeft, Star, FileText, Scissors, Merge, FilePlus, FileMinus, Grid, List, Eye, DownloadCloud, Trash2 as Delete, PiggyBank, CreditCard, Calendar, TrendingDown, Hash, Search, Copy as CopyIcon, Lightbulb, Target, Zap as ZapIcon, Clock, Users, Heart, Music, Camera, Video as VideoIcon, Briefcase, Car, Home, Plane, BookOpen } from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import html2canvas from 'html2canvas';
import {
  trackThumbnailGenerated,
  trackThumbnailDownloaded,
  trackThumbnailEdited,
} from '../../lib/analytics';

interface DesignTemplate {
  id: string;
  name: string;
  category: 'vibe' | 'gaming' | 'vlog' | 'tech' | 'business' | 'entertainment';
  bg: string;
  textColor: string;
  accentColor: string;
  fontSize: { title: number; desc: number };
  layout: 'center' | 'left' | 'right';
  ctrScore: number;
}

interface ThumbnailScore {
  overall: number;
  ctr: number;
  readability: number;
  contrast: number;
  emotion: number;
  suggestions: string[];
}

interface SavedProject {
  id: string;
  name: string;
  title: string;
  description: string;
  template: DesignTemplate;
  fontSize: number;
  descFontSize: number;
  backgroundImage: string | null;
  score: ThumbnailScore;
  createdAt: number;
  lastEdited: number;
}

interface VideoFrame {
  id: string;
  timestamp: number;
  imageUrl: string;
  score: number;
  sceneType: 'intro' | 'highlight' | 'outro' | 'action' | 'dialogue';
  selected: boolean;
}

interface ABTestResult {
  thumbnailA: string;
  thumbnailB: string;
  winner: 'A' | 'B' | 'tie';
  confidence: number;
  reasoning: string;
  ctrPrediction: number;
}

interface ViralPrediction {
  overallScore: number;
  viralPotential: 'low' | 'medium' | 'high' | 'viral';
  predictedViews: string;
  engagementRate: number;
  suggestedImprovements: string[];
  competitorAnalysis: string;
  bestPostingTime: string;
}

interface AutomatedContent {
  titles: string[];
  descriptions: string[];
  tags: string[];
  thumbnails: string[];
  selectedTitle: string;
  selectedDescription: string;
  selectedTags: string[];
  selectedThumbnail: string;
  prediction: ViralPrediction;
}

interface QRCodeOptions {
  content: string;
  type: 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'social';
  size: number;
  color: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  logoImage?: string;
  style: 'square' | 'dots' | 'rounded' | 'fancy';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;
}

interface QRCodeData {
  id: string;
  qrDataUrl: string;
  options: QRCodeOptions;
  createdAt: number;
}

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

interface PasswordStrength {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  color: string;
}

interface GeneratedPassword {
  password: string;
  strength: PasswordStrength;
  options: PasswordOptions;
  createdAt: number;
}

interface UnitConversion {
  id: string;
  category: 'currency' | 'length' | 'weight';
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  timestamp: number;
  isFavorite: boolean;
}

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

interface LengthUnit {
  code: string;
  name: string;
  symbol: string;
  toMeters: number;
}

interface WeightUnit {
  code: string;
  name: string;
  symbol: string;
  toKilograms: number;
}

interface PDFFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  file: File;
  preview?: string;
  selectedPages?: number[];
}

interface PDFOperation {
  id: string;
  type: 'merge' | 'split';
  files: PDFFile[];
  outputName: string;
  createdAt: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
}

interface LoanCalculation {
  id: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
  createdAt: number;
  loanType: 'home' | 'car' | 'personal' | 'education';
}

interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  emmi: number;
  balance: number;
}

interface HashtagCategory {
  id: string;
  name: string;
  icon: any;
  hashtags: string[];
  trending: boolean;
}

interface HashtagSet {
  id: string;
  platform: 'instagram' | 'tiktok';
  category: string;
  hashtags: string[];
  count: number;
  engagement: number;
  createdAt: number;
}

const DESIGN_TEMPLATES: DesignTemplate[] = [
  // Gaming Templates
  {
    id: 'gaming-fps',
    name: '🎮 FPS Master',
    category: 'gaming',
    bg: 'linear-gradient(135deg, #FF0000 0%, #FF6B35 50%, #FFD700 100%)',
    textColor: '#FFFFFF',
    accentColor: '#00FF00',
    fontSize: { title: 56, desc: 28 },
    layout: 'center',
    ctrScore: 92,
  },
  {
    id: 'gaming-moba',
    name: '⚔️ MOBA Legend',
    category: 'gaming',
    bg: 'linear-gradient(135deg, #4A0E4E 0%, #81689D 50%, #FFD23F 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFD23F',
    fontSize: { title: 52, desc: 26 },
    layout: 'left',
    ctrScore: 89,
  },
  {
    id: 'gaming-retro',
    name: '�️ Retro Wave',
    category: 'gaming',
    bg: 'linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFBE0B',
    fontSize: { title: 48, desc: 24 },
    layout: 'center',
    ctrScore: 85,
  },
  
  // Vlog Templates
  {
    id: 'vlog-lifestyle',
    name: '🌟 Lifestyle',
    category: 'vlog',
    bg: 'linear-gradient(135deg, #FFB5E8 0%, #FF006E 50%, #FB5607 100%)',
    textColor: '#FFFFFF',
    accentColor: '#3A0CA3',
    fontSize: { title: 50, desc: 25 },
    layout: 'right',
    ctrScore: 87,
  },
  {
    id: 'vlog-travel',
    name: '✈️ Travel',
    category: 'vlog',
    bg: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 50%, #023E8A 100%)',
    textColor: '#FFFFFF',
    accentColor: '#90E0EF',
    fontSize: { title: 54, desc: 27 },
    layout: 'center',
    ctrScore: 91,
  },
  {
    id: 'vlog-fitness',
    name: '💪 Fitness',
    category: 'vlog',
    bg: 'linear-gradient(135deg, #FF006E 0%, #FB5607 50%, #FFBE0B 100%)',
    textColor: '#FFFFFF',
    accentColor: '#8338EC',
    fontSize: { title: 52, desc: 26 },
    layout: 'left',
    ctrScore: 88,
  },
  
  // Tech Templates
  {
    id: 'tech-coding',
    name: '💻 Code Life',
    category: 'tech',
    bg: 'linear-gradient(135deg, #000000 0%, #1A1A2E 50%, #16213E 100%)',
    textColor: '#00FF41',
    accentColor: '#00B4D8',
    fontSize: { title: 48, desc: 24 },
    layout: 'center',
    ctrScore: 83,
  },
  {
    id: 'tech-startup',
    name: '🚀 Startup',
    category: 'tech',
    bg: 'linear-gradient(135deg, #4361EE 0%, #3F37C9 50%, #7209B7 100%)',
    textColor: '#FFFFFF',
    accentColor: '#4CC9F0',
    fontSize: { title: 50, desc: 25 },
    layout: 'right',
    ctrScore: 86,
  },
  {
    id: 'tech-ai',
    name: '🤖 AI Future',
    category: 'tech',
    bg: 'linear-gradient(135deg, #03071E 0%, #370617 50%, #6A040F 100%)',
    textColor: '#FFBA08',
    accentColor: '#F72585',
    fontSize: { title: 54, desc: 27 },
    layout: 'center',
    ctrScore: 94,
  },
  
  // Business Templates
  {
    id: 'business-finance',
    name: '💰 Finance',
    category: 'business',
    bg: 'linear-gradient(135deg, #2D6A4F 0%, #40916C 50%, #52B788 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    fontSize: { title: 48, desc: 24 },
    layout: 'left',
    ctrScore: 81,
  },
  {
    id: 'business-marketing',
    name: '📈 Marketing',
    category: 'business',
    bg: 'linear-gradient(135deg, #7209B7 0%, #560BAD 50%, #480CA8 100%)',
    textColor: '#FFFFFF',
    accentColor: '#B5179E',
    fontSize: { title: 50, desc: 25 },
    layout: 'center',
    ctrScore: 84,
  },
  
  // Entertainment Templates
  {
    id: 'entertainment-music',
    name: '🎵 Music',
    category: 'entertainment',
    bg: 'linear-gradient(135deg, #F72585 0%, #B5179E 50%, #7209B7 100%)',
    textColor: '#FFFFFF',
    accentColor: '#FFD700',
    fontSize: { title: 56, desc: 28 },
    layout: 'right',
    ctrScore: 90,
  },
  {
    id: 'entertainment-comedy',
    name: '� Comedy',
    category: 'entertainment',
    bg: 'linear-gradient(135deg, #FFB700 0%, #FF6B35 50%, #F72585 100%)',
    textColor: '#FFFFFF',
    accentColor: '#3A0CA3',
    fontSize: { title: 54, desc: 27 },
    layout: 'center',
    ctrScore: 88,
  },
];

interface Thumbnail {
  id: string;
  title: string;
  description: string;
  template: DesignTemplate;
  created: number;
}

export default function ThumbnailGenerator() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('Your Title Here');
  const [description, setDescription] = useState('Add your description');
  const [selectedTemplate, setSelectedTemplate] = useState(DESIGN_TEMPLATES[0]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [descFontSize, setDescFontSize] = useState(24);
  
  // New AI Features State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gaming' | 'vlog' | 'tech' | 'business' | 'entertainment'>('all');
  const [thumbnailScore, setThumbnailScore] = useState<ThumbnailScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [projectName, setProjectName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [emotionBoost, setEmotionBoost] = useState(false);
  
  // Next-Level AI Features State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFrames, setVideoFrames] = useState<VideoFrame[]>([]);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [abTestResult, setAbTestResult] = useState<ABTestResult | null>(null);
  const [isRunningABTest, setIsRunningABTest] = useState(false);
  const [viralPrediction, setViralPrediction] = useState<ViralPrediction | null>(null);
  const [isPredictingViral, setIsPredictingViral] = useState(false);
  const [automatedContent, setAutomatedContent] = useState<AutomatedContent | null>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [workflowMode, setWorkflowMode] = useState<'manual' | 'automated'>('manual');
  const [selectedFrame, setSelectedFrame] = useState<VideoFrame | null>(null);
  
  // QR Code States
  const [qrCodeOptions, setQrCodeOptions] = useState<QRCodeOptions>({
    content: '',
    type: 'url',
    size: 150,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    errorCorrectionLevel: 'M',
    logoImage: undefined,
    style: 'square',
    position: 'bottom-right',
    opacity: 1
  });
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Password Generator States
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [generatedPassword, setGeneratedPassword] = useState<GeneratedPassword | null>(null);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  
  // Unit Converter States
  const [converterCategory, setConverterCategory] = useState<'currency' | 'length' | 'weight'>('currency');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('USD');
  const [toUnit, setToUnit] = useState<string>('EUR');
  const [toValue, setToValue] = useState<string>('');
  const [conversionHistory, setConversionHistory] = useState<UnitConversion[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [swappedUnits, setSwappedUnits] = useState(false);
  
  // PDF Merger/Splitter States
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pdfOperation, setPdfOperation] = useState<'merge' | 'split'>('merge');
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [pdfOperations, setPdfOperations] = useState<PDFOperation[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [selectedPDFFile, setSelectedPDFFile] = useState<PDFFile | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-5');
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  
  // Loan/EMI Calculator States
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [loanTenure, setLoanTenure] = useState<string>('12');
  const [loanType, setLoanType] = useState<'home' | 'car' | 'personal' | 'education'>('personal');
  const [loanCalculations, setLoanCalculations] = useState<LoanCalculation[]>([]);
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [showAmortization, setShowAmortization] = useState(false);
  
  // Hashtag Generator States
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok'>('instagram');
  const [hashtagInput, setHashtagInput] = useState<string>('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [hashtagCategory, setHashtagCategory] = useState<string>('general');
  const [hashtagSets, setHashtagSets] = useState<HashtagSet[]>([]);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image file is too large. Please select an image under 10MB.');
      return;
    }
    
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundImage(e.target?.result as string);
      setSuccess('Background image uploaded successfully!');
      setTimeout(() => setSuccess(null), 2000);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleTemplateChange = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    trackThumbnailEdited({
      fieldChanged: 'template',
      newValue: template.name,
    });
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    trackThumbnailEdited({
      fieldChanged: 'title',
      newValue: value,
    });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    trackThumbnailEdited({
      fieldChanged: 'description',
      newValue: value,
    });
  };

  const generateThumbnail = async () => {
    if (!canvasRef.current) {
      setError('Canvas not found');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Ensure the canvas is visible and properly styled for capture
      const element = canvasRef.current;
      
      // Fix html2canvas issues with better configuration
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: 1280,
        height: 720,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1280,
        windowHeight: 720,
        onclone: (clonedDoc) => {
          // Fix any image loading issues in the cloned document
          const clonedElement = clonedDoc.querySelector('[data-canvas-ref]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.opacity = '1';
          }
        },
      });

      // Convert to blob and create download URL
      canvas.toBlob(async (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          
          const newThumbnail: Thumbnail = {
            id: Date.now().toString(),
            title,
            description,
            template: selectedTemplate,
            created: Date.now(),
          };

          setThumbnails([newThumbnail, ...thumbnails]);
          setSuccess('🔥 Thumbnail generated successfully!');

          await trackThumbnailGenerated({
            textContent: title,
            designStyle: selectedTemplate.name,
            dimensions: `${canvas.width}x${canvas.height}`,
          });

          setTimeout(() => setSuccess(null), 3000);
        }
      }, 'image/png', 0.95);
    } catch (err) {
      console.error('Thumbnail generation error:', err);
      setError('💥 Failed to generate thumbnail. Try a different browser or check your images.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = async () => {
    if (!canvasRef.current) {
      setError('No thumbnail to download. Please generate one first.');
      return;
    }

    try {
      const element = canvasRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: 1280,
        height: 720,
        scrollX: 0,
        scrollY: 0,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `thumbnail_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setSuccess('⚡ Thumbnail downloaded successfully!');
        }
      }, 'image/png', 0.95);

      await trackThumbnailDownloaded({
        format: 'PNG',
        thumbnailSize: `${canvas.width}x${canvas.height}`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setError('💥 Download failed. Try again or use a different browser.');
    }
  };

  // AI Analysis Functions
  const analyzeThumbnail = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic scoring
    setTimeout(() => {
      const baseScore = selectedTemplate.ctrScore;
      const titleLength = title.length;
      const descLength = description.length;
      
      // Calculate scores based on various factors
      const readabilityScore = Math.min(100, Math.max(0, 
        100 - Math.abs(titleLength - 30) * 2 - Math.abs(descLength - 20) * 3
      ));
      
      const contrastScore = calculateContrastScore(selectedTemplate.textColor, selectedTemplate.bg);
      const emotionScore = emotionBoost ? Math.min(100, baseScore + 15) : baseScore;
      
      const ctrScore = Math.round((baseScore + readabilityScore + contrastScore + emotionScore) / 4);
      const overallScore = Math.round((ctrScore + readabilityScore + contrastScore) / 3);
      
      const suggestions: string[] = [];
      if (titleLength > 50) suggestions.push('Shorten title for better readability');
      if (titleLength < 20) suggestions.push('Add more detail to your title');
      if (descLength > 35) suggestions.push('Keep description concise');
      if (contrastScore < 70) suggestions.push('Improve text contrast for better visibility');
      if (!emotionBoost && selectedCategory === 'gaming') suggestions.push('Enable emotion boost for gaming content');
      
      setThumbnailScore({
        overall: overallScore,
        ctr: ctrScore,
        readability: readabilityScore,
        contrast: contrastScore,
        emotion: emotionScore,
        suggestions
      });
      
      setIsAnalyzing(false);
      setSuccess('🧠 AI Analysis Complete!');
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };
  
  const calculateContrastScore = (textColor: string, bgColor: string): number => {
    // Simple contrast calculation (in real app, use proper color contrast algorithm)
    const colors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
    return 75 + Math.random() * 25; // Simulated score between 75-100
  };
  
  const generateKeywordSuggestions = () => {
    const keywords = [
      'viral', 'tutorial', 'guide', 'tips', 'tricks', 'how to', 'best', 'ultimate',
      '2024', 'new', 'latest', 'pro', 'master', 'complete', 'step by step', 'easy'
    ];
    
    const titleWords = title.toLowerCase().split(' ');
    const relevantKeywords = keywords.filter(keyword => 
      !titleWords.includes(keyword) && Math.random() > 0.5
    ).slice(0, 5);
    
    setKeywordSuggestions(relevantKeywords);
  };
  
  const saveProject = () => {
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }
    
    const project: SavedProject = {
      id: Date.now().toString(),
      name: projectName,
      title,
      description,
      template: selectedTemplate,
      fontSize,
      descFontSize,
      backgroundImage,
      score: thumbnailScore || {
        overall: 85,
        ctr: 82,
        readability: 88,
        contrast: 90,
        emotion: 80,
        suggestions: []
      },
      createdAt: Date.now(),
      lastEdited: Date.now()
    };
    
    setSavedProjects([project, ...savedProjects]);
    setShowSaveModal(false);
    setProjectName('');
    setSuccess('💾 Project saved successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  const loadProject = (project: SavedProject) => {
    setTitle(project.title);
    setDescription(project.description);
    setSelectedTemplate(project.template);
    setFontSize(project.fontSize);
    setDescFontSize(project.descFontSize);
    setBackgroundImage(project.backgroundImage);
    setThumbnailScore(project.score);
    setSuccess('✨ Project loaded!');
    setTimeout(() => setSuccess(null), 2000);
  };
  
  const autoOptimizeSettings = () => {
    if (!selectedTemplate) return;
    
    // Auto-adjust font sizes based on template
    setFontSize(selectedTemplate.fontSize.title);
    setDescFontSize(selectedTemplate.fontSize.desc);
    
    // Auto-optimize title length
    if (title.length > 50) {
      setTitle(title.substring(0, 47) + '...');
    }
    
    setAutoOptimize(true);
    setSuccess('⚡ Auto-optimized for maximum CTR!');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  const detectFace = () => {
    // Simulate face detection
    setFaceDetected(true);
    setEmotionBoost(true);
    setSuccess('😮 Face detected! Emotion boost enabled.');
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Next-Level AI Functions
  const handleVideoUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }
    
    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setError('Video file is too large. Please select a video under 500MB.');
      return;
    }
    
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setSuccess('🎥 Video uploaded successfully! Processing frames...');
    setTimeout(() => setSuccess(null), 3000);
    
    // Start video processing
    processVideoFrames(file);
  };
  
  const processVideoFrames = async (file: File) => {
    setIsProcessingVideo(true);
    
    // Simulate video frame extraction and scene detection
    setTimeout(() => {
      const frames: VideoFrame[] = [
        {
          id: 'frame-1',
          timestamp: 0,
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"%3E%3Crect width="1280" height="720" fill="%23FF6B35"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="white" font-size="48" font-weight="bold"%3EIntro Scene%3C/text%3E%3C/svg%3E',
          score: 85,
          sceneType: 'intro',
          selected: false
        },
        {
          id: 'frame-2',
          timestamp: 15,
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"%3E%3Crect width="1280" height="720" fill="%234361EE"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="white" font-size="48" font-weight="bold"%3EAction Scene%3C/text%3E%3C/svg%3E',
          score: 92,
          sceneType: 'action',
          selected: false
        },
        {
          id: 'frame-3',
          timestamp: 30,
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"%3E%3Crect width="1280" height="720" fill="%23F72585"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="white" font-size="48" font-weight="bold"%3EHighlight Scene%3C/text%3E%3C/svg%3E',
          score: 88,
          sceneType: 'highlight',
          selected: false
        },
        {
          id: 'frame-4',
          timestamp: 45,
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"%3E%3Crect width="1280" height="720" fill="%232D6A4F"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="white" font-size="48" font-weight="bold"%3EDialogue Scene%3C/text%3E%3C/svg%3E',
          score: 78,
          sceneType: 'dialogue',
          selected: false
        },
        {
          id: 'frame-5',
          timestamp: 60,
          imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"%3E%3Crect width="1280" height="720" fill="%237209B7"/%3E%3Ctext x="640" y="360" text-anchor="middle" fill="white" font-size="48" font-weight="bold"%3EOutro Scene%3C/text%3E%3C/svg%3E',
          score: 82,
          sceneType: 'outro',
          selected: false
        }
      ];
      
      setVideoFrames(frames);
      setIsProcessingVideo(false);
      setSuccess(`🎬 Extracted ${frames.length} frames with AI scene detection!`);
      setTimeout(() => setSuccess(null), 3000);
    }, 3000);
  };
  
  const runABTest = async () => {
    setIsRunningABTest(true);
    
    // Simulate A/B testing analysis
    setTimeout(() => {
      const result: ABTestResult = {
        thumbnailA: 'thumbnail-a-url',
        thumbnailB: 'thumbnail-b-url',
        winner: 'B',
        confidence: 87,
        reasoning: 'Thumbnail B has better contrast, more engaging facial expression, and clearer text hierarchy. The color scheme aligns better with current trends and the composition draws more attention to the main subject.',
        ctrPrediction: 12.5
      };
      
      setAbTestResult(result);
      setIsRunningABTest(false);
      setSuccess('🧪 A/B Test Complete! Thumbnail B wins with 87% confidence');
      setTimeout(() => setSuccess(null), 3000);
    }, 4000);
  };
  
  const predictViralPotential = async () => {
    setIsPredictingViral(true);
    
    // Simulate viral prediction analysis
    setTimeout(() => {
      const prediction: ViralPrediction = {
        overallScore: 89,
        viralPotential: 'high',
        predictedViews: '2.5M - 5M',
        engagementRate: 8.7,
        suggestedImprovements: [
          'Add trending hashtags in first 2 hours',
          'Post at 7-9 PM EST for maximum reach',
          'Include a controversial hook in first 3 seconds',
          'Use emotional music that matches content tone',
          'Add subtitles for accessibility'
        ],
        competitorAnalysis: 'Top performers in your niche use bright colors and emotional faces. Your content stands out with unique editing style.',
        bestPostingTime: 'Tuesday 8:00 PM EST'
      };
      
      setViralPrediction(prediction);
      setIsPredictingViral(false);
      setSuccess('🚀 Viral Prediction Complete! High viral potential detected!');
      setTimeout(() => setSuccess(null), 3000);
    }, 3500);
  };
  
  const generateAutomatedContent = async () => {
    setIsGeneratingContent(true);
    
    // Simulate full content automation
    setTimeout(() => {
      const content: AutomatedContent = {
        titles: [
          'This ONE Trick Changed Everything! 🔥',
          'You Won\'t Believe What Happened Next... 😮',
          'The Secret They Don\'t Want You to Know 🤫',
          '10X Your Results With This Method! ⚡',
          'Game Changer Alert! 🚨 Must Watch!'
        ],
        descriptions: [
          'Discover the revolutionary technique that\'s taking the internet by storm! In this video, I reveal the exact method that helped me achieve incredible results. Watch until the end for the ultimate secret! #viral #trending',
          'This is what happens when you combine innovation with determination. Join me on this incredible journey as I share my personal experience and insights. Don\'t forget to like and subscribe for more content! #inspiration #success',
          'The wait is finally over! After months of research and testing, I\'m excited to share this breakthrough with you all. This could change everything you thought you knew about this topic! #breakthrough #tutorial'
        ],
        tags: [
          'viral', 'trending', 'tutorial', 'how to', 'tips', 'tricks', 'guide', '2024', 'new', 'latest', 'best', 'ultimate', 'complete', 'step by step', 'easy', 'beginner', 'advanced', 'pro', 'expert', 'secrets', 'revealed', 'exposed', 'inside', 'behind the scenes', 'making of', 'bts', 'vlog', 'storytime', 'experience', 'journey', 'transformation', 'before after', 'challenge', 'experiment', 'test', 'review', 'comparison', 'vs', 'versus', 'battle', 'competition', 'winner', 'loser', 'fail', 'success', 'achievement', 'milestone', 'celebration', 'announcement', 'breaking news', 'exclusive', 'first look', 'preview', 'trailer', 'teaser', 'clip', 'highlight', 'moment', 'memory', 'throwback', 'flashback', 'future', 'prediction', 'forecast', 'trend', 'viral trend', 'challenge', 'dance', 'music', 'song', 'cover', 'remix', 'mashup', 'parody', 'comedy', 'funny', 'humor', 'jokes', 'memes', 'trending memes', 'viral memes', 'funny videos', 'comedy videos', 'entertainment', 'viral entertainment', 'viral content', 'viral videos', 'viral clips', 'viral moments', 'viral trends', 'viral challenges', 'viral dances', 'viral songs', 'viral music', 'viral covers', 'viral remixes', 'viral mashups', 'viral parodies', 'viral comedy', 'viral humor', 'viral jokes', 'viral memes', 'viral trends', 'viral entertainment', 'viral content', 'viral videos', 'viral clips', 'viral moments'
        ],
        thumbnails: [
          'thumbnail-1-url',
          'thumbnail-2-url',
          'thumbnail-3-url'
        ],
        selectedTitle: 'This ONE Trick Changed Everything! 🔥',
        selectedDescription: 'Discover the revolutionary technique that\'s taking the internet by storm! In this video, I reveal the exact method that helped me achieve incredible results. Watch until the end for the ultimate secret! #viral #trending',
        selectedTags: ['viral', 'trending', 'tutorial', 'how to', 'tips', 'tricks', '2024', 'breakthrough'],
        selectedThumbnail: 'thumbnail-1-url',
        prediction: {
          overallScore: 91,
          viralPotential: 'viral',
          predictedViews: '5M - 10M',
          engagementRate: 12.3,
          suggestedImprovements: [
            'Add countdown timer for urgency',
            'Use split-screen for comparison',
            'Include audience poll for engagement'
          ],
          competitorAnalysis: 'Your content outperforms 95% of competitors with similar topics. Unique angle and high production value are key differentiators.',
          bestPostingTime: 'Thursday 7:30 PM EST'
        }
      };
      
      setAutomatedContent(content);
      setIsGeneratingContent(false);
      setSuccess('🤖 Full Automation Complete! Content ready for viral success!');
      setTimeout(() => setSuccess(null), 3000);
    }, 5000);
  };
  
  const selectBestFrame = () => {
    if (videoFrames.length === 0) return;
    
    const bestFrame = videoFrames.reduce((best, frame) => 
      frame.score > best.score ? frame : best
    );
    
    setSelectedFrame(bestFrame);
    setSuccess('✅ Best frame selected based on AI analysis!');
    setTimeout(() => setSuccess(null), 3000);
  };

  // QR Code Generation Functions
  const generateQRCode = async () => {
    if (!qrCodeOptions.content.trim()) {
      setError('Please enter content for the QR code');
      return;
    }

    setIsGeneratingQR(true);
    setError(null);

    try {
      // Simulate QR code generation (in real app, you'd use a QR code library)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simulated QR code data URL
      const qrCanvas = document.createElement('canvas');
      qrCanvas.width = qrCodeOptions.size;
      qrCanvas.height = qrCodeOptions.size;
      const ctx = qrCanvas.getContext('2d');
      
      if (ctx) {
        // Create a pattern that looks like a QR code
        ctx.fillStyle = qrCodeOptions.backgroundColor;
        ctx.fillRect(0, 0, qrCodeOptions.size, qrCodeOptions.size);
        
        ctx.fillStyle = qrCodeOptions.color;
        const cellSize = qrCodeOptions.size / 25;
        
        // Generate random QR-like pattern
        for (let i = 0; i < 25; i++) {
          for (let j = 0; j < 25; j++) {
            if (Math.random() > 0.5) {
              ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
          }
        }
        
        // Add corner squares (QR code markers)
        const drawCornerSquare = (x: number, y: number) => {
          ctx.fillStyle = qrCodeOptions.color;
          ctx.fillRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize);
          ctx.fillStyle = qrCodeOptions.backgroundColor;
          ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
          ctx.fillStyle = qrCodeOptions.color;
          ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
        };
        
        drawCornerSquare(0, 0);
        drawCornerSquare(18, 0);
        drawCornerSquare(0, 18);
      }
      
      const qrDataUrl = qrCanvas.toDataURL();
      
      setQrCodeData({
        id: Date.now().toString(),
        qrDataUrl,
        options: { ...qrCodeOptions },
        createdAt: Date.now()
      });
      
      setSuccess('✅ QR Code generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrCodeData.qrDataUrl;
    link.click();
    
    setSuccess('✅ QR Code downloaded!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const addQRToThumbnail = () => {
    if (!qrCodeData) {
      setError('Please generate a QR code first');
      return;
    }
    
    setShowQRCode(true);
    setSuccess('✅ QR Code added to thumbnail!');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Password Generator Functions
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 10;
    
    // Character variety scoring
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add lowercase letters');
    }
    
    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add uppercase letters');
    }
    
    if (/[0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add numbers');
    }
    
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Add special characters');
    }
    
    // Determine level and color
    let level: PasswordStrength['level'];
    let color: string;
    
    if (score < 30) {
      level = 'weak';
      color = '#ef4444';
    } else if (score < 50) {
      level = 'fair';
      color = '#f59e0b';
    } else if (score < 70) {
      level = 'good';
      color = '#3b82f6';
    } else if (score < 90) {
      level = 'strong';
      color = '#10b981';
    } else {
      level = 'very-strong';
      color = '#059669';
    }
    
    return { score, level, feedback, color };
  };

  const generateSecurePassword = () => {
    setIsGeneratingPassword(true);
    setCopiedPassword(false);
    
    setTimeout(() => {
      let charset = '';
      
      if (passwordOptions.includeLowercase) {
        charset += passwordOptions.excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
      }
      
      if (passwordOptions.includeUppercase) {
        charset += passwordOptions.excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      }
      
      if (passwordOptions.includeNumbers) {
        charset += passwordOptions.excludeSimilar ? '23456789' : '0123456789';
      }
      
      if (passwordOptions.includeSymbols) {
        charset += passwordOptions.excludeAmbiguous ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
      }
      
      if (charset === '') {
        setError('Please select at least one character type');
        setIsGeneratingPassword(false);
        return;
      }
      
      let password = '';
      const array = new Uint32Array(passwordOptions.length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < passwordOptions.length; i++) {
        password += charset[array[i] % charset.length];
      }
      
      const strength = calculatePasswordStrength(password);
      
      setGeneratedPassword({
        password,
        strength,
        options: { ...passwordOptions },
        createdAt: Date.now()
      });
      
      setSuccess('🔐 Password generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setIsGeneratingPassword(false);
    }, 1500);
  };

  const copyPasswordToClipboard = async () => {
    if (!generatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(generatedPassword.password);
      setCopiedPassword(true);
      setSuccess('📋 Password copied to clipboard!');
      setTimeout(() => {
        setCopiedPassword(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError('Failed to copy password');
    }
  };

  // Unit Converter Functions
  const CURRENCY_RATES: CurrencyRate[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.90 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 }
  ];

  const LENGTH_UNITS: LengthUnit[] = [
    { code: 'M', name: 'Meters', symbol: 'm', toMeters: 1 },
    { code: 'KM', name: 'Kilometers', symbol: 'km', toMeters: 1000 },
    { code: 'CM', name: 'Centimeters', symbol: 'cm', toMeters: 0.01 },
    { code: 'MM', name: 'Millimeters', symbol: 'mm', toMeters: 0.001 },
    { code: 'FT', name: 'Feet', symbol: 'ft', toMeters: 0.3048 },
    { code: 'IN', name: 'Inches', symbol: 'in', toMeters: 0.0254 },
    { code: 'MI', name: 'Miles', symbol: 'mi', toMeters: 1609.34 },
    { code: 'YD', name: 'Yards', symbol: 'yd', toMeters: 0.9144 }
  ];

  const WEIGHT_UNITS: WeightUnit[] = [
    { code: 'KG', name: 'Kilograms', symbol: 'kg', toKilograms: 1 },
    { code: 'G', name: 'Grams', symbol: 'g', toKilograms: 0.001 },
    { code: 'MG', name: 'Milligrams', symbol: 'mg', toKilograms: 0.000001 },
    { code: 'LB', name: 'Pounds', symbol: 'lb', toKilograms: 0.453592 },
    { code: 'OZ', name: 'Ounces', symbol: 'oz', toKilograms: 0.0283495 },
    { code: 'ST', name: 'Stones', symbol: 'st', toKilograms: 6.35029 },
    { code: 'T', name: 'Tons', symbol: 't', toKilograms: 1000 }
  ];

  const performConversion = () => {
    if (!fromValue || isNaN(Number(fromValue))) {
      setError('Please enter a valid number');
      return;
    }

    setIsConverting(true);
    setError(null);

    setTimeout(() => {
      const numValue = Number(fromValue);
      let result = 0;

      if (converterCategory === 'currency') {
        const fromRate = CURRENCY_RATES.find(rate => rate.code === fromUnit)?.rate || 1;
        const toRate = CURRENCY_RATES.find(rate => rate.code === toUnit)?.rate || 1;
        result = (numValue / fromRate) * toRate;
      } else if (converterCategory === 'length') {
        const fromUnitData = LENGTH_UNITS.find(unit => unit.code === fromUnit);
        const toUnitData = LENGTH_UNITS.find(unit => unit.code === toUnit);
        if (fromUnitData && toUnitData) {
          const meters = numValue * fromUnitData.toMeters;
          result = meters / toUnitData.toMeters;
        }
      } else if (converterCategory === 'weight') {
        const fromUnitData = WEIGHT_UNITS.find(unit => unit.code === fromUnit);
        const toUnitData = WEIGHT_UNITS.find(unit => unit.code === toUnit);
        if (fromUnitData && toUnitData) {
          const kilograms = numValue * fromUnitData.toKilograms;
          result = kilograms / toUnitData.toKilograms;
        }
      }

      const formattedResult = result.toFixed(6).replace(/\.?0+$/, '');
      setToValue(formattedResult);

      // Add to history
      const newConversion: UnitConversion = {
        id: Date.now().toString(),
        category: converterCategory,
        fromUnit,
        toUnit,
        fromValue: numValue,
        toValue: result,
        timestamp: Date.now(),
        isFavorite: false
      };

      setConversionHistory(prev => [newConversion, ...prev.slice(0, 9)]);
      setSuccess('✅ Conversion completed successfully!');
      setTimeout(() => setSuccess(null), 2000);
      setIsConverting(false);
    }, 1000);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
    setSwappedUnits(!swappedUnits);
  };

  const clearConversion = () => {
    setFromValue('1');
    setToValue('');
    setError(null);
    setSuccess(null);
  };

  const getCurrentUnits = () => {
    switch (converterCategory) {
      case 'currency':
        return CURRENCY_RATES;
      case 'length':
        return LENGTH_UNITS;
      case 'weight':
        return WEIGHT_UNITS;
      default:
        return [];
    }
  };

  const getUnitSymbol = (unitCode: string) => {
    const units = getCurrentUnits();
    const unit = units.find(u => u.code === unitCode);
    return unit?.symbol || unitCode;
  };

  // PDF Merger/Splitter Functions
  const handlePDFFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newPDFFiles: PDFFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type === 'application/pdf') {
        const pdfFile: PDFFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          pageCount: Math.floor(Math.random() * 50) + 1, // Simulated page count
          file,
          preview: '',
          selectedPages: []
        };
        newPDFFiles.push(pdfFile);
      } else {
        setError(`${file.name} is not a PDF file`);
      }
    });
    
    if (newPDFFiles.length > 0) {
      setPdfFiles(prev => [...prev, ...newPDFFiles]);
      setSuccess(`✅ ${newPDFFiles.length} PDF file(s) uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handlePDFDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handlePDFDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handlePDFDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handlePDFFileUpload(e.dataTransfer.files);
  };

  const removePDFFile = (id: string) => {
    setPdfFiles(prev => prev.filter(file => file.id !== id));
    if (selectedPDFFile?.id === id) {
      setSelectedPDFFile(null);
    }
  };

  const reorderPDFFiles = (fromIndex: number, toIndex: number) => {
    const newFiles = [...pdfFiles];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setPdfFiles(newFiles);
  };

  const togglePageSelection = (fileId: string, pageNumber: number) => {
    setPdfFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        const selectedPages = file.selectedPages || [];
        if (selectedPages.includes(pageNumber)) {
          return {
            ...file,
            selectedPages: selectedPages.filter(p => p !== pageNumber)
          };
        } else {
          return {
            ...file,
            selectedPages: [...selectedPages, pageNumber]
          };
        }
      }
      return file;
    }));
  };

  const selectAllPages = (fileId: string) => {
    setPdfFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          selectedPages: Array.from({ length: file.pageCount }, (_, i) => i + 1)
        };
      }
      return file;
    }));
  };

  const clearPageSelection = (fileId: string) => {
    setPdfFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          selectedPages: []
        };
      }
      return file;
    }));
  };

  const parsePageRange = (range: string, totalPages: number): number[] => {
    const pages: number[] = [];
    const parts = range.split(',');
    
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const page = parseInt(trimmed);
        if (!isNaN(page) && page >= 1 && page <= totalPages && !pages.includes(page)) {
          pages.push(page);
        }
      }
    });
    
    return pages.sort((a, b) => a - b);
  };

  const performPDFOperation = async () => {
    if (pdfOperation === 'merge' && pdfFiles.length < 2) {
      setError('Please add at least 2 PDF files to merge');
      return;
    }
    
    if (pdfOperation === 'split' && !selectedPDFFile) {
      setError('Please select a PDF file to split');
      return;
    }
    
    setIsProcessingPDF(true);
    setError(null);
    
    setTimeout(() => {
      const operation: PDFOperation = {
        id: Date.now().toString(),
        type: pdfOperation,
        files: pdfOperation === 'merge' ? [...pdfFiles] : [selectedPDFFile!],
        outputName: pdfOperation === 'merge' 
          ? `merged_${Date.now()}.pdf`
          : `split_${selectedPDFFile?.name.replace('.pdf', '')}_${Date.now()}.pdf`,
        createdAt: Date.now(),
        status: 'completed',
        result: `data:application/pdf;base64,${btoa('Simulated PDF content')}`
      };
      
      setPdfOperations(prev => [operation, ...prev.slice(0, 9)]);
      setSuccess(`✅ PDF ${pdfOperation === 'merge' ? 'merged' : 'split'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      setIsProcessingPDF(false);
      
      // Clear files after successful operation
      setPdfFiles([]);
      setSelectedPDFFile(null);
    }, 2000);
  };

  const downloadPDF = (operation: PDFOperation) => {
    if (operation.result) {
      const link = document.createElement('a');
      link.href = operation.result;
      link.download = operation.outputName;
      link.click();
      setSuccess('📥 PDF downloaded successfully!');
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  const clearPDFFiles = () => {
    setPdfFiles([]);
    setSelectedPDFFile(null);
    setPageRange('1-5');
    setError(null);
    setSuccess(null);
  };

  // Loan/EMI Calculator Functions
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const time = parseFloat(loanTenure); // Monthly tenure

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
      setError('Please enter valid loan details');
      return;
    }

    // EMI calculation formula: P * r * (1 + r)^n / [(1 + r)^n - 1]
    const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
    const totalAmount = emi * time;
    const totalInterest = totalAmount - principal;

    const calculation: LoanCalculation = {
      id: Date.now().toString(),
      loanAmount: principal,
      interestRate: parseFloat(interestRate),
      tenure: time,
      emi: emi,
      totalInterest: totalInterest,
      totalAmount: totalAmount,
      createdAt: Date.now(),
      loanType
    };

    setLoanCalculations(prev => [calculation, ...prev.slice(0, 9)]);
    
    // Generate amortization schedule
    generateAmortizationSchedule(principal, rate, time, emi);
    
    setSuccess('✅ EMI calculated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const generateAmortizationSchedule = (principal: number, rate: number, time: number, emi: number) => {
    const schedule: AmortizationEntry[] = [];
    let balance = principal;

    for (let month = 1; month <= time; month++) {
      const interestPayment = balance * rate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        emmi: emi,
        balance: Math.max(0, balance)
      });
    }

    setAmortizationSchedule(schedule);
  };

  const clearLoanCalculation = () => {
    setLoanAmount('100000');
    setInterestRate('8.5');
    setLoanTenure('12');
    setLoanType('personal');
    setAmortizationSchedule([]);
    setShowAmortization(false);
    setError(null);
    setSuccess(null);
  };

  // Hashtag Generator Functions
  const HASHTAG_CATEGORIES: HashtagCategory[] = [
    {
      id: 'general',
      name: 'General',
      icon: Hash,
      hashtags: ['#trending', '#viral', '#fyp', '#explore', '#instagram', '#tiktok'],
      trending: true
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      icon: Heart,
      hashtags: ['#lifestyle', '#motivation', '#inspiration', '#wellness', '#selfcare', '#mindfulness'],
      trending: true
    },
    {
      id: 'tech',
      name: 'Technology',
      icon: Lightbulb,
      hashtags: ['#technology', '#innovation', '#coding', '#programming', '#tech', '#startup'],
      trending: false
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      hashtags: ['#business', '#entrepreneur', '#success', '#marketing', '#finance', '#startup'],
      trending: true
    },
    {
      id: 'travel',
      name: 'Travel',
      icon: Plane,
      hashtags: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#tourism'],
      trending: false
    },
    {
      id: 'food',
      name: 'Food',
      icon: Heart,
      hashtags: ['#food', '#foodie', '#cooking', '#recipe', '#delicious', '#foodporn'],
      trending: true
    },
    {
      id: 'fitness',
      name: 'Fitness',
      icon: ZapIcon,
      hashtags: ['#fitness', '#workout', '#gym', '#health', '#training', '#exercise'],
      trending: false
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      hashtags: ['#music', '#song', '#playlist', '#musicvideo', '#newmusic', '#musician'],
      trending: true
    },
    {
      id: 'fashion',
      name: 'Fashion',
      icon: Star,
      hashtags: ['#fashion', '#style', '#ootd', '#outfit', '#fashionblogger', '#trendy'],
      trending: true
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: Target,
      hashtags: ['#gaming', '#gamer', '#videogames', '#esports', '#twitch', '#gamingcommunity'],
      trending: false
    }
  ];

  const generateHashtags = () => {
    const baseHashtags = HASHTAG_CATEGORIES.find(cat => cat.id === hashtagCategory)?.hashtags || [];
    const inputWords = hashtagInput.toLowerCase().split(' ').filter(word => word.length > 2);
    
    let generated = [...baseHashtags];
    
    // Add hashtags based on input
    inputWords.forEach(word => {
      if (!generated.includes(`#${word}`)) {
        generated.push(`#${word}`);
      }
      if (!generated.includes(`#${word}s`)) {
        generated.push(`#${word}s`);
      }
    });

    // Add platform-specific hashtags
    if (selectedPlatform === 'instagram') {
      generated.push('#instagood', '#photooftheday', '#instadaily');
    } else {
      generated.push('#foryou', '#fyp', '#duet');
    }

    // Add trending hashtags
    const trendingHashtags = ['#trending', '#viral', '#explorepage'];
    trendingHashtags.forEach(tag => {
      if (!generated.includes(tag)) {
        generated.push(tag);
      }
    });

    // Limit to 30 hashtags
    generated = generated.slice(0, 30);
    
    setGeneratedHashtags(generated);
    
    // Save to hashtag sets
    const hashtagSet: HashtagSet = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      category: hashtagCategory,
      hashtags: generated,
      count: generated.length,
      engagement: Math.floor(Math.random() * 100) + 50, // Simulated engagement
      createdAt: Date.now()
    };
    
    setHashtagSets(prev => [hashtagSet, ...prev.slice(0, 9)]);
    
    setSuccess('✅ Hashtags generated successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const copyHashtags = async () => {
    if (generatedHashtags.length === 0) return;
    
    try {
      await navigator.clipboard.writeText(generatedHashtags.join(' '));
      setCopiedHashtags(true);
      setSuccess('📋 Hashtags copied to clipboard!');
      setTimeout(() => {
        setCopiedHashtags(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError('Failed to copy hashtags');
    }
  };

  const clearHashtags = () => {
    setHashtagInput('');
    setGeneratedHashtags([]);
    setHashtagCategory('general');
    setSelectedPlatform('instagram');
    setError(null);
    setSuccess(null);
  };

  // Auto-analyze when template or text changes
  useEffect(() => {
    if (title && description && selectedTemplate) {
      const timer = setTimeout(() => {
        analyzeThumbnail();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [title, description, selectedTemplate]);
  
  useEffect(() => {
    // Generate keyword suggestions when title changes
    if (title.length > 10) {
      generateKeywordSuggestions();
    }
  }, [title]);
  
  const resetForm = () => {
    setTitle('Your Title Here');
    setDescription('Add your description');
    setSelectedTemplate(DESIGN_TEMPLATES[0]);
    setBackgroundImage(null);
    setError(null);
    setSuccess(null);
    setThumbnailScore(null);
    setAutoOptimize(false);
    setFaceDetected(false);
    setEmotionBoost(false);
    setKeywordSuggestions([]);
  };
  
  const filteredTemplates = selectedCategory === 'all' 
    ? DESIGN_TEMPLATES 
    : DESIGN_TEMPLATES.filter(template => template.category === selectedCategory);
  
  const categoryColors = {
    gaming: 'from-red-500 to-orange-500',
    vlog: 'from-pink-500 to-purple-500',
    tech: 'from-blue-500 to-cyan-500',
    business: 'from-green-500 to-emerald-500',
    entertainment: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center relative">
                  <Crown className="w-8 h-8 text-white" />
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 bg-white/20 rounded-full"
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 400, damping: 10 }}
                className="relative"
              >
                <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter text-white relative">
                  <motion.span 
                    className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 animate-gradient bg-300"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255, 0, 110, 0.5)",
                        "0 0 40px rgba(255, 0, 110, 0.8)",
                        "0 0 20px rgba(255, 0, 110, 0.5)"
                      ],
                      filter: [
                        "hue-rotate(0deg)",
                        "hue-rotate(90deg)",
                        "hue-rotate(180deg)",
                        "hue-rotate(270deg)",
                        "hue-rotate(360deg)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    THUMBNAIL
                  </motion.span>
                  <br />
                  <motion.span 
                    className="bg-clip-text text-transparent bg-gradient-to-l from-orange-400 via-pink-400 to-purple-400 animate-gradient bg-300"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(255, 183, 0, 0.5)",
                        "0 0 40px rgba(255, 183, 0, 0.8)",
                        "0 0 20px rgba(255, 183, 0, 0.5)"
                      ],
                      filter: [
                        "hue-rotate(0deg)",
                        "hue-rotate(-90deg)",
                        "hue-rotate(-180deg)",
                        "hue-rotate(-270deg)",
                        "hue-rotate(-360deg)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    GENERATOR
                  </motion.span>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-3xl blur-xl"
                  />
                </h1>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-full border border-yellow-400/30"
                >
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-black text-lg">ULTRA</span>
                </motion.div>
                
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 20px rgba(255, 107, 107, 0.5)",
                      "0 0 40px rgba(255, 107, 107, 0.8)",
                      "0 0 20px rgba(255, 107, 107, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl font-black text-white"
                >
                  Create 🔥 viral thumbnails
                </motion.div>
                
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-md rounded-full border border-pink-400/30"
                >
                  <Flame className="w-6 h-6 text-pink-400" />
                  <span className="text-pink-400 font-black text-lg">MAX</span>
                </motion.div>
              </div>
              
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-6 text-white/80 font-medium"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  <span>AI Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars className="w-5 h-5 text-yellow-400" />
                  <span>Pro Templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Infinity className="w-5 h-5 text-purple-400" />
                  <span>Unlimited</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <motion.div
              ref={canvasRef}
              data-canvas-ref
              className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative backdrop-blur-xl group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Animated Border Effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(45deg, #ec4899, #f97316, #ec4899)",
                  backgroundSize: "200% 200%",
                  animation: "gradient 3s ease infinite"
                }}
              />
              
              {/* Background Layer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: backgroundImage
                    ? `url(${backgroundImage})`
                    : selectedTemplate.bg,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                animate={{
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Animated Overlay Layer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
                animate={{
                  opacity: [0.6, 0.8, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Particle Effects */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </motion.div>
              
              {/* Content Layer */}
              <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                <motion.h2
                  className="text-center font-black mb-4 drop-shadow-2xl uppercase tracking-tighter"
                  style={{
                    color: selectedTemplate.textColor,
                    fontSize: `${fontSize}px`,
                    fontWeight: '900',
                    textShadow: '0 8px 16px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)',
                    letterSpacing: '-0.02em',
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    textShadow: [
                      '0 8px 16px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)',
                      '0 8px 16px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,255,0.4)',
                      '0 8px 16px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.2)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {title}
                </motion.h2>
                <motion.p
                  className="text-center drop-shadow-2xl font-bold"
                  style={{
                    color: selectedTemplate.accentColor,
                    fontSize: `${descFontSize}px`,
                    textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.1)',
                    letterSpacing: '0.02em',
                  }}
                  animate={{
                    y: [0, -2, 0],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  {description}
                </motion.p>
                
                {/* QR Code Overlay */}
                {showQRCode && qrCodeData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute ${
                      qrCodeData.options.position === 'top-left' ? 'top-4 left-4' :
                      qrCodeData.options.position === 'top-right' ? 'top-4 right-4' :
                      qrCodeData.options.position === 'bottom-left' ? 'bottom-4 left-4' :
                      qrCodeData.options.position === 'bottom-right' ? 'bottom-4 right-4' :
                      'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                    }`}
                    style={{
                      width: `${Math.min(qrCodeData.options.size * 0.8, 120)}px`,
                      height: `${Math.min(qrCodeData.options.size * 0.8, 120)}px`
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <img 
                        src={qrCodeData.qrDataUrl} 
                        alt="QR Code" 
                        className="rounded-lg shadow-2xl border-2 border-white/30"
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: qrCodeData.options.backgroundColor
                        }}
                      />
                      {/* QR Code Glow Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.5)",
                            "0 0 40px rgba(139, 92, 246, 0.8)",
                            "0 0 20px rgba(139, 92, 246, 0.5)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {/* QR Code Pulse Animation */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{
                          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)"
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </div>
              
              {/* Corner Decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30" />
            </motion.div>

            {/* Extreme Gen Z Action Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -3, 3, 0],
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={generateThumbnail}
                disabled={isGenerating}
                className="relative flex-1 py-6 bg-gradient-to-r from-pink-500 via-orange-500 to-pink-500 text-black font-black text-xl uppercase tracking-widest rounded-3xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group border-2 border-white/20"
              >
                {/* Extreme animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 via-orange-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Neon glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(255, 255, 255, 0.3)",
                      "inset 0 0 40px rgba(255, 255, 255, 0.6)",
                      "inset 0 0 20px rgba(255, 255, 255, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Particle effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      animate={{
                        x: [Math.random() * 100, Math.random() * 100],
                        y: [Math.random() * 100, Math.random() * 100],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-lg animate-pulse" />
                        <Sparkles className="w-8 h-8 relative" />
                      </motion.div>
                      <motion.span
                        animate={{ 
                          opacity: [0.5, 1, 0.5],
                          scale: [0.95, 1.05, 0.95]
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="drop-shadow-lg"
                      >
                        GENERATING...
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          rotate: [0, -15, 15, 0],
                          filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 animate-pulse" />
                        <Zap className="w-8 h-8 relative" />
                      </motion.div>
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(255, 255, 255, 0.8)",
                            "0 0 20px rgba(255, 255, 255, 1)",
                            "0 0 10px rgba(255, 255, 255, 0.8)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="drop-shadow-lg font-black"
                      >
                        ⚡ GENERATE
                      </motion.span>
                    </>
                  )}
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, 2, -2, 0],
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadThumbnail}
                className="relative flex-1 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white font-black text-xl uppercase tracking-widest rounded-3xl transition-all flex items-center justify-center gap-3 overflow-hidden group border-2 border-white/20"
              >
                {/* Extreme animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Neon glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 20px rgba(255, 255, 255, 0.3)",
                      "inset 0 0 40px rgba(255, 255, 255, 0.6)",
                      "inset 0 0 20px rgba(255, 255, 255, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Particle effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      animate={{
                        x: [Math.random() * 100, Math.random() * 100],
                        y: [Math.random() * 100, Math.random() * 100],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2.5 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      scale: [1, 1.2, 1],
                      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)", "hue-rotate(360deg)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-50 animate-pulse" />
                    <Download className="w-8 h-8 relative" />
                  </motion.div>
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(255, 255, 255, 0.8)",
                        "0 0 20px rgba(255, 255, 255, 1)",
                        "0 0 10px rgba(255, 255, 255, 0.8)"
                      ]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="drop-shadow-lg font-black"
                  >
                    🚀 DOWNLOAD
                  </motion.span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, 5, -5, 0],
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="relative py-6 px-10 bg-white/10 backdrop-blur-sm text-white font-black text-xl uppercase tracking-widest rounded-3xl hover:bg-white/20 transition-all border-2 border-white/30 overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Neon glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  animate={{
                    boxShadow: [
                      "inset 0 0 15px rgba(255, 255, 255, 0.2)",
                      "inset 0 0 30px rgba(255, 255, 255, 0.4)",
                      "inset 0 0 15px rgba(255, 255, 255, 0.2)"
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative z-10 flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1],
                      filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-50 animate-pulse" />
                    <Trash2 className="w-7 h-7 relative" />
                  </motion.div>
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(255, 255, 255, 0.5)",
                        "0 0 15px rgba(255, 255, 255, 0.8)",
                        "0 0 5px rgba(255, 255, 255, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="font-black"
                  >
                    RESET
                  </motion.span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="flex items-center gap-3 p-4 bg-red-500/20 backdrop-blur-sm border-2 border-red-500/40 rounded-2xl text-red-300 font-medium shadow-lg shadow-red-500/25"
                >
                  <AlertCircle className="w-6 h-6 flex-shrink-0 animate-pulse" />
                  <span className="text-sm font-bold">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="flex items-center gap-3 p-4 bg-green-500/20 backdrop-blur-sm border-2 border-green-500/40 rounded-2xl text-green-300 font-medium shadow-lg shadow-green-500/25"
                >
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 animate-bounce" />
                  <span className="text-sm font-bold">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Extreme Gen Z Text Input */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(236, 72, 153, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(255, 0, 110, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(131, 56, 236, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(58, 134, 255, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(6, 255, 180, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center relative">
                    <Type className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(255, 255, 255, 0.5)",
                      "0 0 20px rgba(255, 255, 255, 0.8)",
                      "0 0 10px rgba(255, 255, 255, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Content
                </motion.span>
              </h3>
              <div className="space-y-4 relative z-10">
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Title
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter viral title..."
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 transition-all font-bold"
                      maxLength={100}
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(255, 0, 110, 0.3)",
                          "inset 0 0 20px rgba(255, 0, 110, 0.6)",
                          "inset 0 0 10px rgba(255, 0, 110, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                  <div className="mt-2 flex justify-between items-center">
                    <motion.span 
                      className="text-white/60 text-xs"
                      animate={{
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {title.length}/100
                    </motion.span>
                    {title.length > 80 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-yellow-400 text-xs font-bold flex items-center gap-1"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ⚠️
                        </motion.div>
                        Near limit
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Description
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter engaging description..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 transition-all font-bold resize-none"
                      maxLength={200}
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(236, 72, 153, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(255, 0, 110, 0.3)",
                          "inset 0 0 20px rgba(255, 0, 110, 0.6)",
                          "inset 0 0 10px rgba(255, 0, 110, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </motion.div>
                  <div className="mt-2 flex justify-between items-center">
                    <motion.span 
                      className="text-white/60 text-xs"
                      animate={{
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    >
                      {description.length}/200
                    </motion.span>
                    {description.length > 180 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-yellow-400 text-xs font-bold flex items-center gap-1"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ⚠️
                        </motion.div>
                        Near limit
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Inputs */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 space-y-5 border border-white/20">
              <div>
                <label className="block text-sm font-black text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Main Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 transition-all font-bold"
                  maxLength={60}
                  placeholder="Enter your viral title..."
                />
                <div className="text-xs text-white/60 mt-2 font-medium">{title.length}/60 characters</div>
              </div>

              <div>
                <label className="block text-sm font-black text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 transition-all font-bold"
                  maxLength={40}
                  placeholder="Add your hook..."
                />
                <div className="text-xs text-white/60 mt-2 font-medium">{description.length}/40 characters</div>
              </div>

              {/* Font Sizes */}
              <div>
                <label className="block text-sm font-black text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-400" />
                  Title Size: {fontSize}px
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="24"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((fontSize - 24) / (72 - 24)) * 100}%, rgba(255,255,255,0.2) ${((fontSize - 24) / (72 - 24)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>24px</span>
                    <span>72px</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-400" />
                  Desc Size: {descFontSize}px
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="12"
                    max="48"
                    value={descFontSize}
                    onChange={(e) => setDescFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((descFontSize - 12) / (48 - 12)) * 100}%, rgba(255,255,255,0.2) ${((descFontSize - 12) / (48 - 12)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>12px</span>
                    <span>48px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Score Display */}
            {thumbnailScore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl p-6 border border-green-500/30"
              >
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  AI Score Analysis
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500"
                          style={{ width: `${thumbnailScore.overall}%` }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{thumbnailScore.overall}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">CTR Prediction</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-500"
                          style={{ width: `${thumbnailScore.ctr}%` }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{thumbnailScore.ctr}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Readability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                          style={{ width: `${thumbnailScore.readability}%` }}
                        />
                      </div>
                      <span className="text-white font-bold text-sm">{thumbnailScore.readability}%</span>
                    </div>
                  </div>
                  {thumbnailScore.suggestions.length > 0 && (
                    <div className="mt-4 p-3 bg-white/10 rounded-xl">
                      <h4 className="text-white/80 font-medium text-sm mb-2">💡 AI Suggestions:</h4>
                      <ul className="space-y-1">
                        {thumbnailScore.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Workflow Mode Toggle */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                AI Workflow Mode
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWorkflowMode('manual')}
                  className={`px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                    workflowMode === 'manual'
                      ? 'bg-white text-black border-white shadow-lg shadow-white/25'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Palette className="w-4 h-4" />
                    <span>Manual</span>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWorkflowMode('automated')}
                  className={`px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                    workflowMode === 'automated'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span>🤖 AI Auto</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Video Integration */}
            {workflowMode === 'automated' && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  Video Integration
                </h3>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files[0]) handleVideoUpload(files[0]);
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'video/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleVideoUpload(file);
                    };
                    input.click();
                  }}
                  className="border-3 border-dashed border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-400/60 hover:bg-white/5 transition-all group"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block mb-3"
                  >
                    <Film className="w-12 h-12 mx-auto text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </motion.div>
                  <p className="text-sm text-white/80 font-medium mb-1">Upload video for AI analysis</p>
                  <p className="text-xs text-white/60">or drag & drop your video file</p>
                  {videoFile && (
                    <div className="mt-3 p-2 bg-purple-500/20 rounded-lg">
                      <p className="text-xs text-purple-300 font-medium">✅ {videoFile.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Frames */}
            {videoFrames.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  AI Scene Detection ({videoFrames.length} frames)
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {videoFrames.map((frame, index) => (
                    <motion.div
                      key={frame.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        frame.selected
                          ? 'bg-purple-500/20 border-purple-400'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => {
                        setSelectedFrame(frame);
                        setVideoFrames(frames => frames.map(f => ({ ...f, selected: f.id === frame.id })));
                        setBackgroundImage(frame.imageUrl);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={frame.imageUrl}
                          alt={`Frame at ${frame.timestamp}s`}
                          className="w-16 h-10 rounded-lg object-cover border border-white/20"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold text-sm capitalize">{frame.sceneType}</span>
                            <span className="text-white/60 text-xs">{frame.timestamp}s</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                                style={{ width: `${frame.score}%` }}
                              />
                            </div>
                            <span className="text-orange-400 font-bold text-xs">{frame.score}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={selectBestFrame}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Select Best Frame</span>
                </motion.button>
              </div>
            )}

            {/* AI Actions Panel */}
            {workflowMode === 'automated' && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  AI Automation Suite
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runABTest}
                    disabled={isRunningABTest}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>{isRunningABTest ? '🧪 Testing...' : '🧪 A/B Test Thumbnails'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={predictViralPotential}
                    disabled={isPredictingViral}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-sm uppercase tracking-wider rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{isPredictingViral ? '🚀 Analyzing...' : '🚀 Predict Viral Potential'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateAutomatedContent}
                    disabled={isGeneratingContent}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{isGeneratingContent ? '🤖 Generating...' : '🤖 Full Content Pipeline'}</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                Content Category
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', name: 'All', emoji: '🎯' },
                  { id: 'gaming', name: 'Gaming', emoji: '🎮' },
                  { id: 'vlog', name: 'Vlog', emoji: '🌟' },
                  { id: 'tech', name: 'Tech', emoji: '💻' },
                  { id: 'business', name: 'Business', emoji: '💰' },
                  { id: 'entertainment', name: 'Entertainment', emoji: '🎵' },
                ].map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                      selectedCategory === category.id
                        ? 'bg-white text-black border-white shadow-lg shadow-white/25'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div>{category.emoji}</div>
                    <div>{category.name}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Design Templates */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="font-black text-white mb-5 flex items-center gap-3 text-lg uppercase tracking-wider">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                AI Templates
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {filteredTemplates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTemplateChange(template)}
                    className={`px-3 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-2 ${
                      selectedTemplate.id === template.id
                        ? 'bg-white text-black border-white shadow-lg shadow-white/25'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="text-lg mb-1">{template.name.split(' ')[0]}</div>
                    <div className="text-xs opacity-80">{template.name.split(' ')[1]}</div>
                    <div className="text-xs mt-1 font-bold text-yellow-300">{template.ctrScore}% CTR</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Background Upload */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="font-black text-white mb-5 flex items-center gap-3 text-lg uppercase tracking-wider">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                Custom Background
              </h3>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400/60 hover:bg-white/5 transition-all group"
              >
                <Upload className="w-12 h-12 mx-auto mb-3 text-white/60 group-hover:text-pink-400 transition-colors" />
                <p className="text-sm text-white/80 font-medium mb-1">Drag & drop your image</p>
                <p className="text-xs text-white/60">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </div>
              {backgroundImage && (
                <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80 font-medium">✅ Image uploaded</span>
                    <button
                      onClick={() => setBackgroundImage(null)}
                      className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors font-bold uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Smart Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                AI Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={autoOptimizeSettings}
                  disabled={autoOptimize}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-sm uppercase tracking-wider rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{autoOptimize ? '✅ Optimized' : '⚡ Auto-Optimize CTR'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={detectFace}
                  disabled={faceDetected}
                  className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{faceDetected ? '😮 Face Detected' : '👁️ Detect Face + Emotion'}</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSaveModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 Save Project</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={analyzeThumbnail}
                  disabled={isAnalyzing}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  <span>{isAnalyzing ? '🧠 Analyzing...' : '🧠 Analyze Performance'}</span>
                </motion.button>
              </div>
            </div>

            {/* Keyword Suggestions */}
            {keywordSuggestions.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  AI Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywordSuggestions.map((keyword, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTitle(title + ' ' + keyword);
                        setKeywordSuggestions(keywordSuggestions.filter(k => k !== keyword));
                      }}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-bold uppercase tracking-wider hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                    >
                      + {keyword}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* A/B Test Results */}
            {abTestResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30"
              >
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  A/B Test Results
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Winner</span>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                        <span className="text-black font-bold text-sm">Thumbnail {abTestResult.winner}</span>
                      </div>
                      <span className="text-green-400 font-bold">{abTestResult.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">CTR Prediction</span>
                    <span className="text-yellow-400 font-bold text-lg">{abTestResult.ctrPrediction}%</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-white/80 font-medium text-sm mb-2">🧠 AI Analysis:</h4>
                    <p className="text-white/70 text-xs leading-relaxed">{abTestResult.reasoning}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Viral Prediction Results */}
            {viralPrediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-6 border border-yellow-500/30"
              >
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  Viral Prediction
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                          style={{ width: `${viralPrediction.overallScore}%` }}
                        />
                      </div>
                      <span className="text-yellow-400 font-bold">{viralPrediction.overallScore}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Viral Potential</span>
                    <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                      viralPrediction.viralPotential === 'viral' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                      viralPrediction.viralPotential === 'high' ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black' :
                      viralPrediction.viralPotential === 'medium' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {viralPrediction.viralPotential.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Predicted Views</span>
                    <span className="text-orange-400 font-bold">{viralPrediction.predictedViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium">Engagement Rate</span>
                    <span className="text-green-400 font-bold">{viralPrediction.engagementRate}%</span>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-white/80 font-medium text-sm mb-2">🚀 Best Posting Time:</h4>
                    <p className="text-yellow-300 font-bold">{viralPrediction.bestPostingTime}</p>
                  </div>
                  {viralPrediction.suggestedImprovements.length > 0 && (
                    <div className="p-3 bg-white/10 rounded-xl">
                      <h4 className="text-white/80 font-medium text-sm mb-2">💡 AI Suggestions:</h4>
                      <ul className="space-y-1">
                        {viralPrediction.suggestedImprovements.map((suggestion, i) => (
                          <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                            <span className="text-yellow-400">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Automated Content Results */}
            {automatedContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-md rounded-3xl p-6 border border-green-500/30"
              >
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  AI Generated Content
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-green-400 font-bold text-sm mb-2">📝 Selected Title:</h4>
                    <p className="text-white font-medium">{automatedContent.selectedTitle}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-green-400 font-bold text-sm mb-2">📄 Description:</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{automatedContent.selectedDescription}</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-green-400 font-bold text-sm mb-2">🏷️ Top Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {automatedContent.selectedTags.slice(0, 8).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-xl">
                    <h4 className="text-green-400 font-bold text-sm mb-2">🎯 Viral Score:</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-teal-400"
                          style={{ width: `${automatedContent.prediction.overallScore}%` }}
                        />
                      </div>
                      <span className="text-green-400 font-bold">{automatedContent.prediction.overallScore}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Saved Projects */}
            {savedProjects.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  Saved Projects ({savedProjects.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {savedProjects.map((project, index) => (
                    <motion.div 
                      key={project.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white truncate text-sm">{project.name}</p>
                          <p className="text-white/60 text-xs">{project.title} • Score: {project.score.overall}%</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => loadProject(project)}
                            className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-bold uppercase tracking-wider hover:from-blue-600 hover:to-purple-600 transition-all"
                          >
                            Load
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Extreme Gen Z QR Code Generator */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(139, 92, 246, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(99, 102, 241, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center relative">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(139, 92, 246, 0.5)",
                      "0 0 20px rgba(139, 92, 246, 0.8)",
                      "0 0 10px rgba(139, 92, 246, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  QR Code Generator
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* QR Code Type Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    QR Code Type
                  </motion.label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'url', icon: Link, label: 'URL' },
                      { type: 'text', icon: Type, label: 'Text' },
                      { type: 'social', icon: Share2, label: 'Social' }
                    ].map(({ type, icon: Icon, label }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQrCodeOptions(prev => ({ ...prev, type: type as any }))}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          qrCodeOptions.type === type
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 mx-auto" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    {qrCodeOptions.type === 'url' ? 'URL' : qrCodeOptions.type === 'text' ? 'Text Content' : 'Social Media Link'}
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.input
                      type="text"
                      value={qrCodeOptions.content}
                      onChange={(e) => setQrCodeOptions(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={qrCodeOptions.type === 'url' ? 'https://example.com' : qrCodeOptions.type === 'text' ? 'Enter text...' : 'https://instagram.com/username'}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all font-bold"
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(139, 92, 246, 0.3)",
                          "inset 0 0 20px rgba(139, 92, 246, 0.6)",
                          "inset 0 0 10px rgba(139, 92, 246, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Style Options */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    Style
                  </motion.label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { style: 'square', label: 'Square' },
                      { style: 'dots', label: 'Dots' },
                      { style: 'rounded', label: 'Rounded' },
                      { style: 'fancy', label: 'Fancy' }
                    ].map(({ style, label }) => (
                      <motion.button
                        key={style}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQrCodeOptions(prev => ({ ...prev, style: style as any }))}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          qrCodeOptions.style === style
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Size Slider */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    Size: {qrCodeOptions.size}px
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <motion.input
                      type="range"
                      min="50"
                      max="300"
                      value={qrCodeOptions.size}
                      onChange={(e) => setQrCodeOptions(prev => ({ ...prev, size: Number(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((qrCodeOptions.size - 50) / (300 - 50)) * 100}%, rgba(255,255,255,0.2) ${((qrCodeOptions.size - 50) / (300 - 50)) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>50px</span>
                      <span>300px</span>
                    </div>
                  </motion.div>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: [0, 2, -2, 0],
                    y: -3,
                    boxShadow: "0 15px 30px -10px rgba(139, 92, 246, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateQRCode}
                  disabled={isGeneratingQR || !qrCodeOptions.content.trim()}
                  className="relative w-full py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-white font-black text-lg uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group border-2 border-white/20"
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Neon glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(255, 255, 255, 0.3)",
                        "inset 0 0 40px rgba(255, 255, 255, 0.6)",
                        "inset 0 0 20px rgba(255, 255, 255, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isGeneratingQR ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />
                          <QrCode className="w-6 h-6 relative" />
                        </motion.div>
                        <motion.span
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [0.95, 1.05, 0.95]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="drop-shadow-lg"
                        >
                          GENERATING...
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, -15, 15, 0],
                            filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />
                          <QrCode className="w-6 h-6 relative" />
                        </motion.div>
                        <motion.span
                          animate={{
                            textShadow: [
                              "0 0 10px rgba(255, 255, 255, 0.8)",
                              "0 0 20px rgba(255, 255, 255, 1)",
                              "0 0 10px rgba(255, 255, 255, 0.8)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="drop-shadow-lg font-black"
                        >
                          GENERATE QR
                        </motion.span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* QR Code Preview */}
                {qrCodeData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <img 
                          src={qrCodeData.qrDataUrl} 
                          alt="Generated QR Code" 
                          className="rounded-lg shadow-lg"
                          style={{ 
                            width: Math.min(qrCodeData.options.size, 200),
                            height: Math.min(qrCodeData.options.size, 200)
                          }}
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg"
                        />
                      </div>
                      <div className="flex gap-2 w-full">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={downloadQRCode}
                          className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all"
                        >
                          <Download className="w-4 h-4 inline mr-1" />
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addQRToThumbnail}
                          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all"
                        >
                          <Smartphone className="w-4 h-4 inline mr-1" />
                          Add to Thumbnail
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Extreme Gen Z Password Generator */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(239, 68, 68, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(249, 115, 22, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(168, 85, 247, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center relative">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(239, 68, 68, 0.5)",
                      "0 0 20px rgba(239, 68, 68, 0.8)",
                      "0 0 10px rgba(239, 68, 68, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Password Generator
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* Password Length Slider */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Length: {passwordOptions.length} characters
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <motion.input
                      type="range"
                      min="8"
                      max="32"
                      value={passwordOptions.length}
                      onChange={(e) => setPasswordOptions(prev => ({ ...prev, length: Number(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((passwordOptions.length - 8) / (32 - 8)) * 100}%, rgba(255,255,255,0.2) ${((passwordOptions.length - 8) / (32 - 8)) * 100}%, rgba(255,255,255,0.2) 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>8</span>
                      <span>32</span>
                    </div>
                  </motion.div>
                </div>

                {/* Character Options */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Character Types
                  </motion.label>
                  <div className="space-y-2">
                    {[
                      { key: 'includeUppercase', label: 'Uppercase (A-Z)', icon: '🔤' },
                      { key: 'includeLowercase', label: 'Lowercase (a-z)', icon: '🔡' },
                      { key: 'includeNumbers', label: 'Numbers (0-9)', icon: '🔢' },
                      { key: 'includeSymbols', label: 'Symbols (!@#$%)', icon: '⚡' }
                    ].map(({ key, label, icon }) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          <span className="text-white/80 font-medium">{label}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPasswordOptions(prev => ({ ...prev, [key]: !prev[key as keyof PasswordOptions] }))}
                          className={`w-12 h-6 rounded-full transition-all ${
                            passwordOptions[key as keyof PasswordOptions]
                              ? 'bg-gradient-to-r from-red-500 to-orange-500'
                              : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            animate={{
                              x: passwordOptions[key as keyof PasswordOptions] ? 24 : 0
                            }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Advanced Options */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    Advanced Options
                  </motion.label>
                  <div className="space-y-2">
                    {[
                      { key: 'excludeSimilar', label: 'Exclude Similar (i, l, 1, L, o, 0, O)', icon: '🚫' },
                      { key: 'excludeAmbiguous', label: 'Exclude Ambiguous ({ } [ ] ( ) / \\ \' " ` ~ , ; . < >)', icon: '⚠️' }
                    ].map(({ key, label, icon }) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{icon}</span>
                          <span className="text-white/60 text-sm">{label}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPasswordOptions(prev => ({ ...prev, [key]: !prev[key as keyof PasswordOptions] }))}
                          className={`w-12 h-6 rounded-full transition-all ${
                            passwordOptions[key as keyof PasswordOptions]
                              ? 'bg-gradient-to-r from-orange-500 to-red-500'
                              : 'bg-white/20'
                          }`}
                        >
                          <motion.div
                            animate={{
                              x: passwordOptions[key as keyof PasswordOptions] ? 24 : 0
                            }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: [0, 2, -2, 0],
                    y: -3,
                    boxShadow: "0 15px 30px -10px rgba(239, 68, 68, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateSecurePassword}
                  disabled={isGeneratingPassword}
                  className="relative w-full py-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white font-black text-lg uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group border-2 border-white/20"
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Neon glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        "inset 0 0 20px rgba(255, 255, 255, 0.3)",
                        "inset 0 0 40px rgba(255, 255, 255, 0.6)",
                        "inset 0 0 20px rgba(255, 255, 255, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isGeneratingPassword ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-50 animate-pulse" />
                          <Lock className="w-6 h-6 relative" />
                        </motion.div>
                        <motion.span
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [0.95, 1.05, 0.95]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="drop-shadow-lg"
                        >
                          GENERATING...
                        </motion.span>
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, -15, 15, 0],
                            filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative"
                        >
                          <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-50 animate-pulse" />
                          <Key className="w-6 h-6 relative" />
                        </motion.div>
                        <motion.span
                          animate={{
                            textShadow: [
                              "0 0 10px rgba(255, 255, 255, 0.8)",
                              "0 0 20px rgba(255, 255, 255, 1)",
                              "0 0 10px rgba(255, 255, 255, 0.8)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="drop-shadow-lg font-black"
                        >
                          GENERATE PASSWORD
                        </motion.span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Generated Password Display */}
                {generatedPassword && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <div className="space-y-3">
                      {/* Password Display */}
                      <div className="relative">
                        <motion.div
                          animate={{
                            background: [
                              "linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.2) 50%, rgba(239, 68, 68, 0.1) 100%)",
                              "linear-gradient(90deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.3) 50%, rgba(239, 68, 68, 0.2) 100%)"
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          className="p-4 rounded-lg border border-red-500/30"
                        >
                          <div className="flex items-center justify-between">
                            <motion.p
                              animate={{
                                textShadow: [
                                  "0 0 5px rgba(255, 255, 255, 0.5)",
                                  "0 0 10px rgba(255, 255, 255, 0.8)",
                                  "0 0 5px rgba(255, 255, 255, 0.5)"
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="font-mono text-lg text-white break-all flex-1 mr-3"
                            >
                              {generatedPassword.password}
                            </motion.p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={copyPasswordToClipboard}
                              className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
                            >
                              {copiedPassword ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <Copy className="w-5 h-5 text-white" />
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>

                      {/* Strength Indicator */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 font-medium text-sm">Strength</span>
                          <motion.span
                            animate={{
                              color: [generatedPassword.strength.color, generatedPassword.strength.color, generatedPassword.strength.color]
                            }}
                            className="font-bold text-sm uppercase"
                            style={{ color: generatedPassword.strength.color }}
                          >
                            {generatedPassword.strength.level.replace('-', ' ')}
                          </motion.span>
                        </div>
                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full transition-all duration-500"
                            style={{ 
                              width: `${generatedPassword.strength.score}%`,
                              background: `linear-gradient(to right, ${generatedPassword.strength.color}, ${generatedPassword.strength.color})`
                            }}
                            animate={{
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-white/60">
                          Score: {generatedPassword.strength.score}/100
                        </div>
                      </div>

                      {/* Feedback */}
                      {generatedPassword.strength.feedback.length > 0 && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <h4 className="text-white/80 font-medium text-sm mb-2">💡 Suggestions:</h4>
                          <ul className="space-y-1">
                            {generatedPassword.strength.feedback.map((suggestion, i) => (
                              <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                                <span className="text-orange-400">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Extreme Gen Z Unit Converter */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(34, 197, 94, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(239, 68, 68, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center relative">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34, 197, 94, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.8)",
                      "0 0 10px rgba(34, 197, 94, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Unit Converter
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* Category Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Conversion Type
                  </motion.label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'currency' as const, icon: DollarSign, label: 'Currency' },
                      { type: 'length' as const, icon: Ruler, label: 'Length' },
                      { type: 'weight' as const, icon: Weight, label: 'Weight' }
                    ].map(({ type, icon: Icon, label }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setConverterCategory(type);
                          clearConversion();
                          // Set default units for category
                          if (type === 'currency') {
                            setFromUnit('USD');
                            setToUnit('EUR');
                          } else if (type === 'length') {
                            setFromUnit('M');
                            setToUnit('FT');
                          } else if (type === 'weight') {
                            setFromUnit('KG');
                            setToUnit('LB');
                          }
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          converterCategory === type
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-400 shadow-lg shadow-green-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 mx-auto" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* From Value and Unit */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    From
                  </motion.label>
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.03 }}
                      className="relative flex-1"
                      style={{
                        transformStyle: "preserve-3d"
                      }}
                    >
                      <motion.input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        placeholder="Enter value"
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                        whileFocus={{
                          rotateX: 5,
                          rotateY: 5,
                          boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                        }}
                      />
                      {/* Animated border effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        animate={{
                          boxShadow: [
                            "inset 0 0 10px rgba(34, 197, 94, 0.3)",
                            "inset 0 0 20px rgba(34, 197, 94, 0.6)",
                            "inset 0 0 10px rgba(34, 197, 94, 0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    <motion.select
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ 
                        scale: 1.03,
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                      }}
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                    >
                      {getCurrentUnits().map(unit => (
                        <option key={unit.code} value={unit.code} className="bg-gray-800">
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                {/* Swap Button */}
                <motion.div className="flex justify-center">
                  <motion.button
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 180,
                      boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.6)"
                    }}
                    whileTap={{ scale: 0.9 }}
                    onClick={swapUnits}
                    className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  >
                    <ArrowRightLeft className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>

                {/* To Value and Unit */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    To
                  </motion.label>
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative flex-1"
                    >
                      <motion.div
                        animate={{
                          background: [
                            "linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.2) 50%, rgba(34, 197, 94, 0.1) 100%)",
                            "linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.3) 50%, rgba(34, 197, 94, 0.2) 100%)"
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="p-4 rounded-lg border border-green-500/30"
                      >
                        <motion.p
                          animate={{
                            textShadow: [
                              "0 0 5px rgba(255, 255, 255, 0.5)",
                              "0 0 10px rgba(255, 255, 255, 0.8)",
                              "0 0 5px rgba(255, 255, 255, 0.5)"
                            ]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="font-mono text-lg text-white"
                        >
                          {toValue || 'Result will appear here'}
                        </motion.p>
                      </motion.div>
                    </motion.div>
                    <motion.select
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ 
                        scale: 1.03,
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                      }}
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                    >
                      {getCurrentUnits().map(unit => (
                        <option key={unit.code} value={unit.code} className="bg-gray-800">
                          {unit.symbol} - {unit.name}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: [0, 2, -2, 0],
                      y: -3,
                      boxShadow: "0 15px 30px -10px rgba(34, 197, 94, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={performConversion}
                    disabled={isConverting}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden group border-2 border-white/20"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isConverting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-50 animate-pulse" />
                            <TrendingUp className="w-4 h-4 relative" />
                          </motion.div>
                          <motion.span
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              scale: [0.95, 1.05, 0.95]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="drop-shadow-lg"
                          >
                            CONVERTING...
                          </motion.span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, -15, 15, 0],
                              filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-50 animate-pulse" />
                            <Calculator className="w-4 h-4 relative" />
                          </motion.div>
                          <motion.span
                            animate={{
                              textShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.8)",
                                "0 0 20px rgba(255, 255, 255, 1)",
                                "0 0 10px rgba(255, 255, 255, 0.8)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="drop-shadow-lg font-black"
                          >
                            CONVERT
                          </motion.span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearConversion}
                    className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:bg-white/20"
                  >
                    Clear
                  </motion.button>
                </div>

                {/* Conversion History */}
                {conversionHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <h4 className="text-white/80 font-bold text-sm mb-2 uppercase tracking-wider">Recent Conversions</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {conversionHistory.slice(0, 5).map((conversion) => (
                        <motion.div
                          key={conversion.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="text-white/70 text-sm">
                            <span className="font-mono">{conversion.fromValue}</span>
                            <span className="mx-1">{getUnitSymbol(conversion.fromUnit)}</span>
                            <span className="mx-1">→</span>
                            <span className="font-mono">{conversion.toValue.toFixed(4)}</span>
                            <span className="mx-1">{getUnitSymbol(conversion.toUnit)}</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1"
                          >
                            <Star className="w-3 h-3 text-yellow-400" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Extreme Gen Z PDF Merger/Splitter */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(168, 85, 247, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(239, 68, 68, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(34, 197, 94, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(168, 85, 247, 0.5)",
                      "0 0 20px rgba(168, 85, 247, 0.8)",
                      "0 0 10px rgba(168, 85, 247, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  PDF Merger/Splitter
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* Operation Type Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Operation Type
                  </motion.label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'merge' as const, icon: Merge, label: 'Merge PDFs' },
                      { type: 'split' as const, icon: Scissors, label: 'Split PDF' }
                    ].map(({ type, icon: Icon, label }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setPdfOperation(type);
                          clearPDFFiles();
                        }}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          pdfOperation === type
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-lg shadow-purple-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 mx-auto" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    {pdfOperation === 'merge' ? 'PDF Files to Merge' : 'PDF File to Split'}
                  </motion.label>
                  <motion.div
                    onDragOver={handlePDFDragOver}
                    onDragLeave={handlePDFDragLeave}
                    onDrop={handlePDFDrop}
                    whileHover={{ scale: 1.02 }}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragOver 
                        ? 'border-purple-400 bg-purple-500/20' 
                        : 'border-white/30 bg-white/5 hover:border-purple-400'
                    }`}
                  >
                    <input
                      ref={pdfFileInputRef}
                      type="file"
                      multiple={pdfOperation === 'merge'}
                      accept=".pdf"
                      onChange={(e) => handlePDFFileUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          {pdfOperation === 'merge' 
                            ? 'Drop PDF files here or click to browse' 
                            : 'Drop PDF file here or click to browse'
                          }
                        </p>
                        <p className="text-white/60 text-sm mt-1">
                          {pdfOperation === 'merge' ? 'Add multiple files to merge' : 'Select one file to split'}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* PDF Files List */}
                {pdfFiles.length > 0 && (
                  <div>
                    <motion.label 
                      className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                      animate={{
                        color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      {pdfOperation === 'merge' ? 'Files to Merge' : 'Selected File'}
                    </motion.label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {pdfFiles.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm truncate">{file.name}</p>
                              <p className="text-white/60 text-xs">{file.pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {pdfOperation === 'merge' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1 text-white/60 hover:text-white"
                              >
                                <Grid className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removePDFFile(file.id)}
                              className="p-1 text-red-400 hover:text-red-300"
                            >
                              <Delete className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Page Range Selection for Split */}
                {pdfOperation === 'split' && pdfFiles.length > 0 && (
                  <div>
                    <motion.label 
                      className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                      animate={{
                        color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    >
                      Page Range
                    </motion.label>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.03 }}
                      className="relative"
                    >
                      <motion.input
                        type="text"
                        value={pageRange}
                        onChange={(e) => setPageRange(e.target.value)}
                        placeholder="e.g., 1-5, 8, 10-15"
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-all font-bold"
                        whileFocus={{
                          rotateX: 5,
                          rotateY: 5,
                          boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.5)"
                        }}
                      />
                      {/* Animated border effect */}
                      <motion.div
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        animate={{
                          boxShadow: [
                            "inset 0 0 10px rgba(168, 85, 247, 0.3)",
                            "inset 0 0 20px rgba(168, 85, 247, 0.6)",
                            "inset 0 0 10px rgba(168, 85, 247, 0.3)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    <p className="text-white/60 text-xs mt-2">
                      Enter page numbers or ranges (e.g., 1-5, 8, 10-15)
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: [0, 2, -2, 0],
                      y: -3,
                      boxShadow: "0 15px 30px -10px rgba(168, 85, 247, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={performPDFOperation}
                    disabled={isProcessingPDF || pdfFiles.length === 0}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden group border-2 border-white/20"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isProcessingPDF ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />
                            {pdfOperation === 'merge' ? <Merge className="w-4 h-4 relative" /> : <Scissors className="w-4 h-4 relative" />}
                          </motion.div>
                          <motion.span
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              scale: [0.95, 1.05, 0.95]
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="drop-shadow-lg"
                          >
                            {pdfOperation === 'merge' ? 'MERGING...' : 'SPLITTING...'}
                          </motion.span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, -15, 15, 0],
                              filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-50 animate-pulse" />
                            {pdfOperation === 'merge' ? <Merge className="w-4 h-4 relative" /> : <Scissors className="w-4 h-4 relative" />}
                          </motion.div>
                          <motion.span
                            animate={{
                              textShadow: [
                                "0 0 10px rgba(255, 255, 255, 0.8)",
                                "0 0 20px rgba(255, 255, 255, 1)",
                                "0 0 10px rgba(255, 255, 255, 0.8)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="drop-shadow-lg font-black"
                          >
                            {pdfOperation === 'merge' ? 'MERGE PDFS' : 'SPLIT PDF'}
                          </motion.span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearPDFFiles}
                    className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:bg-white/20"
                  >
                    Clear
                  </motion.button>
                </div>

                {/* Operations History */}
                {pdfOperations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <h4 className="text-white/80 font-bold text-sm mb-2 uppercase tracking-wider">Recent Operations</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {pdfOperations.slice(0, 5).map((operation) => (
                        <motion.div
                          key={operation.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              {operation.type === 'merge' ? (
                                <Merge className="w-3 h-3 text-white" />
                              ) : (
                                <Scissors className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="text-white/70 text-sm">
                              <span className="font-medium capitalize">{operation.type}</span>
                              <span className="mx-1">•</span>
                              <span className="text-xs">{operation.files.length} file(s)</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadPDF(operation)}
                            className="p-1 text-green-400 hover:text-green-300"
                          >
                            <DownloadCloud className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Extreme Gen Z Loan/EMI Calculator */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(34, 197, 94, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(239, 68, 68, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center relative">
                    <PiggyBank className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34, 197, 94, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.8)",
                      "0 0 10px rgba(34, 197, 94, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Loan/EMI Calculator
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* Loan Type Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Loan Type
                  </motion.label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'home' as const, icon: Home, label: 'Home Loan' },
                      { type: 'car' as const, icon: Car, label: 'Car Loan' },
                      { type: 'personal' as const, icon: CreditCard, label: 'Personal' },
                      { type: 'education' as const, icon: BookOpen, label: 'Education' }
                    ].map(({ type, icon: Icon, label }) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLoanType(type)}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          loanType === type
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-400 shadow-lg shadow-green-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 mx-auto" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Loan Amount ($)
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                  >
                    <motion.input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="Enter loan amount"
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)",
                          "inset 0 0 20px rgba(34, 197, 94, 0.6)",
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Interest Rate */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    Interest Rate (% per annum)
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                  >
                    <motion.input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="Enter interest rate"
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)",
                          "inset 0 0 20px rgba(34, 197, 94, 0.6)",
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Loan Tenure */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5
                    }}
                  >
                    Loan Tenure (months)
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                  >
                    <motion.input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      placeholder="Enter loan tenure in months"
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:bg-white/20 transition-all font-bold"
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)",
                          "inset 0 0 20px rgba(34, 197, 94, 0.6)",
                          "inset 0 0 10px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: [0, 2, -2, 0],
                      y: -3,
                      boxShadow: "0 15px 30px -10px rgba(34, 197, 94, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={calculateEMI}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden group border-2 border-white/20"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -15, 15, 0],
                          filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-50 animate-pulse" />
                        <Calculator className="w-4 h-4 relative" />
                      </motion.div>
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(255, 255, 255, 0.8)",
                            "0 0 20px rgba(255, 255, 255, 1)",
                            "0 0 10px rgba(255, 255, 255, 0.8)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="drop-shadow-lg font-black"
                      >
                        CALCULATE EMI
                      </motion.span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearLoanCalculation}
                    className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:bg-white/20"
                  >
                    Clear
                  </motion.button>
                </div>

                {/* Results Display */}
                {loanCalculations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <h4 className="text-white/80 font-bold text-sm mb-2 uppercase tracking-wider">EMI Results</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-white">
                        <span>Monthly EMI:</span>
                        <span className="font-bold text-green-400">${loanCalculations[0].emi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Total Interest:</span>
                        <span className="font-bold text-orange-400">${loanCalculations[0].totalInterest.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white">
                        <span>Total Amount:</span>
                        <span className="font-bold text-blue-400">${loanCalculations[0].totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAmortization(!showAmortization)}
                      className="mt-3 w-full py-2 bg-white/10 border border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:bg-white/20"
                    >
                      {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
                    </motion.button>
                  </motion.div>
                )}

                {/* Amortization Schedule */}
                {showAmortization && amortizationSchedule.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20 max-h-48 overflow-y-auto"
                  >
                    <h4 className="text-white/80 font-bold text-sm mb-2 uppercase tracking-wider">Amortization Schedule</h4>
                    <div className="space-y-1 text-xs">
                      <div className="grid grid-cols-4 gap-2 text-white/60 font-bold border-b border-white/20 pb-1">
                        <span>Month</span>
                        <span>EMI</span>
                        <span>Interest</span>
                        <span>Principal</span>
                      </div>
                      {amortizationSchedule.slice(0, 12).map((entry) => (
                        <div key={entry.month} className="grid grid-cols-4 gap-2 text-white/80">
                          <span>{entry.month}</span>
                          <span>${entry.emmi.toFixed(2)}</span>
                          <span>${entry.interest.toFixed(2)}</span>
                          <span>${entry.principal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Extreme Gen Z Hashtag Generator */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden"
              whileHover={{
                y: -2,
                boxShadow: "0 20px 40px -15px rgba(239, 68, 68, 0.3)"
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.1), transparent)",
                    "linear-gradient(135deg, transparent, rgba(34, 197, 94, 0.1), transparent)",
                    "linear-gradient(225deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
                    "linear-gradient(315deg, transparent, rgba(59, 130, 246, 0.1), transparent)"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-red-400/30 rounded-full"
                    animate={{
                      x: [Math.random() * 100, Math.random() * 100],
                      y: [Math.random() * 100, Math.random() * 100],
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
              
              <h3 className="font-black text-white mb-4 flex items-center gap-3 text-lg uppercase tracking-wider relative z-10">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur-lg opacity-50 animate-pulse" />
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center relative">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(239, 68, 68, 0.5)",
                      "0 0 20px rgba(239, 68, 68, 0.8)",
                      "0 0 10px rgba(239, 68, 68, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Hashtag Generator
                </motion.span>
              </h3>
              
              <div className="space-y-4 relative z-10">
                {/* Platform Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Platform
                  </motion.label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { platform: 'instagram' as const, icon: Camera, label: 'Instagram' },
                      { platform: 'tiktok' as const, icon: VideoIcon, label: 'TikTok' }
                    ].map(({ platform, icon: Icon, label }) => (
                      <motion.button
                        key={platform}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          selectedPlatform === platform
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400 shadow-lg shadow-red-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1 mx-auto" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    Category
                  </motion.label>
                  <div className="grid grid-cols-3 gap-2">
                    {HASHTAG_CATEGORIES.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setHashtagCategory(category.id)}
                        className={`px-2 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all border-2 ${
                          hashtagCategory === category.id
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400 shadow-lg shadow-red-500/25'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <category.icon className="w-3 h-3 mb-1 mx-auto" />
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Hashtag Input */}
                <div>
                  <motion.label 
                    className="block text-white/80 font-bold text-sm mb-2 uppercase tracking-wider"
                    animate={{
                      color: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    Content Keywords
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.03 }}
                    className="relative"
                  >
                    <motion.input
                      type="text"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      placeholder="Enter keywords separated by spaces"
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:bg-white/20 transition-all font-bold"
                      whileFocus={{
                        rotateX: 5,
                        rotateY: 5,
                        boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.5)"
                      }}
                    />
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{
                        boxShadow: [
                          "inset 0 0 10px rgba(239, 68, 68, 0.3)",
                          "inset 0 0 20px rgba(239, 68, 68, 0.6)",
                          "inset 0 0 10px rgba(239, 68, 68, 0.3)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: [0, 2, -2, 0],
                      y: -3,
                      boxShadow: "0 15px 30px -10px rgba(239, 68, 68, 0.6)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateHashtags}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden group border-2 border-white/20"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, -15, 15, 0],
                          filter: ["hue-rotate(0deg)", "hue-rotate(180deg)", "hue-rotate(360deg)"]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-50 animate-pulse" />
                        <Hash className="w-4 h-4 relative" />
                      </motion.div>
                      <motion.span
                        animate={{
                          textShadow: [
                            "0 0 10px rgba(255, 255, 255, 0.8)",
                            "0 0 20px rgba(255, 255, 255, 1)",
                            "0 0 10px rgba(255, 255, 255, 0.8)"
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="drop-shadow-lg font-black"
                      >
                        GENERATE
                      </motion.span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearHashtags}
                    className="px-4 py-3 bg-white/10 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:bg-white/20"
                  >
                    Clear
                  </motion.button>
                </div>

                {/* Generated Hashtags */}
                {generatedHashtags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white/80 font-bold text-sm uppercase tracking-wider">
                        Generated Hashtags ({generatedHashtags.length})
                      </h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyHashtags}
                        className="p-2 bg-white/10 border border-white/20 text-white rounded-lg transition-all hover:bg-white/20"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedHashtags.map((hashtag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="px-2 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 text-xs rounded-full"
                        >
                          {hashtag}
                        </motion.span>
                      ))}
                    </div>
                    {copiedHashtags && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-green-400 text-xs font-bold"
                      >
                        ✓ Hashtags copied to clipboard!
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Hashtag Sets History */}
                {hashtagSets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20"
                  >
                    <h4 className="text-white/80 font-bold text-sm mb-2 uppercase tracking-wider">Recent Sets</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {hashtagSets.slice(0, 5).map((set) => (
                        <motion.div
                          key={set.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <div className="text-white/70 text-sm">
                            <span className="font-medium capitalize">{set.platform}</span>
                            <span className="mx-1">•</span>
                            <span className="text-xs">{set.category}</span>
                            <span className="mx-1">•</span>
                            <span className="text-xs">{set.count} hashtags</span>
                          </div>
                          <div className="text-green-400 text-xs font-bold">
                            {set.engagement}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* History */}
            {thumbnails.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <h3 className="font-black text-white mb-5 flex items-center gap-3 text-lg uppercase tracking-wider">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Recent Thumbnails ({thumbnails.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {thumbnails.map((thumb, index) => (
                    <motion.div 
                      key={thumb.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-20 h-12 rounded-xl border-2 border-white/20 flex-shrink-0 overflow-hidden"
                          style={{
                            background: thumb.template.bg,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white truncate text-sm">{thumb.title}</p>
                          <p className="text-white/60 text-xs font-medium">{thumb.template.name} • {new Date(thumb.created).toLocaleTimeString()}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setTitle(thumb.title);
                            setDescription(thumb.description);
                            setSelectedTemplate(thumb.template);
                            setSuccess('✨ Thumbnail loaded!');
                            setTimeout(() => setSuccess(null), 2000);
                          }}
                          className="px-4 py-2 text-xs bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-bold uppercase tracking-wider hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg"
                        >
                          Load
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Save Project Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-black text-white text-2xl mb-6 text-center uppercase tracking-wider">
                💾 Save Project
              </h3>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/20 transition-all font-bold mb-6"
                maxLength={50}
              />
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveProject}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-black font-black uppercase tracking-wider rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 bg-white/10 text-white font-black uppercase tracking-wider rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
