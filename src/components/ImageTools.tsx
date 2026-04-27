import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Minimize2, Maximize, Crop, RotateCw, User, Stamp, RefreshCw, Package, Target, Sparkles } from 'lucide-react';

const tools = [
  { name: 'Compress Image', path: '/tools/image-compressor', description: 'Reduce image file size while maintaining quality', icon: Minimize2 },
  { name: 'Resize Image', path: '/tools/image-resizer', description: 'Change image dimensions with custom or preset sizes', icon: Maximize },
  { name: 'Crop Image', path: '/tools/image-cropper', description: 'Trim and crop images with interactive controls', icon: Crop },
  { name: 'Rotate/Flip', path: '/tools/image-rotator', description: 'Adjust image orientation - rotate and flip', icon: RotateCw },
  { name: 'Passport Size', path: '/tools/passport-size', description: 'Create passport-sized photos (35x45mm)', icon: User },
  { name: 'Add Watermark', path: '/tools/watermark', description: 'Add text watermarks to protect your images', icon: Stamp },
  { name: 'Image Converter', path: '/tools/image-converter', description: 'Convert between JPG, PNG, WebP, HEIC formats', icon: RefreshCw },
  { name: 'Bulk Compressor', path: '/tools/bulk-compressor', description: 'Compress multiple images at once', icon: Package },
  { name: 'Targeted Compression', path: '/tools/targeted-compression', description: 'Compress to specific file size (50KB, 100KB)', icon: Target },
  { name: 'Thumbnail Generator', path: '/tools/thumbnail-generator', description: 'Create stunning YouTube thumbnails with templates', icon: Sparkles },
];

export default function ImageTools() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Image Tools
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Compress, resize, crop, convert, and enhance your images - all in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={tool.path}
              className="group block p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ink group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-ink/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-ink/60 mt-2">{tool.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}