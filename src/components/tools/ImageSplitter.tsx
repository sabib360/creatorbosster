import { useState, useRef } from 'react';
import { Upload, Download, X, Grid3x3, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

export default function ImageSplitter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [pieces, setPieces] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
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
    setPieces([]);

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const splitImage = async () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = preview;
      });

      const pieceW = Math.floor(img.width / cols);
      const pieceH = Math.floor(img.height / rows);
      const totalPieces = rows * cols;
      const newPieces: string[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const canvas = document.createElement('canvas');
          canvas.width = pieceW;
          canvas.height = pieceH;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH);
            const dataUrl = canvas.toDataURL(selectedFile.type);
            newPieces.push(dataUrl);
          }
          setProgress(Math.round(((r * cols + c + 1) / totalPieces) * 100));
        }
      }

      setPieces(newPieces);
    } catch {
      setError('Failed to split image');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (pieces.length === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const ext = selectedFile?.type.split('/')[1] || 'png';
      pieces.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(',')[1];
        const r = Math.floor(i / cols) + 1;
        const c = (i % cols) + 1;
        zip.file(`piece_${r}x${c}.${ext}`, base64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split_${selectedFile?.name || 'image'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to create ZIP file');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPiece = (dataUrl: string, index: number) => {
    const r = Math.floor(index / cols) + 1;
    const c = (index % cols) + 1;
    const ext = selectedFile?.type.split('/')[1] || 'png';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `piece_${r}x${c}.${ext}`;
    a.click();
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setSelectedFile(null);
    setPreview(null);
    setPieces([]);
    setError(null);
    setProgress(0);
    previewUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Grid3x3 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image Splitter
        </h1>
        <p className="text-ink/60">Split images into grid pieces and download as ZIP</p>
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original ({imageDimensions.width}x{imageDimensions.height})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Original" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-slate-800 rounded-lg text-xs text-ink/60">Pieces: {rows * cols}</div>
                <div className="p-2 bg-slate-800 rounded-lg text-xs text-ink/60">Each: ~{Math.floor(imageDimensions.width / cols)}x{Math.floor(imageDimensions.height / rows)}px</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Grid Preview</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800" style={{ aspectRatio: '1' }}>
                {preview && (
                  <div className="relative w-full h-full">
                    <img src={preview} alt="Grid" className="w-full h-full object-contain" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {Array.from({ length: cols - 1 }, (_, i) => (
                        <line key={`v${i}`} x1={`${((i + 1) / cols) * 100}%`} y1="0" x2={`${((i + 1) / cols) * 100}%`} y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                      ))}
                      {Array.from({ length: rows - 1 }, (_, i) => (
                        <line key={`h${i}`} x1="0" y1={`${((i + 1) / rows) * 100}%`} x2="100%" y2={`${((i + 1) / rows) * 100}%`} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                      ))}
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Grid Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Rows: {rows}</label>
                <input type="range" min="1" max="8" value={rows} onChange={(e) => setRows(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-ink/60">Columns: {cols}</label>
                <input type="range" min="1" max="8" value={cols} onChange={(e) => setCols(parseInt(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['2x2', '3x3', '4x4', '2x3', '3x2', '2x4', '4x2'].map(preset => {
                const [r, c] = preset.split('x').map(Number);
                return (
                  <button key={preset} onClick={() => { setRows(r); setCols(c); }} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors">
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {isProcessing && pieces.length === 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Splitting...</span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {pieces.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Split Pieces ({pieces.length})</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {pieces.map((piece, i) => (
                  <button key={i} onClick={() => downloadPiece(piece, i)} className="relative rounded-xl overflow-hidden border border-slate-700 hover:border-primary transition-colors group">
                    <img src={piece} alt={`Piece ${i + 1}`} className="w-full aspect-square object-cover bg-slate-800" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {Math.floor(i / cols) + 1}x{(i % cols) + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={splitImage} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Splitting...' : <><Grid3x3 className="w-5 h-5" /> Split Image</>}
            </button>
            {pieces.length > 0 && (
              <button onClick={downloadAll} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isProcessing ? 'Zipping...' : <><Download className="w-5 h-5" /> Download All (ZIP)</>}
              </button>
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
