import { useState, useRef } from 'react';
import { Upload, Download, X, RotateCw, RotateCcw, FlipHorizontal2, FlipVertical2, AlertCircle } from 'lucide-react';

export default function ImageRotator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
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
    setRotatedImage(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleTransform = () => {
    if (!selectedFile || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const radians = (rotation * Math.PI) / 180;
      
      if (rotation % 180 !== 0) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      ctx?.translate(canvas.width / 2, canvas.height / 2);
      ctx?.rotate(radians);
      ctx?.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setRotatedImage(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, selectedFile.type);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!rotatedImage) return;
    const a = document.createElement('a');
    a.href = rotatedImage;
    a.download = `transformed_${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setRotatedImage(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <RotateCw className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Rotate / Flip Image
        </h1>
        <p className="text-ink/60">Adjust image orientation - rotate and flip</p>
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Transformed</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {rotatedImage ? (
                  <img src={rotatedImage} alt="Transformed" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Transform Controls</h3>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setRotation(r => r - 90)} className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                <RotateCcw className="w-5 h-5" /> -90°
              </button>
              <button onClick={() => setRotation(r => r + 90)} className="flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                +90° <RotateCw className="w-5 h-5" />
              </button>
              <button onClick={() => setFlipH(f => !f)} className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${flipH ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <FlipHorizontal2 className="w-5 h-5" /> Flip H
              </button>
              <button onClick={() => setFlipV(f => !f)} className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${flipV ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <FlipVertical2 className="w-5 h-5" /> Flip V
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-ink/60">Current rotation: {rotation}°</span>
              {flipH && <span className="text-sm text-primary">Flipped Horizontally</span>}
              {flipV && <span className="text-sm text-primary">Flipped Vertically</span>}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleTransform} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><RotateCw className="w-5 h-5" /> Apply</>}
            </button>
            {rotatedImage && (
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