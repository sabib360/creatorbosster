import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchTools, getPopularTools } from '../config/tools-database';
import SEOHead from './SEOHead';

export default function NotFound() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredTools = query.length > 0 ? searchTools(query).slice(0, 5) : [];
  const popularTools = getPopularTools().slice(0, 6);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length > 0) navigate(`/tools/${filteredTools[0].slug}`);
  };

  return (
    <>
      <SEOHead
        title="Page Not Found - CreatorBoost AI"
        description="The page you are looking for does not exist. Browse our free AI tools for image processing, PDF editing, and content creation."
        canonicalUrl="https://creatorboostai.xyz/404"
        noindex={true}
      />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* Illustration */}
        <div className="relative mb-8">
          <div className="text-[120px] md:text-[160px] font-display font-black text-white/[0.03] leading-none select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🔍</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 text-sm sm:text-base mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved. Try searching for a tool or explore our popular tools below.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-sm"
            />
          </div>
          {filteredTools.length > 0 && (
            <div className="mt-2 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm text-white/70">{tool.name}</span>
                </Link>
              ))}
            </div>
          )}
        </form>

        {/* Popular Tools */}
        <div className="mb-8">
          <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-3">Popular Tools</p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="px-3 py-1.5 bg-white/[0.04] hover:bg-primary/10 border border-white/[0.06] hover:border-primary/30 rounded-lg text-xs text-white/50 hover:text-primary transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
    </>
  );
}
