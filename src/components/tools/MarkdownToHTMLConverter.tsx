import { useState } from 'react';
import { Copy, Check, Code, ArrowRightLeft, Eye } from 'lucide-react';

function markdownToHTML(md: string): string {
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gim, '<hr />');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/^[-*] (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<\/p><p>/g, '\n\n').replace(/^<p>/, '').replace(/<\/p>$/, '');
  return html;
}

export default function MarkdownToHTMLConverter() {
  const [input, setInput] = useState('# Hello World\n\nThis is a **bold** and *italic* paragraph.\n\n## Features\n\n- Item 1\n- Item 2\n- Item 3\n\n> This is a blockquote\n\n[Click here](https://example.com)\n\n```javascript\nconsole.log("Hello!");\n```');
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const convert = () => { setOutput(markdownToHTML(input)); };

  const copyOutput = async () => {
    try { await navigator.clipboard.writeText(output); } catch {
      const t = document.createElement('textarea'); t.value = output; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto"><Code className="w-8 h-8 text-purple-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Markdown to HTML</h1>
        <p className="text-ink/60">Convert Markdown text to HTML with live preview</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-bold text-ink uppercase tracking-widest text-sm">Markdown Input</h3>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-72 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none focus:outline-none focus:border-purple-400" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-widest text-sm">{showPreview ? 'Preview' : 'HTML Output'}</h3>
            <div className="flex gap-1">
              <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-ink transition-colors"><Eye className="w-3 h-3" /> {showPreview ? 'Code' : 'Preview'}</button>
              {output && <button onClick={copyOutput} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-ink transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>}
            </div>
          </div>
          {showPreview ? (
            <div className="w-full h-72 px-4 py-3 bg-white rounded-xl overflow-auto text-black text-sm" dangerouslySetInnerHTML={{ __html: output }} />
          ) : (
            <textarea value={output} readOnly className="w-full h-72 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none" placeholder="HTML output..." />
          )}
        </div>
      </div>

      <button onClick={convert} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors flex items-center justify-center gap-2">
        <ArrowRightLeft className="w-5 h-5" /> Convert to HTML
      </button>
    </div>
  );
}
