import { useState, useRef } from 'react';
import { Upload, Download, X, Trash2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pagesToRemove, setPagesToRemove] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResultPdf(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removePages = async () => {
    if (!selectedFile || !pagesToRemove) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageIndices = pagesToRemove.split(',').map(p => parseInt(p.trim()) - 1);
      
      const newPdf = await PDFDocument.create();
      const allPages = pdf.getPageIndices().filter(i => !pageIndices.includes(i));
      const copiedPages = await newPdf.copyPages(pdf, allPages);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResultPdf(blob);
    } catch (err) {
      setError('Failed to remove pages. Please check page numbers.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'removed_pages.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFile(null);
    setPagesToRemove('');
    setResultPdf(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Trash2 className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Remove Pages</h1>
        <p className="text-ink/60">Delete specific pages from your PDF</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p>
          <p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFile && (
        <div className="space-y-8">
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Pages to Remove</h3>
            <input type="text" value={pagesToRemove} onChange={(e) => setPagesToRemove(e.target.value)} placeholder="e.g., 2, 4, 6" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" />
            <p className="text-sm text-ink/60">Enter page numbers separated by commas</p>
          </div>

          <div className="flex gap-4">
            <button onClick={removePages} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Trash2 className="w-5 h-5" /> Remove Pages</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}