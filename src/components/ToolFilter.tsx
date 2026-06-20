/**
 * Tool Filter & Sort Component
 * Allows users to filter and sort tools within category pages.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowUpDown, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export type SortOption = 'popular' | 'trending' | 'newest' | 'alphabetical';
export type FilterCategory = string | 'all';

interface ToolFilterProps {
  categories: Array<{ id: string; name: string; count: number }>;
  activeCategory: FilterCategory;
  activeSort: SortOption;
  onCategoryChange: (category: FilterCategory) => void;
  onSortChange: (sort: SortOption) => void;
  totalTools: number;
  filteredCount: number;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A-Z' },
];

export default function ToolFilter({
  categories,
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
  totalTools,
  filteredCount,
}: ToolFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
              activeCategory === 'all'
                ? "bg-primary text-black border-primary"
                : "bg-white/[0.04] text-white/50 border-white/[0.06] hover:text-white hover:bg-white/[0.08]"
            )}
          >
            All ({totalTools})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                activeCategory === cat.id
                  ? "bg-primary text-black border-primary"
                  : "bg-white/[0.04] text-white/50 border-white/[0.06] hover:text-white hover:bg-white/[0.08]"
              )}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Sort + Filter Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">
            {filteredCount} tool{filteredCount !== 1 ? 's' : ''}
          </span>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-white/60 font-bold cursor-pointer hover:bg-white/[0.08] transition-colors focus:outline-none focus:border-primary/50"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(activeCategory !== 'all' || activeSort !== 'popular') && (
        <div className="flex items-center gap-2 text-xs text-white/40">
          <SlidersHorizontal className="w-3 h-3" />
          <span>Filtered:</span>
          {activeCategory !== 'all' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {categories.find(c => c.id === activeCategory)?.name}
              <button onClick={() => onCategoryChange('all')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeSort !== 'popular' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.06] rounded-full">
              {SORT_OPTIONS.find(o => o.value === activeSort)?.label}
              <button onClick={() => onSortChange('popular')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => { onCategoryChange('all'); onSortChange('popular'); }}
            className="text-white/30 hover:text-white/60 transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for managing filter state
 */
export function useToolFilter<T extends { category: string; trending?: boolean; featured?: boolean; publishDate?: string; name: string }>(
  tools: T[]
) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [activeSort, setActiveSort] = useState<SortOption>('popular');

  const categories = useMemo(() => {
    const catMap = new Map<string, number>();
    tools.forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + 1);
    });
    return Array.from(catMap.entries()).map(([id, count]) => ({
      id,
      name: id.replace('-tools', '').replace(/^./, c => c.toUpperCase()),
      count,
    }));
  }, [tools]);

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? [...tools]
      : tools.filter(t => t.category === activeCategory);

    switch (activeSort) {
      case 'trending':
        result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime());
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
      default:
        // Keep original order (which is popularity-sorted in the database)
        break;
    }

    return result;
  }, [tools, activeCategory, activeSort]);

  return {
    activeCategory,
    activeSort,
    setActiveCategory,
    setActiveSort,
    categories,
    filtered,
    totalTools: tools.length,
    filteredCount: filtered.length,
  };
}
