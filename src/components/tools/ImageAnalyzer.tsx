import { useState, useRef } from 'react';
import { Upload, Download, X, Eye, AlertCircle, Sparkles } from 'lucide-react';

export default function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select a valid image file'); return; }
    setError(null); setSelectedFile(file); setAnalysis(null);
  };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFileSelect(file); };

  const analyzeImage = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      // Placeholder implementation - in a real app, this would call a backend API
      setTimeout(() => {
        setAnalysis("This image analysis feature requires server-side AI processing. In a production environment, this would use Google's Gemini API to analyze the image and provide detailed information about objects, colors, composition, and notable features.");
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      setIsProcessing(false);
    }
  };

  const reset = () => { setSelectedFile(null); setAnalysis(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4"><div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center mx-auto"><Eye className="w-8 h-8 text-tertiary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Image Analyzer</h1><p className="text-ink/60">AI-powered image analysis and description</p></div>
      {!selectedFile && (<div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-tertiary transition-colors cursor-pointer group">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" /><Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-tertiary transition-colors" />
        <p className="text-lg font-bold text-ink mb-2">Drop your image here</p><p className="text-ink/60">or click to browse</p></div>)}
      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {selectedFile && (<div className="space-y-8">
        <div className="relative rounded-xl overflow-hidden border border-slate-700"><img src={URL.createObjectURL(selectedFile)} alt="Original" className="w-full h-64 object-contain bg-slate-800" /></div>
        {analysis && (<div className="p-6 bg-slate-800/50 rounded-2xl"><h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-4">Analysis</h3><div className="prose prose-invert max-w-none"><p className="text-ink/80 whitespace-pre-wrap">{analysis}</p></div></div>)}
        <div className="flex gap-4"><button onClick={analyzeImage} disabled={isProcessing} className="flex-1 py-4 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? <><Sparkles className="w-5 h-5 animate-pulse" /> Analyzing...</> : <><Sparkles className="w-5 h-5" /> Analyze Image</>}</button>
          <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button></div></div>)}
    </div>
  );
}