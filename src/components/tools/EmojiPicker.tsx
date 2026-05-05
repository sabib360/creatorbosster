import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Smile, Heart, Star, Clock, TrendingUp, X, Crown, Lock, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface EmojiCategory {
  name: string;
  emojis: string[];
  icon: string;
  color: string;
}


const emojiCategories: EmojiCategory[] = [
  {
    name: 'Smileys & Emotions',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '😸', '😹', '😺', '😻', '😼', '😽', '🙀', '😿', '😾'],
    icon: '😊',
    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
  },
  {
    name: 'Special',
    emojis: ['🤩', '🥳', '🎉', '🎊', '🥰', '😍', '🤗', '🤭', '🥺', '😘', '💕', '💖', '💗', '💓', '💞', '💝', '🥵', '🥶', '🤯', '🤪', '🥴', '😵', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '🥸', '🤡', '👹', '👺', '👻', '💀', '☠️', '👽', '🤖', '🎃', '😈', '👿'],
    icon: '✨',
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/50'
  },
  {
    name: 'People & Body',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🙏', '🤝', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤷', '🤦', '🧔‍♂️', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩‍🦲', '👱‍♂️', '👱‍♀️', '🧔‍♀️', '👨‍🦼', '👨‍🦽', '👨‍🦯', '👩‍🦼', '👩‍🦽', '👩‍🦯', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍⚕️', '👩‍⚕️'],
    icon: '👋',
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/50'
  },
  {
    name: 'Animals & Nature',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🌸', '💐', '🌷', '🌹', '🥀', '🌺', '🌻', '🌼', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃'],
    icon: '🐶',
    color: 'from-green-500/20 to-green-600/20 border-green-500/50'
  },
  {
    name: 'Food & Drink',
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🫔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🥄', '🍽', '🍴', '🥣', '🥡'],
    icon: '🍔',
    color: 'from-red-500/20 to-orange-500/20 border-red-500/50'
  },
  {
    name: 'Activities & Sports',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼', '🤼‍♀️', '🤼‍♂️', '🤸', '🤸‍♀️', '🤸‍♂️', '⛹️', '⛹️‍♀️', '⛹️‍♂️', '🤺', '🤾', '🤾‍♀️', '🤾‍♂️', '🏌️', '🏌️‍♀️', '🏌️‍♂️', '🏇', '🧘', '🧘‍♀️', '🧘‍♂️', '🏄', '🏄‍♀️', '🏄‍♂️', '🏊', '🏊‍♀️', '🏊‍♂️', '🤽', '🤽‍♀️', '🤽‍♂️', '🚣', '🚣‍♀️', '🚣‍♂️', '🧗', '🧗‍♀️', '🧗‍♂️', '🚵', '🚵‍♀️', '🚵‍♂️', '🚴', '🚴‍♀️', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♀️', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '📽️', '🎰', '🎮', '🕹️', '🎲', '♠️', '♣️', '♥️', '♦️', '♟️', '🃏', '🀄', '🎴', '🎯', '🎳'],
    icon: '⚽',
    color: 'from-purple-500/20 to-purple-600/20 border-purple-500/50'
  },
  {
    name: 'Objects & Symbols',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '🎈', '🎏', '🎀', '🎁', '🎊', '🎉', '🎃', '🎄', '🎆', '🎇', '🧧', '✨', '🎋', '🎍', '🎑', '🧨', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🕹️', '🎰', '🧩'],
    icon: '💡',
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/50'
  }
];

const trendingEmojis = ['🔥', '❤️', '😂', '👍', '🥰', '😊', '🎉', '🤔', '👀', '💯', '✨', '😎', '🥳', '😍', '🤩', '💕'];

const recentlyUsed = ['😀', '❤️', '👍', '😂', '🔥', '🥰', '😊', '🎉', '🤔', '👀'];

