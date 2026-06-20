import { useState, useRef } from 'react';
import { Upload, Download, X, Eraser, AlertCircle, Palette } from 'lucide-react';

export default function AIBackgroundRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgMode, setBgMode] = useState<'transparent' | 'color' | 'original'>('transparent');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file'); return; }
    setError(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreview(url);
    setResultImage(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const removeBackground = async () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true); setError(null);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = preview; });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corner colors for background detection
      const corners = [
        [data[0], data[1], data[2]],
        [data[(canvas.width - 1) * 4], data[(canvas.width - 1) * 4 + 1], data[(canvas.width - 1) * 4 + 2]],
        [data[(canvas.height - 1) * canvas.width * 4], data[(canvas.height - 1) * canvas.width * 4 + 1], data[(canvas.height - 1) * canvas.width * 4 + 2]],
        [data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4], data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 1], data[((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 + 2]],
      ];
      const avgR = corners.reduce((s, c) => s + c[0], 0) / 4;
      const avgG = corners.reduce((s, c) => s + c[1], 0) / 4;
      const avgB = corners.reduce((s, c) => s + c[2], 0) / 4;

      const threshold = 60;
      for (let i = 0; i < data.length; i += 4) {
        const diff = Math.abs(data[i] - avgR) + Math.abs(data[i + 1] - avgG) + Math.abs(data[i + 2] - avgB);
        if (diff < threshold * 3) {
          data[i + 3] = 0; // Make transparent
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Fill background with selected color if not transparent
      if (bgMode === 'color') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.fillStyle = bgColor;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        setResultImage(tempCanvas.toDataURL('image/png'));
      } else {
        setResultImage(canvas.toDataURL('image/png'));
      }
    } catch { setError('Failed to process image.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a'); a.href = resultImage; a.download = `bg_removed_${selectedFile?.name || 'image.png'}`; a.click();
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setSelectedFile(null); setPreview(null); setResultImage(null); setError(null); previewUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Eraser className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">AI Background Remover</h1>
        <p className="text-ink/60">Remove backgrounds and replace with solid colors or transparency</p>
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {showComparison && resultImage ? (
                  <div className="relative" style={{ height: '300px' }}>
                    <img src={resultImage} alt="Result" className="absolute inset-0 w-full h-full object-contain bg-slate-800" />
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Result</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700" style={{ backgroundImage: 'repeating-conic-gradient(#374151 0% 25%, #1f2937 0% 50%)', backgroundSize: '20px 20px' }}>
                {resultImage ? <img src={resultImage} alt="Result" className="w-full h-64 object-contain" /> : <div className="w-full h-64 flex items-center justify-center text-ink/40">Result will appear here</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Background Options</h3>
            <div className="flex gap-2">
              {([['transparent', 'Transparent'], ['color', 'Solid Color'], ['original', 'Keep Original']] as const).map(([mode, label]) => (
                <button key={mode} onClick={() => setBgMode(mode)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${bgMode === mode ? 'bg-tertiary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{label}</button>
              ))}
            </div>
            {bgMode === 'color' && (
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-700 cursor-pointer" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink font-mono text-sm" />
              </div>
            )}
            {resultImage && (
              <button onClick={() => setShowComparison(!showComparison)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-bold text-ink transition-colors">{showComparison ? 'Hide' : 'Show'} Comparison</button>
            )}
          </div>

          <div className="flex gap-4">
            <button onClick={removeBackground} disabled={isProcessing} className="flex-1 py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Eraser className="w-5 h-5" /> Remove Background</>}
            </button>
            {resultImage && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
