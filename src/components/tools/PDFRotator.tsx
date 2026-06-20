import { useState, useRef } from 'react';
import { Upload, Download, X, RotateCw, AlertCircle, Check } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

type RotationMode = 'all' | 'specific';

export default function PDFRotator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState(90);
  const [mode, setMode] = useState<RotationMode>('all');
  const [specificPages, setSpecificPages] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null);
    try { const buf = await file.arrayBuffer(); const pdf = await PDFDocument.load(buf); setPageCount(pdf.getPageCount()); } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const getTargetIndices = (total: number): number[] => {
    if (mode === 'all') return Array.from({ length: total }, (_, i) => i);
    return specificPages.split(',').flatMap(part => {
      const t = part.trim();
      if (t.includes('-')) { const [s, e] = t.split('-').map(n => parseInt(n) - 1); return Array.from({ length: e - s + 1 }, (_, i) => s + i); }
      return [parseInt(t) - 1];
    }).filter(i => i >= 0 && i < total);
  };

  const rotatePDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      const targets = getTargetIndices(pages.length);
      targets.forEach(idx => {
        const page = pages[idx];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      });
      const pdfBytes = await pdf.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to rotate PDF.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'rotated.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPageCount(0); setAngle(90); setResultPdf(null); setError(null); setSpecificPages(''); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><RotateCw className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Rotate PDF</h1>
        <p className="text-ink/60">Rotate all or specific pages by 90°, 180°, or 270°</p>
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
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Rotation Angle</h3>
            <div className="flex gap-3">
              {[90, 180, 270].map(a => (
                <button key={a} onClick={() => setAngle(a)} className={`flex-1 py-4 rounded-xl font-bold text-lg transition-colors ${angle === a ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{a}°</button>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Apply To</h3>
            <div className="flex gap-2">
              <button onClick={() => setMode('all')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${mode === 'all' ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>All Pages</button>
              <button onClick={() => setMode('specific')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${mode === 'specific' ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>Specific Pages</button>
            </div>
            {mode === 'specific' && (
              <input type="text" value={specificPages} onChange={(e) => setSpecificPages(e.target.value)} placeholder="e.g., 1, 3-5, 8" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink" />
            )}
          </div>

          {resultPdf && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-bold text-sm">PDF rotated {angle}° successfully!</p>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={rotatePDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Processing...' : <><RotateCw className="w-5 h-5" /> Rotate {angle}°</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
