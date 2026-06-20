/**
 * Reusable Breadcrumb Component with Schema Markup
 * Used across all page types: tools, blog, categories, legal pages.
 */

import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { breadcrumbSchema } from '../lib/schema';
import { SEO_CONFIG } from '../config/seo-config';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
    ...items,
  ];

  const schema = breadcrumbSchema(
    allItems.map((item) => ({
      name: item.name,
      url: item.path.startsWith('http') ? item.path : `${SEO_CONFIG.siteUrl}${item.path}`,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs flex-wrap ${className}`}
      >
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <span key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3 h-3 text-white/20" />}
              {isLast ? (
                <span className="text-white/70 font-medium">{item.name}</span>
              ) : i === 0 ? (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 text-white/40 hover:text-primary transition-colors"
                >
                  <Home className="w-3 h-3" /> {item.name}
                </Link>
              ) : (
                <Link
                  to={item.path}
                  className="text-white/40 hover:text-primary transition-colors capitalize"
                >
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
