import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import SEOHead from './SEOHead';
import { getTool } from '../config/tools-registry';

interface ToolPageProps {
  children: ReactNode;
  /** toolId from tools-registry */
  toolId?: string;
  /** optional override if you only know toolPath */
  toolPath?: string;
}

export default function ToolPage({ children, toolId, toolPath }: ToolPageProps) {
  const location = useLocation();

  const resolvedToolId = toolId ?? (() => {
    // If toolPath provided, try to match registry by `path`
    if (toolPath) {
      const all = [
        // limited import surface: tools-registry exports getTool/getTools... but not list here
      ];
      // we cannot list tools from registry here without adding another export;
      // so fall back to undefined.
    }
    return undefined;
  })();

  const tool = resolvedToolId ? getTool(resolvedToolId) : undefined;

  const getToolName = () => {
    const path = location.pathname.split('/').pop();
    if (!path) return 'Tool';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <>
      {tool && (
        <SEOHead
          title={tool.seoTitle}
          description={tool.seoDescription}
          keywords={tool.keywords.join(', ')}
          canonicalUrl={`https://creatorboostai.xyz${tool.path}`}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          
          <Link
          to="/"
          className="flex items-center gap-2 text-ink/60 hover:text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-widest">Home</span>
        </Link>
        <span className="text-ink/40">/</span>
        <Link
          to={location.pathname.includes('image') ? '/image-tools' : location.pathname.includes('pdf') ? '/pdf-tools' : location.pathname.includes('ai') ? '/ai-tools' : '/'}
          className="text-ink/60 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
        >
          {location.pathname.includes('image') ? 'Image Tools' : location.pathname.includes('pdf') ? 'PDF Tools' : location.pathname.includes('ai') ? 'AI Tools' : 'Tools'}
        </Link>
        <span className="text-ink/40">/</span>
        <span className="text-ink font-bold uppercase tracking-widest text-sm">{getToolName()}</span>
      </div>

      {/* Tool Content */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
        {children}
      </div>
      </motion.div>
    
    </>
  );
}
