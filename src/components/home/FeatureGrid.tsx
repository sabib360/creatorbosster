import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ImageIcon, FileText, Bot, Zap, ArrowRight, Sparkles, Palette,
  BarChart3, Lock, Download, Clock, Shield, Eye, Filter, Edit3,
  Share2, Check, Smile, Gauge, Cloud, Smartphone, Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  { to: '/tools/image-compressor', icon: ImageIcon, label: 'Image Compression', desc: 'Reduce file size', color: 'text-blue-400' },
  { to: '/tools/background-remover', icon: Palette, label: 'Background Removal', desc: 'Remove backgrounds', color: 'text-purple-400' },
  { to: '/tools/image-resizer', icon: Edit3, label: 'Image Resizing', desc: 'Resize to any size', color: 'text-cyan-400' },
  { to: '/tools/image-cropper', icon: Filter, label: 'Image Cropping', desc: 'Crop precisely', color: 'text-blue-400' },
  { to: '/tools/image-converter', icon: Share2, label: 'Image Conversion', desc: 'JPEG, PNG, WebP', color: 'text-purple-400' },
  { to: '/tools/pdf-compressor', icon: FileText, label: 'PDF Compression', desc: 'Reduce file sizes', color: 'text-cyan-400' },
  { to: '/tools/pdf-merger', icon: Zap, label: 'PDF Merging', desc: 'Combine PDFs', color: 'text-blue-400' },
  { to: '/tools/pdf-splitter', icon: FileText, label: 'PDF Splitting', desc: 'Extract pages', color: 'text-purple-400' },
  { to: '/tools/pdf-to-word', icon: FileText, label: 'PDF to Word', desc: 'Convert format', color: 'text-cyan-400' },
  { to: '/tools/pdf-rotator', icon: Download, label: 'PDF Rotation', desc: 'Rotate pages', color: 'text-blue-400' },
  { to: '/tools/ai-assistant', icon: Bot, label: 'AI Assistant', desc: 'Generate content', color: 'text-purple-400' },
  { to: '/tools/image-analyzer', icon: Sparkles, label: 'AI Image Analysis', desc: 'Analyze images', color: 'text-cyan-400' },
  { to: '/tools/pdf-summarizer', icon: BarChart3, label: 'PDF Summarizer', desc: 'AI summaries', color: 'text-blue-400' },
  { to: '/tools/caption-writer', icon: Edit3, label: 'Caption Writer', desc: 'Social captions', color: 'text-purple-400' },
  { to: '/tools/ai-thumbnail-generator', icon: Palette, label: 'AI Thumbnails', desc: 'Create thumbnails', color: 'text-cyan-400' },
  { to: undefined, icon: Lock, label: '100% Private', desc: 'Files stay local', color: 'text-blue-400' },
  { to: undefined, icon: Clock, label: 'Lightning Fast', desc: 'In-browser processing', color: 'text-purple-400' },
  { to: undefined, icon: Shield, label: 'No Registration', desc: 'Use immediately', color: 'text-cyan-400' },
  { to: undefined, icon: Eye, label: 'Ad-Free', desc: 'Clean experience', color: 'text-blue-400' },
  { to: undefined, icon: Check, label: 'Auto-Save', desc: 'Progress saved', color: 'text-purple-400' },
  { to: '/tools/json-formatter', icon: Cpu, label: 'JSON Tools', desc: 'Format & validate', color: 'text-cyan-400' },
  { to: '/tools/bulk-compressor', icon: Gauge, label: 'Batch Processing', desc: 'Multiple files', color: 'text-blue-400' },
  { to: undefined, icon: Cloud, label: 'Cloud Ready', desc: 'All devices', color: 'text-purple-400' },
  { to: undefined, icon: Smartphone, label: 'Mobile Friendly', desc: 'Fully responsive', color: 'text-cyan-400' },
  { to: undefined, icon: Smile, label: 'Easy to Use', desc: 'Intuitive UI', color: 'text-blue-400' },
];

export function FeatureGrid() {
  return (
    <section className="py-12 border-t border-gray-800/60">
      <div className="mb-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white mb-3">25 Powerful Features</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">Everything you need to process images, PDFs, and create content with AI.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {features.map((feat, i) => {
          const Wrapper = feat.to ? Link : 'div';
          const wrapperProps = feat.to ? { to: feat.to } : {};
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
            >
              <Wrapper
                {...(wrapperProps as any)}
                className={cn(
                  "block group p-4 bg-white/[0.03] border border-gray-800/60 rounded-xl transition-all duration-300",
                  feat.to && "hover:border-blue-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 cursor-pointer"
                )}
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 bg-white/5 transition-colors", feat.to && "group-hover:bg-white/10")}>
                  <feat.icon className={cn("w-4 h-4", feat.color)} />
                </div>
                <h4 className="text-xs font-semibold text-white mb-0.5 leading-tight">{feat.label}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{feat.desc}</p>
              </Wrapper>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
