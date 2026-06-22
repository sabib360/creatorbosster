import { useState, useRef, useCallback, useEffect } from 'react';
import { Download, AlertCircle, QrCode, Copy, Check, Share2, RefreshCw, Upload, X, Trash2, Clock, ChevronDown, ChevronUp, Star, Wifi, Mail, Phone, MessageSquare, Link, FileText, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
/* FAQ content is rendered by ToolPage via route props */

type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'sms';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

interface WiFiConfig {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

interface HistoryItem {
  id: string;
  type: QRType;
  value: string;
  date: number;
  fgColor: string;
  bgColor: string;
}

const QR_TYPES: { id: QRType; label: string; description: string; icon: typeof Link }[] = [
  { id: 'url', label: 'URL / Link', description: 'Website or social link', icon: Link },
  { id: 'text', label: 'Plain Text', description: 'Any text message', icon: FileText },
  { id: 'email', label: 'Email', description: 'Pre-filled email', icon: Mail },
  { id: 'phone', label: 'Phone', description: 'Dialable number', icon: Phone },
  { id: 'wifi', label: 'WiFi', description: 'Network credentials', icon: Wifi },
  { id: 'sms', label: 'SMS', description: 'Text message', icon: MessageSquare },
];

const ERROR_LEVELS: { id: ErrorLevel; label: string; description: string }[] = [
  { id: 'L', label: 'Low (7%)', description: 'Smallest size' },
  { id: 'M', label: 'Medium (15%)', description: 'Recommended' },
  { id: 'Q', label: 'Quartile (25%)', description: 'Balanced' },
  { id: 'H', label: 'High (30%)', description: 'Most resilient' },
];

const PRESET_COLORS = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#ff6b6b', '#ee5a24', '#f39c12', '#27ae60',
  '#2980b9', '#8e44ad', '#2c3e50', '#d35400', '#c0392b',
];

const USE_CASES = [
  { icon: CreditCard, title: 'Business Cards', description: 'Add QR codes to business cards linking to your portfolio, LinkedIn, or website.' },
  { icon: Wifi, title: 'WiFi Sharing', description: 'Let guests connect to your WiFi instantly by scanning a QR code.' },
  { icon: Link, title: 'Payment Links', description: 'Create QR codes for payment pages, PayPal, Venmo, or crypto wallets.' },
  { icon: Star, title: 'YouTube Links', description: 'Share your YouTube channel or specific videos via scannable QR codes.' },
  { icon: Mail, title: 'Email Campaigns', description: 'Add QR codes to flyers or posters that open a pre-filled email.' },
  { icon: Phone, title: 'Contact Info', description: 'Share your phone number or SMS pre-filled message via QR codes.' },
];

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');
  const [sms, setSms] = useState({ number: '', message: '' });
  const [wifi, setWifi] = useState<WiFiConfig>({ ssid: '', password: '', encryption: 'WPA', hidden: false });
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M');
  const [size, setSize] = useState(256);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('qr-code-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveToHistory = useCallback((item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem('qr-code-history', JSON.stringify(updated));
  }, [history]);

  const getQRValue = useCallback((): string => {
    switch (qrType) {
      case 'url': return url;
      case 'text': return text;
      case 'email': return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      case 'phone': return `tel:${phone}`;
      case 'sms': return `smsto:${sms.number}:${encodeURIComponent(sms.message)}`;
      case 'wifi': return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};${wifi.hidden ? 'H:true;' : ''}`;
      default: return '';
    }
  }, [qrType, url, text, email, phone, sms, wifi]);

  const validate = (): boolean => {
    switch (qrType) {
      case 'url': return url.trim().length > 10 && url.startsWith('http');
      case 'text': return text.trim().length > 0;
      case 'email': return email.to.includes('@');
      case 'phone': return phone.trim().length >= 7;
      case 'sms': return sms.number.trim().length >= 7;
      case 'wifi': return wifi.ssid.trim().length > 0;
      default: return false;
    }
  };

  const handleGenerate = () => {
    if (!validate()) {
      setError('Please fill in the required fields for this QR code type.');
      return;
    }
    setError('');
    setGenerated(true);
    const value = getQRValue();
    saveToHistory({
      id: Date.now().toString(),
      type: qrType,
      value: value.substring(0, 100),
      date: Date.now(),
      fgColor,
      bgColor,
    });
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const svgEl = svgContainerRef.current?.querySelector('svg');
      if (!svgEl) return;
      const svgClone = svgEl.cloneNode(true) as SVGElement;
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `qrcode-${qrType}-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } else {
      const canvasEl = canvasContainerRef.current?.querySelector('canvas');
      if (!canvasEl) return;
      const downloadUrl = canvasEl.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `qrcode-${qrType}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopyValue = () => {
    navigator.clipboard.writeText(getQRValue());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const canvasEl = canvasContainerRef.current?.querySelector('canvas');
        if (!canvasEl) return;
        canvasEl.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          await navigator.share({ title: 'QR Code', text: 'Check out this QR code!', files: [file] });
        });
      } catch {}
    } else {
      handleDownload('png');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024) {
      setError('Logo file size must be under 100KB for best results.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target?.result as string);
      setGenerated(false);
      if (errorLevel !== 'H') setErrorLevel('H');
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    setGenerated(false);
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('qr-code-history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qr-code-history');
  };

  const qrValue = generated ? getQRValue() : '';

  const inputClass = 'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors';
  const labelClass = 'block text-sm font-semibold text-white mb-1';

  const renderInput = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Website URL *</label>
            <input type="url" value={url} onChange={(e) => { setUrl(e.target.value); setGenerated(false); }} placeholder="https://example.com" className={inputClass} />
          </div>
        );
      case 'text':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Text Content *</label>
            <textarea value={text} onChange={(e) => { setText(e.target.value); setGenerated(false); }} placeholder="Enter any text you want to encode..." rows={4} className={`${inputClass} resize-none`} />
          </div>
        );
      case 'email':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Email Address *</label>
            <input type="email" value={email.to} onChange={(e) => { setEmail({ ...email, to: e.target.value }); setGenerated(false); }} placeholder="recipient@example.com" className={inputClass} />
            <label className={labelClass}>Subject</label>
            <input type="text" value={email.subject} onChange={(e) => { setEmail({ ...email, subject: e.target.value }); setGenerated(false); }} placeholder="Email subject" className={inputClass} />
            <label className={labelClass}>Body</label>
            <textarea value={email.body} onChange={(e) => { setEmail({ ...email, body: e.target.value }); setGenerated(false); }} placeholder="Email body text" rows={3} className={`${inputClass} resize-none`} />
          </div>
        );
      case 'phone':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Phone Number *</label>
            <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setGenerated(false); }} placeholder="+1 (555) 123-4567" className={inputClass} />
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Phone Number *</label>
            <input type="tel" value={sms.number} onChange={(e) => { setSms({ ...sms, number: e.target.value }); setGenerated(false); }} placeholder="+1 (555) 123-4567" className={inputClass} />
            <label className={labelClass}>Message</label>
            <textarea value={sms.message} onChange={(e) => { setSms({ ...sms, message: e.target.value }); setGenerated(false); }} placeholder="Enter SMS message..." rows={3} className={`${inputClass} resize-none`} />
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Network Name (SSID) *</label>
            <input type="text" value={wifi.ssid} onChange={(e) => { setWifi({ ...wifi, ssid: e.target.value }); setGenerated(false); }} placeholder="MyWiFiNetwork" className={inputClass} />
            <label className={labelClass}>Password</label>
            <input type="text" value={wifi.password} onChange={(e) => { setWifi({ ...wifi, password: e.target.value }); setGenerated(false); }} placeholder="password123" className={inputClass} />
            <label className={labelClass}>Encryption</label>
            <div className="flex gap-3">
              {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                <button key={enc} onClick={() => { setWifi({ ...wifi, encryption: enc }); setGenerated(false); }} className={`flex-1 py-2 rounded-lg font-semibold transition ${wifi.encryption === enc ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'}`}>
                  {enc === 'nopass' ? 'None' : enc}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={wifi.hidden} onChange={(e) => { setWifi({ ...wifi, hidden: e.target.checked }); setGenerated(false); }} className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary" />
              Hidden network
            </label>
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
          <QrCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Free Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          QR Code Generator
        </h1>
        <p className="text-lg text-ink/60 max-w-2xl mx-auto">
          Create QR codes instantly for any purpose. Free, fast, and works offline.
        </p>
      </div>

      {/* QR Type Selector */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <label className="block text-sm font-semibold text-white">QR Code Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {QR_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => { setQrType(t.id); setGenerated(false); setError(''); }} className={`px-4 py-3 rounded-lg font-semibold transition text-center flex flex-col items-center gap-1 ${qrType === t.id ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'}`}>
                <Icon className="w-5 h-5 mb-1" />
                <span className="block text-sm">{t.label}</span>
                <span className="block text-xs opacity-70">{t.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Input */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Content
        </h3>
        {renderInput()}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customization */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h3 className="text-white font-semibold">Customization</h3>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Foreground Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button key={c} onClick={() => { setFgColor(c); setGenerated(false); }} className={`w-8 h-8 rounded-lg border-2 transition ${fgColor === c ? 'border-primary scale-110' : 'border-slate-600 hover:border-slate-400'}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Background Color</label>
            <div className="flex flex-wrap gap-2">
              {['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#fff3cd', '#d1ecf1', '#d4edda', '#f8d7da'].map((c) => (
                <button key={c} onClick={() => { setBgColor(c); setGenerated(false); }} className={`w-8 h-8 rounded-lg border-2 transition ${bgColor === c ? 'border-primary scale-110' : 'border-slate-600 hover:border-slate-400'}`} style={{ backgroundColor: c }} />
              ))}
              <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Center Logo (Optional)</label>
          <div className="flex items-center gap-3">
            {logo ? (
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg object-contain bg-white p-1" />
                <button onClick={removeLogo} className="px-3 py-1.5 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition">Remove</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-300 hover:text-white hover:border-slate-500 transition">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-semibold">Upload Logo</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </div>
          <p className="text-xs text-gray-500">Max 100KB. Use High error correction for best results with logos.</p>
        </div>

        {/* Error Correction Level */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Error Correction Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ERROR_LEVELS.map((lvl) => (
              <button key={lvl.id} onClick={() => { setErrorLevel(lvl.id); setGenerated(false); }} className={`px-4 py-2 rounded-lg font-semibold transition ${errorLevel === lvl.id ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'}`}>
                <span className="block text-sm">{lvl.label}</span>
                <span className="block text-xs opacity-70">{lvl.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">Size: {size}x{size}px</label>
          <input type="range" min={128} max={1024} step={32} value={size} onChange={(e) => { setSize(Number(e.target.value)); setGenerated(false); }} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>128px</span>
            <span>1024px</span>
          </div>
        </div>
      </div>

      {/* Generate + Regenerate */}
      <div className="flex gap-3">
        <button onClick={handleGenerate} className="flex-1 px-6 py-4 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" />
          {generated ? 'Update QR Code' : 'Generate QR Code'}
        </button>
        {generated && (
          <button onClick={handleGenerate} className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Regenerate
          </button>
        )}
      </div>

      {/* Preview & Download */}
      {generated && qrValue && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-white font-semibold">Preview</h3>
          <div className="flex flex-col items-center gap-4">
            <div ref={svgContainerRef} className="p-4 bg-white rounded-xl shadow-lg inline-block" style={{ backgroundColor: bgColor }}>
              <QRCodeSVG value={qrValue} size={size} fgColor={fgColor} bgColor={bgColor} level={errorLevel} imageSettings={logo ? { src: logo, x: 0.5, y: 0.5, height: size * 0.2, width: size * 0.2, excavate: true } : undefined} />
            </div>
            <div ref={canvasContainerRef} className="hidden">
              <QRCodeCanvas value={qrValue} size={size} fgColor={fgColor} bgColor={bgColor} level={errorLevel} imageSettings={logo ? { src: logo, x: 0.5, y: 0.5, height: size * 0.2, width: size * 0.2, excavate: true } : undefined} />
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => handleDownload('png')} className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button onClick={() => handleDownload('svg')} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2">
                <Download className="w-4 h-4" /> Download SVG
              </button>
              <button onClick={handleCopyValue} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Value'}
              </button>
              <button onClick={handleShare} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* History */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <button onClick={() => setShowHistory(!showHistory)} className="w-full px-6 py-4 flex items-center justify-between text-white font-semibold hover:bg-slate-700/50 transition">
          <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Recent QR Codes ({history.length})</span>
          {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        <AnimatePresence>
          {showHistory && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="px-6 pb-4 space-y-2">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No QR codes generated yet.</p>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Clear All</button>
                    </div>
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: item.bgColor, border: `1px solid ${item.fgColor}20` }}>
                          <QrCode className="w-4 h-4" style={{ color: item.fgColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-primary uppercase">{item.type}</span>
                          <p className="text-sm text-gray-400 truncate">{item.value}</p>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                        <button onClick={() => deleteHistoryItem(item.id)} className="p-1 text-gray-500 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Use Cases */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <div key={i} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <Icon className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-white font-semibold text-sm">{uc.title}</h4>
                <p className="text-gray-400 text-xs mt-1">{uc.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* What is QR Code Generator */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">What is QR Code Generator?</h2>
        <div className="text-gray-300 text-sm leading-relaxed space-y-3">
          <p>A QR Code Generator is a free online tool that creates scannable two-dimensional barcodes from various types of data. QR (Quick Response) codes can store URLs, text, contact information, WiFi credentials, and more in a compact square pattern that any smartphone camera can instantly decode.</p>
          <p>Our QR Code Generator runs entirely in your browser using client-side rendering — no data is uploaded to any server. This means your information stays private and the generation is nearly instantaneous, typically under 100 milliseconds.</p>
          <p>Whether you need QR codes for business cards, marketing materials, restaurant menus, WiFi sharing, payment links, or social media profiles, our tool provides professional-quality output with full customization options including colors, logos, and multiple download formats.</p>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">How to Use</h2>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Choose QR Code Type', desc: 'Select from URL, Text, Email, Phone, WiFi, or SMS.' },
            { step: 2, title: 'Enter Your Content', desc: 'Fill in the required fields for your chosen QR code type.' },
            { step: 3, title: 'Customize Appearance', desc: 'Pick colors, add a logo, adjust size and error correction level.' },
            { step: 4, title: 'Generate & Download', desc: 'Click Generate, then download as PNG or SVG. Scan to verify!' },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">{s.step}</span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{s.title}</h4>
                <p className="text-gray-400 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Types of QR Codes */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Types of QR Codes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QR_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <Icon className="w-5 h-5 text-primary mb-2" />
                <h4 className="text-white font-semibold text-sm">{t.label}</h4>
                <p className="text-gray-400 text-xs mt-1">{t.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            '100% free with no usage limits',
            'Client-side generation — your data never leaves your browser',
            'Works offline after first load',
            'Generates in under 100ms',
            'Download as PNG or SVG',
            'Custom colors and logo support',
            '6 QR code types supported',
            'Mobile-first responsive design',
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">Best Practices</h2>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• <strong className="text-white">Use High error correction</strong> when adding a logo to ensure scannability</p>
          <p>• <strong className="text-white">Maintain contrast</strong> — dark QR code on light background works best</p>
          <p>• <strong className="text-white">Test before printing</strong> — always scan your QR code with multiple devices</p>
          <p>• <strong className="text-white">Keep logos small</strong> — center logo should be under 30% of the QR code area</p>
          <p>• <strong className="text-white">Minimum size</strong> — at least 2cm x 2cm for print, 50px for screens</p>
          <p>• <strong className="text-white">Use SVG for print</strong> — vector format scales without quality loss</p>
          <p>• <strong className="text-white">Add quiet zone</strong> — leave white space around the QR code for reliable scanning</p>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-200 mb-2">⚠️ Important</h3>
        <p className="text-yellow-100 text-sm">Always double-check the content encoded in your QR code before distributing it. Scanning a QR code from an untrusted source can lead to malicious websites.</p>
      </div>
    </motion.div>
  );
}
