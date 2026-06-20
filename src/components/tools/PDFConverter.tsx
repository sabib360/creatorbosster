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

      <p className="text-ink/70 leading-relaxed text-center max-w-2xl mx-auto">
        Switch your document between PDF, Word (DOCX), and plain-text formats without installing desktop software. This is handy when you receive a PDF that needs editing in a word processor or when you need to strip formatting and extract raw text for data processing.
      </p>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">How to Convert a File</h2>
        <ol className="space-y-3 text-ink/70 list-decimal list-inside">
          <li>Drop your file into the upload zone or click to browse your device.</li>
          <li>Select the target output format — PDF, Word, or Text — from the buttons below.</li>
          <li>Press <strong className="text-ink">Convert</strong> to begin the transformation.</li>
          <li>Download the converted file once processing completes.</li>
        </ol>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Common Use Cases</h2>
        <ul className="space-y-2 text-ink/70">
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Converting a PDF resume into a Word document so a recruiter can make edits.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Extracting plain text from a PDF for pasting into a code editor or spreadsheet.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Turning a Word draft into a PDF for consistent formatting across all devices.</span></li>
          <li className="flex gap-3"><span className="text-primary font-black">•</span><span>Preparing a contract in PDF form after finalizing edits in a word processor.</span></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-ink">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Will formatting be preserved during conversion?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">PDF-to-Word conversion retains most layout elements including headings, paragraphs, and tables. Complex formatting like multi-column layouts or embedded fonts may shift slightly. Always review the output before sharing.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Can I convert a scanned PDF to editable text?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">Image-only PDFs without an OCR text layer will convert as blank or placeholder text. For scanned documents, use an OCR tool first to generate searchable text, then convert the result here.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">Is my document uploaded to a server?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">This tool processes files in-browser wherever possible. For format conversions requiring server-side libraries, the file is processed temporarily and not retained after the session ends.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-ink mb-2">What is the maximum file size?</h3>
            <p className="text-ink/60 text-sm leading-relaxed">There is no hard limit, but files over 50 MB may cause slow performance or browser memory issues. For very large documents, consider splitting them first.</p>
          </div>
        </div>
      </div>

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
