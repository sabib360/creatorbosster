import { useState, useRef } from 'react';
import { Upload, Download, X, RotateCw, AlertCircle } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function PDFRotator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); };

  const rotatePDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + angle));
      });
      const pdfBytes = await pdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResultPdf(blob);
    } catch (err) { setError('Failed to rotate PDF.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => { if (!resultPdf) return; const url = URL.createObjectURL(resultPdf); const a = document.createElement('a'); a.href = url; a.download = 'rotated.pdf'; a.click(); URL.revokeObjectURL(url); };
  const reset = () => { setSelectedFile(null); setAngle(90); setResultPdf(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><RotateCw className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Rotate PDF</h1><p className="text-ink/60">Change PDF page orientation</p></div>
      {!selectedFile && (<div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" /><Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
        <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p><p className="text-ink/60">or click to browse</p></div>)}
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {selectedFile && (<div className="space-y-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3><p className="text-ink">{selectedFile.name}</p></div>
        <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm">Rotation Angle</h3>
          <div className="flex gap-4">{[90, 180, 270].map(a => (<button key={a} onClick={() => setAngle(a)} className={`flex-1 py-4 rounded-xl font-bold transition-colors ${angle === a ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{a}°</button>))}</div></div>
        <div className="flex gap-4"><button onClick={rotatePDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? 'Processing...' : <><RotateCw className="w-5 h-5" /> Rotate {angle}°</>}</button>
          {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
          <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button></div></div>)}
    </div>
  );
}