export default function EmojiPicker() {
  const { user, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(emojiCategories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);
  const [recentEmojis, setRecentEmojis] = useState<string[]>(recentlyUsed);

  const filteredEmojis = selectedCategory.emojis.filter(emoji => 
    searchTerm === '' || emoji.includes(searchTerm)
  );

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    
    // Add to recently used
    if (!recentEmojis.includes(emoji)) {
      setRecentEmojis(prev => [emoji, ...prev.slice(0, 9)]);
    }
    
    setTimeout(() => setCopiedEmoji(null), 2000);
  };

  const getEmojiDescription = (emoji: string) => {
    const descriptions: { [key: string]: string } = {
      '😀': 'Grinning Face',
      '❤️': 'Red Heart',
      '👍': 'Thumbs Up',
      '😂': 'Face with Tears of Joy',
      '🔥': 'Fire',
      '🥰': 'Smiling Face with Hearts',
      '😊': 'Smiling Face with Smiling Eyes',
      '🎉': 'Party Popper',
      '🤔': 'Thinking Face',
      '👀': 'Eyes'
    };
    return descriptions[emoji] || '';
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
          Emoji Picker
        </h1>
        <p className="text-xl text-ink/60 max-w-2xl mx-auto">
          Find and copy the perfect emoji for your social media posts and messages.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-ink/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-ink placeholder-ink/40 outline-none"
              placeholder="Search emojis..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-ink/40" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recently Used */}
      {!searchTerm && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-ink">Recently Used</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {recentEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => copyEmoji(emoji)}
                  className="group relative p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-all"
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-xl">
                    <Copy className="w-4 h-4 text-white" />
                  </div>
                  {copiedEmoji === emoji && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-xl">
                      <div className="text-green-100">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Emojis */}
      {!searchTerm && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-ink">Trending Now</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => copyEmoji(emoji)}
                  className="group relative p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-all"
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-xl">
                    <Copy className="w-4 h-4 text-white" />
                  </div>
                  {copiedEmoji === emoji && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-xl">
                      <div className="text-green-100">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {emojiCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                selectedCategory.name === category.name
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-slate-800/50 border border-slate-700 text-ink/80 hover:border-primary/30'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
                          </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{selectedCategory.icon}</span>
            <h3 className="text-lg font-bold text-ink">{selectedCategory.name}</h3>
            <span className="text-sm text-ink/40">({filteredEmojis.length} emojis)</span>
          </div>
          
          {filteredEmojis.length > 0 ? (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {filteredEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => copyEmoji(emoji)}
                  className="group relative p-3 rounded-xl transition-all bg-slate-800/50 hover:bg-slate-800/70 cursor-pointer"
                  title={getEmojiDescription(emoji)}
                >
                  <span className="text-2xl">{emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-xl">
                    <Copy className="w-4 h-4 text-white" />
                  </div>
                  {copiedEmoji === emoji && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 rounded-xl">
                      <div className="text-green-100">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60">No emojis found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      
      
      {/* Usage Tips */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-400" />
            Emoji Usage Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ink/70">
            <div>
              <p className="font-bold text-blue-400 mb-2">📱 Platform Guidelines</p>
              <p>• Instagram: 5-10 emojis per post<br/>
              • Twitter: 2-3 emojis per tweet<br/>
              • Facebook: 3-5 emojis per post<br/>
              • LinkedIn: 1-2 emojis for professional content</p>
            </div>
            <div>
              <p className="font-bold text-green-400 mb-2">✨ Best Practices</p>
              <p>• Use emojis to enhance, not replace text<br/>
              • Match emoji tone to your brand voice<br/>
              • Consider cultural differences<br/>
              • Test emoji rendering on different devices</p>
            </div>
            <div>
              <p className="font-bold text-purple-400 mb-2">🎯 Engagement Boost</p>
              <p>• Emojis increase engagement by 48%<br/>
              • Use relevant emojis for your audience<br/>
              • Place emojis at the beginning for attention<br/>
              • Create emoji-only posts for visual impact</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
