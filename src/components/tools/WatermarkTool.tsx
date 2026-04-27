import { useState, useRef } from 'react';
import { Upload, Download, X, Stamp, AlertCircle } from 'lucide-react';

export default function WatermarkTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('© CreatorBoost');
  const [fontSize, setFontSize] = useState(30);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState('center');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setWatermarkedImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const addWatermark = () => {
    if (!selectedFile || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx?.drawImage(img, 0, 0);
      
      ctx!.font = `bold ${fontSize}px Arial`;
      ctx!.globalAlpha = opacity;
      ctx!.fillStyle = 'white';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      
      let x, y;
      const metrics = ctx!.measureText(watermarkText);
      const textWidth = metrics.width;
      
      switch (position) {
        case 'top-left':
          x = textWidth / 2 + 20;
          y = fontSize + 20;
          break;
        case 'top-right':
          x = canvas.width - textWidth / 2 - 20;
          y = fontSize + 20;
          break;
        case 'bottom-left':
          x = textWidth / 2 + 20;
          y = canvas.height - fontSize - 20;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth / 2 - 20;
          y = canvas.height - fontSize - 20;
          break;
        case 'center':
        default:
          x = canvas.width / 2;
          y = canvas.height / 2;
          break;
      }
      
      ctx!.fillText(watermarkText, x, y);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setWatermarkedImage(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, selectedFile.type);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!watermarkedImage) return;
    const a = document.createElement('a');
    a.href = watermarkedImage;
    a.download = `watermarked_${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setWatermarkedImage(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Stamp className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Add Watermark
        </h1>
        <p className="text-ink/60">Add text watermarks to protect your images</p>
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Original" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Watermarked</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {watermarkedImage ? (
                  <img src={watermarkedImage} alt="Watermarked" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Watermark Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Watermark Text</label>
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-ink/60">Font Size: {fontSize}px</label>
                  <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-ink/60">Opacity: {Math.round(opacity * 100)}%</label>
                  <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-ink/60">Position</label>
                <div className="flex flex-wrap gap-2">
                  {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map(pos => (
                    <button key={pos} onClick={() => setPosition(pos)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${position === pos ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                      {pos.replace('-', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={addWatermark} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Stamp className="w-5 h-5" /> Add Watermark</>}
            </button>
            {watermarkedImage && (
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