import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Copy, Check, Heart, Share2, RefreshCw, Wand2, Star,
  Gamepad2, Instagram, Facebook, Music, Crown, Swords, Eye,
  ChevronDown, ChevronUp, TrendingUp, Zap, Type, Users, Hash, Clock
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════ */
/* ─── Unicode Character Maps ────────────────────────── */
/* ═══════════════════════════════════════════════════════ */

const UPPER_MAP: Record<string, string> = {
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ꜰ', G: 'ɢ',
  H: 'ʜ', I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ',
  O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ', S: 'ꜱ', T: 'ᴛ', U: 'ᴜ',
  V: 'ᴠ', W: 'ᴡ', X: 'ˣ', Y: 'ʏ', Z: 'ᴢ',
};

const BOLD_MAP: Record<string, string> = {
  a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠',
  h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧',
  o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮',
  v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳',
  A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆',
  H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍',
  O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔',
  V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙',
};

const ITALIC_MAP: Record<string, string> = {
  a: '𝑎', b: '𝑏', c: '𝑐', d: '𝑑', e: '𝑒', f: '𝑓', g: '𝑔',
  h: 'ℎ', i: '𝑖', j: '𝑗', k: '𝑘', l: '𝑙', m: '𝑚', n: '𝑛',
  o: '𝑜', p: '𝑝', q: '𝑞', r: '𝑟', s: '𝑠', t: '𝑡', u: '𝑢',
  v: '𝑣', w: '𝑤', x: '𝑥', y: '𝑦', z: '𝑧',
  A: '𝐴', B: '𝐵', C: '𝐶', D: '𝐷', E: '𝐸', F: '𝐹', G: '𝐺',
  H: '𝐻', I: '𝐼', J: '𝐽', K: '𝐾', L: '𝐿', M: '𝑀', N: '𝑁',
  O: '𝑂', P: '𝑃', Q: '𝑄', R: '𝑅', S: '𝑆', T: '𝑇', U: '𝑈',
  V: '𝑉', W: '𝑊', X: '𝑋', Y: '𝑌', Z: '𝑍',
};

const CURSIVE_MAP: Record<string, string> = {
  a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: '𝑒', f: '𝒻', g: '𝑔',
  h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃',
  o: '𝑜', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊',
  v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏',
  A: '𝒜', B: '𝒞', C: '𝒟', D: '𝐸', E: '𝐹', F: '𝒢', G: '𝐻',
  H: '𝐼', I: '𝒥', J: '𝐾', K: '𝐿', L: '𝑀', M: '𝒩', N: '𝑂',
  O: '𝒫', P: '𝑄', Q: '𝑅', R: '𝒮', S: '𝒯', T: '𝑈', U: '𝑉',
  V: '𝑊', W: '𝑋', X: '𝑌', Y: '𝒵', Z: '𝑎',
};

const MONO_MAP: Record<string, string> = {
  a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘',
  h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟',
  o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦',
  v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
  A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾',
  H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ',
  O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌',
  V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',
};

const DOUBLE_MAP: Record<string, string> = {
  a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘',
  h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟',
  o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦',
  v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',
  A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲',
  H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸', N: '𝕹',
  O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀',
  V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅',
};

function mapChar(char: string, map: Record<string, string>): string {
  return map[char] || char;
}

function transformText(text: string, map: Record<string, string>): string {
  return text.split('').map(c => mapChar(c, map)).join('');
}

/* ═══════════════════════════════════════════════════════ */
/* ─── Style Definitions ─────────────────────────────── */
/* ═══════════════════════════════════════════════════════ */

interface StyleDef {
  id: string;
  name: string;
  icon: string;
  category: string;
  generate: (text: string) => string;
}

