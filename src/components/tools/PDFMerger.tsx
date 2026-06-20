import { useState, useRef } from 'react';
import { Upload, Download, X, Combine, AlertCircle, Trash2, MoveUp, MoveDown, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export default function PDFMerger() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mergedPdf, setMergedPdf] = useState<Blob | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) { setError('Please select valid PDF files'); return; }
    setError(null);
    const enriched: PDFFile[] = [];
    for (const file of pdfFiles) {
      try {
        const buf = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        enriched.push({ file, name: file.name, size: file.size, pageCount: pdf.getPageCount() });
      } catch {
        enriched.push({ file, name: file.name, size: file.size });
      }
    }
    setFiles(prev => [...prev, ...enriched]);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newFiles.length) return prev;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const mergedPdf = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedPdf(blob);
      setMergedSize(blob.size);
    } catch { setError('Failed to merge PDFs. Please try again.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;
    const url = URL.createObjectURL(mergedPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'merged.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setFiles([]); setMergedPdf(null); setMergedSize(null); setError(null); setProgress(0); };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Combine className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Merge PDF</h1>
        <p className="text-ink/60">Combine multiple PDFs into one document</p>
      </div>

      <p className="text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
        Stitch several PDF files into a single document while preserving the page order you choose. This eliminates the need for desktop software when consolidating invoices, reports, or multi-chapter contracts into one shareable file.
      </p>

      {files.length === 0 && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" multiple accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop PDF files here</p>
          <p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5 flex-shrink-0" /><span>{error}</span></div>}

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">PDF Files ({files.length})</h3>
            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-secondary hover:underline">+ Add more</button>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />

          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-slate-800 rounded-xl text-center"><div className="text-xl font-bold text-ink">{files.length}</div><div className="text-xs text-ink/60 uppercase">Files</div></div>
            <div className="p-3 bg-slate-800 rounded-xl text-center"><div className="text-xl font-bold text-ink">{totalPages || '—'}</div><div className="text-xs text-ink/60 uppercase">Pages</div></div>
            <div className="p-3 bg-slate-800 rounded-xl text-center"><div className="text-xl font-bold text-ink">{formatSize(totalSize)}</div><div className="text-xs text-ink/60 uppercase">Total Size</div></div>
          </div>

          <div className="space-y-3">
            {files.map((pdf, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-ink/40 font-bold w-8">{index + 1}</span>
                <FileText className="w-5 h-5 text-secondary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-ink truncate block">{pdf.name}</span>
                  <span className="text-ink/60 text-xs">{formatSize(pdf.size)}{pdf.pageCount ? ` • ${pdf.pageCount} pages` : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><MoveUp className="w-4 h-4" /></button>
                  <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30"><MoveDown className="w-4 h-4" /></button>
                  <button onClick={() => removeFile(index)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Merging...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {mergedPdf && mergedSize && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 font-bold text-sm">Merged: {formatSize(mergedSize)} ({totalPages} pages)</p>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={mergePDFs} disabled={isProcessing || files.length < 2} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Merging...' : <><Combine className="w-5 h-5" /> Merge PDFs</>}
            </button>
            {mergedPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
