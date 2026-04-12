export default function NativeAd() {
  return (
    <div className="brutal-border brutal-shadow-sm rounded-xl p-5 my-6 bg-white transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold bg-primary text-black px-2 py-1 rounded uppercase tracking-wider">Sponsored</span>
        <span className="text-xs text-ink/60 font-medium">Recommended for You</span>
      </div>
      
      <a href="https://partner.canva.com/thumbmagic" target="_blank" rel="noopener noreferrer" className="block group">
        <h3 className="font-display font-black text-xl mb-2 group-hover:text-primary transition-colors text-black">
          🎨 Create Better Thumbnails with Canva Pro
        </h3>
        <p className="text-sm text-black/80 mb-4 font-medium leading-relaxed">
          Discover the top tools that will 10x your YouTube growth. Try Canva Pro free for 30 days and unlock premium templates, background remover, and more!
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black/50 uppercase tracking-wider">Partner: Canva</span>
        </div>
      </a>
    </div>
  );
}
