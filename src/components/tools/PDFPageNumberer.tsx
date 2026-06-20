import { useState, useRef } from 'react';
import { Upload, Download, X, Hash, AlertCircle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function PDFPageNumberer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState<'helvetica' | 'timesRoman' | 'courier'>('helvetica');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      setPageCount(pdf.getPageCount());
    } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const addPageNumbers = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const buf = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const fontKey = fontFamily === 'timesRoman' ? 'TimesRoman' : fontFamily === 'helvetica' ? 'Helvetica' : 'Courier';
      const font = await pdf.embedFont(StandardFonts[fontKey as keyof typeof StandardFonts]);
      const pages = pdf.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const pageNum = String(startNumber + i);
        const textWidth = font.widthOfTextAtSize(pageNum, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        let x = 0, y = 0;
        const margin = 30;

        switch (position) {
          case 'top-left': x = margin; y = height - margin - textHeight; break;
          case 'top-center': x = (width - textWidth) / 2; y = height - margin - textHeight; break;
          case 'top-right': x = width - margin - textWidth; y = height - margin - textHeight; break;
          case 'bottom-left': x = margin; y = margin; break;
          case 'bottom-center': x = (width - textWidth) / 2; y = margin; break;
          case 'bottom-right': x = width - margin - textWidth; y = margin; break;
        }

        page.drawText(pageNum, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }

      const pdfBytes = await pdf.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to add page numbers.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'numbered.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setResultPdf(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Hash className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Page Numberer</h1>
        <p className="text-ink/60">Add page numbers to your PDF document</p>
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

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Settings</h3>

            <div className="space-y-2">
              <label className="text-sm text-ink/60">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map(p => (
                  <button key={p} onClick={() => setPosition(p)} className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors capitalize ${position === p ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>
                    {p.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Start Number</label>
                <input type="number" value={startNumber} onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)} min="1" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Font Size: {fontSize}pt</label>
                <input type="range" min="8" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Font</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value as any)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink">
                  <option value="helvetica">Helvetica</option>
                  <option value="timesRoman">Times Roman</option>
                  <option value="courier">Courier</option>
                </select>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Adding numbers...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={addPageNumbers} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Hash className="w-5 h-5" /> Add Page Numbers</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
