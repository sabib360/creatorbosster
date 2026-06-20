import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, X, Sparkles, AlertCircle } from 'lucide-react';

interface FilterPreset {
  name: string;
  filter: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { name: 'Original', filter: 'none' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Blur', filter: 'blur(3px)' },
  { name: 'Brightness Up', filter: 'brightness(1.5)' },
  { name: 'Brightness Down', filter: 'brightness(0.5)' },
  { name: 'High Contrast', filter: 'contrast(200%)' },
  { name: 'Low Contrast', filter: 'contrast(50%)' },
  { name: 'Saturate', filter: 'saturate(200%)' },
  { name: 'Desaturate', filter: 'saturate(0%)' },
  { name: 'Hue Rotate 90', filter: 'hue-rotate(90deg)' },
  { name: 'Hue Rotate 180', filter: 'hue-rotate(180deg)' },
  { name: 'Hue Rotate 270', filter: 'hue-rotate(270deg)' },
  { name: 'Invert', filter: 'invert(100%)' },
  { name: 'Vintage', filter: 'sepia(60%) contrast(110%) brightness(90%)' },
  { name: 'Cool Tone', filter: 'hue-rotate(180deg) saturate(120%)' },
  { name: 'Warm Tone', filter: 'sepia(30%) saturate(140%) brightness(105%)' },
  { name: 'Dramatic', filter: 'contrast(150%) brightness(85%) saturate(130%)' },
  { name: 'Fade', filter: 'contrast(80%) brightness(110%) saturate(70%)' },
  { name: 'Vivid', filter: 'saturate(180%) contrast(110%) brightness(105%)' },
  { name: 'Polaroid', filter: 'sepia(20%) contrast(120%) brightness(110%) saturate(120%)' },
  { name: 'Noir', filter: 'grayscale(100%) contrast(140%) brightness(90%)' },
];

export default function ImageFilterApplier() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPos, setComparisonPos] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const filteredUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (filteredUrlRef.current) URL.revokeObjectURL(filteredUrlRef.current);
    };
  }, []);

  const getCurrentFilter = useCallback(() => {
    const preset = FILTER_PRESETS[activeFilter];
    if (preset.filter !== 'none') return preset.filter;
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hueRotate}deg) sepia(${sepia}%) grayscale(${grayscale}%) invert(${invert}%)`;
  }, [activeFilter, brightness, contrast, saturation, blur, hueRotate, sepia, grayscale, invert]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (filteredUrlRef.current) URL.revokeObjectURL(filteredUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreview(url);
    setFilteredImage(null);
    filteredUrlRef.current = null;
    setActiveFilter(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHueRotate(0);
    setSepia(0);
    setGrayscale(0);
    setInvert(0);
    setShowComparison(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleApplyFilter = () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onerror = () => { setError('Failed to load image'); setIsProcessing(false); };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setIsProcessing(false); return; }
      ctx.filter = getCurrentFilter();
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          if (filteredUrlRef.current) URL.revokeObjectURL(filteredUrlRef.current);
          const url = URL.createObjectURL(blob);
          filteredUrlRef.current = url;
          setFilteredImage(url);
        }
        setIsProcessing(false);
      }, selectedFile.type);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!filteredImage) return;
    const a = document.createElement('a');
    a.href = filteredImage;
    a.download = `filtered_${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (filteredUrlRef.current) URL.revokeObjectURL(filteredUrlRef.current);
    setSelectedFile(null);
    setPreview(null);
    setFilteredImage(null);
    setError(null);
    previewUrlRef.current = null;
    filteredUrlRef.current = null;
  };

  const customFilter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) hue-rotate(${hueRotate}deg) sepia(${sepia}%) grayscale(${grayscale}%) invert(${invert}%)`;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image Filters
        </h1>
        <p className="text-ink/60">Apply 20+ filters and custom adjustments to your images</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-primary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your image here</p>
          <p className="text-ink/60">or click to browse</p>
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
          {/* Preview */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-700">
              {preview && (
                <div className="relative">
                  {showComparison && filteredImage ? (
                    <div className="relative" style={{ height: '400px' }}>
                      <img src={filteredImage} alt="Filtered" className="absolute inset-0 w-full h-full object-contain bg-slate-800" />
                      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparisonPos}% 0 0)` }}>
                        <img src={preview} alt="Original" className="w-full h-full object-contain bg-slate-800" />
                      </div>
                      <input type="range" min="0" max="100" value={comparisonPos} onChange={(e) => setComparisonPos(parseInt(e.target.value))} className="absolute bottom-4 left-0 right-0 w-full accent-primary z-10" />
                      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">Original</div>
                      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded font-bold">Filtered</div>
                    </div>
                  ) : (
                    <div style={{ filter: getCurrentFilter() }}>
                      <img src={preview} alt="Preview" className="w-full h-80 object-contain bg-slate-800" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {filteredImage && (
              <button onClick={() => setShowComparison(!showComparison)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors">
                {showComparison ? 'Hide Comparison' : 'Show Before/After'}
              </button>
            )}
          </div>

          {/* Filter Presets */}
          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Filter Presets</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {FILTER_PRESETS.map((preset, i) => (
                <button key={preset.name} onClick={() => { setActiveFilter(i); setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); setHueRotate(0); setSepia(0); setGrayscale(0); setInvert(0); }}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${activeFilter === i ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                  <div className="w-full aspect-square rounded-lg mb-1 bg-slate-600" style={{ filter: preset.filter }} />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Adjustments */}
          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Custom Adjustments</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Brightness', value: brightness, set: setBrightness, min: 0, max: 200 },
                { label: 'Contrast', value: contrast, set: setContrast, min: 0, max: 200 },
                { label: 'Saturation', value: saturation, set: setSaturation, min: 0, max: 200 },
                { label: 'Blur', value: blur, set: setBlur, min: 0, max: 20, step: 0.5 },
                { label: 'Hue Rotate', value: hueRotate, set: setHueRotate, min: 0, max: 360 },
                { label: 'Sepia', value: sepia, set: setSepia, min: 0, max: 100 },
                { label: 'Grayscale', value: grayscale, set: setGrayscale, min: 0, max: 100 },
                { label: 'Invert', value: invert, set: setInvert, min: 0, max: 100 },
              ].map(({ label, value, set, min, max, step }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-ink/60">{label}</label>
                    <span className="text-sm font-bold text-ink">{value}{label === 'Blur' ? 'px' : label === 'Hue Rotate' ? '°' : '%'}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step || 1} value={value} onChange={(e) => { set(parseFloat(e.target.value)); setActiveFilter(0); }} className="w-full accent-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={handleApplyFilter} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Sparkles className="w-5 h-5" /> Apply Filter</>}
            </button>
            {filteredImage && (
              <button onClick={handleDownload} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download
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
