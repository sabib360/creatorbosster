import { useState, useRef } from 'react';
import { Upload, Download, X, Globe, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

interface FaviconSize {
  size: number;
  label: string;
  format: string;
  required: boolean;
}

const FAVICON_SIZES: FaviconSize[] = [
  { size: 16, label: '16x16', format: 'png', required: true },
  { size: 32, label: '32x32', format: 'png', required: true },
  { size: 48, label: '48x48', format: 'png', required: true },
  { size: 64, label: '64x64', format: 'png', required: false },
  { size: 96, label: '96x96', format: 'png', required: false },
  { size: 128, label: '128x128', format: 'png', required: false },
  { size: 180, label: '180x180 (Apple Touch)', format: 'png', required: true },
  { size: 192, label: '192x192 (Android)', format: 'png', required: true },
  { size: 256, label: '256x256', format: 'png', required: false },
  { size: 512, label: '512x512 (PWA)', format: 'png', required: false },
];

export default function FaviconGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [generatedSizes, setGeneratedSizes] = useState<Map<number, string>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Set<number>>(new Set(FAVICON_SIZES.filter(s => s.required).map(s => s.size)));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreview(url);
    setGeneratedSizes(new Map());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => {
      const next = new Set(prev);
      if (next.has(size)) next.delete(size);
      else next.add(size);
      return next;
    });
  };

  const generateFavicons = async () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = preview;
      });

      const newSizes = new Map<number, string>();
      const sizesToGenerate = FAVICON_SIZES.filter(s => selectedSizes.has(s.size));

      for (let i = 0; i < sizesToGenerate.length; i++) {
        const { size } = sizesToGenerate[i];
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size, size);
          const dataUrl = canvas.toDataURL('image/png');
          newSizes.set(size, dataUrl);
        }
        setProgress(Math.round(((i + 1) / sizesToGenerate.length) * 100));
      }

      setGeneratedSizes(newSizes);
    } catch {
      setError('Failed to generate favicons');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (generatedSizes.size === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      generatedSizes.forEach((dataUrl, size) => {
        const base64 = dataUrl.split(',')[1];
        zip.file(`favicon-${size}x${size}.png`, base64, { base64: true });
      });

      if (generatedSizes.has(32)) {
        zip.file('favicon.ico', generatedSizes.get(32)!.split(',')[1], { base64: true });
      }

      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <!-- Favicon Links -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  ${generatedSizes.has(180) ? '<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">' : ''}
  ${generatedSizes.has(192) ? '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">' : ''}
  ${generatedSizes.has(512) ? '<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">' : ''}
  <meta name="theme-color" content="#ffffff">
</head>
<body>
  <h1>Favicon Preview</h1>
</body>
</html>`;
      zip.file('favicon-links.html', htmlContent);

      const manifestContent = JSON.stringify({
        name: 'Your App',
        short_name: 'App',
        icons: Array.from(generatedSizes.keys()).map(size => ({
          src: `/favicon-${size}x${size}.png`,
          sizes: `${size}x${size}`,
          type: 'image/png',
        })),
      }, null, 2);
      zip.file('manifest.json', manifestContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicons.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to create ZIP file');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    generatedSizes.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    setSelectedFile(null);
    setPreview(null);
    setGeneratedSizes(new Map());
    setError(null);
    setProgress(0);
    previewUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Favicon Generator
        </h1>
        <p className="text-ink/60">Generate favicons in multiple sizes from any image</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-primary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your image here</p>
          <p className="text-ink/60">or click to browse (recommended: 512x512 or larger)</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Source Image</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Source" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
              <div className="text-sm text-ink/60">
                {selectedFile.name} • {formatFileSize(selectedFile.size)}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Website Preview</h3>
              <div className="rounded-xl border border-slate-700 bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 bg-slate-200 rounded-sm" />
                  <div className="flex-1 bg-slate-100 rounded-full h-6 flex items-center px-3">
                    <span className="text-xs text-slate-400">https://yoursite.com</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {generatedSizes.has(16) && <img src={generatedSizes.get(16)} alt="16" className="w-4 h-4" />}
                {generatedSizes.has(32) && <img src={generatedSizes.get(32)} alt="32" className="w-8 h-8" />}
                {generatedSizes.has(48) && <img src={generatedSizes.get(48)} alt="48" className="w-12 h-12" />}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Select Sizes to Generate</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {FAVICON_SIZES.map(s => (
                <button key={s.size} onClick={() => toggleSize(s.size)} className={`p-3 rounded-xl text-sm font-bold transition-colors text-left ${selectedSizes.has(s.size) ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                  <div>{s.label}</div>
                  {s.required && <div className="text-[9px] opacity-60 mt-0.5">Required</div>}
                </button>
              ))}
            </div>
          </div>

          {isProcessing && generatedSizes.size === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Generating...</span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {generatedSizes.size > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Generated Favicons</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {Array.from(generatedSizes.entries()).map(([size, dataUrl]) => (
                  <div key={size} className="p-3 bg-slate-800 rounded-xl text-center space-y-2">
                    <div className="flex items-center justify-center h-12">
                      <img src={dataUrl} alt={`${size}x${size}`} style={{ width: Math.min(size, 48), height: Math.min(size, 48) }} className="border border-slate-700 rounded" />
                    </div>
                    <div className="text-xs font-bold text-ink">{size}x{size}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={generateFavicons} disabled={isProcessing || selectedSizes.size === 0} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Generating...' : <><Globe className="w-5 h-5" /> Generate Favicons</>}
            </button>
            {generatedSizes.size > 0 && (
              <button onClick={downloadAll} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download All (ZIP)
              </button>
            )}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
