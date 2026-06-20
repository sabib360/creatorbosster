import { useState, useRef } from 'react';
import { Upload, Download, X, FileInput, AlertCircle, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

type PageSize = 'a4' | 'letter' | 'legal' | 'fit';

const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  a4: { width: 595.28, height: 841.89, label: 'A4 (210 x 297mm)' },
  letter: { width: 612, height: 792, label: 'US Letter (8.5 x 11")' },
  legal: { width: 612, height: 1008, label: 'US Legal (8.5 x 14")' },
  fit: { width: 0, height: 0, label: 'Fit to Image' },
};

export default function JPGToPDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [marginTop, setMarginTop] = useState(0);
  const [marginBottom, setMarginBottom] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [marginRight, setMarginRight] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) { setError('Please select valid image files (JPG, PNG)'); return; }
    setError(null); setSelectedFiles(prev => [...prev, ...imageFiles]); setResultPdf(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); };

  const removeFile = (index: number) => setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  const moveFile = (index: number, direction: 'up' | 'down') => {
    setSelectedFiles(prev => {
      const n = [...prev]; const ni = direction === 'up' ? index - 1 : index + 1;
      if (ni < 0 || ni >= n.length) return prev;
      [n[index], n[ni]] = [n[ni], n[index]]; return n;
    });
  };

  const convertToPDF = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true); setError(null); setProgress(0);
    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const arrayBuffer = await file.arrayBuffer();
        let image;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') image = await pdfDoc.embedJpg(arrayBuffer);
        else if (file.type === 'image/png') image = await pdfDoc.embedPng(arrayBuffer);
        if (!image) continue;

        const { width: imgW, height: imgH } = image;
        let pageW: number, pageH: number;

        if (pageSize === 'fit') {
          pageW = imgW + marginLeft + marginRight;
          pageH = imgH + marginTop + marginBottom;
        } else {
          const ps = PAGE_SIZES[pageSize];
          pageW = ps.width; pageH = ps.height;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const drawW = pageW - marginLeft - marginRight;
        const drawH = pageH - marginTop - marginBottom;
        const scale = Math.min(drawW / imgW, drawH / imgH);
        const scaledW = imgW * scale, scaledH = imgH * scale;
        const x = marginLeft + (drawW - scaledW) / 2;
        const y = marginTop + (drawH - scaledH) / 2;
        page.drawImage(image, { x, y, width: scaledW, height: scaledH });
        setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      const pdfBytes = await pdfDoc.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to convert images to PDF.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'images.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFiles([]); setResultPdf(null); setError(null); setProgress(0); };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><FileInput className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">JPG to PDF</h1>
        <p className="text-ink/60">Convert images to a PDF document with custom page size</p>
      </div>

      {selectedFiles.length === 0 && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop images here</p><p className="text-ink/60">or click to browse (JPG, PNG)</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFiles.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Selected Images ({selectedFiles.length})</h3>
            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-secondary hover:underline">+ Add more</button>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />

          <div className="space-y-2">
            {selectedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <img src={URL.createObjectURL(file)} alt="" className="w-10 h-10 rounded object-cover" />
                <span className="flex-1 text-ink text-sm truncate">{file.name}</span>
                <span className="text-ink/60 text-xs">{formatSize(file.size)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"><MoveUp className="w-3 h-3" /></button>
                  <button onClick={() => moveFile(i, 'down')} disabled={i === selectedFiles.length - 1} className="p-1 hover:bg-slate-700 rounded disabled:opacity-30"><MoveDown className="w-3 h-3" /></button>
                  <button onClick={() => removeFile(i)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Page Settings</h3>
            <div className="space-y-2">
              <label className="text-sm text-ink/60">Page Size</label>
              <div className="flex gap-2">
                {Object.entries(PAGE_SIZES).map(([key, val]) => (
                  <button key={key} onClick={() => setPageSize(key as PageSize)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${pageSize === key ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{val.label}</button>
                ))}
              </div>
            </div>

            {pageSize !== 'fit' && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Top', value: marginTop, set: setMarginTop },
                  { label: 'Bottom', value: marginBottom, set: setMarginBottom },
                  { label: 'Left', value: marginLeft, set: setMarginLeft },
                  { label: 'Right', value: marginRight, set: setMarginRight },
                ].map(({ label, value, set }) => (
                  <div key={label} className="space-y-1">
                    <label className="text-xs text-ink/60">{label} (pt)</label>
                    <input type="number" value={value} onChange={(e) => set(parseInt(e.target.value) || 0)} min="0" max="200" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink text-sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span className="text-ink/60">Converting...</span><span className="font-bold text-primary">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={convertToPDF} disabled={isProcessing || selectedFiles.length === 0} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Converting...' : <><FileInput className="w-5 h-5" /> Convert to PDF</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
