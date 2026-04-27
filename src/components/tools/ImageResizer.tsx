import { useState, useRef } from 'react';
import { Upload, Download, X, Maximize, AlertCircle } from 'lucide-react';

export default function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setNewWidth(img.width);
      setNewHeight(img.height);
      setAspectRatio(img.width / img.height);
    };
    img.src = url;
    setResizedImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleWidthChange = (width: number) => {
    setNewWidth(width);
    if (maintainAspectRatio) {
      setNewHeight(Math.round(width / aspectRatio));
    }
  };

  const handleHeightChange = (height: number) => {
    setNewHeight(height);
    if (maintainAspectRatio) {
      setNewWidth(Math.round(height * aspectRatio));
    }
  };

  const handleResize = () => {
    if (!selectedFile || !newWidth || !newHeight) return;
    
    setIsProcessing(true);
    setError(null);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setResizedImage(url);
        }
        setIsProcessing(false);
      }, selectedFile.type);
    };
    
    img.src = preview || '';
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    const a = document.createElement('a');
    a.href = resizedImage;
    a.download = `resized_${selectedFile?.name || 'image.jpg'}`;
    a.click();
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setImageDimensions({ width: 0, height: 0 });
    setNewWidth(0);
    setNewHeight(0);
    setResizedImage(null);
    setError(null);
  };

  const presets = [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Cover', width: 820, height: 312 },
    { name: 'Twitter Header', width: 1500, height: 500 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <Maximize className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Resize Image
        </h1>
        <p className="text-ink/60">Change image dimensions with custom or preset sizes</p>
      </div>

      {!selectedFile && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
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
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original ({imageDimensions.width} x {imageDimensions.height})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {preview && <img src={preview} alt="Original" className="w-full h-64 object-contain bg-slate-800" />}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Resized ({newWidth} x {newHeight})</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {resizedImage ? (
                  <img src={resizedImage} alt="Resized" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Preview will appear here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-slate-800/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <span className="font-bold text-ink uppercase tracking-widest text-sm">Maintain Aspect Ratio</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-ink uppercase tracking-widest text-sm">Width (px)</label>
                <input
                  type="number"
                  value={newWidth}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-ink uppercase tracking-widest text-sm">Height (px)</label>
                <input
                  type="number"
                  value={newHeight}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-bold text-ink uppercase tracking-widest text-sm">Presets</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setNewWidth(preset.width);
                      setNewHeight(preset.height);
                      setMaintainAspectRatio(false);
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-bold text-ink transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleResize}
              disabled={isProcessing}
              className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : 'Resize'}
            </button>
            {resizedImage && (
              <button
                onClick={handleDownload}
                className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
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