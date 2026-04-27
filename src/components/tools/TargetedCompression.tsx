import { useState, useRef } from 'react';
import { Upload, Download, X, Target, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function TargetedCompression() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [targetSize, setTargetSize] = useState<'50' | '100' | '200'>('50');
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
    setCompressedFile(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const targetSizeKB = parseInt(targetSize);
      const options = {
        maxSizeMB: targetSizeKB / 1024,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.6,
      };
      const compressedBlob = await imageCompression(selectedFile, options);
      setCompressedFile(compressedBlob);
    } catch (err) {
      setError('Failed to compress image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${targetSize}kb_${selectedFile?.name || 'image.jpg'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setCompressedFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Targeted Compression
        </h1>
        <p className="text-ink/60">Compress to specific file size (50KB, 100KB, 200KB)</p>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Size:</span>
                <span className="font-bold text-ink">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Compressed</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {compressedFile ? (
                  <img src={URL.createObjectURL(compressedFile)} alt="Compressed" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
              {compressedFile && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Size:</span>
                  <span className="font-bold text-primary">{formatFileSize(compressedFile.size)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Target Size</h3>
            <div className="flex gap-4">
              {['50', '100', '200'].map((size) => (
                <button key={size} onClick={() => setTargetSize(size as '50' | '100' | '200')} className={`flex-1 py-4 rounded-xl font-bold transition-colors ${targetSize === size ? 'bg-primary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                  {size} KB
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handleCompress} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Target className="w-5 h-5" /> Compress to {targetSize}KB</>}
            </button>
            {compressedFile && (
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