import { useState, useRef } from 'react';
import { Upload, Download, Sparkles, Trash2, AlertCircle, CheckCircle2, Palette, Type, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import {
  trackThumbnailGenerated,
  trackThumbnailDownloaded,
  trackThumbnailEdited,
} from '../../lib/analytics';

interface DesignTemplate {
  id: string;
  name: string;
  bg: string;
  textColor: string;
  accentColor: string;
}

const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#ffd700',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    accentColor: '#00d4ff',
  },
  {
    id: 'dark',
    name: 'Dark',
    bg: '#1a1a2e',
    textColor: '#eaeaea',
    accentColor: '#00ff88',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
    textColor: '#ffffff',
    accentColor: '#4d96ff',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: 'linear-gradient(135deg, #0066cc 0%, #00ccff 100%)',
    textColor: '#ffffff',
    accentColor: '#ffff00',
  },
  {
    id: 'neon',
    name: 'Neon',
    bg: '#000000',
    textColor: '#00ff00',
    accentColor: '#ff00ff',
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

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setBackgroundImage(e.target?.result as string);
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
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const newThumbnail: Thumbnail = {
        id: Date.now().toString(),
        title,
        description,
        template: selectedTemplate,
        created: Date.now(),
      };

      setThumbnails([newThumbnail, ...thumbnails]);
      setSuccess('Thumbnail generated successfully!');

      await trackThumbnailGenerated({
        textContent: title,
        designStyle: selectedTemplate.name,
        dimensions: `${canvas.width}x${canvas.height}`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to generate thumbnail. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadThumbnail = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail_${Date.now()}.png`;
      a.click();

      setSuccess('Thumbnail downloaded!');
      await trackThumbnailDownloaded({
        format: 'PNG',
        thumbnailSize: `${canvas.width}x${canvas.height}`,
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to download thumbnail');
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('Your Title Here');
    setDescription('Add your description');
    setSelectedTemplate(DESIGN_TEMPLATES[0]);
    setBackgroundImage(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter text-ink mb-2">
            Thumbnail Generator
          </h1>
          <p className="text-ink/60 text-lg">Create stunning YouTube thumbnails with AI assistance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div
              ref={canvasRef}
              className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700"
              style={{
                background: backgroundImage
                  ? `url(${backgroundImage})`
                  : selectedTemplate.bg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/30 backdrop-blur-sm">
                <h2
                  className="text-center font-bold mb-4 drop-shadow-lg"
                  style={{
                    color: selectedTemplate.textColor,
                    fontSize: `${fontSize}px`,
                    fontWeight: 'bold',
                    textShadow: '0 4px 6px rgba(0,0,0,0.5)',
                  }}
                >
                  {title}
                </h2>
                <p
                  className="text-center drop-shadow-lg"
                  style={{
                    color: selectedTemplate.accentColor,
                    fontSize: `${descFontSize}px`,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateThumbnail}
                disabled={isGenerating}
                className="flex-1 py-3 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadThumbnail}
                className="flex-1 py-3 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="py-3 px-6 bg-slate-700 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
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
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text Inputs */}
            <div className="bg-slate-800/50 rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-2">Main Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:border-primary/50"
                  maxLength={60}
                />
                <div className="text-xs text-ink/40 mt-1">{title.length}/60</div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink/80 mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:border-primary/50"
                  maxLength={40}
                />
                <div className="text-xs text-ink/40 mt-1">{description.length}/40</div>
              </div>

              {/* Font Sizes */}
              <div>
                <label className="block text-sm font-bold text-ink/80 mb-2">
                  <Type className="w-4 h-4 inline mr-2" />
                  Title Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink/80 mb-2">Description Font Size: {descFontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={descFontSize}
                  onChange={(e) => setDescFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Design Templates */}
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Design Templates
              </h3>
              <div className="space-y-2">
                {DESIGN_TEMPLATES.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplateChange(template)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                      selectedTemplate.id === template.id
                        ? 'bg-primary text-black ring-2 ring-primary/50'
                        : 'bg-slate-700 text-ink hover:bg-slate-600'
                    }`}
                  >
                    {template.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Background Upload */}
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Background Image
              </h3>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-ink/60" />
                <p className="text-sm text-ink/60">Drag & drop or click to upload</p>
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
                <button
                  onClick={() => setBackgroundImage(null)}
                  className="w-full mt-2 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  Remove Background
                </button>
              )}
            </div>

            {/* History */}
            {thumbnails.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <h3 className="font-bold text-ink mb-4">Recent Thumbnails ({thumbnails.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {thumbnails.map((thumb) => (
                    <div key={thumb.id} className="p-3 bg-slate-700/50 rounded-lg text-sm">
                      <p className="font-semibold text-ink truncate">{thumb.title}</p>
                      <p className="text-ink/60 text-xs">{thumb.template.name} • {new Date(thumb.created).toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
