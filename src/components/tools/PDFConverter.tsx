import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, AlertCircle } from 'lucide-react';

export default function PDFConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null); setSelectedFile(file); setResultFile(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); };

  const convertFile = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    // Placeholder - in a real app, this would use a conversion library
    setTimeout(() => {
      setResultFile(new Blob([`Converted content of ${selectedFile.name}`], { type: 'application/pdf' }));
      setIsProcessing(false);
    }, 1000);
  };

  const handleDownload = () => { if (!resultFile) return; const url = URL.createObjectURL(resultFile); const a = document.createElement('a'); a.href = url; a.download = `converted.${outputFormat}`; a.click(); URL.revokeObjectURL(url); };
  const reset = () => { setSelectedFile(null); setResultFile(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><FileText className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Converter</h1><p className="text-ink/60">Convert between PDF, Word, and Text formats</p></div>
      {!selectedFile && (<div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" accept="application/pdf,.docx,.doc,.txt" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" /><Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
        <p className="text-lg font-bold text-ink mb-2">Drop your file here</p><p className="text-ink/60">or click to browse</p></div>)}
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {selectedFile && (<div className="space-y-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3><p className="text-ink">{selectedFile.name}</p></div>
        <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm">Output Format</h3>
          <div className="flex gap-4">{[{ value: 'pdf', label: 'PDF' }, { value: 'docx', label: 'Word' }, { value: 'txt', label: 'Text' }].map(f => (<button key={f.value} onClick={() => setOutputFormat(f.value as any)} className={`flex-1 py-4 rounded-xl font-bold transition-colors ${outputFormat === f.value ? 'bg-secondary text-black' : 'bg-slate-700 hover:bg-slate-600 text-ink'}`}>{f.label}</button>))}</div></div>
        <div className="flex gap-4"><button onClick={convertFile} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? 'Converting...' : <><FileText className="w-5 h-5" /> Convert</>}</button>
          {resultFile && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
          <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button></div></div>)}
    </div>
  );
}