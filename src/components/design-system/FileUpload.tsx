import { useState, useRef, DragEvent } from 'react';
import { Upload, X, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
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
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <Upload className={cn('h-10 w-10 mb-3 transition-colors', isDragging ? 'text-primary' : 'text-muted-foreground')} />
        <p className="text-sm font-medium text-foreground">Drop files here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Max file size: {maxSize}MB</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileInput} className="hidden" />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <File className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