const STYLES: StyleDef[] = [
  // Fancy
  { id: 'small-caps', name: 'Small Caps', icon: '🔡', category: 'Fancy', generate: (t) => transformText(t, UPPER_MAP) },
  { id: 'bold', name: 'Bold', icon: '𝗕', category: 'Fancy', generate: (t) => transformText(t, BOLD_MAP) },
  { id: 'italic', name: 'Italic', icon: '𝐼', category: 'Fancy', generate: (t) => transformText(t, ITALIC_MAP) },
  { id: 'cursive', name: 'Cursive', icon: '𝒞', category: 'Fancy', generate: (t) => transformText(t, CURSIVE_MAP) },
  { id: 'monospace', name: 'Monospace', icon: '𝕄', category: 'Fancy', generate: (t) => transformText(t, MONO_MAP) },
  { id: 'double-struck', name: 'Double Struck', icon: '𝔻', category: 'Fancy', generate: (t) => transformText(t, DOUBLE_MAP) },

  // Gothic
  { id: 'gothic', name: 'Gothic', icon: '𝔊', category: 'Gothic', generate: (t) => {
    const gothicMap: Record<string, string> = {
      a: '𝔞', b: '𝔟', c: '𝔠', d: '𝔡', e: '𝔢', f: '𝔣', g: '𝔤',
      h: '𝔥', i: '𝔦', j: '𝔧', k: '𝔨', l: '𝔩', m: '𝔪', n: '𝔫',
      o: '𝔬', p: '𝔭', q: '𝔮', r: '𝔯', s: '𝔰', t: '𝔱', u: '𝔲',
      v: '𝔳', w: '𝔴', x: '𝔵', y: '𝔶', z: '𝔷',
      A: '𝔄', B: '𝔅', C: 'ℭ', D: '𝔇', E: '𝔈', F: '𝔉', G: '𝔊',
      H: 'ℌ', I: 'ℑ', J: '𝔍', K: '𝔎', L: '𝔏', M: '𝔐', N: '𝔑',
      O: '𝔒', P: '𝔓', Q: '𝔔', R: 'ℜ', S: '𝔖', T: '𝔗', U: '𝔘',
      V: '𝔙', W: '𝔚', X: '𝔛', Y: '𝔜', Z: 'ℨ',
    };
    return transformText(t, gothicMap);
  }},
  { id: 'fraktur', name: 'Fraktur', icon: '𝔉', category: 'Gothic', generate: (t) => {
    const frakturMap: Record<string, string> = {
      a: '𝖆', b: '𝖇', c: '𝖈', d: '𝖉', e: '𝖊', f: '𝖋', g: '𝖌',
      h: '𝖍', i: '𝖎', j: '𝖏', k: '𝖐', l: '𝖑', m: '𝖒', n: '𝖓',
      o: '𝖔', p: '𝖕', q: '𝖖', r: '𝖗', s: '𝖘', t: '𝖙', u: '𝖚',
      v: '𝖛', w: '𝖜', x: '𝖝', y: '𝖞', z: '𝖟',
      A: '𝕬', B: '𝕭', C: '𝕮', D: '𝕯', E: '𝕰', F: '𝕱', G: '𝕲',
      H: '𝕳', I: '𝕴', J: '𝕵', K: '𝕶', L: '𝕷', M: '𝕸', N: '𝕹',
      O: '𝕺', P: '𝕻', Q: '𝕼', R: '𝕽', S: '𝕾', T: '𝕿', U: '𝖀',
      V: '𝖁', W: '𝖂', X: '𝖃', Y: '𝖄', Z: '𝖅',
    };
    return transformText(t, frakturMap);
  }},

  // Arabic Style
  { id: 'arabic-style', name: 'Arabic Style', icon: '🕌', category: 'Arabic Style', generate: (t) => {
    const arabicMap: Record<string, string> = {
      a: 'ɑ', b: 'ß', c: 'ç', d: 'δ', e: 'ε', f: 'ƒ', g: 'ϱ',
      h: 'λ', i: 'ι', j: 'ν', k: 'κ', l: 'ℓ', m: '皂', n: 'π',
      o: 'σ', p: 'ρ', q: 'φ', r: 'я', s: 'ş', t: 'τ', u: 'υ',
      v: 'ν', w: 'ω', x: 'χ', y: 'ψ', z: 'ζ',
      A: 'آ', B: 'Б', C: 'Ç', D: 'Đ', E: '€', F: 'Ƒ', G: 'Ǥ',
      H: 'Ħ', I: 'İ', J: 'J', K: 'К', L: 'Ł', M: 'М', N: 'Ñ',
      O: 'Ø', P: 'Þ', Q: 'Q', R: 'Ř', S: 'Š', T: 'Ŧ', U: 'Ü',
      V: 'V', W: 'Ŵ', X: 'X', Y: 'Ÿ', Z: 'Ž',
    };
    return transformText(t, arabicMap);
  }},
  { id: 'arabesque', name: 'Arabesque', icon: '☪️', category: 'Arabic Style', generate: (t) => {
    return '۵' + transformText(t.toUpperCase(), UPPER_MAP).split('').join(' ') + '۵';
  }},

  // Gaming Style
  { id: 'gaming-1', name: 'Gaming Alpha', icon: '🎮', category: 'Gaming Style', generate: (t) => `꧁༒☬${t.toUpperCase()}☬༒꧂` },
  { id: 'gaming-2', name: 'Gaming Beta', icon: '⚔️', category: 'Gaming Style', generate: (t) => `々${t}々` },
  { id: 'gaming-3', name: 'Gaming Gamma', icon: '🔫', category: 'Gaming Style', generate: (t) => `★·.·´¯\`·.·★ ${t} ★·.·´¯\`·.·★` },
  { id: 'gaming-4', name: 'Free Fire Style', icon: '🔥', category: 'Gaming Style', generate: (t) => `亗${transformText(t, UPPER_MAP)}亗` },
  { id: 'gaming-5', name: 'PUBG Style', icon: '🎯', category: 'Gaming Style', generate: (t) => `⭐${t}⭐` },
  { id: 'gaming-6', name: 'Ninja Style', icon: '🥷', category: 'Gaming Style', generate: (t) => `々${t.toUpperCase()}々` },

  // VIP Style
  { id: 'vip-1', name: 'VIP Classic', icon: '👑', category: 'VIP Style', generate: (t) => `꧁ঔৣ☬${t}☬ঔৣ꧂` },
  { id: 'vip-2', name: 'VIP Royal', icon: '💎', category: 'VIP Style', generate: (t) => `❖👑 ${t} 👑❖` },
  { id: 'vip-3', name: 'VIP Premium', icon: '✨', category: 'VIP Style', generate: (t) => `★彡 ${t} 彡★` },
  { id: 'vip-4', name: 'VIP Elite', icon: '⚜️', category: 'VIP Style', generate: (t) => `⚜️ ${t.toUpperCase()} ⚜️` },

  // Royal Style
  { id: 'royal-1', name: 'Royal Crown', icon: '👑', category: 'Royal Style', generate: (t) => `👑 ™${t}™ 👑` },
  { id: 'royal-2', name: 'Royal Throne', icon: '🏰', category: 'Royal Style', generate: (t) => `♛ ${t} ♛` },
  { id: 'royal-3', name: 'Royal Empire', icon: '⚔️', category: 'Royal Style', generate: (t) => `⚔️ ᏕᏖᎡᏆᏋᏋᎠ ${t} ᏕᏖᎡᏆᏋᏋᎠ ⚔️` },
  { id: 'royal-4', name: 'Royal Gold', icon: '🏆', category: 'Royal Style', generate: (t) => `🏆 ★ ${t} ★ 🏆` },

  // Invisible Space Style
  { id: 'invisible-1', name: 'Invisible Space', icon: '👁️', category: 'Invisible Space Style', generate: (t) => t.split('').join('ㅤ') },
  { id: 'invisible-2', name: 'Wide Space', icon: '↔️', category: 'Invisible Space Style', generate: (t) => t.split('').join('　') },
  { id: 'invisible-3', name: 'Dot Separator', icon: '•', category: 'Invisible Space Style', generate: (t) => t.split('').join('•') },
  { id: 'invisible-4', name: 'Dash Separator', icon: '—', category: 'Invisible Space Style', generate: (t) => t.split('').join('—') },

  // Symbols Style
  { id: 'symbols-1', name: 'Star Decorated', icon: '⭐', category: 'Symbols Style', generate: (t) => `⭐·˚✧ ${t} ✧˚·⭐` },
  { id: 'symbols-2', name: 'Heart Decorated', icon: '💕', category: 'Symbols Style', generate: (t) => `♡⃛ ${t} ♡⃛` },
  { id: 'symbols-3', name: 'Flower Decorated', icon: '🌸', category: 'Symbols Style', generate: (t) => `✿${t}✿` },
  { id: 'symbols-4', name: 'Music Decorated', icon: '🎵', category: 'Symbols Style', generate: (t) => `♫♪ ${t} ♪♫` },
  { id: 'symbols-5', name: 'Arrow Decorated', icon: '➡️', category: 'Symbols Style', generate: (t) => `»»——— ${t} ———««` },
  { id: 'symbols-6', name: 'Diamond Decorated', icon: '💎', category: 'Symbols Style', generate: (t) => `◆◇ ${t} ◇◆` },

  // Cool Text Style
  { id: 'cool-1', name: 'Boxed', icon: '📦', category: 'Cool Text Style', generate: (t) => `【${t}】` },
  { id: 'cool-2', name: 'Brackets', icon: '🔗', category: 'Cool Text Style', generate: (t) => `『${t}』` },
  { id: 'cool-3', name: 'Parentheses', icon: '🔲', category: 'Cool Text Style', generate: (t) => `(★ ${t} ★)` },
  { id: 'cool-4', name: 'Double Lines', icon: '📏', category: 'Cool Text Style', generate: (t) => `║${t}║` },
  { id: 'cool-5', name: 'Cornered', icon: '📐', category: 'Cool Text Style', generate: (t) => `╔═╗ ${t} ╚═╝` },
  { id: 'cool-6', name: 'Waved', icon: '🌊', category: 'Cool Text Style', generate: (t) => `≋${t}≋` },
];

