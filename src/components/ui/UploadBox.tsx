import { useRef, useState, DragEvent } from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function UploadBox({
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  className,
}: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
        className="sr-only"
        aria-label="Upload file"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'w-full p-8 border-2 border-dashed rounded-xl transition-all duration-200 text-center cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]',
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
            isDragging ? 'bg-primary/20' : 'bg-white/5'
          )}>
            {isDragging ? (
              <FileImage className="w-6 h-6 text-primary" />
            ) : (
              <Upload className="w-6 h-6 text-white/30" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">
              {isDragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-white/30 mt-1">
              Max file size: {maxSize}MB
            </p>
          </div>
        </div>
      </button>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
          <X className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}
