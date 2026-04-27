import { useState, useRef } from 'react';
import { Upload, Download, X, Package, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';

export default function BulkCompressor() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<{ name: string; blob: Blob }[]>([]);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }
    setError(null);
    setSelectedFiles(imageFiles);
    setPreviews(imageFiles.map(f => URL.createObjectURL(f)));
    setCompressedFiles([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleCompress = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    const results: { name: string; blob: Blob }[] = [];

    try {
      for (const file of selectedFiles) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, quality };
        const compressedBlob = await imageCompression(file, options);
        results.push({ name: file.name, blob: compressedBlob });
      }
      setCompressedFiles(results);
    } catch (err) {
      setError('Failed to compress images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (compressedFiles.length === 0) return;
    const zip = new JSZip();
    compressedFiles.forEach(({ name, blob }) => {
      zip.file(`compressed_${name}`, blob);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCompressedFiles([]);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Bulk Compressor
        </h1>
        <p className="text-ink/60">Compress multiple images at once and download as ZIP</p>
      </div>

      {selectedFiles.length === 0 && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-primary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop multiple images here</p>
          <p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Selected Images ({selectedFiles.length})</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden border border-slate-700">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover bg-slate-800" />
                <p className="text-xs text-ink/60 p-2 truncate">{selectedFiles[index].name}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="font-bold text-ink uppercase tracking-widest text-sm">Quality: {Math.round(quality * 100)}%</label>
              <span className="text-ink/60">{Math.round(quality * 100)}%</span>
            </div>
            <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-primary" />
          </div>

          <div className="flex gap-4">
            <button onClick={handleCompress} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Package className="w-5 h-5" /> Compress All</>}
            </button>
            {compressedFiles.length > 0 && (
              <button onClick={handleDownloadAll} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download ZIP
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