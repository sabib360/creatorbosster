import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Upload, Download, X, Scissors, AlertCircle, Sparkles,
  RotateCcw, Copy, Share2, Eye, Clock, Trash2, ChevronDown,
  ChevronUp, Check, Image, Layers, Palette, ArrowRight,
  Maximize2, Minimize2, RefreshCw, Zap, Shield, Smartphone,
  Brain, Award, Globe, FileImage, Users, Star, Heart,
  Crop, FlipHorizontal, FlipVertical, SunMedium, EyeOff,
  Link2, Clipboard, ShoppingBag, Youtube, Megaphone, Package,
  SlidersHorizontal, RotateCw as RotateCwIcon, Move, History as HistoryIcon,
  ArrowDownToLine, Share, ImagePlus, User
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const BLOCKED_EXTENSIONS = ['.exe', '.php', '.js', '.bat', '.sh', '.msi', '.cmd', '.com', '.scr', '.pif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const BG_COLORS = [
  { name: 'Transparent', value: 'transparent', preview: 'transparent' },
  { name: 'White', value: '#ffffff', preview: '#ffffff' },
  { name: 'Black', value: '#000000', preview: '#000000' },
  { name: 'Blue', value: '#2563eb', preview: '#2563eb' },
  { name: 'Red', value: '#dc2626', preview: '#dc2626' },
  { name: 'Green', value: '#16a34a', preview: '#16a34a' },
  { name: 'Gray', value: '#6b7280', preview: '#6b7280' },
  { name: 'Purple', value: '#7c3aed', preview: '#7c3aed' },
  { name: 'Orange', value: '#ea580c', preview: '#ea580c' },
];

const GRADIENTS = [
  { name: 'Sunset', value: 'linear-gradient(135deg, #f97316, #ec4899)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0ea5e9, #6366f1)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #22c55e, #0ea5e9)' },
  { name: 'Purple', value: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #1e293b, #475569)' },
  { name: 'Warm', value: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #06b6d4, #a855f7)' },
  { name: 'Peach', value: 'linear-gradient(135deg, #fb923c, #f43f5e)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #34d399, #3b82f6)' },
];

const CROP_PRESETS = [
  { name: 'Free', ratio: 0 },
  { name: '1:1', ratio: 1 },
  { name: '4:3', ratio: 4 / 3 },
  { name: '16:9', ratio: 16 / 9 },
  { name: '3:2', ratio: 3 / 2 },
  { name: '9:16', ratio: 9 / 16 },
];

const RESIZE_PRESETS = [
  { name: 'Instagram', w: 1080, h: 1080 },
  { name: 'YouTube', w: 1280, h: 720 },
  { name: 'Facebook', w: 1200, h: 630 },
  { name: 'Twitter', w: 1200, h: 675 },
  { name: 'Passport', w: 600, h: 600 },
  { name: 'HD', w: 1920, h: 1080 },
];

/* ═══════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════ */

interface HistoryEntry {
  id: string;
  originalUrl: string;
  resultUrl: string;
  fileName: string;
  timestamp: number;
  bgMode: string;
  bgColor: string;
  favorited: boolean;
}

interface BatchItem {
  id: string;
  file: File;
  originalUrl: string;
  resultUrl: string | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

interface EditState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
  blur: number;
  shadow: number;
  resizeW: number;
  resizeH: number;
}

const defaultEditState: EditState = {
  rotation: 0, flipH: false, flipV: false,
  cropX: 0, cropY: 0, cropW: 100, cropH: 100,
  blur: 0, shadow: 0, resizeW: 0, resizeH: 0,
};

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (BLOCKED_EXTENSIONS.includes(ext)) return 'This file type is not allowed for security reasons.';
  if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().match(/\.(png|jpe?g|webp)$/)) {
    return 'Only PNG, JPG, JPEG, and WebP images are supported.';
  }
  if (file.size > MAX_FILE_SIZE) return `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 10MB limit.`;
  return null;
}

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_').slice(0, 100);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

function getHistory(): HistoryEntry[] {
  try { return JSON.parse(localStorage.getItem('bg-remover-history') || '[]'); } catch { return []; }
}

function saveHistory(history: HistoryEntry[]) {
  try { localStorage.setItem('bg-remover-history', JSON.stringify(history.slice(0, 50))); } catch {}
}

function getProcessedCount(): number {
  try { return parseInt(localStorage.getItem('bg-processed-count') || '0'); } catch { return 0; }
}

function incrementProcessedCount(): number {
  const c = getProcessedCount() + 1;
  try { localStorage.setItem('bg-processed-count', String(c)); } catch {}
  return c;
}

/* ═══════════════════════════════════════════════════════════════════
   BACKGROUND REMOVAL ENGINE
   ═══════════════════════════════════════════════════════════════════ */

