import { useState, useRef } from 'react';
import { Upload, Download, X, Scissors, AlertCircle, FileText, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function PDFSplitter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<'range' | 'individual'>('range');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const [individualPdfs, setIndividualPdfs] = useState<{ name: string; blob: Blob }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null); setIndividualPdfs([]);
    try { const buf = await file.arrayBuffer(); const pdf = await PDFDocument.load(buf); setPageCount(pdf.getPageCount()); } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const splitByRange = async () => {
    if (!selectedFile || !pageRange) return;
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const rangeParts = pageRange.split(',').flatMap(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) { const [start, end] = trimmed.split('-').map(n => parseInt(n) - 1); return Array.from({ length: end - start + 1 }, (_, i) => start + i); }
        return [parseInt(trimmed) - 1];
      });
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, rangeParts);
      copiedPages.forEach(page => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();
      setResultPdf(new Blob([pdfBytes], { type: 'application/pdf' }));
    } catch { setError('Failed to split PDF. Please check page range.'); } finally { setIsProcessing(false); }
  };

  const splitIntoIndividual = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null); setProgress(0); setIndividualPdfs([]);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageIndices();
      const results: { name: string; blob: Blob }[] = [];
      for (let i = 0; i < pages.length; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [pages[i]]);
        newPdf.addPage(copiedPage);
        const bytes = await newPdf.save();
        results.push({ name: `page_${i + 1}.pdf`, blob: new Blob([bytes], { type: 'application/pdf' }) });
        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }
      setIndividualPdfs(results);
    } catch { setError('Failed to split PDF into individual pages.'); } finally { setIsProcessing(false); }
  };

  const downloadAll = async () => {
    if (individualPdfs.length === 0) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      individualPdfs.forEach(p => zip.file(p.name, p.blob));
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'split_pages.zip'; a.click(); URL.revokeObjectURL(url);
    } catch { setError('Failed to create ZIP file.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'split.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setPageRange(''); setResultPdf(null); setIndividualPdfs([]); setError(null); setProgress(0); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Scissors className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Split PDF</h1>
        <p className="text-ink/60">Extract pages or split into individual files</p>
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
            <p className="text-ink/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {pageCount} pages</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <div className="flex gap-2">
              <button onClick={() => setSplitMode('range')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${splitMode === 'range' ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Extract by Range</button>
              <button onClick={() => setSplitMode('individual')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${splitMode === 'individual' ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Split All Pages</button>
            </div>

            {splitMode === 'range' ? (
              <div className="space-y-2">
                <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder="e.g., 1-3, 5, 7-10" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:border-secondary" />
                <p className="text-sm text-ink/60">Enter page numbers separated by commas. Use hyphens for ranges.</p>
              </div>
            ) : (
              <p className="text-sm text-ink/60">This will extract every page as a separate PDF, then download all as a ZIP file.</p>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Processing...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {individualPdfs.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Extracted {individualPdfs.length} pages</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {individualPdfs.map((p, i) => (
                  <div key={i} className="p-2 bg-slate-800 rounded-lg text-center text-xs text-ink/70">{p.name}</div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {splitMode === 'range' ? (
              <button onClick={splitByRange} disabled={isProcessing || !pageRange} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isProcessing ? 'Splitting...' : <><Scissors className="w-5 h-5" /> Extract Pages</>}
              </button>
            ) : (
              <button onClick={splitIntoIndividual} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isProcessing ? 'Splitting...' : <><Scissors className="w-5 h-5" /> Split All Pages</>}
              </button>
            )}
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            {individualPdfs.length > 0 && <button onClick={downloadAll} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download ZIP</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
