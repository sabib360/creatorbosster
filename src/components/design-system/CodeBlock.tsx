import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
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
    <div className={cn('rounded-2xl overflow-hidden border border-white/[0.06]', className)}>
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-3 bg-[#0B1120] border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-white/30" />
            {filename && <span className="text-xs text-white/40 font-mono">{filename}</span>}
            {language && (
              <span className="text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md font-medium">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="text-white/30 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      <div className="overflow-x-auto bg-[#050816]">
        <pre className="p-4 text-sm text-white/60 font-mono leading-relaxed">
          {showLineNumbers ? (
            lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-white/15 w-8 text-right mr-4 select-none">{i + 1}</span>
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