// Bold map (we need it for the fancy section)
/* ═══════════════════════════════════════════════════════ */
/* ─── Component ─────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════ */

const CATEGORIES = ['All', 'Fancy', 'Gothic', 'Arabic Style', 'Gaming Style', 'VIP Style', 'Royal Style', 'Invisible Space Style', 'Symbols Style', 'Cool Text Style'];

const PLATFORMS = [
  { id: 'freefire', name: 'Free Fire', icon: Gamepad2, styles: ['gaming-1', 'gaming-4', 'gaming-6', 'symbols-1', 'symbols-4'] },
  { id: 'pubg', name: 'PUBG', icon: Swords, styles: ['gaming-2', 'gaming-5', 'gaming-3', 'symbols-2', 'symbols-6'] },
  { id: 'instagram', name: 'Instagram', icon: Instagram, styles: ['small-caps', 'cursive', 'symbols-3', 'symbols-2', 'cool-1'] },
  { id: 'facebook', name: 'Facebook', icon: Facebook, styles: ['bold', 'cursive', 'cool-2', 'symbols-5', 'cool-3'] },
  { id: 'tiktok', name: 'TikTok', icon: Music, styles: ['italic', 'monospace', 'symbols-4', 'cool-6', 'vip-3'] },
];

const EXAMPLE_NAMES = ['Sabib', 'King', 'Ahmed', 'Shadow', 'Phoenix', 'Dragon', 'Ninja', 'Viper', 'Storm', 'Legend'];

