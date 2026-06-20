import { useState, useMemo } from 'react';
import { Copy, Check, Palette } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255;
  const k = Math.min(c, m, y);
  return { c: Math.round((c - k) / (1 - k) * 100), m: Math.round((m - k) / (1 - k) * 100), y: Math.round((y - k) / (1 - k) * 100), k: Math.round(k * 100) };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p: number, q: number, t: number) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorCodeConverter() {
  const [hex, setHex] = useState('#3B82F6');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const colors = useMemo(() => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    const complement = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
    const compHex = `#${complement.r.toString(16).padStart(2, '0')}${complement.g.toString(16).padStart(2, '0')}${complement.b.toString(16).padStart(2, '0')}`;
    const palette = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
      const c = hslToRgb((hsl.h + deg) % 360, hsl.s, hsl.l);
      return `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
    });
    return { rgb, hsl, cmyk, compHex, palette };
  }, [hex]);

  const copyValue = async (key: string, value: string) => {
    try { await navigator.clipboard.writeText(value); } catch {
      const t = document.createElement('textarea'); t.value = value; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopiedField(key); setTimeout(() => setCopiedField(null), 2000);
  };

  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto"><Palette className="w-8 h-8 text-purple-400" /></div>
        <h1 className="text-3xl font-display font-black uppercase tracking-tighter text-ink">Color Code Converter</h1>
        <p className="text-ink/60">Convert between HEX, RGB, HSL, and CMYK color formats</p>
      </div>

      <div className="space-y-4 p-6 bg-slate-800/50 rounded-2xl">
        <div className="flex items-center gap-4">
          <input type="color" value={isValidHex ? hex : '#000000'} onChange={(e) => setHex(e.target.value)} className="w-16 h-16 rounded-xl border border-slate-700 cursor-pointer" />
          <div className="flex-1 space-y-1">
            <label className="font-bold text-ink uppercase tracking-widest text-sm">HEX</label>
            <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-ink font-mono focus:outline-none focus:border-purple-400" />
          </div>
        </div>
      </div>

      {colors && (
        <div className="space-y-4">
          {/* Preview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 rounded-xl border border-slate-700" style={{ backgroundColor: hex }} />
            <div className="h-24 rounded-xl border border-slate-700" style={{ backgroundColor: colors.compHex }} />
          </div>
          <div className="flex items-center justify-between text-xs text-ink/60">
            <span>Original</span><span>Complementary</span>
          </div>

          {/* Color Values */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HEX', value: hex, key: 'hex' },
              { label: 'RGB', value: `rgb(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b})`, key: 'rgb' },
              { label: 'HSL', value: `hsl(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%)`, key: 'hsl' },
              { label: 'CMYK', value: `cmyk(${colors.cmyk.c}%, ${colors.cmyk.m}%, ${colors.cmyk.y}%, ${colors.cmyk.k}%)`, key: 'cmyk' },
            ].map(({ label, value, key }) => (
              <div key={key} className="p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase">{label}</span>
                  <button onClick={() => copyValue(key, value)} className="p-1 hover:bg-slate-700 rounded transition-colors">
                    {copiedField === key ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-ink/60" />}
                  </button>
                </div>
                <code className="text-xs text-ink font-mono break-all">{value}</code>
              </div>
            ))}
          </div>

          {/* Color Palette */}
          <div className="p-4 bg-slate-800/50 rounded-xl space-y-2">
            <h4 className="font-bold text-ink text-sm uppercase">Color Palette (12 variations)</h4>
            <div className="flex gap-1 rounded-lg overflow-hidden">
              {colors.palette.map((c, i) => (
                <button key={i} onClick={() => setHex(c)} className="flex-1 h-10 hover:scale-110 transition-transform" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
