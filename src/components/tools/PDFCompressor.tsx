import { useState, useRef } from 'react';
import { Upload, Download, X, Minimize2, AlertCircle, TrendingDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type QualityLevel = 'low' | 'medium' | 'high';

export default function PDFCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<QualityLevel>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null); setOriginalSize(file.size); setCompressedSize(0);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const compressPDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      let options: any = {};
      if (quality === 'low') { options.useObjectStreams = true; options.addDefaultPage = false; }
      else if (quality === 'medium') { options.useObjectStreams = false; }
      else { options.useObjectStreams = false; options.addDefaultPage = false; }

      const pdfBytes = await pdf.save(options);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResultPdf(blob);
      setCompressedSize(blob.size);
    } catch { setError('Failed to compress PDF.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'compressed.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setResultPdf(null); setError(null); setOriginalSize(0); setCompressedSize(0); };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const reduction = originalSize > 0 && compressedSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Minimize2 className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Compress PDF</h1>
        <p className="text-ink/60">Reduce PDF file size while maintaining readability</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p><p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFile && (
        <div className="space-y-8">
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
            <p className="text-ink/60 text-sm">Original size: {formatSize(originalSize)}</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Compression Level</h3>
            <div className="flex gap-3">
              {([
                { level: 'low' as QualityLevel, label: 'Low', desc: 'Maximum compression' },
                { level: 'medium' as QualityLevel, label: 'Medium', desc: 'Balanced' },
                { level: 'high' as QualityLevel, label: 'High', desc: 'Minimal changes' },
              ]).map(({ level, label, desc }) => (
                <button key={level} onClick={() => setQuality(level)} className={`flex-1 p-4 rounded-xl text-center transition-colors ${quality === level ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                  <div className="font-bold">{label}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {reduction && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-bold text-sm">Reduced by {reduction}%</p>
                <p className="text-ink/60 text-xs">{formatSize(originalSize)} → {formatSize(compressedSize)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={compressPDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Compressing...' : <><Minimize2 className="w-5 h-5" /> Compress PDF</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
