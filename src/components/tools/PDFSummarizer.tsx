import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, AlertCircle, Sparkles } from 'lucide-react';

export default function PDFSummarizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setSummary(null);
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); };

  const summarizePDF = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      // Placeholder implementation - in a real app, this would call a backend API
      setTimeout(() => {
        setSummary("This PDF summarization feature requires server-side AI processing. In a production environment, this would use Google's Gemini API to analyze the PDF content and generate a summary of the main points and key takeaways.");
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError('Failed to summarize PDF. Please try again.');
      setIsProcessing(false);
    }
  };

  const reset = () => { setSelectedFile(null); setSummary(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><FileText className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Summarizer</h1><p className="text-ink/60">AI-powered PDF content extraction and summarization</p></div>
      {!selectedFile && (<div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-tertiary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" /><Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-tertiary transition-colors" />
        <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p><p className="text-ink/60">or click to browse</p></div>)}
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {selectedFile && (<div className="space-y-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3><p className="text-ink">{selectedFile.name}</p></div>
        {summary && (<div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-4">Summary</h3><div className="prose prose-invert max-w-none"><p className="text-ink/80 whitespace-pre-wrap">{summary}</p></div></div>)}
        <div className="flex gap-4"><button onClick={summarizePDF} disabled={isProcessing} className="flex-1 py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? <><Sparkles className="w-5 h-5 animate-pulse" /> Processing...</> : <><Sparkles className="w-5 h-5" /> Generate Summary</>}</button>
          <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button></div></div>)}
    </div>
  );
}
