import { useState, useRef } from 'react';
import { Upload, Download, X, FileInput, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function JPGToPDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) { setError('Please select valid image files'); return; }
    setError(null); setSelectedFiles(imageFiles); setResultPdf(null);
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); };

  const convertToPDF = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true); setError(null);
    try {
      const pdfDoc = await PDFDocument.create();
      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg') image = await pdfDoc.embedJpg(arrayBuffer);
        else if (file.type === 'image/png') image = await pdfDoc.embedPng(arrayBuffer);
        if (image) { const page = pdfDoc.addPage([image.width, image.height]); page.drawImage(image); }
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      setResultPdf(blob);
    } catch (err) { setError('Failed to convert images to PDF.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => { if (!resultPdf) return; const url = URL.createObjectURL(resultPdf); const a = document.createElement('a'); a.href = url; a.download = 'images.pdf'; a.click(); URL.revokeObjectURL(url); };
  const reset = () => { setSelectedFiles([]); setResultPdf(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><FileInput className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">JPG to PDF</h1><p className="text-ink/60">Convert images to PDF document</p></div>
      {selectedFiles.length === 0 && (<div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" /><Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
        <p className="text-lg font-bold text-ink mb-2">Drop images here</p><p className="text-ink/60">or click to browse</p></div>)}
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {selectedFiles.length > 0 && (<div className="space-y-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected Images ({selectedFiles.length})</h3>
          <div className="grid grid-cols-4 gap-4">{selectedFiles.map((file, i) => (<div key={i} className="relative rounded-lg overflow-hidden"><img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-20 object-cover" /><p className="text-xs text-ink/60 truncate p-1">{file.name}</p></div>))}</div></div>
        <div className="flex gap-4"><button onClick={convertToPDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? 'Converting...' : <><FileInput className="w-5 h-5" /> Convert to PDF</>}</button>
          {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
          <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button></div></div>)}
    </div>
  );
}