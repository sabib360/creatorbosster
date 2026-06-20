import { useState, useRef } from 'react';
import { Upload, Download, X, Image, AlertCircle, Check } from 'lucide-react';
import JSZip from 'jszip';

export default function PDFToJPG() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [quality, setQuality] = useState(0.92);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultImages, setResultImages] = useState<{ name: string; dataUrl: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultImages([]); setSelectedPages(new Set());
    try {
      const buf = await file.arrayBuffer();
      // Count pages by finding /Type /Page entries
      const text = new TextDecoder('ascii', { fatal: false }).decode(new Uint8Array(buf));
      const matches = text.match(/\/Type\s*\/Page[^s]/g);
      setPageCount(matches ? matches.length : 1);
      // Select all pages by default
      const allPages = new Set<number>();
      for (let i = 1; i <= (matches ? matches.length : 1); i++) allPages.add(i);
      setSelectedPages(allPages);
    } catch { setPageCount(1); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const togglePage = (page: number) => {
    setSelectedPages(prev => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page); else next.add(page);
      return next;
    });
  };

  const selectAll = () => { const s = new Set<number>(); for (let i = 1; i <= pageCount; i++) s.add(i); setSelectedPages(s); };
  const selectNone = () => setSelectedPages(new Set());

  const convertToJPG = async () => {
    if (!selectedFile || selectedPages.size === 0) return;
    setIsProcessing(true); setError(null); setProgress(0); setResultImages([]);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      const { getDocument } = pdfjsLib;
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const images: { name: string; dataUrl: string }[] = [];
      const pages = Array.from(selectedPages).sort((a, b) => a - b);

      for (let i = 0; i < pages.length; i++) {
        const pageNum = pages[i];
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        images.push({ name: `page_${pageNum}.jpg`, dataUrl });
        setProgress(Math.round(((i + 1) / pages.length) * 100));
      }

      setResultImages(images);
    } catch (err: any) {
      if (err.message?.includes('pdfjs-dist')) {
        // Fallback: render using canvas + PDF embed approach
        setError('PDF.js library not available. Please try again or use a different browser.');
      } else {
        setError('Failed to convert PDF to images.');
      }
    } finally { setIsProcessing(false); }
  };

  const downloadAll = async () => {
    if (resultImages.length === 0) return;
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      resultImages.forEach(img => { const base64 = img.dataUrl.split(',')[1]; zip.file(img.name, base64, { base64: true }); });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'pdf_images.zip'; a.click(); URL.revokeObjectURL(url);
    } catch { setError('Failed to create ZIP.'); } finally { setIsProcessing(false); }
  };

  const downloadSingle = (img: { name: string; dataUrl: string }) => {
    const a = document.createElement('a'); a.href = img.dataUrl; a.download = img.name; a.click();
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setResultImages([]); setSelectedPages(new Set()); setError(null); setProgress(0); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Image className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF to JPG</h1>
        <p className="text-ink/60">Convert PDF pages to JPG images</p>
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

          {pageCount > 0 && resultImages.length === 0 && (
            <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Select Pages ({selectedPages.size}/{pageCount})</h3>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs font-bold text-secondary hover:underline">All</button>
                  <button onClick={selectNone} className="text-xs font-bold text-ink/60 hover:underline">None</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => togglePage(page)} className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors ${selectedPages.has(page) ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{page}</button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-ink/60">Quality: {Math.round(quality * 100)}%</label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Converting...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {resultImages.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> Converted {resultImages.length} pages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {resultImages.map((img, i) => (
                  <button key={i} onClick={() => downloadSingle(img)} className="relative group rounded-xl overflow-hidden border border-slate-700 hover:border-secondary transition-colors">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-32 object-cover bg-slate-800" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Download className="w-5 h-5 text-white" /></div>
                    <div className="p-1 text-[10px] text-ink/60 truncate">{img.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={convertToJPG} disabled={isProcessing || selectedPages.size === 0} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Converting...' : <><Image className="w-5 h-5" /> Convert to JPG</>}
            </button>
            {resultImages.length > 0 && <button onClick={downloadAll} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download All (ZIP)</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
