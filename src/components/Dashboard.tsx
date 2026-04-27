import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ImageIcon, FileText, Bot, Zap, ArrowRight, Sparkles, Palette, BarChart3, AlertCircle } from 'lucide-react';
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

      {/* Featured Tools Section */}
      {!searchQuery && (
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-3xl font-display font-black uppercase tracking-tight text-ink">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YouTube Title & Thumbnail Generator */}
            <Link
              to="/dashboard"
              className="group relative overflow-hidden rounded-3xl border border-slate-800 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-ink mb-2">YouTube Title & Thumbnail</h3>
                  <p className="text-ink/60">Generate viral YouTube titles and thumbnails with AI assistance</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest">
                  Try Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Thumbnail Generator */}
            <Link
              to="/tools/thumbnail-generator"
              className="group relative overflow-hidden rounded-3xl border border-slate-800 hover:border-secondary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-transparent" />
              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                    <Palette className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-ink mb-2">Thumbnail Creator</h3>
                  <p className="text-ink/60">Design professional thumbnails with 6 stunning templates</p>
                </div>
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest">
                  Try Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Competitor Analysis */}
            <Link
              to="/dashboard"
              className="group relative overflow-hidden rounded-3xl border border-slate-800 hover:border-tertiary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-tertiary/20 via-transparent to-transparent" />
              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-tertiary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-tertiary/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-tertiary" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-ink mb-2">Competitor Analysis</h3>
                  <p className="text-ink/60">Analyze competitor YouTube titles and optimize your CTR</p>
                </div>
                <div className="flex items-center gap-2 text-tertiary font-bold uppercase tracking-widest">
                  Try Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* AI Assistant */}
            <Link
              to="/tools/ai-assistant"
              className="group relative overflow-hidden rounded-3xl border border-slate-800 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
              <div className="relative z-10 p-8 h-64 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-ink mb-2">AI Assistant</h3>
                  <p className="text-ink/60">Chat with AI for creative ideas and content tips</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest">
                  Try Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
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
            <p className="text-ink/60">Access all tools with daily credits. No subscription required.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}