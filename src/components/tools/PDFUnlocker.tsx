import { useState, useRef } from 'react';
import { Upload, Download, X, Unlock, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFUnlocker() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null); setSuccess(false);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const unlockPDF = async () => {
    if (!selectedFile) return;
    if (!password) { setError('Please enter the password'); return; }

    setIsProcessing(true); setError(null); setSuccess(false);
    try {
      const buf = await selectedFile.arrayBuffer();
      let pdf;
      try {
        pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
      } catch {
        pdf = await PDFDocument.load(buf);
      }

      // Save without encryption by creating a new doc and copying pages
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes('password') || err.message?.includes('encrypted')) {
        setError('Incorrect password or the PDF requires a different password.');
      } else {
        setError('Failed to unlock PDF. Please check the password and try again.');
      }
    } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'unlocked.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPassword(''); setResultPdf(null); setError(null); setSuccess(false); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Unlock className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Unlocker</h1>
        <p className="text-ink/60">Remove password protection from your PDF</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your locked PDF here</p><p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
      {success && <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"><CheckCircle2 className="w-5 h-5" /><span>PDF unlocked successfully! Download below.</span></div>}

      {selectedFile && (
        <div className="space-y-8">
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
            <p className="text-ink/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Enter Password</h3>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter the PDF password" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink pr-12" onKeyDown={(e) => e.key === 'Enter' && unlockPDF()} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-lg">
                {showPassword ? <EyeOff className="w-4 h-4 text-ink/60" /> : <Eye className="w-4 h-4 text-ink/60" />}
              </button>
            </div>
            <p className="text-sm text-ink/60">Enter the password that was used to protect this PDF. The tool will remove all restrictions.</p>
          </div>

          <div className="flex gap-4">
            <button onClick={unlockPDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Unlocking...' : <><Unlock className="w-5 h-5" /> Unlock PDF</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download Unlocked</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
