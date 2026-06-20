import { useState, useRef } from 'react';
import { Upload, Download, X, Droplets, AlertCircle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default function PDFWatermarkAdder() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('center');
  const [rotation, setRotation] = useState(45);
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.3);
  const [applyTo, setApplyTo] = useState<'all' | 'first' | 'last'>('all');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null);
    try { const buf = await file.arrayBuffer(); const pdf = await PDFDocument.load(buf); setPageCount(pdf.getPageCount()); } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const getTargetPages = (totalPages: number): number[] => {
    if (applyTo === 'first') return [0];
    if (applyTo === 'last') return [totalPages - 1];
    if (pageRange.trim()) {
      return pageRange.split(',').flatMap(part => {
        const t = part.trim();
        if (t.includes('-')) { const [s, e] = t.split('-').map(n => parseInt(n) - 1); return Array.from({ length: e - s + 1 }, (_, i) => s + i); }
        return [parseInt(t) - 1];
      }).filter(i => i >= 0 && i < totalPages);
    }
    return Array.from({ length: totalPages }, (_, i) => i);
  };

  const addWatermark = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const buf = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const targets = getTargetPages(pages.length);

      for (const idx of targets) {
        const page = pages[idx];
        const { width, height } = page.getSize();

        if (watermarkType === 'text') {
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
          let x = 0, y = 0;
          switch (position) {
            case 'center': x = (width - textWidth) / 2; y = height / 2; break;
            case 'top-left': x = 50; y = height - 50; break;
            case 'top-right': x = width - textWidth - 50; y = height - 50; break;
            case 'bottom-left': x = 50; y = 50; break;
            case 'bottom-right': x = width - textWidth - 50; y = 50; break;
          }
          page.drawText(watermarkText, {
            x, y, size: fontSize, font,
            color: rgb(0.5, 0.5, 0.5),
            opacity,
            rotate: degrees(rotation),
          });
        } else if (watermarkImage) {
          const imgBuf = await watermarkImage.arrayBuffer();
          const img = watermarkImage.type === 'image/png' ? await pdf.embedPng(imgBuf) : await pdf.embedJpg(imgBuf);
          const scale = Math.min((width * 0.5) / img.width, (height * 0.5) / img.height);
          const imgW = img.width * scale, imgH = img.height * scale;
          let x = 0, y = 0;
          switch (position) {
            case 'center': x = (width - imgW) / 2; y = (height - imgH) / 2; break;
            case 'top-left': x = 50; y = height - imgH - 50; break;
            case 'top-right': x = width - imgW - 50; y = height - imgH - 50; break;
            case 'bottom-left': x = 50; y = 50; break;
            case 'bottom-right': x = width - imgW - 50; y = 50; break;
          }
          page.drawImage(img, { x, y, width: imgW, height: imgH, opacity, rotate: degrees(rotation) });
        }
        setProgress(Math.round(((targets.indexOf(idx) + 1) / targets.length) * 100));
      }

      const pdfBytes = await pdf.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to add watermark.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'watermarked.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setResultPdf(null); setError(null); setWatermarkImage(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Droplets className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Watermark</h1>
        <p className="text-ink/60">Add text or image watermarks to your PDF</p>
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
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Watermark Settings</h3>

            <div className="flex gap-2">
              {(['text', 'image'] as WatermarkType[]).map(t => (
                <button key={t} onClick={() => setWatermarkType(t)} className={`flex-1 py-3 rounded-xl font-bold capitalize transition-colors ${watermarkType === t ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{t} Watermark</button>
              ))}
            </div>

            {watermarkType === 'text' ? (
              <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" placeholder="Enter watermark text" />
            ) : (
              <div className="space-y-2">
                <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => setWatermarkImage(e.target.files?.[0] || null)} className="hidden" />
                <button onClick={() => imageInputRef.current?.click()} className="w-full py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink hover:border-secondary transition-colors">
                  {watermarkImage ? watermarkImage.name : 'Select watermark image'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'] as Position[]).map(p => (
                    <button key={p} onClick={() => setPosition(p)} className={`py-1.5 rounded text-[10px] font-bold capitalize transition-colors ${position === p ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{p.replace('-', ' ')}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Apply To</label>
                <select value={applyTo} onChange={(e) => setApplyTo(e.target.value as any)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm">
                  <option value="all">All Pages</option>
                  <option value="first">First Page</option>
                  <option value="last">Last Page</option>
                </select>
              </div>
            </div>

            {applyTo === 'all' && (
              <input type="text" value={pageRange} onChange={(e) => setPageRange(e.target.value)} placeholder="Optional: specific pages (e.g., 1, 3-5)" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm" />
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Rotation: {rotation}°</label>
                <input type="range" min="-180" max="180" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Size: {fontSize}pt</label>
                <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Opacity: {Math.round(opacity * 100)}%</label>
                <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Adding watermark...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={addWatermark} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><Droplets className="w-5 h-5" /> Add Watermark</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
