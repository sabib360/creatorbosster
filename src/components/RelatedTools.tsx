import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ALL_TOOLS, type ToolVariant } from '../config/tools-registry';

interface RelatedToolsProps {
  currentToolId: string;
  count?: number;
}

const CATEGORY_SIMILARITY: Record<string, string[]> = {
  'PDF Tools': ['PDF Tools', 'Developer Tools'],
  'Image Tools': ['Image Tools', 'AI Tools'],
  'AI Tools': ['AI Tools', 'Image Tools', 'Social Media Tools'],
  'Calculator Tools': ['Calculator Tools', 'Finance Tools'],
  'Finance Tools': ['Finance Tools', 'Calculator Tools'],
  'Social Media Tools': ['Social Media Tools', 'AI Tools'],
  'Developer Tools': ['Developer Tools', 'PDF Tools'],
};

function scoreTool(tool: ToolVariant, current: ToolVariant): number {
  let score = 0;
  if (tool.category === current.category) score += 10;
  const similarCategories = CATEGORY_SIMILARITY[current.category] || [];
  if (similarCategories.includes(tool.category)) score += 5;
  if (tool.subcategory === current.subcategory) score += 3;
  const sharedKeywords = tool.keywords.filter(k => current.keywords.some(ck => k.split(' ').some(w => ck.includes(w))));
  score += sharedKeywords.length;
  return score;
}

export default function RelatedTools({ currentToolId, count = 6 }: RelatedToolsProps) {
  const current = ALL_TOOLS.find(t => t.id === currentToolId);
  if (!current) return null;

  const related = ALL_TOOLS
    .filter(t => t.id !== currentToolId)
    .map(t => ({ tool: t, score: scoreTool(t, current) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.tool);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 space-y-6">
      <h2 className="text-2xl font-display font-black uppercase tracking-wider text-ink">
        Related Tools
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="font-display font-black uppercase tracking-wider text-sm text-ink group-hover:text-primary transition-colors truncate">
                  {tool.name}
                </h3>
                <p className="text-ink/50 text-xs leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
            <div className="mt-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                {tool.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