export default function StylishNameGenerator() {
  const [inputName, setInputName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('freefire');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [history, setHistory] = useState<Array<{ name: string; style: string; result: string; date: Date }>>([]);

  const filteredStyles = useMemo(() => {
    if (selectedCategory === 'All') return STYLES;
    return STYLES.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  const platformStyles = useMemo(() => {
    if (!selectedPlatform) return filteredStyles;
    const platform = PLATFORMS.find(p => p.id === selectedPlatform);
    if (!platform) return filteredStyles;
    return filteredStyles.filter(s => platform.styles.includes(s.id));
  }, [selectedPlatform, filteredStyles]);

  const displayedStyles = useMemo(() => {
    if (showAllStyles) return platformStyles;
    return platformStyles.slice(0, 12);
  }, [platformStyles, showAllStyles]);

  const handleCopy = useCallback(async (text: string, styleId: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedId(styleId);
    setTimeout(() => setCopiedId(null), 2000);

    if (inputName) {
      const style = STYLES.find(s => s.id === styleId);
      setHistory(prev => [{
        name: inputName,
        style: style?.name || styleId,
        result: text,
        date: new Date(),
      }, ...prev].slice(0, 20));
    }
  }, [inputName]);

  const toggleFavorite = useCallback((text: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(text)) {
        next.delete(text);
      } else {
        next.add(text);
      }
      return next;
    });
  }, []);

  const handleShare = useCallback(async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Stylish Name', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedId('share');
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* ─── Hero ─── */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto border border-purple-500/20"
        >
          <Sparkles className="w-8 h-8 text-purple-400" />
        </motion.div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-ink">
          Stylish Name Generator
        </h1>
        <p className="text-ink/60 max-w-2xl mx-auto">
          Create unique stylish names for gaming and social media instantly. Stand out with cool fonts, symbols, and decorative text.
        </p>
      </div>

      {/* ─── Input Section ─── */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-ink/60 uppercase tracking-wider">Enter Your Name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Type your name here... (e.g., Sabib, King, Ahmed)"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-ink font-bold text-lg transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 outline-none"
          />
          <p className="text-xs text-ink/40">
            Enter any name, word, or text to create stylish variations
          </p>
        </div>

        {/* Quick Examples */}
        <div>
          <label className="block text-xs font-bold text-ink/40 mb-2">Quick Examples</label>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_NAMES.map(name => (
              <button
                key={name}
                onClick={() => setInputName(name)}
                className="px-3 py-1.5 bg-slate-800/30 border border-slate-700 rounded-lg text-xs font-bold text-ink/70 hover:border-purple-500/30 hover:text-purple-400 transition-all"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-bold text-ink/60 mb-3 uppercase tracking-wider">Platform</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {PLATFORMS.map(platform => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-xl font-bold transition-all flex flex-col items-center gap-1.5 ${
                    selectedPlatform === platform.id
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-purple-400'
                      : 'bg-slate-800/50 border border-slate-700 text-ink/70 hover:border-purple-500/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{platform.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Style Categories ─── */}
      <div>
        <label className="block text-sm font-bold text-ink/60 mb-3 uppercase tracking-wider">Style Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                  : 'bg-slate-800/50 border border-slate-700 text-ink/60 hover:border-purple-500/30 hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Generated Styles ─── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            Generated Styles
            {inputName && (
              <span className="text-sm text-ink/40 font-normal">for "{inputName}"</span>
            )}
          </h2>
          <span className="text-xs text-ink/40">{displayedStyles.length} styles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {displayedStyles.map((style) => {
              const generated = inputName ? style.generate(inputName) : style.generate('YourName');
              const isFav = favorites.has(generated);
              const isCopied = copiedId === style.id;

              return (
                <motion.div
                  key={style.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-xs font-bold text-ink/60">{style.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-ink/30 uppercase px-2 py-0.5 bg-slate-700/50 rounded">
                      {style.category}
                    </span>
                  </div>

                  <div
                    className="bg-slate-900/50 rounded-lg p-3 mb-3 min-h-[3rem] flex items-center justify-center cursor-pointer hover:bg-slate-900 transition-colors"
                    onClick={() => handleCopy(generated, style.id)}
                    title="Click to copy"
                  >
                    <span className="text-ink text-lg font-medium break-all text-center leading-relaxed">
                      {generated}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(generated, style.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all bg-slate-700/50 hover:bg-slate-700 text-ink/70 hover:text-ink"
                    >
                      {isCopied ? (
                        <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                      )}
                    </button>
                    <button
                      onClick={() => toggleFavorite(generated)}
                      className={`p-2 rounded-lg transition-all ${
                        isFav
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-slate-700/50 text-ink/40 hover:text-pink-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleShare(generated)}
                      className="p-2 rounded-lg bg-slate-700/50 text-ink/40 hover:text-blue-400 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {platformStyles.length > 12 && (
          <button
            onClick={() => setShowAllStyles(!showAllStyles)}
            className="w-full py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-ink/60 hover:text-ink hover:border-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            {showAllStyles ? (
              <><ChevronUp className="w-4 h-4" /> Show Less</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Show All {platformStyles.length} Styles</>
            )}
          </button>
        )}
      </div>

      {/* ─── Favorites ─── */}
      {favorites.size > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400 fill-current" />
            Favorites ({favorites.size})
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(favorites).map((fav, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg"
              >
                <span className="text-sm text-ink">{fav}</span>
                <button
                  onClick={() => toggleFavorite(fav)}
                  className="text-pink-400 hover:text-pink-300 transition-colors"
                >
                  <Heart className="w-3 h-3 fill-current" />
                </button>
                <button
                  onClick={() => handleCopy(fav, `fav-${i}`)}
                  className="text-ink/40 hover:text-ink transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── History ─── */}
      {history.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Recent
          </h3>
          <div className="space-y-2">
            {history.slice(0, 10).map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
              >
                <span className="text-ink font-bold text-sm flex-1 truncate">{item.result}</span>
                <span className="text-[10px] text-ink/30 flex-shrink-0">{item.style}</span>
                <button
                  onClick={() => handleCopy(item.result, `hist-${i}`)}
                  className="p-1.5 text-ink/40 hover:text-ink transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Trending Styles ─── */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Trending Name Styles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Free Fire Names', desc: 'Gaming names with cool symbols', platform: 'freefire', icon: Gamepad2 },
            { name: 'PUBG Names', desc: 'Battle royale style names', platform: 'pubg', icon: Swords },
            { name: 'Instagram Bio Names', desc: 'Stylish names for your profile', platform: 'instagram', icon: Instagram },
            { name: 'Facebook Stylish Names', desc: 'Stand out on Facebook', platform: 'facebook', icon: Facebook },
            { name: 'Attitude Names', desc: 'Bold and confident name styles', platform: 'freefire', icon: Crown },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedPlatform(item.platform)}
                className="flex items-center gap-3 p-3 bg-slate-800/30 border border-slate-700 rounded-xl text-left hover:border-purple-500/30 transition-all group"
              >
                <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
                <div>
                  <span className="block text-sm font-bold text-ink">{item.name}</span>
                  <span className="text-xs text-ink/40">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
