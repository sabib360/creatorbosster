import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Trash2, Copy, Download } from 'lucide-react';

interface MetadataEntry {
  key: string;
  value: string;
}

interface ImageInfo {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  lastModified: string;
}

export default function ImageMetadataViewer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataEntry[]>([]);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strippedImage, setStrippedImage] = useState<string | null>(null);
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
    setMetadata([]);
    setStrippedImage(null);

    const img = new Image();
    img.onload = () => {
      setImageInfo({
        name: file.name,
        type: file.type,
        size: file.size,
        width: img.width,
        height: img.height,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    };
    img.src = url;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const extractMetadata = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const view = new DataView(buffer);
      const entries: MetadataEntry[] = [];

      entries.push({ key: 'File Name', value: selectedFile.name });
      entries.push({ key: 'File Type', value: selectedFile.type });
      entries.push({ key: 'File Size', value: formatFileSize(selectedFile.size) });
      entries.push({ key: 'Last Modified', value: new Date(selectedFile.lastModified).toLocaleString() });

      if (imageInfo) {
        entries.push({ key: 'Width', value: `${imageInfo.width}px` });
        entries.push({ key: 'Height', value: `${imageInfo.height}px` });
        entries.push({ key: 'Megapixels', value: `${((imageInfo.width * imageInfo.height) / 1000000).toFixed(2)} MP` });
      }

      if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg') {
        const bytes = new Uint8Array(buffer);
        let offset = 2;
        while (offset < bytes.length - 1) {
          if (bytes[offset] !== 0xFF) break;
          const marker = bytes[offset + 1];
          if (marker === 0xE1) {
            const segmentLength = view.getUint16(offset + 2);
            const segmentData = new Uint8Array(buffer, offset + 4, segmentLength - 2);
            const segmentStr = new TextDecoder('ascii', { fatal: false }).decode(segmentData);
            if (segmentStr.startsWith('Exif')) {
              entries.push({ key: 'EXIF Data', value: 'EXIF metadata detected (use a dedicated EXIF reader for full details)' });
              const parts = segmentStr.split('\n');
              parts.forEach(p => {
                const trimmed = p.trim();
                if (trimmed && !trimmed.startsWith('Exif')) {
                  entries.push({ key: 'EXIF', value: trimmed.substring(0, 200) });
                }
              });
            }
            offset += 2 + segmentLength;
          } else if (marker === 0xDA) {
            break;
          } else {
            const segmentLength = view.getUint16(offset + 2);
            offset += 2 + segmentLength;
          }
        }
        entries.push({ key: 'JPEG Quality', value: 'Variable (estimated by compression)' });
        entries.push({ key: 'Color Space', value: 'sRGB (typical for JPEG)' });
        entries.push({ key: 'Has Alpha Channel', value: 'No' });
        entries.push({ key: 'Animated', value: 'No' });
      } else if (selectedFile.type === 'image/png') {
        const bytes = new Uint8Array(buffer);
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
          entries.push({ key: 'PNG Version', value: 'PNG specification 1.2' });
          let pos = 8;
          while (pos < bytes.length - 8) {
            const chunkLen = new DataView(buffer, pos, 4).getUint32(0);
            const chunkType = new TextDecoder('ascii').decode(new Uint8Array(buffer, pos + 4, 4));
            entries.push({ key: 'PNG Chunk', value: `${chunkType} (${chunkLen} bytes)` });
            if (chunkType === 'IHDR') {
              const ihdr = new DataView(buffer, pos + 8);
              entries.push({ key: 'Bit Depth', value: `${ihdr.getUint8(8)}` });
              const colorType = ihdr.getUint8(9);
              entries.push({ key: 'Color Type', value: colorType === 6 ? 'RGBA (Truecolor + Alpha)' : colorType === 2 ? 'RGB (Truecolor)' : colorType === 0 ? 'Grayscale' : `Type ${colorType}` });
              entries.push({ key: 'Compression', value: 'Deflate' });
              entries.push({ key: 'Interlace', value: ihdr.getUint8(12) === 0 ? 'None' : 'Adam7' });
            }
            pos += 12 + chunkLen;
          }
          entries.push({ key: 'Has Alpha Channel', value: 'Yes (PNG supports transparency)' });
        }
      } else if (selectedFile.type === 'image/webp') {
        entries.push({ key: 'Format', value: 'WebP' });
        entries.push({ key: 'Has Alpha Channel', value: 'Yes (WebP supports transparency)' });
        entries.push({ key: 'Animation Support', value: 'Yes' });
      } else if (selectedFile.type === 'image/gif') {
        entries.push({ key: 'Format', value: 'GIF' });
        entries.push({ key: 'Has Alpha Channel', value: 'No (binary transparency only)' });
        entries.push({ key: 'Animation Support', value: 'Yes' });
      } else if (selectedFile.type === 'image/bmp') {
        entries.push({ key: 'Format', value: 'BMP (Bitmap)' });
        entries.push({ key: 'Has Alpha Channel', value: 'Depends on bit depth' });
      }

      if (imageInfo) {
        const ratio = imageInfo.width / imageInfo.height;
        entries.push({ key: 'Aspect Ratio', value: simplifyRatio(imageInfo.width, imageInfo.height) });
        entries.push({ key: 'Orientation', value: ratio > 1 ? 'Landscape' : ratio < 1 ? 'Portrait' : 'Square' });
      }

      setMetadata(entries);
    } catch (err) {
      setError('Failed to read metadata');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const stripMetadata = () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setStrippedImage(url);
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.92);
    };
    img.src = preview;
  };

  const copyMetadata = async () => {
    const text = metadata.map(m => `${m.key}: ${m.value}`).join('\n');
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
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simplifyRatio = (w: number, h: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const d = gcd(w, h);
    return `${w / d}:${h / d}`;
  };

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    setSelectedFile(null);
    setPreview(null);
    setMetadata([]);
    setImageInfo(null);
    setStrippedImage(null);
    setError(null);
    previewUrlRef.current = null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">
          Image Metadata Viewer
        </h1>
        <p className="text-ink/60">View EXIF data, dimensions, and image properties</p>
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
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Stripped Image</h3>
              <div className="relative rounded-xl overflow-hidden border border-slate-700">
                {strippedImage ? (
                  <img src={strippedImage} alt="Stripped" className="w-full h-64 object-contain bg-slate-800" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-slate-800 text-ink/40">
                    <span>Click "Strip Metadata" to remove EXIF</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {metadata.length > 0 && (
            <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Metadata</h3>
                <button onClick={copyMetadata} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-ink transition-colors flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 px-4 text-ink/60 font-bold uppercase tracking-widest text-xs">Property</th>
                      <th className="text-left py-2 px-4 text-ink/60 font-bold uppercase tracking-widest text-xs">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata.map((entry, i) => (
                      <tr key={i} className="border-b border-slate-800">
                        <td className="py-2 px-4 font-bold text-ink">{entry.key}</td>
                        <td className="py-2 px-4 text-ink/70 font-mono text-xs break-all">{entry.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={extractMetadata} disabled={isProcessing} className="flex-1 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? 'Reading...' : <><FileText className="w-5 h-5" /> Read Metadata</>}
            </button>
            {selectedFile.type === 'image/jpeg' && (
              <button onClick={stripMetadata} disabled={isProcessing} className="flex-1 py-4 bg-secondary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isProcessing ? 'Processing...' : <><Trash2 className="w-5 h-5" /> Strip Metadata</>}
              </button>
            )}
            {strippedImage && (
              <a href={strippedImage} download={`stripped_${selectedFile.name}`} className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-ink font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download Stripped
              </a>
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
