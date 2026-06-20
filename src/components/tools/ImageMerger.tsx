import { useState, useRef } from 'react';
import { Upload, Download, X, Plus, AlertCircle, Images } from 'lucide-react';

interface ImageFile {
  file: File;
  url: string;
  name: string;
}

export default function ImageMerger() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [layout, setLayout] = useState<'horizontal' | 'vertical' | 'grid'>('horizontal');
  const [spacing, setSpacing] = useState(0);
  const [bgColor, setBgColor] = useState('#000000');
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergedUrlRef = useRef<string | null>(null);

  const handleFilesSelect = (files: FileList) => {
    setError(null);
    const newImages: ImageFile[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push({ file, url: URL.createObjectURL(file), name: file.name });
      }
    });
    if (newImages.length === 0) {
      setError('Please select valid image files');
      return;
    }
    setImages(prev => [...prev, ...newImages]);
    if (mergedUrlRef.current) { URL.revokeObjectURL(mergedUrlRef.current); setMergedImage(null); mergedUrlRef.current = null; }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFilesSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].url);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (mergedUrlRef.current) { URL.revokeObjectURL(mergedUrlRef.current); setMergedImage(null); mergedUrlRef.current = null; }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    setImages(newImages);
  };

  const mergeImages = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const loadedImages = await Promise.all(
        images.map(({ url }) => new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = url;
        }))
      );

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { setIsProcessing(false); return; }

      if (layout === 'horizontal') {
        const totalWidth = loadedImages.reduce((sum, img) => sum + img.width, 0) + (loadedImages.length - 1) * spacing;
        const maxHeight = Math.max(...loadedImages.map(img => img.height));
        canvas.width = totalWidth;
        canvas.height = maxHeight;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let x = 0;
        loadedImages.forEach(img => {
          ctx.drawImage(img, x, (maxHeight - img.height) / 2);
          x += img.width + spacing;
        });
      } else if (layout === 'vertical') {
        const maxWidth = Math.max(...loadedImages.map(img => img.width));
        const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0) + (loadedImages.length - 1) * spacing;
        canvas.width = maxWidth;
        canvas.height = totalHeight;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let y = 0;
        loadedImages.forEach(img => {
          ctx.drawImage(img, (maxWidth - img.width) / 2, y);
          y += img.height + spacing;
        });
      } else {
        const cols = Math.ceil(Math.sqrt(loadedImages.length));
        const rows = Math.ceil(loadedImages.length / cols);
        const maxImgWidth = Math.max(...loadedImages.map(img => img.width));
        const maxImgHeight = Math.max(...loadedImages.map(img => img.height));
        canvas.width = cols * maxImgWidth + (cols - 1) * spacing;
        canvas.height = rows * maxImgHeight + (rows - 1) * spacing;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        loadedImages.forEach((img, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          ctx.drawImage(img, col * (maxImgWidth + spacing), row * (maxImgHeight + spacing));
        });
      }

      canvas.toBlob((blob) => {
        if (blob) {
          if (mergedUrlRef.current) URL.revokeObjectURL(mergedUrlRef.current);
          const url = URL.createObjectURL(blob);
          mergedUrlRef.current = url;
          setMergedImage(url);
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch {
      setError('Failed to merge images');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedImage) return;
    const a = document.createElement('a');
    a.href = mergedImage;
    a.download = `merged_${Date.now()}.png`;
    a.click();
  };

  const reset = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    if (mergedUrlRef.current) URL.revokeObjectURL(mergedUrlRef.current);
    setImages([]);
    setMergedImage(null);
    setError(null);
    mergedUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Images className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image Merger / Collage
        </h1>
        <p className="text-ink/60">Combine multiple images into a single image</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => e.target.files && handleFilesSelect(e.target.files)} className="hidden" />
        <Plus className="w-10 h-10 text-ink/40 mx-auto mb-3 group-hover:text-primary transition-colors" />
        <p className="text-lg font-bold text-ink mb-1">Drop images here</p>
        <p className="text-ink/60 text-sm">or click to browse ({images.length} selected)</p>
      </div>

      {images.length > 0 && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Selected Images ({images.length})</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-700">
                  <img src={img.url} alt={img.name} className="w-full aspect-square object-cover bg-slate-800" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <div className="flex gap-1">
                      <button onClick={() => moveImage(i, 'up')} className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30">Up</button>
                      <button onClick={() => moveImage(i, 'down')} className="p-1 bg-white/20 rounded text-white text-xs hover:bg-white/30">Down</button>
                    </div>
                    <button onClick={() => removeImage(i)} className="p-1 bg-red-500/40 rounded text-white text-xs hover:bg-red-500/60">Remove</button>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{i + 1}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Merge Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Layout</label>
                <div className="flex gap-2">
                  {(['horizontal', 'vertical', 'grid'] as const).map(l => (
                    <button key={l} onClick={() => setLayout(l)} className={`flex-1 py-3 rounded-xl font-bold transition-colors capitalize ${layout === l ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-ink/60">Spacing: {spacing}px</label>
                  <input type="range" min="0" max="50" value={spacing} onChange={(e) => setSpacing(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink/60">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer" />
                    <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink font-mono text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={mergeImages} disabled={isProcessing || images.length === 0} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Merging...' : <><Images className="w-5 h-5" /> Merge Images</>}
            </button>
            {mergedImage && (
              <button onClick={handleDownload} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download
              </button>
            )}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {mergedImage && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Merged Result</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                <img src={mergedImage} alt="Merged" className="w-full max-h-96 object-contain bg-slate-800" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
