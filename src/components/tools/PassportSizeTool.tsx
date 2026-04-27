import { useState, useRef } from 'react';
import { Upload, Download, X, User, AlertCircle } from 'lucide-react';

export default function PassportSizeTool() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [passportImage, setPassportImage] = useState<string | null>(null);
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
    setPassportImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const createPassportPhoto = () => {
    if (!selectedFile || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Passport size: 35mm x 45mm (295 x 395 pixels at 254 DPI)
      const targetWidth = 295;
      const targetHeight = 395;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Center the image and fill the canvas
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const offsetX = (targetWidth - scaledWidth) / 2;
      const offsetY = (targetHeight - scaledHeight) / 2;
      
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          setPassportImage(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.9);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!passportImage) return;
    const a = document.createElement('a');
    a.href = passportImage;
    a.download = `passport_${selectedFile?.name || 'photo.jpg'}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPassportImage(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Passport Size Photo
        </h1>
        <p className="text-ink/60">Create passport-sized photos (35x45mm)</p>
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Passport Photo (35x45mm)</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {passportImage ? (
                  <img src={passportImage} alt="Passport" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <div className="text-center space-y-2">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Passport Photo Specifications</h3>
              <div className="text-ink/60 space-y-1">
                <p>• Size: 35mm x 45mm</p>
                <p>• Resolution: 295 x 395 pixels</p>
                <p>• Background: White</p>
                <p>• Format: JPEG</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={createPassportPhoto} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><User className="w-5 h-5" /> Create</>}
            </button>
            {passportImage && (
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