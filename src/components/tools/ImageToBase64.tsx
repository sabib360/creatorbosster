import { useState, useRef } from 'react';
import { Upload, Download, X, Copy, Check, Binary, AlertCircle } from 'lucide-react';

export default function ImageToBase64() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreview(url);
    setBase64String(null);
    setCopied(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const convertToBase64 = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setBase64String(reader.result as string);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError('Failed to convert image');
      setIsProcessing(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const copyToClipboard = async () => {
    if (!base64String) return;
    try {
      await navigator.clipboard.writeText(base64String);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = base64String;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadAsText = () => {
    if (!base64String) return;
    const blob = new Blob([base64String], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name || 'image'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setSelectedFile(null);
    setPreview(null);
    setBase64String(null);
    setCopied(false);
    setError(null);
    previewUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Binary className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image to Base64
        </h1>
        <p className="text-ink/60">Convert any image to a Base64 encoded string</p>
      </div>

      {!selectedFile && (
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} className="hidden" />
          <Upload className="w-12 h-12 text-ink/40 mx-auto mb-4 group-hover:text-primary transition-colors" />
          <p className="text-lg font-bold text-ink mb-2">Drop your image here</p>
          <p className="text-ink/60">or click to browse</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Image Preview</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">File:</span>
                  <span className="font-bold text-ink">{selectedFile.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Size:</span>
                  <span className="font-bold text-ink">{formatFileSize(selectedFile.size)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Type:</span>
                  <span className="font-bold text-ink">{selectedFile.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Base64 Output</h3>
              <div className="relative rounded-xl border border-slate-700 bg-slate-800 p-4 h-64 overflow-auto">
                {base64String ? (
                  <code className="text-xs text-ink/70 break-all whitespace-pre-wrap font-mono">{base64String}</code>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/40">
                    <span>Base64 string will appear here</span>
                  </div>
                )}
              </div>
              {base64String && (
                <div className="text-sm text-ink/60">
                  Base64 size: {formatFileSize(base64String.length)} ({((base64String.length / selectedFile.size) * 100).toFixed(1)}% of original)
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={convertToBase64} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Converting...' : <><Binary className="w-5 h-5" /> Convert to Base64</>}
            </button>
            {base64String && (
              <>
                <button onClick={copyToClipboard} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                  {copied ? <><Check className="w-5 h-5" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy</>}
                </button>
                <button onClick={downloadAsText} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-ink font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download .txt
                </button>
              </>
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