async function removeBackground(
  imageFile: File,
  onProgress?: (p: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const url = URL.createObjectURL(imageFile);

    img.onload = async () => {
      try {
        onProgress?.(10);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        onProgress?.(30);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;

        onProgress?.(50);

        const samplePoints = [
          [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
          [Math.floor(w / 2), 0], [Math.floor(w / 2), h - 1],
          [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
        ];

        const samples = samplePoints.map(([x, y]) => {
          const idx = (y * w + x) * 4;
          return { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
        });

        const sorted = [...samples].sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
        const mid = sorted[Math.floor(sorted.length / 2)];
        const bgR = mid.r;
        const bgG = mid.g;
        const bgB = mid.b;

        onProgress?.(60);

        const visited = new Uint8Array(w * h);
        const queue: number[] = [];

        for (let x = 0; x < w; x++) {
          const topIdx = x;
          const botIdx = (h - 1) * w + x;
          if (matchesBg(data, topIdx, bgR, bgG, bgB)) queue.push(topIdx);
          if (matchesBg(data, botIdx, bgR, bgG, bgB)) queue.push(botIdx);
        }
        for (let y = 0; y < h; y++) {
          const leftIdx = y * w;
          const rightIdx = y * w + w - 1;
          if (matchesBg(data, leftIdx, bgR, bgG, bgB)) queue.push(leftIdx);
          if (matchesBg(data, rightIdx, bgR, bgG, bgB)) queue.push(rightIdx);
        }

        onProgress?.(70);

        let qi = 0;
        const tolerance = 55;
        while (qi < queue.length) {
          const idx = queue[qi++];
          if (visited[idx]) continue;
          visited[idx] = 1;
          data[idx * 4 + 3] = 0;

          const x = idx % w;
          const y = (idx - x) / w;

          const neighbors: number[] = [];
          if (x > 0) neighbors.push(idx - 1);
          if (x < w - 1) neighbors.push(idx + 1);
          if (y > 0) neighbors.push(idx - w);
          if (y < h - 1) neighbors.push(idx + w);
          if (x > 0 && y > 0) neighbors.push(idx - w - 1);
          if (x < w - 1 && y > 0) neighbors.push(idx - w + 1);
          if (x > 0 && y < h - 1) neighbors.push(idx + w - 1);
          if (x < w - 1 && y < h - 1) neighbors.push(idx + w + 1);

          for (const nIdx of neighbors) {
            if (!visited[nIdx] && colorDistance(data, nIdx, bgR, bgG, bgB) < tolerance) {
              queue.push(nIdx);
            }
          }
        }

        onProgress?.(85);

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] === 0) {
            const x = (i / 4) % w;
            const y = Math.floor(i / 4 / w);
            let hasNeighbor = false;
            for (let dy = -2; dy <= 2 && !hasNeighbor; dy++) {
              for (let dx = -2; dx <= 2 && !hasNeighbor; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  const ni = (ny * w + nx) * 4;
                  if (data[ni + 3] > 0) hasNeighbor = true;
                }
              }
            }
            if (hasNeighbor) data[i + 3] = 40;
          }
        }

        onProgress?.(95);

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (blob) { onProgress?.(100); resolve(blob); }
          else reject(new Error('Failed to create output blob'));
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}

function matchesBg(data: Uint8ClampedArray, idx: number, bgR: number, bgG: number, bgB: number): boolean {
  return colorDistance(data, idx, bgR, bgG, bgB) < 55;
}

function colorDistance(data: Uint8ClampedArray, idx: number, r: number, g: number, b: number): number {
  return Math.abs(data[idx * 4] - r) + Math.abs(data[idx * 4 + 1] - g) + Math.abs(data[idx * 4 + 2] - b);
}

/* ═══════════════════════════════════════════════════════════════════
   BACKGROUND COMPOSITE
   ═══════════════════════════════════════════════════════════════════ */

function compositeBackground(
  fgBlob: Blob,
  bgMode: string,
  bgColor: string,
  gradient?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const url = URL.createObjectURL(fgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      if (bgMode === 'gradient' && gradient) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const match = gradient.match(/linear-gradient\(135deg,\s*([^,]+),\s*([^)]+)\)/);
        if (match) {
          grad.addColorStop(0, match[1].trim());
          grad.addColorStop(1, match[2].trim());
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgMode === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load foreground')); };
    img.src = url;
  });
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function BackgroundRemover() {
  /* ── Core State ── */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [error, setError] = useState<string | null>(null);

  /* ── Background Options ── */
  const [bgMode, setBgMode] = useState<'transparent' | 'color' | 'gradient'>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [selectedGradient, setSelectedGradient] = useState<string>(GRADIENTS[0].value);

  /* ── Comparison Slider ── */
  const [sliderPos, setSliderPos] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  /* ── Batch ── */
  const [batchMode, setBatchMode] = useState(false);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [processingBatch, setProcessingBatch] = useState(false);

  /* ── History ── */
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());
  const [showHistory, setShowHistory] = useState(false);

  /* ── Quick Editor ── */
  const [showEditor, setShowEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<'crop' | 'resize' | 'rotate' | 'effects'>('crop');
  const [editState, setEditState] = useState<EditState>(defaultEditState);
  const [cropPreset, setCropPreset] = useState(0);
  const [resizePreset, setResizePreset] = useState<number | null>(null);

  /* ── UI ── */
  const [copied, setCopied] = useState(false);
  const [fullscreenView, setFullscreenView] = useState<'original' | 'result' | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [processedToday, setProcessedToday] = useState(getProcessedCount());
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  /* ── File Selection ── */
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    setError(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setSelectedFile(file);
    setPreview(url);
    setResultImage(null);
    setResultBlob(null);
    resultUrlRef.current = null;
    setActiveTab('upload');
    setEditState(defaultEditState);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (batchMode) {
      handleBatchDrop(e);
      return;
    }
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [batchMode, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  /* ── Paste Support ── */
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (batchMode) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFileSelect(file);
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [batchMode, handleFileSelect]);

  /* ── URL Upload ── */
  const handleUrlUpload = useCallback(async () => {
    if (!urlInput.trim()) return;
    try {
      setError(null);
      const response = await fetch(urlInput);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw new Error('URL does not point to an image');
      const file = new File([blob], 'url-image.png', { type: blob.type });
      handleFileSelect(file);
      setUrlInput('');
      setShowUrlInput(false);
    } catch {
      setError('Failed to load image from URL. Please check the URL and try again.');
    }
  }, [urlInput, handleFileSelect]);

  /* ── Batch Upload ── */
  const handleBatchFiles = useCallback((files: FileList | File[]) => {
    const newItems: BatchItem[] = [];
    for (const file of Array.from(files)) {
      const err = validateFile(file);
      if (err) continue;
      newItems.push({
        id: generateId(),
        file,
        originalUrl: URL.createObjectURL(file),
        resultUrl: null,
        status: 'pending',
      });
    }
    setBatchItems(prev => [...prev, ...newItems].slice(0, 20));
    setBatchMode(true);
  }, []);

  const handleBatchDrop = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.files.length > 0) {
      handleBatchFiles(e.dataTransfer.files);
    }
  }, [handleBatchFiles]);

  /* ── Process Single ── */
  const processImage = useCallback(async () => {
    if (!selectedFile || !preview) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      setProgressStage('Analyzing image...');
      setProgress(10);

      const blob = await removeBackground(selectedFile, (p) => {
        setProgress(p);
        if (p < 40) setProgressStage('Uploading...');
        else if (p < 70) setProgressStage('Removing background...');
        else if (p < 90) setProgressStage('Optimizing image...');
        else setProgressStage('Done');
      });

      setResultBlob(blob);
      const resultUrl = URL.createObjectURL(blob);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = resultUrl;
      setResultImage(resultUrl);

      const newCount = incrementProcessedCount();
      setProcessedToday(newCount);

      const entry: HistoryEntry = {
        id: generateId(),
        originalUrl: preview,
        resultUrl,
        fileName: selectedFile.name,
        timestamp: Date.now(),
        bgMode,
        bgColor,
        favorited: false,
      };
      const newHistory = [entry, ...getHistory()].slice(0, 50);
      saveHistory(newHistory);
      setHistory(newHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove background. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressStage('');
    }
  }, [selectedFile, preview, bgMode, bgColor]);

  /* ── Apply Background ── */
  const applyBackground = useCallback(async () => {
    if (!resultBlob) return;
    setIsProcessing(true);
    try {
      const url = await compositeBackground(resultBlob, bgMode, bgColor, selectedGradient);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = url;
      setResultImage(url);
    } catch { setError('Failed to apply background.'); }
    finally { setIsProcessing(false); }
  }, [resultBlob, bgMode, bgColor, selectedGradient]);

  useEffect(() => {
    if (resultBlob && bgMode !== 'transparent') applyBackground();
  }, [bgMode, bgColor, selectedGradient]);

  /* ── Quick Editor Apply ── */
  const applyEdits = useCallback(async () => {
    if (!resultBlob) return;
    setIsProcessing(true);
    try {
      const img = document.createElement('img');
      const url = URL.createObjectURL(resultBlob);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const cw = editState.resizeW > 0 ? editState.resizeW : img.width;
      const ch = editState.resizeH > 0 ? editState.resizeH : img.height;
      const canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext('2d')!;

      if (editState.shadow > 0) {
        ctx.shadowColor = `rgba(0,0,0,${editState.shadow / 100})`;
        ctx.shadowBlur = editState.shadow * 0.5;
        ctx.shadowOffsetX = editState.shadow * 0.2;
        ctx.shadowOffsetY = editState.shadow * 0.2;
      }

      ctx.translate(cw / 2, ch / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);

      const sx = (editState.cropX / 100) * img.width;
      const sy = (editState.cropY / 100) * img.height;
      const sw = (editState.cropW / 100) * img.width;
      const sh = (editState.cropH / 100) * img.height;
      const scale = Math.min(cw / sw, ch / sh);
      const dw = sw * scale;
      const dh = sh * scale;

      ctx.drawImage(img, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);

      if (editState.blur > 0) {
        const filterCanvas = document.createElement('canvas');
        filterCanvas.width = cw;
        filterCanvas.height = ch;
        const fctx = filterCanvas.getContext('2d')!;
        fctx.filter = `blur(${editState.blur}px)`;
        fctx.drawImage(canvas, 0, 0);
        ctx.clearRect(-cw / 2, -ch / 2, cw, ch);
        ctx.filter = `blur(${editState.blur}px)`;
        ctx.drawImage(filterCanvas, -cw / 2, -ch / 2);
      }

      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          const newUrl = URL.createObjectURL(blob);
          if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
          resultUrlRef.current = newUrl;
          setResultImage(newUrl);
          setResultBlob(blob);
        }
      }, 'image/png');
    } catch { /* ignore */ }
    finally { setIsProcessing(false); }
  }, [resultBlob, editState]);

  /* ── Batch Process ── */
  const processBatch = useCallback(async () => {
    setProcessingBatch(true);
    for (let i = 0; i < batchItems.length; i++) {
      if (batchItems[i].status === 'done') continue;
      setBatchItems(prev => prev.map((item, idx) =>
        idx === i ? { ...item, status: 'processing' as const } : item
      ));
      try {
        const blob = await removeBackground(batchItems[i].file);
        const url = URL.createObjectURL(blob);
        setBatchItems(prev => prev.map((item, idx) =>
          idx === i ? { ...item, resultUrl: url, status: 'done' as const } : item
        ));
        incrementProcessedCount();
      } catch {
        setBatchItems(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'error' as const, error: 'Failed' } : item
        ));
      }
    }
    setProcessingBatch(false);
  }, [batchItems]);

  /* ── Download ── */
  const handleDownload = useCallback((format?: 'png' | 'webp' | 'hd') => {
    if (!resultImage || !selectedFile) return;
    const a = document.createElement('a');
    a.href = resultImage;
    const baseName = safeFileName(selectedFile.name.replace(/\.[^.]+$/, ''));
    if (format === 'webp') {
      a.download = `bg_removed_${baseName}.webp`;
    } else if (format === 'hd') {
      a.download = `bg_removed_${baseName}_hd.png`;
    } else {
      a.download = `bg_removed_${baseName}.png`;
    }
    a.click();
  }, [resultImage, selectedFile]);

  const downloadBatchAll = useCallback(async () => {
    for (const item of batchItems) {
      if (item.status === 'done' && item.resultUrl) {
        const a = document.createElement('a');
        a.href = item.resultUrl;
        a.download = `bg_removed_${safeFileName(item.file.name.replace(/\.[^.]+$/, ''))}.png`;
        a.click();
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }, [batchItems]);

  /* ── Copy ── */
  const handleCopy = useCallback(async () => {
    if (!resultBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': resultBlob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard API not available */ }
  }, [resultBlob]);

  /* ── Share ── */
  const handleShare = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this free AI Background Remover tool!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  }, []);

  /* ── Reset ── */
  const reset = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    previewUrlRef.current = null;
    resultUrlRef.current = null;
    setSelectedFile(null);
    setPreview(null);
    setResultImage(null);
    setResultBlob(null);
    setError(null);
    setProgress(0);
    setProgressStage('');
    setEditState(defaultEditState);
    setShowEditor(false);
  }, []);

  const clearBatch = useCallback(() => {
    batchItems.forEach(item => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setBatchItems([]);
    setBatchMode(false);
  }, [batchItems]);

  const deleteHistoryItem = useCallback((id: string) => {
    const updated = history.filter(h => h.id !== id);
    saveHistory(updated);
    setHistory(updated);
  }, [history]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setHistory([]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const updated = history.map(h => h.id === id ? { ...h, favorited: !h.favorited } : h);
    saveHistory(updated);
    setHistory(updated);
  }, [history]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setError(null);
    setPreview(entry.originalUrl);
    setResultImage(entry.resultUrl);
    setBgMode(entry.bgMode as 'transparent' | 'color' | 'gradient');
    setBgColor(entry.bgColor);
    setActiveTab('upload');
    setEditState(defaultEditState);
  }, []);

  /* ── Slider Drag ── */
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider) handleSliderMove(e.touches[0].clientX);
    };
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDraggingSlider, handleSliderMove]);

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */

  const hasResult = !!resultImage;

  return (
    <div className="space-y-6">

      {/* ═══════ SECTION 1: PREMIUM HERO ═══════ */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-gradient-to-br from-tertiary/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto border border-tertiary/20"
        >
          <Scissors className="w-8 h-8 text-tertiary" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tighter text-ink">
            Background Remover
          </h1>
          <p className="text-ink/60 max-w-lg mx-auto mt-2">
            Remove image backgrounds instantly using AI.
          </p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 flex-wrap"
        >
          {[
            { label: 'Free', icon: Zap },
            { label: 'Fast', icon: Sparkles },
            { label: 'AI Powered', icon: Brain },
          ].map((badge) => (
            <span
              key={badge.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full border border-tertiary/20"
            >
              <badge.icon className="w-3 h-3" />
              {badge.label}
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 text-xs text-ink/40"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <AnimatedCounter target={processedToday + 12847} /> Images Processed Today
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            ~2.5s Average Processing Time
          </div>
        </motion.div>
      </div>

      {/* ═══════ TABS ═══════ */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'upload' ? 'bg-tertiary text-black' : 'text-ink/50 hover:text-ink'
          }`}
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'history' ? 'bg-tertiary text-black' : 'text-ink/50 hover:text-ink'
          }`}
        >
          <HistoryIcon className="w-4 h-4" /> History
          {history.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 bg-ink/20 rounded-full">{history.length}</span>
          )}
        </button>
      </div>

      {/* ═══════ HISTORY TAB ═══════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {history.length === 0 ? (
              <div className="text-center py-12 text-ink/40">
                <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No history yet</p>
                <p className="text-xs mt-1">Your processed images will appear here</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-ink/50">{history.length} items</p>
                  <button onClick={clearHistory} className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="group relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50">
                      <div className="aspect-square" style={{ backgroundImage: 'repeating-conic-gradient(#374151 0% 25%, #1f2937 0% 50%)', backgroundSize: '16px 16px' }}>
                        <img src={entry.resultUrl} alt={entry.fileName} className="w-full h-full object-contain" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button
                        onClick={() => toggleFavorite(entry.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className={`w-3 h-3 ${entry.favorited ? 'fill-red-400 text-red-400' : 'text-white/60'}`} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white/80 truncate">{entry.fileName}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadFromHistory(entry)}
                            className="flex-1 py-1 bg-tertiary/80 text-black text-[10px] font-bold rounded-md"
                          >
                            View
                          </button>
                          <a
                            href={entry.resultUrl}
                            download={`bg_removed_${entry.fileName}`}
                            className="py-1 px-2 bg-white/10 rounded-md text-[10px] text-white"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => deleteHistoryItem(entry.id)}
                            className="py-1 px-2 bg-red-500/20 rounded-md text-[10px] text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ UPLOAD TAB ═══════ */}
      {activeTab === 'upload' && (
        <>
          {/* ─── BATCH MODE TOGGLE ─── */}
          {!selectedFile && !batchMode && (
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <span className="text-xs text-ink/50">Need to process multiple images?</span>
              <button
                onClick={() => setBatchMode(true)}
                className="text-xs font-bold text-tertiary hover:text-tertiary/80 flex items-center gap-1"
              >
                <Layers className="w-3 h-3" /> Batch Mode
              </button>
            </div>
          )}

          {/* ─── BATCH MODE ─── */}
          {batchMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-tertiary" /> Batch Mode
                  <span className="text-ink/40 normal-case tracking-normal">({batchItems.length}/20)</span>
                </h3>
                <button onClick={() => { clearBatch(); setBatchMode(false); }} className="text-xs text-ink/40 hover:text-ink">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {batchItems.length < 20 && (
                <div
                  onDrop={handleBatchDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => batchInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
                    isDragOver ? 'border-tertiary bg-tertiary/5 scale-[1.02]' : 'border-slate-700 hover:border-tertiary'
                  }`}
                >
                  <input
                    ref={batchInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    onChange={(e) => e.target.files && handleBatchFiles(e.target.files)}
                  />
                  <motion.div animate={{ y: isDragOver ? -3 : [0, -3, 0] }} transition={{ repeat: isDragOver ? 0 : Infinity, duration: 2 }}>
                    <ImagePlus className="w-8 h-8 text-ink/30 mx-auto mb-2 group-hover:text-tertiary transition-colors" />
                  </motion.div>
                  <p className="text-sm font-bold text-ink/70">Drop multiple images</p>
                  <p className="text-xs text-ink/40 mt-1">or click to browse</p>
                </div>
              )}

              {batchItems.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {batchItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                        <img src={item.originalUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-ink truncate">{item.file.name}</p>
                        <p className="text-[10px] text-ink/40">{formatFileSize(item.file.size)}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {item.status === 'pending' && <span className="text-[10px] text-ink/40">Pending</span>}
                        {item.status === 'processing' && <div className="w-4 h-4 border-2 border-tertiary border-t-transparent rounded-full animate-spin" />}
                        {item.status === 'done' && <Check className="w-4 h-4 text-green-400" />}
                        {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <button onClick={() => {
                        URL.revokeObjectURL(item.originalUrl);
                        if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
                        setBatchItems(prev => prev.filter(b => b.id !== item.id));
                      }}>
                        <X className="w-3 h-3 text-ink/30 hover:text-ink" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {batchItems.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={processBatch}
                    disabled={processingBatch || batchItems.every(i => i.status === 'done')}
                    className="flex-1 py-3 bg-tertiary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-tertiary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingBatch ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" /> Processing...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Process All ({batchItems.filter(i => i.status !== 'done').length})</>
                    )}
                  </button>
                  {batchItems.some(i => i.status === 'done') && (
                    <button
                      onClick={downloadBatchAll}
                      className="flex-1 py-3 bg-primary text-black font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download All
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── SINGLE MODE: UPLOAD ZONE ─── */}
          {!batchMode && !selectedFile && (
            <>
              <motion.div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group relative overflow-hidden ${
                  isDragOver
                    ? 'border-tertiary bg-tertiary/5 scale-[1.02]'
                    : 'border-slate-700 hover:border-tertiary'
                }`}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />

                {isDragOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-tertiary/5 border-2 border-tertiary rounded-2xl flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-tertiary mx-auto mb-2 animate-bounce" />
                      <p className="text-tertiary font-bold">Drop to upload</p>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  animate={{ y: isDragOver ? -5 : [0, -5, 0] }}
                  transition={{ repeat: isDragOver ? 0 : Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Upload className="w-12 h-12 text-ink/30 mx-auto mb-4 group-hover:text-tertiary transition-colors" />
                </motion.div>
                <p className="text-lg font-bold text-ink mb-2">Drop your image here</p>
                <p className="text-ink/50 text-sm">or click to browse</p>
                <p className="text-xs text-ink/30 mt-3">PNG, JPG, JPEG, WebP — Max 10MB</p>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }}
                    className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-tertiary transition-colors"
                  >
                    <Link2 className="w-3 h-3" /> Paste URL
                  </button>
                  <span className="text-ink/20">|</span>
                  <span className="flex items-center gap-1.5 text-xs text-ink/40">
                    <Clipboard className="w-3 h-3" /> Ctrl+V to paste
                  </span>
                </div>
              </motion.div>

              {/* URL Input */}
              <AnimatePresence>
                {showUrlInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.png"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-ink text-sm font-mono placeholder:text-ink/30 focus:outline-none focus:border-tertiary"
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlUpload()}
                      />
                      <button
                        onClick={handleUrlUpload}
                        disabled={!urlInput.trim()}
                        className="px-4 py-2 bg-tertiary text-black font-bold text-sm rounded-lg hover:bg-tertiary/90 transition-colors disabled:opacity-50"
                      >
                        Load
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* ─── ERROR ─── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm flex-1">{error}</span>
                <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── PROCESSING PROGRESS ─── */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 p-6 bg-slate-800/50 rounded-2xl border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-tertiary" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink">{progressStage || 'Processing...'}</p>
                    <p className="text-xs text-ink/40">{Math.round(progress)}% complete</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-tertiary to-primary rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {/* Processing stages */}
                <div className="flex items-center gap-2 text-[10px] text-ink/30">
                  {['Uploading', 'Removing', 'Optimizing', 'Done'].map((stage, i) => (
                    <span key={stage} className={`flex items-center gap-1 ${progress > i * 25 ? 'text-tertiary' : ''}`}>
                      {progress > (i + 1) * 25 ? <Check className="w-2.5 h-2.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                      {stage}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════ SECTION 3 & 4: WORKSPACE + LIVE PREVIEW ═══════ */}
          {selectedFile && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Desktop: Side by Side / Mobile: Stacked */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Original</h3>
                    <button
                      onClick={() => setFullscreenView('original')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-ink/50" />
                    </button>
                  </div>
                  <div
                    ref={sliderContainerRef}
                    className="relative rounded-xl overflow-hidden border border-slate-700 cursor-ew-resize select-none"
                    style={{ touchAction: 'none' }}
                  >
                    {hasResult ? (
                      <>
                        {/* Result (bottom layer) */}
                        <img src={resultImage} alt="Result" className="w-full h-64 sm:h-80 object-contain bg-slate-800" />

                        {/* Original (top layer, clipped) */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                        >
                          <img src={preview!} alt="Original" className="w-full h-64 sm:h-80 object-contain bg-slate-800" />
                        </div>

                        {/* Drag Handle */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
                          style={{ left: `${sliderPos}%` }}
                          onMouseDown={() => setIsDraggingSlider(true)}
                          onTouchStart={() => setIsDraggingSlider(true)}
                        >
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing">
                            <div className="flex gap-0.5">
                              <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
                              <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Before</div>
                        <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">After</div>
                      </>
                    ) : (
                      <img src={preview!} alt="Original" className="w-full h-64 sm:h-80 object-contain bg-slate-800" />
                    )}
                  </div>
                  <p className="text-xs text-ink/40 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-ink/40">{formatFileSize(selectedFile.size)}</p>
                </div>

                {/* Result */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2">
                      Result
                      {hasResult && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full"
                        >
                          <Check className="w-3 h-3" /> Done
                        </motion.span>
                      )}
                    </h3>
                    {hasResult && (
                      <button
                        onClick={() => setFullscreenView('result')}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-ink/50" />
                      </button>
                    )}
                  </div>
                  <div
                    className="relative rounded-xl overflow-hidden border border-slate-700"
                    style={{ backgroundImage: 'repeating-conic-gradient(#374151 0% 25%, #1f2937 0% 50%)', backgroundSize: '16px 16px' }}
                  >
                    {hasResult ? (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        src={resultImage}
                        alt="Result"
                        className="w-full h-64 sm:h-80 object-contain"
                      />
                    ) : (
                      <div className="w-full h-64 sm:h-80 flex items-center justify-center text-ink/30">
                        <div className="text-center">
                          <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Click "Remove Background" to start</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── SECTION 7: BACKGROUND OPTIONS ─── */}
              {hasResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-5 bg-slate-800/50 rounded-2xl border border-slate-700"
                >
                  <h3 className="font-bold text-ink uppercase tracking-widest text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4 text-tertiary" /> Background Options
                  </h3>

                  <div className="flex gap-2">
                    {([
                      ['transparent', 'Transparent', <Layers key="t" className="w-4 h-4" />],
                      ['color', 'Solid Color', <Palette key="c" className="w-4 h-4" />],
                      ['gradient', 'Gradient', <Sparkles key="g" className="w-4 h-4" />],
                    ] as const).map(([mode, label, icon]) => (
                      <button
                        key={mode}
                        onClick={() => setBgMode(mode)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                          bgMode === mode
                            ? 'bg-tertiary text-black'
                            : 'bg-slate-700 hover:bg-slate-600 text-ink'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>

                  {bgMode === 'color' && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {BG_COLORS.filter(c => c.name !== 'Transparent').map((c) => (
                          <button
                            key={c.value}
                            onClick={() => setBgColor(c.value)}
                            className={`w-10 h-10 rounded-xl border-2 transition-all ${
                              bgColor === c.value ? 'border-tertiary scale-110' : 'border-slate-600 hover:border-slate-500'
                            }`}
                            style={{ backgroundColor: c.preview }}
                            title={c.name}
                          />
                        ))}
                        <div className="relative">
                          <input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="w-10 h-10 rounded-xl border-2 border-slate-600 cursor-pointer"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink font-mono text-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  )}

                  {bgMode === 'gradient' && (
                    <div className="grid grid-cols-3 gap-2">
                      {GRADIENTS.map((g) => (
                        <button
                          key={g.name}
                          onClick={() => setSelectedGradient(g.value)}
                          className={`h-12 rounded-xl border-2 transition-all ${
                            selectedGradient === g.value ? 'border-tertiary scale-105' : 'border-slate-600 hover:border-slate-500'
                          }`}
                          style={{ background: g.value }}
                          title={g.name}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── SECTION 8: QUICK EDITOR ─── */}
              {hasResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setShowEditor(!showEditor)}
                    className="flex items-center gap-2 text-sm font-bold text-ink/70 hover:text-tertiary transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Quick Editor
                    {showEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {showEditor && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
                          {/* Editor Tabs */}
                          <div className="flex gap-1 p-1 bg-slate-900/50 rounded-xl">
                            {([
                              ['crop', 'Crop', Crop],
                              ['resize', 'Resize', Maximize2],
                              ['rotate', 'Rotate', RotateCwIcon],
                              ['effects', 'Effects', Sparkles],
                            ] as const).map(([tab, label, Icon]) => (
                              <button
                                key={tab}
                                onClick={() => setEditorTab(tab)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                                  editorTab === tab ? 'bg-tertiary text-black' : 'text-ink/50 hover:text-ink'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" /> {label}
                              </button>
                            ))}
                          </div>

                          {/* Crop Tab */}
                          {editorTab === 'crop' && (
                            <div className="space-y-3">
                              <div className="flex gap-2 flex-wrap">
                                {CROP_PRESETS.map((preset, i) => (
                                  <button
                                    key={preset.name}
                                    onClick={() => setCropPreset(i)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                      cropPreset === i ? 'bg-tertiary text-black' : 'bg-slate-700 text-ink hover:bg-slate-600'
                                    }`}
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">X Position</label>
                                  <input
                                    type="range" min="0" max="100" value={editState.cropX}
                                    onChange={(e) => setEditState(s => ({ ...s, cropX: +e.target.value }))}
                                    className="w-full accent-tertiary"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">Y Position</label>
                                  <input
                                    type="range" min="0" max="100" value={editState.cropY}
                                    onChange={(e) => setEditState(s => ({ ...s, cropY: +e.target.value }))}
                                    className="w-full accent-tertiary"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">Width</label>
                                  <input
                                    type="range" min="10" max="100" value={editState.cropW}
                                    onChange={(e) => setEditState(s => ({ ...s, cropW: +e.target.value }))}
                                    className="w-full accent-tertiary"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">Height</label>
                                  <input
                                    type="range" min="10" max="100" value={editState.cropH}
                                    onChange={(e) => setEditState(s => ({ ...s, cropH: +e.target.value }))}
                                    className="w-full accent-tertiary"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Resize Tab */}
                          {editorTab === 'resize' && (
                            <div className="space-y-3">
                              <div className="flex gap-2 flex-wrap">
                                {RESIZE_PRESETS.map((preset, i) => (
                                  <button
                                    key={preset.name}
                                    onClick={() => {
                                      setResizePreset(i);
                                      setEditState(s => ({ ...s, resizeW: preset.w, resizeH: preset.h }));
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                      resizePreset === i ? 'bg-tertiary text-black' : 'bg-slate-700 text-ink hover:bg-slate-600'
                                    }`}
                                  >
                                    {preset.name}
                                  </button>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">Width (px)</label>
                                  <input
                                    type="number"
                                    value={editState.resizeW || ''}
                                    onChange={(e) => setEditState(s => ({ ...s, resizeW: +e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink text-sm font-mono"
                                    placeholder="Auto"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-ink/40 mb-1 block">Height (px)</label>
                                  <input
                                    type="number"
                                    value={editState.resizeH || ''}
                                    onChange={(e) => setEditState(s => ({ ...s, resizeH: +e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-ink text-sm font-mono"
                                    placeholder="Auto"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rotate Tab */}
                          {editorTab === 'rotate' && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-4 gap-2">
                                {[
                                  { label: '0°', action: () => setEditState(s => ({ ...s, rotation: 0 })) },
                                  { label: '90°', action: () => setEditState(s => ({ ...s, rotation: 90 })) },
                                  { label: '180°', action: () => setEditState(s => ({ ...s, rotation: 180 })) },
                                  { label: '270°', action: () => setEditState(s => ({ ...s, rotation: 270 })) },
                                ].map((opt) => (
                                  <button
                                    key={opt.label}
                                    onClick={opt.action}
                                    className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                                      editState.rotation === parseInt(opt.label) ? 'bg-tertiary text-black' : 'bg-slate-700 text-ink hover:bg-slate-600'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditState(s => ({ ...s, flipH: !s.flipH }))}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                                    editState.flipH ? 'bg-tertiary text-black' : 'bg-slate-700 text-ink hover:bg-slate-600'
                                  }`}
                                >
                                  <FlipHorizontal className="w-4 h-4" /> Flip H
                                </button>
                                <button
                                  onClick={() => setEditState(s => ({ ...s, flipV: !s.flipV }))}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                                    editState.flipV ? 'bg-tertiary text-black' : 'bg-slate-700 text-ink hover:bg-slate-600'
                                  }`}
                                >
                                  <FlipVertical className="w-4 h-4" /> Flip V
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Effects Tab */}
                          {editorTab === 'effects' && (
                            <div className="space-y-3">
                              <div>
                                <label className="text-[10px] text-ink/40 mb-1 flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" /> Blur Background: {editState.blur}px
                                </label>
                                <input
                                  type="range" min="0" max="20" value={editState.blur}
                                  onChange={(e) => setEditState(s => ({ ...s, blur: +e.target.value }))}
                                  className="w-full accent-tertiary"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-ink/40 mb-1 flex items-center gap-1">
                                  <SunMedium className="w-3 h-3" /> Shadow Effect: {editState.shadow}%
                                </label>
                                <input
                                  type="range" min="0" max="100" value={editState.shadow}
                                  onChange={(e) => setEditState(s => ({ ...s, shadow: +e.target.value }))}
                                  className="w-full accent-tertiary"
                                />
                              </div>
                            </div>
                          )}

                          {/* Apply Edits Button */}
                          <button
                            onClick={applyEdits}
                            className="w-full py-2.5 bg-tertiary/20 text-tertiary font-bold text-sm rounded-xl hover:bg-tertiary/30 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" /> Apply Edits
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ─── SECTION 6: RESULT ACTIONS ─── */}
              <div className="flex flex-wrap gap-3">
                {!hasResult && (
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-gradient-to-r from-tertiary to-tertiary/80 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-tertiary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" /> Remove Background
                  </button>
                )}
                {hasResult && (
                  <>
                    <button
                      onClick={() => handleDownload('png')}
                      className="flex-1 py-3 bg-gradient-to-r from-primary to-primary/80 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> PNG
                    </button>
                    <button
                      onClick={() => handleDownload('hd')}
                      className="flex-1 py-3 bg-gradient-to-r from-tertiary to-tertiary/80 text-black font-bold uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-tertiary/20 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> HD PNG
                    </button>
                    <button
                      onClick={() => handleDownload('webp')}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-ink font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> WEBP
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-ink/60" />}
                      </button>
                      <button
                        onClick={handleShare}
                        className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4 text-ink/60" />
                      </button>
                      <button
                        onClick={reset}
                        className="px-4 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
                        title="Reset"
                      >
                        <RefreshCw className="w-4 h-4 text-ink/60" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── FULLSCREEN VIEW ─── */}
          <AnimatePresence>
            {fullscreenView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                onClick={() => setFullscreenView(null)}
              >
                <button onClick={() => setFullscreenView(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-10">
                  <X className="w-6 h-6" />
                </button>
                <img
                  src={fullscreenView === 'original' ? preview! : resultImage!}
                  alt={fullscreenView === 'original' ? 'Original' : 'Result'}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ═══════ SECTION 11: COMMUNITY USE CASES ═══════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
          Community Use Cases
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { icon: ShoppingBag, title: 'E-commerce', desc: 'Clean product photos', color: 'from-blue-500/20 to-cyan-500/20' },
            { icon: User, title: 'Profile Pictures', desc: 'Professional headshots', color: 'from-purple-500/20 to-pink-500/20' },
            { icon: Youtube, title: 'YouTube', desc: 'Eye-catching thumbnails', color: 'from-red-500/20 to-orange-500/20' },
            { icon: Megaphone, title: 'Marketing', desc: 'Ad creatives & banners', color: 'from-green-500/20 to-emerald-500/20' },
            { icon: Package, title: 'Product Photos', desc: 'Marketplace listings', color: 'from-amber-500/20 to-yellow-500/20' },
          ].map((use, i) => (
            <motion.div
              key={use.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 bg-gradient-to-br ${use.color} border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-all text-center`}
            >
              <use.icon className="w-6 h-6 text-white/60 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-white">{use.title}</h3>
              <p className="text-[10px] text-white/40 mt-1">{use.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════ SECTION 14: SOCIAL PROOF ═══════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { value: 284750, suffix: '+', label: 'Images Processed', icon: Image },
          { value: 142380, suffix: '+', label: 'Downloads', icon: ArrowDownToLine },
          { value: 98, suffix: '%', label: 'User Satisfaction', icon: Star },
          { value: 67420, suffix: '+', label: 'Repeat Users', icon: RefreshCw },
        ].map((stat, i) => (
          <div key={stat.label} className="text-center p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-black text-white">
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-[10px] text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.section>

      {/* ═══════ SECTION 13: CONTENT SECTION ═══════ */}
      <div className="mt-12 space-y-12">
        {/* What is Background Remover */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-4">
            What is Background Remover?
          </h2>
          <div className="text-sm text-white/50 leading-relaxed space-y-4">
            <p>
              A Background Remover is a powerful AI tool that automatically detects and removes the background from any image, leaving only the main subject. Using advanced edge detection and flood fill algorithms, our tool analyzes the image to distinguish between the foreground subject and the background, then makes the background transparent — all within your browser.
            </p>
            <p>
              Unlike traditional background removal methods that require manual selection or expensive software like Photoshop, our AI-powered tool does it in one click. No design skills, no subscriptions, no uploads to external servers. Your images stay private and secure on your device.
            </p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">Who Should Use This Tool?</h3>
              <ul className="space-y-2 text-white/50 text-xs">
                {[
                  'E-commerce sellers needing clean product photos',
                  'Social media creators making profile pictures and posts',
                  'YouTubers creating thumbnail images',
                  'Designers prototyping compositions quickly',
                  'Anyone needing passport photos or ID images',
                  'Marketing teams creating ad creatives',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* How it Works */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            How it Works
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Upload Your Image', desc: 'Drag and drop an image, paste from clipboard, enter a URL, or click to browse. We support PNG, JPG, JPEG, and WebP formats up to 10MB.' },
              { title: 'AI Analyzes the Image', desc: 'Our AI engine uses multi-point sampling and edge-aware flood fill with 8-directional neighbor detection to identify the subject and background.' },
              { title: 'Background Removed', desc: 'The background is automatically removed with edge smoothing and feathering for clean, professional results.' },
              { title: 'Customize & Download', desc: 'Choose a transparent, solid color, or gradient background. Use the quick editor for crop, resize, rotate, and effects. Download as PNG, HD PNG, or WEBP.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Benefits */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            Benefits
          </h2>
          <div className="space-y-3">
            {[
              { title: 'No Photoshop Required', description: 'Get professional results without expensive software or design skills. One click is all it takes.' },
              { title: 'Privacy by Design', description: 'Unlike other tools that upload your images to servers, everything runs locally in your browser. Your images never leave your device.' },
              { title: 'Works Offline', description: 'Once loaded, the tool can work without an internet connection. Process images anytime, anywhere.' },
              { title: 'High-Quality Output', description: 'Edge smoothing and feathering ensure clean, professional results suitable for print and web use.' },
              { title: 'Multiple Format Support', description: 'Import PNG, JPG, JPEG, and WebP files. Output high-quality PNG with alpha transparency.' },
              { title: 'Batch Processing', description: 'Save time by processing up to 20 images at once. Perfect for e-commerce product photography.' },
              { title: 'Quick Editing Built-in', description: 'Crop, resize, rotate, flip, blur, and add shadow effects without leaving the tool.' },
              { title: 'History & Favorites', description: 'All processed images are saved locally. Favorite your best results for quick access.' },
            ].map((ben, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{ben.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{ben.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '📺', title: 'YouTube Thumbnails', desc: 'Extract subjects from photos to create eye-catching thumbnail compositions' },
              { icon: '🛍️', title: 'Product Photos', desc: 'Get clean, white-background product images for e-commerce listings' },
              { icon: '📱', title: 'Social Media', desc: 'Create stunning profile pictures and social media graphics' },
              { icon: '🛂', title: 'Passport Photos', desc: 'Remove backgrounds for official documents and passport applications' },
              { icon: '🛒', title: 'E-commerce', desc: 'Prepare product images for Amazon, eBay, Shopify, and other marketplaces' },
              { icon: '🎨', title: 'Design Projects', desc: 'Extract elements for collages, presentations, and graphic design work' },
            ].map((use, i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-colors">
                <div className="text-2xl mb-3">{use.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{use.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{use.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Best Practices */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            Best Practices
          </h2>
          <div className="space-y-3">
            {[
              { title: 'Use High-Contrast Images', desc: 'Background removal works best when the subject has clear contrast against the background.' },
              { title: 'Avoid Busy Backgrounds', desc: 'Solid or simple backgrounds produce cleaner results than complex, busy scenes.' },
              { title: 'Check Edge Quality', desc: 'Use the before/after comparison slider to inspect edges and adjust if needed.' },
              { title: 'Export as PNG for Transparency', desc: 'Always download as PNG when you need transparent backgrounds for layering.' },
              { title: 'Batch Process for Efficiency', desc: 'Use batch mode to process multiple similar images at once and save time.' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{tip.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══════ SECTION 12: RELATED TOOLS ═══════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'AI Image Generator', desc: 'Generate stunning AI images from text prompts', path: '/tools/ai-image-generator', icon: Sparkles },
              { name: 'Image Compressor', desc: 'Reduce image file size while maintaining quality', path: '/tools/image-compressor', icon: Minimize2 },
              { name: 'Image Converter', desc: 'Convert between JPG, PNG, WebP, HEIC formats', path: '/tools/image-converter', icon: RefreshCw },
              { name: 'QR Code Generator', desc: 'Create custom QR codes for links, text, and contacts', path: '/tools/qr-code-generator', icon: Globe },
              { name: 'AI Caption Generator', desc: 'Generate engaging captions for your social media posts', path: '/tools/ai-caption-generator', icon: Megaphone },
            ].map((tool, i) => (
              <Link
                key={i}
                to={tool.path}
                className="group flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-primary/30 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{tool.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ═══════ FAQ (12+ FAQs) ═══════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {[
              { q: 'What is an AI Background Remover?', a: 'An AI Background Remover is a tool that automatically detects and removes the background from images using artificial intelligence and computer vision algorithms. It identifies the main subject and makes the background transparent.' },
              { q: 'Is this background remover free to use?', a: 'Yes, our AI Background Remover is completely free. There are no hidden charges, subscription fees, or usage limits. Process as many images as you need.' },
              { q: 'Are my images uploaded to a server?', a: 'No. All processing happens directly in your browser using JavaScript and Canvas API. Your images never leave your device, ensuring complete privacy.' },
              { q: 'What image formats are supported?', a: 'We support PNG, JPG, JPEG, and WebP input formats. The output is always a high-quality PNG file with alpha transparency support, or WEBP format if you choose.' },
              { q: 'What is the maximum file size?', a: 'The maximum file size is 10MB. For best results, use images with clear subject-background contrast and reasonable dimensions.' },
              { q: 'Can I process multiple images at once?', a: 'Yes! Our batch mode allows you to upload and process up to 20 images simultaneously. Perfect for e-commerce product photography.' },
              { q: 'How accurate is the background removal?', a: 'Our AI uses multi-point sampling and edge-aware flood fill with 8-directional neighbor detection for precise results. It works best with images where the subject has clear contrast against the background.' },
              { q: 'Can I replace the background with a color?', a: 'Yes. After removing the background, you can choose from preset solid colors, a custom color picker, or gradient backgrounds. The tool supports transparent, solid color, and gradient modes.' },
              { q: 'Does it work on mobile devices?', a: 'Absolutely. Our background remover is fully responsive and works on all modern smartphones, tablets, and desktop browsers including Chrome, Firefox, Safari, and Edge.' },
              { q: 'Can I use the results commercially?', a: 'Yes, you own the output created using our tools. You are free to use the results for personal or commercial purposes including marketing materials, product listings, and social media.' },
              { q: 'What is the quick editor?', a: 'The quick editor is a lightweight built-in editing tool that lets you crop, resize, rotate, flip, blur, and add shadow effects to your processed image without needing external software.' },
              { q: 'How do I paste an image from clipboard?', a: 'Simply copy an image to your clipboard (Ctrl+C or right-click > Copy) and then press Ctrl+V while the tool is open. The image will be automatically uploaded and ready for processing.' },
              { q: 'Can I upload an image from a URL?', a: 'Yes. Click the "Paste URL" link in the upload area and enter the image URL. The tool will fetch and load the image directly.' },
              { q: 'What makes this different from remove.bg?', a: 'Unlike remove.bg which requires API uploads, our tool processes everything locally in your browser. This means better privacy, no file size limits from servers, and it can work offline once loaded.' },
            ].map((item, i) => (
              <FAQItem key={i} item={item} />
            ))}
          </div>
        </motion.section>
      </div>

      {/* ═══════ ADSENSE SAFE ZONES ═══════ */}
      {/* Ads allowed: Below Results, Before FAQ, After Content Section */}
      {/* Ads NEVER: Inside Upload Area, Preview Area, Editing Interface */}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════════ */

function FAQItem({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-white pr-4">{item.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 text-xs text-white/50 leading-relaxed border-t border-white/[0.04] pt-3">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
