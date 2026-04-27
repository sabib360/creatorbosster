import { useState, useRef } from 'react';
import { Upload, Download, X, Combine, AlertCircle, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedPdf, setMergedPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (pdfFiles.length === 0) {
      setError('Please select valid PDF files');
      return;
    }
    setError(null);
    setFiles(prev => [...prev, ...pdfFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
      const newFiles = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newFiles.length) return prev;
      [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setMergedPdf(blob);
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdf) return;
    const url = URL.createObjectURL(mergedPdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFiles([]);
    setMergedPdf(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Combine className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Merge PDF
        </h1>
        <p className="text-ink/60">Combine multiple PDFs into one document</p>
      </div>

      {files.length === 0 && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" multiple accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop PDF files here</p>
          <p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">PDF Files ({files.length})</h3>
            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-bold text-secondary hover:underline">
              + Add more
            </button>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="application/pdf" onChange={(e) => handleFileSelect(e.target.files)} className="hidden" />

          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-ink/40 font-bold w-8">{index + 1}</span>
                <span className="flex-1 text-ink truncate">{file.name}</span>
                <span className="text-ink/60 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30">
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-2 hover:bg-slate-700 rounded-lg disabled:opacity-30">
                    <MoveDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFile(index)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={mergePDFs} disabled={isProcessing || files.length < 2} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Merging...' : <><Combine className="w-5 h-5" /> Merge PDFs</>}
            </button>
            {mergedPdf && (
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