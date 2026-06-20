import { useState, useRef } from 'react';
import { Upload, Download, X, Trash2, AlertCircle, Check, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToRemove, setPagesToRemove] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null); setResultSize(null); setPagesToRemove(new Set());
    try { const buf = await file.arrayBuffer(); const pdf = await PDFDocument.load(buf); setPageCount(pdf.getPageCount()); } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const togglePage = (page: number) => {
    setPagesToRemove(prev => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page); else next.add(page);
      return next;
    });
    setResultPdf(null);
  };

  const removePages = async () => {
    if (!selectedFile || pagesToRemove.size === 0) return;
    setIsProcessing(true); setError(null);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const allPages = pdf.getPageIndices().filter(i => !pagesToRemove.has(i));
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, allPages);
      copiedPages.forEach(page => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResultPdf(blob);
      setResultSize(blob.size);
    } catch { setError('Failed to remove pages.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'removed_pages.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setPagesToRemove(new Set()); setResultPdf(null); setResultSize(null); setError(null); };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Remove Pages</h1>
        <p className="text-ink/60">Select and delete specific pages from your PDF</p>
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
            <p className="text-ink/60 text-sm">{formatSize(selectedFile.size)} • {pageCount} pages</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Select Pages to Remove ({pagesToRemove.size})</h3>
              <button onClick={() => { const s = new Set<number>(); for (let i = 1; i <= pageCount; i++) s.add(i); setPagesToRemove(s); setResultPdf(null); }} className="text-xs font-bold text-red-400 hover:underline">Remove All</button>
            </div>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => togglePage(page)} className={`relative p-3 rounded-xl text-sm font-bold transition-all ${pagesToRemove.has(page) ? 'bg-red-500/20 border-2 border-red-500 text-red-400' : 'bg-slate-800 border-2 border-transparent hover:border-slate-600 text-ink'}`}>
                  {page}
                  {pagesToRemove.has(page) && <Trash2 className="w-3 h-3 absolute top-1 right-1 text-red-400" />}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink/60">Click pages to toggle. Selected pages (highlighted red) will be removed. {pageCount - pagesToRemove.size} pages will remain.</p>
          </div>

          {resultPdf && resultSize && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-400 font-bold text-sm">Pages removed successfully!</p>
                <p className="text-ink/60 text-xs">{pageCount - pagesToRemove.size} pages remaining • {formatSize(resultSize)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={removePages} disabled={isProcessing || pagesToRemove.size === 0} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Trash2 className="w-5 h-5" /> Remove {pagesToRemove.size} Page{pagesToRemove.size !== 1 ? 's' : ''}</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
