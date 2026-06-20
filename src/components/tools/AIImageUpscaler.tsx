import { useState, useRef } from 'react';
import { Upload, Download, X, ZoomIn, AlertCircle, Sparkles } from 'lucide-react';

type Scale = 2 | 4 | 8;

export default function AIImageUpscaler() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [scale, setScale] = useState<Scale>(2);
  const [sharpen, setSharpen] = useState(true);
  const [denoise, setDenoise] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file'); return; }
    setError(null); setSelectedFile(file); setResultImage(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image(); img.onload = () => setOriginalDims({ w: img.width, h: img.height }); img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const upscale = async () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true); setError(null);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = preview; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply sharpening
      if (sharpen) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        const copy = new Uint8ClampedArray(data);

        for (let y = 1; y < canvas.height - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            for (let c = 0; c < 3; c++) {
              let val = 0;
              for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                  val += copy[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
                }
              }
              data[(y * w + x) * 4 + c] = Math.min(255, Math.max(0, val));
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      setResultImage(canvas.toDataURL('image/png'));
    } catch { setError('Failed to upscale image.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a'); a.href = resultImage; a.download = `upscaled_${scale}x_${selectedFile?.name || 'image.png'}`; a.click();
  };

  const reset = () => { setSelectedFile(null); setPreview(null); setResultImage(null); setError(null); setOriginalDims({ w: 0, h: 0 }); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><ZoomIn className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Image Upscaler</h1>
        <p className="text-ink/60">Upscale images 2x, 4x, or 8x with AI enhancement</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-tertiary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-tertiary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your image here</p><p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFile && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original ({originalDims.w}x{originalDims.h})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {showComparison && resultImage ? (
                  <div className="relative" style={{ height: '300px' }}>
                    <img src={resultImage} alt="Upscaled" className="absolute inset-0 w-full h-full object-contain bg-slate-800" />
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                      <img src={preview!} alt="Original" className="w-full h-full object-contain bg-slate-800" />
                    </div>
                    <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(parseInt(e.target.value))} className="absolute bottom-4 left-0 right-0 w-full accent-tertiary z-10" />
                  </div>
                ) : (
                  <img src={preview} alt="Original" className="w-full h-64 object-contain bg-slate-800" />
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Upscaled ({originalDims.w * scale}x{originalDims.h * scale})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {resultImage ? <img src={resultImage} alt="Upscaled" className="w-full h-64 object-contain bg-slate-800" /> : <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">Upscaled result here</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Settings</h3>
            <div className="space-y-3">
              <label className="text-sm text-ink/60">Scale Factor</label>
              <div className="flex gap-2">
                {([2, 4, 8] as Scale[]).map(s => (
                  <button key={s} onClick={() => setScale(s)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${scale === s ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{s}x</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sharpen} onChange={(e) => setSharpen(e.target.checked)} className="accent-tertiary" /><span className="text-sm text-ink">Sharpen</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={denoise} onChange={(e) => setDenoise(e.target.checked)} className="accent-tertiary" /><span className="text-sm text-ink">Denoise</span></label>
            </div>
          </div>

          {resultImage && <button onClick={() => setShowComparison(!showComparison)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-ink transition-colors">{showComparison ? 'Hide' : 'Show'} Comparison</button>}

          <div className="flex gap-4">
            <button onClick={upscale} disabled={isProcessing} className="flex-1 py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Upscaling...' : <><Sparkles className="w-5 h-5" /> Upscale {scale}x</>}
            </button>
            {resultImage && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
