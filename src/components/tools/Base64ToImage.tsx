import { useState, useRef } from 'react';
import { Download, X, Clipboard, Image as ImageIcon, AlertCircle, Binary } from 'lucide-react';

export default function Base64ToImage() {
  const [base64Input, setBase64Input] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>('image/png');
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleConvert = () => {
    setError(null);
    setPreview(null);

    const input = base64Input.trim();
    if (!input) {
      setError('Please paste a Base64 string');
      return;
    }

    try {
      let dataUrl = input;
      if (!input.startsWith('data:')) {
        const mimeMatch = input.match(/^([A-Za-z-]+\/[A-Za-z0-9+.]+)/);
        if (mimeMatch) {
          dataUrl = `data:${mimeMatch[1]};base64,${input.replace(mimeMatch[0], '').trim()}`;
        } else {
          dataUrl = `data:image/png;base64,${input}`;
        }
      }

      const extractedType = dataUrl.match(/data:([^;]+)/)?.[1] || 'image/png';
      setImageType(extractedType);

      const img = new Image();
      img.onload = () => {
        setPreview(dataUrl);
        setImageSize({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        setError('Invalid Base64 image data. Please check the string and try again.');
      };
      img.src = dataUrl;
    } catch {
      setError('Failed to decode Base64 string. Please check the format.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBase64Input(text);
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    const ext = imageType.split('/')[1] || 'png';
    const a = document.createElement('a');
    a.href = preview;
    a.download = `decoded_image.${ext}`;
    a.click();
  };

  const handleSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 200, 200);
      grad.addColorStop(0, '#f97316');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Test', 100, 108);
    }
    const dataUrl = canvas.toDataURL('image/png');
    setBase64Input(dataUrl);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const estimatedSize = base64Input ? Math.floor((base64Input.length * 3) / 4) : 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <ImageIcon className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Base64 to Image
        </h1>
        <p className="text-ink/60">Convert a Base64 string back to an image file</p>
      </div>

      <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex items-center justify-between">
          <label className="font-bold text-ink uppercase tracking-widest text-sm">Base64 Input</label>
          <div className="flex gap-2">
            <button onClick={handlePaste} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
              <Clipboard className="w-3 h-3" /> Paste
            </button>
            <button onClick={handleSample} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors">
              Load Sample
            </button>
          </div>
        </div>
        <textarea ref={textareaRef} value={base64Input} onChange={(e) => setBase64Input(e.target.value)} placeholder="Paste your Base64 encoded image string here..." className="w-full h-40 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-sm resize-none focus:outline-none focus:border-primary" />
        {base64Input && (
          <div className="text-sm text-ink/60">
            Estimated image size: {formatFileSize(estimatedSize)}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Decoded Image</h3>
          <div className="relative rounded-xl overflow-hidden border border-slate-700">
            <img src={preview} alt="Decoded" className="w-full h-80 object-contain bg-slate-800" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-800 rounded-xl">
              <div className="text-xs text-ink/60 uppercase">Format</div>
              <div className="font-bold text-ink">{imageType}</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-xl">
              <div className="text-xs text-ink/60 uppercase">Dimensions</div>
              <div className="font-bold text-ink">{imageSize.width} x {imageSize.height}</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-xl">
              <div className="text-xs text-ink/60 uppercase">Size</div>
              <div className="font-bold text-ink">{formatFileSize(estimatedSize)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={handleConvert} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <Binary className="w-5 h-5" /> Convert
        </button>
        {preview && (
          <button onClick={handleDownload} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download Image
          </button>
        )}
        <button onClick={() => { setBase64Input(''); setPreview(null); setError(null); }} className="px-6 py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
