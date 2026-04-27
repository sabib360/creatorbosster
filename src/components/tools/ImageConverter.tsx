import { useState, useRef } from 'react';
import { Upload, Download, X, RefreshCw, AlertCircle } from 'lucide-react';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatLabels: Record<OutputFormat, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setConvertedImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const convertImage = () => {
    if (!selectedFile || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setConvertedImage(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, outputFormat, quality);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const ext = outputFormat.split('/')[1];
    const a = document.createElement('a');
    a.href = convertedImage;
    a.download = `converted_${selectedFile?.name.split('.')[0] || 'image'}.${ext}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setConvertedImage(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <RefreshCw className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image Converter
        </h1>
        <p className="text-ink/60">Convert between JPG, PNG, WebP formats</p>
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original ({selectedFile.type.split('/')[1].toUpperCase()})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Original" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Converted ({formatLabels[outputFormat]})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {convertedImage ? (
                  <img src={convertedImage} alt="Converted" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Conversion Settings</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Output Format</label>
                <div className="flex gap-2">
                  {Object.entries(formatLabels).map(([format, label]) => (
                    <button key={format} onClick={() => setOutputFormat(format as OutputFormat)} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${outputFormat === format ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Quality: {Math.round(quality * 100)}%</label>
                <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={convertImage} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Converting...' : <><RefreshCw className="w-5 h-5" /> Convert</>}
            </button>
            {convertedImage && (
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