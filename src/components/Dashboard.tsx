import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ImageIcon, FileText, Bot, Zap, ArrowRight, Sparkles, Palette, BarChart3, AlertCircle, Lock, Download, Clock, Shield, Eye, Filter, Edit3, Share2, Check, Smile, Gauge, Cloud, Smartphone, Cpu, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = [
  {
    id: 'image-tools',
    name: 'Image Tools',
    description: 'Compress, resize, crop, and convert images',
    icon: ImageIcon,
    color: 'bg-primary',
    tools: [
      { name: 'Compress Image', path: '/tools/image-compressor', description: 'Reduce image file size' },
      { name: 'Resize Image', path: '/tools/image-resizer', description: 'Change image dimensions' },
      { name: 'Crop Image', path: '/tools/image-cropper', description: 'Trim and crop images' },
      { name: 'Rotate/Flip', path: '/tools/image-rotator', description: 'Adjust image orientation' },
      { name: 'Passport Size', path: '/tools/passport-size', description: 'Create passport photos' },
      { name: 'Add Watermark', path: '/tools/watermark', description: 'Protect your images' },
    ]
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, convert, and optimize PDFs',
    icon: FileText,
    color: 'bg-secondary',
    tools: [
      { name: 'Merge PDF', path: '/tools/pdf-merger', description: 'Combine multiple PDFs' },
      { name: 'Split PDF', path: '/tools/pdf-splitter', description: 'Extract pages from PDF' },
      { name: 'Remove Pages', path: '/tools/pdf-remover', description: 'Delete PDF pages' },
      { name: 'Rotate PDF', path: '/tools/pdf-rotator', description: 'Change PDF orientation' },
      { name: 'Compress PDF', path: '/tools/pdf-compressor', description: 'Reduce PDF file size' },
      { name: 'PDF to JPG', path: '/tools/pdf-to-jpg', description: 'Convert PDF to images' },
    ]
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    description: 'AI-powered image and document processing',
    icon: Bot,
    color: 'bg-tertiary',
    tools: [
      { name: 'PDF Summarizer', path: '/tools/pdf-summarizer', description: 'AI-powered summaries' },
      { name: 'Background Remover', path: '/tools/background-remover', description: 'Remove image backgrounds' },
      { name: 'Image Analyzer', path: '/tools/image-analyzer', description: 'AI image analysis' },
      { name: 'AI Assistant', path: '/tools/ai-assistant', description: 'Chat with AI helper' },
    ]
  }
];

