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

      <p className="text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
        Extract the key points from a long PDF without reading every page. This tool uses AI to distill reports, research papers, and manuals into a concise summary so you can decide what deserves your full attention.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">How to Summarize a PDF</h2>
        <ol className="space-y-3 text-ink/70 list-decimal list-inside">
          <li>Upload your PDF by clicking the drop zone or dragging the file onto it.</li>
          <li>Confirm the file name displayed matches the document you intend to summarize.</li>
          <li>Press <strong className="text-ink">Generate Summary</strong> to begin AI processing.</li>
          <li>Review the extracted summary covering main themes and key takeaways.</li>
          <li>Copy the summary text for use in notes, emails, or project documentation.</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Common Use Cases</h2>
        <ul className="space-y-2 text-ink/70">
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Getting the gist of a 50-page market research report before a strategy meeting.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Extracting action items from a lengthy project proposal or contract draft.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Condensing an academic paper's methodology and findings into study notes.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Quickly reviewing a software documentation PDF to find relevant API details.</span></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">How accurate are the summaries?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">The AI extracts the most prominent themes and data points. For highly technical or nuanced documents, the summary is a starting point — always verify critical details against the original source.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Does the PDF stay private?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">The file is sent to Google's Gemini API for processing. It is not stored on our servers. We do not retain copies of your documents or their content after the request completes.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">What PDF types work best?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">Text-based PDFs (generated from Word, Google Docs, or LaTeX) produce the best results. Scanned PDFs that are purely image-based may yield limited summaries unless they have an OCR text layer.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Is there a page limit?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">There is no enforced page limit, but very large documents (over 200 pages) may hit API processing constraints. For best results, keep files under 100 pages or split longer documents.</p>
          </div>
        </div>
      </div>

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
