import { useState, useRef } from 'react';
import { Upload, Download, X, Crop, AlertCircle } from 'lucide-react';

export default function ImageCropper() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setCroppedImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleCrop = () => {
    if (!selectedFile || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const cropX = (cropArea.x / 100) * img.width;
      const cropY = (cropArea.y / 100) * img.height;
      const cropW = (cropArea.width / 100) * img.width;
      const cropH = (cropArea.height / 100) * img.height;
      
      canvas.width = cropW;
      canvas.height = cropH;
      
      ctx?.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedImage(url);
        }
        setIsProcessing(false);
      }, selectedFile.type);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!croppedImage) return;
    const a = document.createElement('a');
    a.href = croppedImage;
    a.download = `cropped_${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setCroppedImage(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Crop className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Crop Image
        </h1>
        <p className="text-ink/60">Trim and crop images with interactive controls</p>
      </div>

      {!selectedFile && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Cropped</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {croppedImage ? (
                  <img src={croppedImage} alt="Cropped" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Crop Area</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">X Position (%)</label>
                <input type="number" value={cropArea.x} onChange={(e) => setCropArea({...cropArea, x: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Y Position (%)</label>
                <input type="number" value={cropArea.y} onChange={(e) => setCropArea({...cropArea, y: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Width (%)</label>
                <input type="number" value={cropArea.width} onChange={(e) => setCropArea({...cropArea, width: parseInt(e.target.value) || 50})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" min="10" max="100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Height (%)</label>
                <input type="number" value={cropArea.height} onChange={(e) => setCropArea({...cropArea, height: parseInt(e.target.value) || 50})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" min="10" max="100" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleCrop} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Crop className="w-5 h-5" /> Crop</>}
            </button>
            {croppedImage && (
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