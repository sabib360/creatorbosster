import { useState, useRef } from 'react';
import { Upload, Download, X, FileText, AlertCircle, Tag } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface MetadataFields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export default function PDFMetadataEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MetadataFields>({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
  const [originalMetadata, setOriginalMetadata] = useState<MetadataFields | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultPdf, setResultPdf] = useState<Blob | null>(null);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') { setError('Please select a valid PDF file'); return; }
    setError(null); setSelectedFile(file); setResultPdf(null); setLoaded(false);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const title = pdf.getTitle() || '';
      const author = pdf.getAuthor() || '';
      const subject = pdf.getSubject() || '';
      const keywords = pdf.getKeywords() || '';
      const creator = pdf.getCreator() || '';
      const producer = pdf.getProducer() || '';
      const fields = { title, author, subject, keywords, creator, producer };
      setMetadata(fields);
      setOriginalMetadata(fields);
      setLoaded(true);
    } catch {
      setError('Failed to read PDF metadata.');
    }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); };

  const updateMetadata = async () => {
    if (!selectedFile) return;
    setIsProcessing(true); setError(null);
    try {
      const buf = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      if (metadata.title) pdf.setTitle(metadata.title);
      if (metadata.author) pdf.setAuthor(metadata.author);
      if (metadata.subject) pdf.setSubject(metadata.subject);
      if (metadata.keywords) pdf.setKeywords([metadata.keywords]);
      if (metadata.creator) pdf.setCreator(metadata.creator);
      if (metadata.producer) pdf.setProducer(metadata.producer);

      const pdfBytes = await pdf.save();
      setResultPdf(new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' }));
    } catch { setError('Failed to update metadata.'); } finally { setIsProcessing(false); }
  };

  const handleDownload = () => {
    if (!resultPdf) return;
    const url = URL.createObjectURL(resultPdf);
    const a = document.createElement('a'); a.href = url; a.download = 'updated_metadata.pdf'; a.click(); URL.revokeObjectURL(url);
  };

  const reset = () => { setSelectedFile(null); setMetadata({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' }); setOriginalMetadata(null); setResultPdf(null); setError(null); setLoaded(false); };

  const updateField = (key: keyof MetadataFields, value: string) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
    setResultPdf(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto"><Tag className="w-8 h-8 text-secondary" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">PDF Metadata Editor</h1>
        <p className="text-ink/60">Edit title, author, subject, keywords, and custom metadata</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-secondary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-secondary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your PDF here</p><p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

      {selectedFile && loaded && (
        <div className="space-y-8">
          <div className="p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm mb-2">Selected File</h3>
            <p className="text-ink">{selectedFile.name}</p>
            <p className="text-ink/60 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Metadata Fields</h3>
            <div className="space-y-4">
              {([
                { key: 'title' as const, label: 'Title', placeholder: 'Document title' },
                { key: 'author' as const, label: 'Author', placeholder: 'Author name' },
                { key: 'subject' as const, label: 'Subject', placeholder: 'Document subject' },
                { key: 'keywords' as const, label: 'Keywords', placeholder: 'keyword1, keyword2, keyword3' },
                { key: 'creator' as const, label: 'Creator', placeholder: 'Application that created the PDF' },
                { key: 'producer' as const, label: 'Producer', placeholder: 'PDF producer' },
              ]).map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm text-ink/60">{label}</label>
                  <input type="text" value={metadata[key]} onChange={(e) => updateField(key, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink text-sm focus:outline-none focus:border-secondary" />
                  {originalMetadata && originalMetadata[key] && (
                    <p className="text-[10px] text-ink/40">Original: {originalMetadata[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={updateMetadata} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Updating...' : <><Tag className="w-5 h-5" /> Update Metadata</>}
            </button>
            {resultPdf && <button onClick={handleDownload} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>}
            <button onClick={reset} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {selectedFile && !loaded && !error && (
        <div className="text-center py-8 text-ink/60">Loading metadata...</div>
      )}
    </div>
  );
}
