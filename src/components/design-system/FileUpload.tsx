import { useState, useRef, DragEvent } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({ accept, multiple = false, maxSize = 10, onFilesSelected, className }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragIn = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragOut = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.size <= maxSize * 1024 * 1024);
    setSelectedFiles((prev) => [...prev, ...files]);
    onFilesSelected?.(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter((f) => f.size <= maxSize * 1024 * 1024);
    setSelectedFiles((prev) => [...prev, ...files]);
    onFilesSelected?.(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300',
          isDragging 
            ? 'border-brand-500/50 bg-brand-500/5 scale-[1.02]' 
            : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]'
        )}
      >
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300',
          isDragging ? 'bg-brand-500/10 scale-110' : 'bg-white/[0.04]'
        )}>
          <Upload className={cn('h-7 w-7 transition-colors', isDragging ? 'text-brand-400' : 'text-white/30')} />
        </div>
        <p className="text-sm font-medium text-white/70 mb-1">
          {isDragging ? 'Drop files here' : 'Drop files here or click to upload'}
        </p>
        <p className="text-xs text-white/30">Max file size: {maxSize}MB</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileInput} className="hidden" />
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            {selectedFiles.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <File className="h-4 w-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{file.name}</p>
                  <p className="text-xs text-white/30">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <button 
                  onClick={() => removeFile(i)} 
                  className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
