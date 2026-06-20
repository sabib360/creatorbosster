import { useState, useRef, useCallback } from 'react';
import { Download, AlertCircle, Loader, QrCode, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import ToolPage from '../ToolPage';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

interface WiFiConfig {
  ssid: string;
  password: string;
  hidden: boolean;
}

interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  org: string;
}

const QR_TYPES: { id: QRType; label: string; description: string }[] = [
  { id: 'url', label: 'URL / Link', description: 'Website or social link' },
  { id: 'text', label: 'Plain Text', description: 'Any text message' },
  { id: 'email', label: 'Email', description: 'Pre-filled email' },
  { id: 'phone', label: 'Phone Number', description: 'Dialable number' },
  { id: 'wifi', label: 'WiFi', description: 'Network credentials' },
  { id: 'vcard', label: 'Contact Card', description: 'vCard information' },
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

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState<QRType>('url');
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [phone, setPhone] = useState('');
  const [wifi, setWifi] = useState<WiFiConfig>({ ssid: '', password: '', hidden: false });
  const [vcard, setVcard] = useState<VCardConfig>({ firstName: '', lastName: '', phone: '', email: '', org: '' });
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>('M');
  const [size, setSize] = useState(256);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getQRValue = useCallback((): string => {
    switch (qrType) {
      case 'url': return url;
      case 'text': return text;
      case 'email': return `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
      case 'phone': return `tel:${phone}`;
      case 'wifi': return `WIFI:T:WPA;S:${wifi.ssid};P:${wifi.password};${wifi.hidden ? 'H:true;' : ''}`;
      case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.lastName};${vcard.firstName}\nFN:${vcard.firstName} ${vcard.lastName}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nORG:${vcard.org}\nEND:VCARD`;
      default: return '';
    }
  }, [qrType, url, text, email, phone, wifi, vcard]);

  const validate = (): boolean => {
    switch (qrType) {
      case 'url': return url.trim().length > 10 && url.startsWith('http');
      case 'text': return text.trim().length > 0;
      case 'email': return email.to.includes('@');
      case 'phone': return phone.trim().length >= 7;
      case 'wifi': return wifi.ssid.trim().length > 0;
      case 'vcard': return vcard.firstName.trim().length > 0 || vcard.lastName.trim().length > 0;
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
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const svgEl = canvasRef.current?.querySelector('svg');
      if (!svgEl) return;
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode-${qrType}-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const canvasEl = canvasRef.current?.querySelector('canvas');
      if (!canvasEl) return;
      const url = canvasEl.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
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

  const qrValue = generated ? getQRValue() : '';

  const renderInput = () => {
    const inputClass = 'w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary';
    const labelClass = 'block text-sm font-semibold text-white mb-1';

    switch (qrType) {
      case 'url':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setGenerated(false); }}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>
        );
      case 'text':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Text Content</label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setGenerated(false); }}
              placeholder="Enter any text you want to encode..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
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
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setGenerated(false); }} placeholder="+1 (555) 123-4567" className={inputClass} />
          </div>
        );
      case 'wifi':
        return (
          <div className="space-y-3">
            <label className={labelClass}>Network Name (SSID) *</label>
            <input type="text" value={wifi.ssid} onChange={(e) => { setWifi({ ...wifi, ssid: e.target.value }); setGenerated(false); }} placeholder="MyWiFiNetwork" className={inputClass} />
            <label className={labelClass}>Password</label>
            <input type="text" value={wifi.password} onChange={(e) => { setWifi({ ...wifi, password: e.target.value }); setGenerated(false); }} placeholder="password123" className={inputClass} />
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={wifi.hidden} onChange={(e) => { setWifi({ ...wifi, hidden: e.target.checked }); setGenerated(false); }} className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary" />
              Hidden network
            </label>
          </div>
        );
      case 'vcard':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" value={vcard.firstName} onChange={(e) => { setVcard({ ...vcard, firstName: e.target.value }); setGenerated(false); }} placeholder="John" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" value={vcard.lastName} onChange={(e) => { setVcard({ ...vcard, lastName: e.target.value }); setGenerated(false); }} placeholder="Doe" className={inputClass} />
              </div>
            </div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={vcard.phone} onChange={(e) => { setVcard({ ...vcard, phone: e.target.value }); setGenerated(false); }} placeholder="+1 (555) 123-4567" className={inputClass} />
            <label className={labelClass}>Email</label>
            <input type="email" value={vcard.email} onChange={(e) => { setVcard({ ...vcard, email: e.target.value }); setGenerated(false); }} placeholder="john@example.com" className={inputClass} />
            <label className={labelClass}>Organization</label>
            <input type="text" value={vcard.org} onChange={(e) => { setVcard({ ...vcard, org: e.target.value }); setGenerated(false); }} placeholder="Company Name" className={inputClass} />
          </div>
        );
    }
  };

  return (
    <ToolPage>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">QR Code Generator</h1>
          <p className="text-gray-400">Create custom QR codes for links, text, contacts, WiFi, and more</p>
        </div>

        {/* QR Type Selector */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <label className="block text-sm font-semibold text-white">QR Code Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {QR_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setQrType(t.id); setGenerated(false); setError(''); }}
                className={`px-4 py-3 rounded-lg font-semibold transition text-center ${
                  qrType === t.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'
                }`}
              >
                <span className="block text-sm">{t.label}</span>
                <span className="block text-xs opacity-70 mt-1">{t.description}</span>
              </button>
            ))}
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
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Customization */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-white font-semibold">Customization</h3>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Foreground Color</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setFgColor(c); setGenerated(false); }}
                    className={`w-8 h-8 rounded-lg border-2 transition ${fgColor === c ? 'border-primary scale-110' : 'border-slate-600 hover:border-slate-400'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input type="color" value={fgColor} onChange={(e) => { setFgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#fff3cd', '#d1ecf1', '#d4edda', '#f8d7da'].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setBgColor(c); setGenerated(false); }}
                    className={`w-8 h-8 rounded-lg border-2 transition ${bgColor === c ? 'border-primary scale-110' : 'border-slate-600 hover:border-slate-400'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setGenerated(false); }} className="w-8 h-8 rounded-lg cursor-pointer border-0" />
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Error Correction Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ERROR_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => { setErrorLevel(lvl.id); setGenerated(false); }}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    errorLevel === lvl.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-700 text-gray-300 hover:text-white border border-slate-600'
                  }`}
                >
                  <span className="block text-sm">{lvl.label}</span>
                  <span className="block text-xs opacity-70">{lvl.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">Size: {size}x{size}px</label>
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setGenerated(false); }}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full px-6 py-4 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          Generate QR Code
        </button>

        {/* Preview & Download */}
        {generated && qrValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-white font-semibold">Preview</h3>

            <div className="flex flex-col items-center gap-4">
              <div
                ref={canvasRef}
                className="p-4 bg-white rounded-xl shadow-lg inline-block"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG
                  value={qrValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={errorLevel}
                />
              </div>

              {/* Hidden canvas for PNG export */}
              <div className="hidden">
                <QRCodeCanvas
                  value={qrValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={errorLevel}
                />
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload('png')}
                  className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={() => handleDownload('svg')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download SVG
                </button>
                <button
                  onClick={handleCopyValue}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Value'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3">
          <h3 className="text-lg font-bold text-white">✨ Features</h3>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Support for URLs, text, email, phone, WiFi, and vCard</li>
            <li>✓ Custom foreground and background colors</li>
            <li>✓ 4 error correction levels (L, M, Q, H)</li>
            <li>✓ Adjustable size from 128px to 512px</li>
            <li>✓ Download as PNG or SVG</li>
            <li>✓ Scan-ready output</li>
            <li>✓ 100% free, runs in your browser</li>
          </ul>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-200 mb-2">⚠️ Important</h3>
          <p className="text-yellow-100 text-sm">
            Always double-check the content encoded in your QR code before distributing it. Scanning a QR code from an untrusted source can lead to malicious websites.
          </p>
        </div>
      </motion.div>
    </ToolPage>
  );
}
