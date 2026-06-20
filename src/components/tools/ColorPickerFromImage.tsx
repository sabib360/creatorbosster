import { useState, useRef, useEffect } from 'react';
import { Upload, X, Pipette, Copy, Check, AlertCircle, Palette } from 'lucide-react';

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
}

function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPickerFromImage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

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
    setPickedColor(null);
    setColorHistory([]);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const img = imageRef.current;
    if (!img) return;

    const scaleX = img.width / rect.width;
    const scaleY = img.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);
    const colorInfo: ColorInfo = { hex, rgb, hsl };
    setPickedColor(colorInfo);
    setColorHistory(prev => [colorInfo, ...prev.filter(c => c.hex !== hex)].slice(0, 20));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setSelectedFile(null);
    setPreview(null);
    setPickedColor(null);
    setColorHistory([]);
    setError(null);
    previewUrlRef.current = null;
    imageRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Pipette className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Color Picker from Image
        </h1>
        <p className="text-ink/60">Click anywhere on an image to pick colors and get HEX, RGB, HSL values</p>
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

      <canvas ref={canvasRef} className="hidden" />

      {selectedFile && preview && (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 cursor-crosshair" onMouseMove={handleMouseMove} onMouseEnter={() => setShowCursor(true)} onMouseLeave={() => setShowCursor(false)} onClick={handleImageClick}>
              <img src={preview} alt="Pick a color" className="w-full max-h-96 object-contain bg-slate-800 pointer-events-none" draggable={false} />
              {showCursor && (
                <div className="absolute w-6 h-6 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-lg" style={{ left: cursorPos.x, top: cursorPos.y, backgroundColor: pickedColor?.hex || 'transparent' }} />
              )}
            </div>
            <p className="text-center text-sm text-ink/60">Click anywhere on the image to pick a color</p>
          </div>

          {pickedColor && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: 'HEX', value: pickedColor.hex },
                  { label: 'RGB', value: pickedColor.rgb },
                  { label: 'HSL', value: pickedColor.hsl },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-slate-800/50 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink uppercase tracking-widest text-sm">{label}</span>
                      <button onClick={() => copyToClipboard(value, label)} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors">
                        {copiedField === label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                      </button>
                    </div>
                    <div className="font-mono text-lg text-ink break-all">{value}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl">
                <div className="w-16 h-16 rounded-xl border border-slate-700 shadow-xl" style={{ backgroundColor: pickedColor.hex }} />
                <div>
                  <div className="font-bold text-ink">Selected Color</div>
                  <div className="text-sm text-ink/60">Click the copy buttons above to copy values</div>
                </div>
              </div>
            </div>
          )}

          {colorHistory.length > 0 && (
            <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-ink/60" />
                <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Color History</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {colorHistory.map((color, i) => (
                  <button key={`${color.hex}-${i}`} onClick={() => copyToClipboard(color.hex, `hist-${i}`)} className="group relative w-10 h-10 rounded-xl border border-slate-700 shadow-lg hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }} title={color.hex}>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-ink/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">{color.hex}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={reset} className="w-full py-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-ink">
            <X className="w-5 h-5" /> Load Another Image
          </button>
        </div>
      )}
    </div>
  );
}
