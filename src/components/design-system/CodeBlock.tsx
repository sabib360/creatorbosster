import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({ code, language = 'text', filename, showLineNumbers = false, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('rounded-xl border bg-slate-950 overflow-hidden', className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            {filename && <span className="text-xs text-slate-400 font-mono">{filename}</span>}
            {language && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{language}</span>}
          </div>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm text-slate-300 font-mono leading-relaxed">
          {showLineNumbers ? (
            lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-slate-600 w-8 text-right mr-4 select-none">{i + 1}</span>
                <code>{line}</code>
              </div>
            ))
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
