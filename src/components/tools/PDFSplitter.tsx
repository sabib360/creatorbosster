import { useState, useRef } from 'react';
import { Upload, Download, X, Scissors, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFSplitter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [splitPdf, setSplitPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setSplitPdf(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const splitPDF = async () => {
    if (!selectedFile || !pageRange) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      
      const rangeParts = pageRange.split(',').flatMap(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(n => parseInt(n) - 1);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        return [parseInt(trimmed) - 1];
      });

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, rangeParts);
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setSplitPdf(blob);
    } catch (err) {
      setError('Failed to split PDF. Please check page range.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!splitPdf) return;
    const url = URL.createObjectURL(splitPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'split.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFile(null);
    setPageRange('');
    setSplitPdf(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Scissors className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Split PDF
        </h1>
        <p className="text-ink/60">Extract specific pages from your PDF</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p>
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
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
            <p className="text-ink/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Page Range</h3>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="e.g., 1, 3-5, 7"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-secondary"
            />
            <p className="text-sm text-ink/60">Enter page numbers separated by commas. Use hyphens for ranges (e.g., 1, 3-5, 7)</p>
          </div>

          <div className="flex gap-4">
            <button onClick={splitPDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Splitting...' : <><Scissors className="w-5 h-5" /> Split PDF</>}
            </button>
            {splitPdf && (
              <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
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