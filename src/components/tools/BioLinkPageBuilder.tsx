import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Copy, Link2, CheckCircle2 } from 'lucide-react';

interface BioLinkItem {
  id: string;
  label: string;
  url: string;
}

export default function BioLinkPageBuilder() {
  const [pageTitle, setPageTitle] = useState('My Link in Bio');
  const [subtitle, setSubtitle] = useState('Welcome to my latest links and socials.');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [links, setLinks] = useState<BioLinkItem[]>([
    { id: '1', label: 'YouTube Channel', url: 'https://youtube.com/creatorboostai' },
    { id: '2', label: 'Instagram', url: 'https://instagram.com/creatorboostai' },
    { id: '3', label: 'Latest Blog', url: 'https://creatorboostai.xyz/blog' }
  ]);
  const [copied, setCopied] = useState(false);

  const addLink = () => {
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    setLinks([
      ...links,
      { id: Date.now().toString(), label: linkLabel.trim(), url: linkUrl.trim() }
    ]);
    setLinkLabel('');
    setLinkUrl('');
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; padding: 40px; }
    .page { width: 100%; max-width: 420px; background: rgba(15, 23, 42, 0.95); border-radius: 28px; padding: 28px; box-shadow: 0 40px 120px rgba(15, 23, 42, 0.35); }
    h1 { margin: 0 0 12px; font-size: 2rem; }
    p { margin: 0 0 24px; color: #cbd5e1; }
    a { display: block; margin: 10px 0; padding: 16px 18px; border-radius: 18px; background: #111827; color: #f8fafc; text-decoration: none; font-weight: 700; }
    a:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="page">
    <h1>${pageTitle}</h1>
    <p>${subtitle}</p>
    ${links.map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`).join('')}
  </div>
</body>
</html>`;

  const copyPreview = () => {
    navigator.clipboard.writeText(previewHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Bio Link Page Builder
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Build a mobile-friendly landing page for your social profiles, campaigns, and link collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-ink/60">Page Title</label>
            <input
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-ink focus:border-primary outline-none"
              placeholder="My Link in Bio"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-bold text-ink/60">Subtitle</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-ink focus:border-primary outline-none"
              placeholder="Welcome to my latest links and socials."
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-ink/60">Add a new link</label>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-ink focus:border-primary outline-none"
                placeholder="Label (e.g. Latest Video)"
              />
              <input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-ink focus:border-primary outline-none"
                placeholder="https://"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={addLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-black transition hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
            <button
              type="button"
              onClick={copyPreview}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-bold text-ink transition hover:border-primary"
            >
              <Copy className="w-4 h-4" /> {copied ? 'Copied HTML' : 'Copy Preview HTML'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-ink/60">Live preview URL</p>
                <p className="text-sm font-semibold text-ink">creatorboostai.xyz/link-in-bio</p>
              </div>
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
                  <div>
                    <p className="font-semibold text-ink">{link.label}</p>
                    <p className="text-sm text-ink/60 truncate max-w-sm">{link.url}</p>
                  </div>
                  <button type="button" onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink">Preview</h2>
              <p className="text-ink/60">See how your bio link page will look on mobile screens.</p>
            </div>
            <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6">
              <div className="rounded-3xl bg-slate-950 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-xl font-bold text-ink mb-2">{pageTitle}</p>
                <p className="text-sm text-ink/60 mb-5">{subtitle}</p>
                <div className="space-y-3">
                  {links.map((link) => (
                    <a key={link.id} href={link.url} className="block rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-slate-800" target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="font-semibold text-ink">Quick Start</p>
                <p className="text-ink/60 text-sm">Build a polished profile page in minutes. Copy the preview HTML and host it anywhere.</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-ink/60">
              <li>Add your links, profile, and CTA.</li>
              <li>Copy the generated page HTML using the button above.</li>
              <li>Host on any static page or use it as shared bio link content.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
