import { useState } from 'react';
import { Copy, Check, Code, ArrowRightLeft } from 'lucide-react';

function htmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n');
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(?:ul|ol|div|span|section|article|header|footer|nav|main)[^>]*>/gi, '\n');
  md = md.replace(/<[^>]+>/g, '');
  md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  md = md.replace(/\n{3,}/g, '\n\n');
  return md.trim();
}

export default function HTMLToMarkdownConverter() {
  const [input, setInput] = useState('<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n<a href="https://example.com">Click here</a>');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => { setOutput(htmlToMarkdown(input)); };

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
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">HTML to Markdown</h1>
        <p className="text-ink/60">Convert HTML code to clean, readable Markdown</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between"><h3 className="font-bold text-ink uppercase tracking-widest text-sm">HTML Input</h3><span className="text-xs text-ink/60">{input.length} chars</span></div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-72 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none focus:outline-none focus:border-purple-400" placeholder="Paste HTML here..." />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between"><h3 className="font-bold text-ink uppercase tracking-widest text-sm">Markdown Output</h3>
            {output && <button onClick={copyOutput} className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold text-ink transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}</button>}
          </div>
          <textarea value={output} readOnly className="w-full h-72 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-ink font-mono text-xs resize-none" placeholder="Markdown output..." />
        </div>
      </div>

      <button onClick={convert} className="w-full py-4 bg-purple-400 text-black font-bold uppercase tracking-widest rounded-xl hover:bg-purple-400/90 transition-colors flex items-center justify-center gap-2">
        <ArrowRightLeft className="w-5 h-5" /> Convert to Markdown
      </button>
    </div>
  );
}