const allTools = categories.flatMap(cat => cat.tools);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = searchQuery
    ? allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
            <Sparkles className="w-10 h-10 text-black fill-black" />
          </div>
        </motion.div>
        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter text-ink">
          CreatorBoost AI
        </motion.h1>
        <motion.p variants={itemVariants} className="text-xl text-ink/60 max-w-2xl mx-auto">
          All-in-one toolkit for creators. Process images, PDFs, and leverage AI - all in your browser.
        </motion.p>
        
        {/* Search Bar */}
        <motion.div variants={itemVariants} className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </motion.div>
      </div>

      {/* Introduction Section */}
      {!searchQuery && (
        <motion.div variants={itemVariants} className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 md:p-12 space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink">
            Your Complete Creator Toolkit
          </h2>
          <div className="space-y-4 text-ink/70 leading-relaxed text-lg">
            <p>
              CreatorBoost AI is a comprehensive, browser-based platform designed to help content creators, digital professionals, and everyday users accomplish essential tasks with powerful, easy-to-use tools. Whether you're managing images, working with PDFs, or need AI-powered assistance, we've got you covered.
            </p>
            <p>
              Our platform combines cutting-edge AI technology with practical utility tools to deliver results without requiring downloads, installations, or complicated software. All processing happens securely in your browser, ensuring your data remains private while you work on your projects.
            </p>
            <p>
              From image optimization and PDF manipulation to AI-powered content analysis and financial calculations, CreatorBoost AI offers 50+ tools organized across six main categories. Whether you're a YouTube creator optimizing thumbnails, a business professional managing documents, or someone who needs quick utility solutions, our tools are built to save you time and deliver professional results.
            </p>
          </div>
          
          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-700">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-ink">Fast & Efficient</h3>
              <p className="text-sm text-ink/60">Process files instantly without downloads or waiting times</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold text-ink">50+ Tools</h3>
              <p className="text-sm text-ink/60">Comprehensive solutions for image, PDF, AI, and finance needs</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 bg-tertiary/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-tertiary" />
              </div>
              <h3 className="font-bold text-ink">100% Free & Private</h3>
              <p className="text-sm text-ink/60">No account required for most tools, your data stays secure</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trust & Impact Section */}
      {!searchQuery && (
        <motion.div variants={itemVariants} className="border-t border-slate-800 pt-12">
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5 border border-slate-800 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-ink mb-12 text-center">
              Trusted by Creators Worldwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-display font-black text-primary">50K+</div>
                <p className="text-ink/70 font-semibold">Content Pieces Generated</p>
                <p className="text-xs text-ink/50">Titles, descriptions, thumbnails</p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-display font-black text-secondary">10K+</div>
                <p className="text-ink/70 font-semibold">Active Users</p>
                <p className="text-xs text-ink/50">Growing every month</p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-display font-black text-tertiary">500M+</div>
                <p className="text-ink/70 font-semibold">Combined Views Influenced</p>
                <p className="text-xs text-ink/50">Content optimized with our tools</p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl md:text-5xl font-display font-black text-primary">4.8/5</div>
                <p className="text-ink/70 font-semibold">User Rating</p>
                <p className="text-xs text-ink/50">Based on 1000+ reviews</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}



      {/* Search Results */}
      {searchQuery && filteredTools && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
            Search Results ({filteredTools.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-primary/50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-ink/60 mt-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Categories */}
      {!searchQuery && (
        <div className="space-y-12">
          <div className="border-t border-slate-800 pt-12" />
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', category.color)}>
                  <category.icon className="w-6 h-6 text-black fill-black" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black uppercase tracking-tight text-ink">
                    {category.name}
                  </h2>
                  <p className="text-sm text-ink/60">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-ink/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-ink/60 mt-2">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Features Section */}
      <motion.div variants={itemVariants} className="py-12 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-ink">Fast & Secure</h3>
            <p className="text-ink/60">All processing happens in your browser. Your files never leave your device.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Bot className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-ink">AI Powered</h3>
            <p className="text-ink/60">Leverage Google Gemini AI for intelligent document and image processing.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-tertiary" />
            </div>
            <h3 className="text-xl font-bold text-ink">Free to Use</h3>
            <p className="text-ink/60">Access all tools for free. No subscription required.</p>
          </div>
        </div>
      </motion.div>

      {/* Most-Searched Daily Use Features */}
      <motion.div variants={itemVariants} className="py-16 border-t border-slate-800">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">Most-Searched Daily Use Features</h2>
          <p className="text-ink/60 max-w-2xl mx-auto">The most searched daily utility tools your users want, organized by category.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">Image Tools</h3>
                <p className="text-ink/60 text-sm">Top image utilities for creators and everyday users.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>Background Remover</li>
              <li>Image Compressor</li>
              <li>Image to PDF</li>
              <li>Passport Photo Maker</li>
              <li>Image Resizer</li>
              <li>Photo Enhancer/Upscaler</li>
              <li>Meme Generator</li>
              <li>Screenshot to Text (OCR)</li>
              <li>Watermark Remover</li>
              <li>Color Picker from Image</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">PDF Tools</h3>
                <p className="text-ink/60 text-sm">The highest-demand PDF utilities for office and document work.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>PDF to Word</li>
              <li>Word to PDF</li>
              <li>PDF Compressor</li>
              <li>PDF Merger</li>
              <li>PDF to Excel</li>
              <li>PDF Password Remover</li>
              <li>PDF Editor</li>
              <li>E-Signature Tool</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-tertiary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">AI Tools</h3>
                <p className="text-ink/60 text-sm">Trending AI utilities for students, creators, and professionals.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>AI Background Remover</li>
              <li>AI Resume/CV Builder</li>
              <li>AI Cover Letter Writer</li>
              <li>AI Grammar Checker</li>
              <li>AI Paraphraser</li>
              <li>AI Plagiarism Checker</li>
              <li>AI Translator</li>
              <li>AI Summarizer</li>
              <li>AI Chatbot</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">Finance Tools</h3>
                <p className="text-ink/60 text-sm">Daily financial calculators for global users.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>VAT Calculator</li>
              <li>GST Calculator</li>
              <li>Currency Converter</li>
              <li>Invoice Generator</li>
              <li>Salary Calculator</li>
              <li>Loan/EMI Calculator</li>
              <li>Tip Calculator</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">Social Media Tools</h3>
                <p className="text-ink/60 text-sm">Tools that creators use every day for content growth.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>YouTube Thumbnail Maker</li>
              <li>Instagram Post Resizer</li>
              <li>TikTok Watermark Remover</li>
              <li>Hashtag Generator</li>
              <li>Bio Link Page Builder</li>
              <li>YouTube Title/Tag Generator</li>
              <li>Social Media Caption Writer</li>
              <li>QR Code Generator</li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-tertiary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-ink">Everyday Utility Tools</h3>
                <p className="text-ink/60 text-sm">Simple utilities that drive daily search volume.</p>
              </div>
            </div>
            <ol className="space-y-2 text-sm text-ink/70 list-decimal list-inside">
              <li>Word Counter</li>
              <li>Age Calculator</li>
              <li>BMI Calculator</li>
              <li>Password Generator</li>
              <li>Unit Converter</li>
              <li>Timer/Stopwatch</li>
              <li>Note Pad Online</li>
              <li>Internet Speed Test</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* 25 Key Features Section */}
      <motion.div variants={itemVariants} className="py-16 border-t border-slate-800">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">25 Powerful Features</h2>
          <p className="text-ink/60 max-w-2xl mx-auto">Everything you need to process images, PDFs, and create content with AI assistance.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Image Processing Features */}
          <Link to="/tools/image-compressor" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">Image Compression</h4>
            <p className="text-xs text-ink/60">Reduce file size while maintaining quality</p>
          </Link>

          <Link to="/tools/background-remover" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition">
              <Palette className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-secondary transition">Background Removal</h4>
            <p className="text-xs text-ink/60">Remove backgrounds from images instantly</p>
          </Link>

          <Link to="/tools/image-resizer" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <Edit3 className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">Image Resizing</h4>
            <p className="text-xs text-ink/60">Resize images to any dimensions instantly</p>
          </Link>

          <Link to="/tools/image-cropper" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">Image Cropping</h4>
            <p className="text-xs text-ink/60">Crop and adjust images with precision</p>
          </Link>

          <Link to="/tools/image-converter" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition">
              <Share2 className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-secondary transition">Image Conversion</h4>
            <p className="text-xs text-ink/60">Convert between JPEG, PNG, WebP, GIF</p>
          </Link>

          {/* PDF Processing Features */}
          <Link to="/tools/pdf-compressor" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <FileText className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">PDF Compression</h4>
            <p className="text-xs text-ink/60">Reduce PDF file sizes significantly</p>
          </Link>

          <Link to="/tools/pdf-merger" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">PDF Merging</h4>
            <p className="text-xs text-ink/60">Combine multiple PDFs into one file</p>
          </Link>

          <Link to="/tools/pdf-splitter" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-secondary transition">PDF Splitting</h4>
            <p className="text-xs text-ink/60">Extract specific pages from PDFs</p>
          </Link>

          <Link to="/tools/pdf-to-word" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <FileText className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">PDF to Word</h4>
            <p className="text-xs text-ink/60">Convert PDF documents to Word format</p>
          </Link>

          <Link to="/tools/pdf-rotator" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">PDF Rotation</h4>
            <p className="text-xs text-ink/60">Rotate pages in PDF documents</p>
          </Link>

          {/* AI Features */}
          <Link to="/tools/ai-assistant" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition">
              <Bot className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-secondary transition">AI Writing Assistant</h4>
            <p className="text-xs text-ink/60">Generate content with AI assistance</p>
          </Link>

          <Link to="/tools/image-analyzer" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <Sparkles className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">AI Image Analysis</h4>
            <p className="text-xs text-ink/60">Analyze and describe images with AI</p>
          </Link>

          <Link to="/tools/pdf-summarizer" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">PDF Summarization</h4>
            <p className="text-xs text-ink/60">Get AI summaries of documents</p>
          </Link>

          <Link to="/tools/caption-writer" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition">
              <Edit3 className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-secondary transition">AI Caption Writer</h4>
            <p className="text-xs text-ink/60">Generate captions for social media</p>
          </Link>

          <Link to="/tools/ai-thumbnail-generator" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <Palette className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">AI Thumbnail Generator</h4>
            <p className="text-xs text-ink/60">Create stunning thumbnails with AI</p>
          </Link>

          {/* Security & Performance */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1">100% Private</h4>
            <p className="text-xs text-ink/60">Files never leave your device</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Lightning Fast</h4>
            <p className="text-xs text-ink/60">Process files instantly in-browser</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1">No Registration</h4>
            <p className="text-xs text-ink/60">Start using tools immediately</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Ad-Free Experience</h4>
            <p className="text-xs text-ink/60">Premium members get ad-free tools</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
              <Check className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Auto-Save Work</h4>
            <p className="text-xs text-ink/60">Your progress is saved automatically</p>
          </div>

          {/* Developer & Utility */}
          <Link to="/tools/json-formatter" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-tertiary/20 transition">
              <Cpu className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-tertiary transition">JSON Tools</h4>
            <p className="text-xs text-ink/60">Format, validate, and minify JSON</p>
          </Link>

          <Link to="/tools/bulk-compressor" className="group bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition cursor-pointer hover:bg-slate-900/70">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1 group-hover:text-primary transition">Batch Processing</h4>
            <p className="text-xs text-ink/60">Process multiple files at once</p>
          </Link>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-secondary/50 transition">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
              <Cloud className="w-5 h-5 text-secondary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Cloud Integration</h4>
            <p className="text-xs text-ink/60">Works on all devices seamlessly</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-tertiary/50 transition">
            <div className="w-10 h-10 bg-tertiary/10 rounded-lg flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5 text-tertiary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Mobile Friendly</h4>
            <p className="text-xs text-ink/60">Fully responsive on all screens</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Smile className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-ink mb-1">Easy to Use</h4>
            <p className="text-xs text-ink/60">Intuitive interface for everyone</p>
          </div>
        </div>
      </motion.div>


    </motion.div>
  );
}