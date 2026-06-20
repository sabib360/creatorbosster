import { useState, useRef } from 'react';
import { Upload, Download, X, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export default function PDFPasswordProtector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [canPrint, setCanPrint] = useState(true);
  const [canCopy, setCanCopy] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const protectPDF = async () => {
    if (!selectedFile) return;
    if (!password) { setError('Please enter a password'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setIsProcessing(true); setError(null);
    try {
      const buf = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);

      let permissions = 0;
      if (canPrint) permissions |= 4;
      if (canCopy) permissions |= 16;
      if (canEdit) permissions |= 8;

      const pdfBytes = await pdf.save({
        userPassword: password,
        ownerPassword: password + '_owner',
        permissions: {
          printing: canPrint ? 'highResolution' : 'disabled',
          copying: canCopy,
          modifying: canEdit,
        },
      } as any);

      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to protect PDF. The file may be corrupted.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'protected.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setPassword(''); setConfirmPassword(''); setResultPdf(null); setError(null); };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Lock className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Password Protector</h1>
        <p className="text-ink/60">Encrypt your PDF with a password and permission settings</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p><p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFile && (
        <div className="space-y-8">
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
            <p className="text-ink/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Password</h3>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink pr-12" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-lg">
                {showPassword ? <EyeOff className="w-4 h-4 text-ink/60" /> : <Eye className="w-4 h-4 text-ink/60" />}
              </button>
            </div>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink pr-12" />
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Permissions</h3>
            <div className="space-y-3">
              {[
                { label: 'Allow Printing', value: canPrint, set: setCanPrint },
                { label: 'Allow Copying', value: canCopy, set: setCanCopy },
                { label: 'Allow Editing', value: canEdit, set: setCanEdit },
              ].map(({ label, value, set }) => (
                <label key={label} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl cursor-pointer">
                  <span className="font-bold text-ink text-sm">{label}</span>
                  <div className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-secondary' : 'bg-slate-700'}`} onClick={() => set(!value)}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${value ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={protectPDF} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Protecting...' : <><Lock className="w-5 h-5" /> Protect PDF</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
