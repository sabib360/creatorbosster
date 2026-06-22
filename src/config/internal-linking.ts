/**
 * CreatorBoost AI — Internal Linking Engine
 * Enterprise-grade contextual internal linking system
 *
 * Every page links intelligently to reinforce topical authority.
 * - Tool pages → Related tools + category + blog articles
 * - Blog pages → Relevant tools + related articles + categories
 * - Category pages → Tools + articles + trending
 * - Homepage → Top tools + categories + trending + blog
 */

import { ALL_TOOLS, type ToolVariant } from './tools-registry';
import { BLOG_POSTS, type BlogPost } from './blog-data';
import { CATEGORIES, type CategoryEntry } from './tools-database';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface LinkItem {
  path: string;
  name: string;
  description?: string;
  type: 'tool' | 'blog' | 'category' | 'page';
  priority: number;
  context?: string;
}

export interface InternalLinksResult {
  relatedTools: LinkItem[];
  relatedArticles: LinkItem[];
  relatedCategories: LinkItem[];
  breadcrumbs: Array<{ name: string; path: string }>;
}

// ═══════════════════════════════════════════════════════════════════
// TOOL → RELATED TOOLS
// Contextual: same category + keyword overlap
// ═══════════════════════════════════════════════════════════════════

export function getRelatedTools(tool: ToolVariant, limit = 8): LinkItem[] {
  const seen = new Set<string>([tool.id]);
  const results: LinkItem[] = [];

  // 1. Same category tools (highest priority)
  const sameCategory = ALL_TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id && !seen.has(t.id)
  );
  for (const t of sameCategory.slice(0, 4)) {
    seen.add(t.id);
    results.push({
      path: t.path,
      name: t.name,
      description: t.seoDescription?.slice(0, 80),
      type: 'tool',
      priority: 10,
      context: `Same category: ${tool.category}`,
    });
  }

  // 2. Keyword overlap tools
  const toolKeywords = tool.keywords.map((k) => k.toLowerCase());
  for (const t of ALL_TOOLS) {
    if (seen.has(t.id) || t.id === tool.id) continue;
    const overlap = t.keywords.filter((k) =>
      toolKeywords.some((tk) => k.toLowerCase().includes(tk) || tk.includes(k.toLowerCase()))
    );
    if (overlap.length > 0) {
      seen.add(t.id);
      results.push({
        path: t.path,
        name: t.name,
        description: t.seoDescription?.slice(0, 80),
        type: 'tool',
        priority: 5 + overlap.length,
        context: `Related: ${overlap[0]}`,
      });
    }
    if (results.length >= limit) break;
  }

  // 3. Fill with popular tools if needed
  if (results.length < limit) {
    const popular = ALL_TOOLS.filter((t) => !seen.has(t.id) && t.id !== tool.id)
      .sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume);
    for (const t of popular.slice(0, limit - results.length)) {
      seen.add(t.id);
      results.push({
        path: t.path,
        name: t.name,
        description: t.seoDescription?.slice(0, 80),
        type: 'tool',
        priority: 1,
      });
    }
  }

  return results.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════
// TOOL → RELATED ARTICLES
// Find blog posts that mention or relate to this tool
// ═══════════════════════════════════════════════════════════════════

export function getRelatedArticles(tool: ToolVariant, limit = 4): LinkItem[] {
  const toolKeywords = tool.keywords.map((k) => k.toLowerCase());
  const toolName = tool.name.toLowerCase();
  const results: LinkItem[] = [];

  for (const post of BLOG_POSTS) {
    const postText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();

    // Check if post mentions this tool's keywords
    const relevance = toolKeywords.filter((kw) => postText.includes(kw)).length;
    // Check if post title contains tool name
    const nameMatch = postText.includes(toolName) ? 5 : 0;

    if (relevance > 0 || nameMatch > 0) {
      results.push({
        path: `/blog/${post.slug}`,
        name: post.title,
        description: post.excerpt?.slice(0, 80),
        type: 'blog',
        priority: relevance + nameMatch,
      });
    }
  }

  // If not enough, find articles in related categories
  if (results.length < limit) {
    const categoryMap: Record<string, string[]> = {
      'image-tools': ['image-editing', 'tutorials'],
      'pdf-tools': ['pdf-tools', 'tutorials'],
      'ai-tools': ['ai', 'technology'],
      'youtube-tools': ['youtube', 'tutorials'],
      'social-media-tools': ['social-media', 'tutorials'],
      'finance-tools': ['technology', 'tutorials'],
      'seo-tools': ['seo', 'tutorials'],
    };
    const relatedCategories = categoryMap[tool.category] || ['tutorials'];

    for (const post of BLOG_POSTS) {
      if (results.find((r) => r.path === `/blog/${post.slug}`)) continue;
      if (relatedCategories.includes(post.category)) {
        results.push({
          path: `/blog/${post.slug}`,
          name: post.title,
          description: post.excerpt?.slice(0, 80),
          type: 'blog',
          priority: 2,
        });
      }
      if (results.length >= limit) break;
    }
  }

  return results.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════
// TOOL → BREADCRUMBS
// ═══════════════════════════════════════════════════════════════════

export function getToolBreadcrumbs(tool: ToolVariant): Array<{ name: string; path: string }> {
  const categoryMap: Record<string, { name: string; path: string }> = {
    'image-tools': { name: 'Image Tools', path: '/image-tools' },
    'pdf-tools': { name: 'PDF Tools', path: '/pdf-tools' },
    'ai-tools': { name: 'AI Tools', path: '/ai-tools' },
    'youtube-tools': { name: 'YouTube Tools', path: '/ai-tools' },
    'social-media-tools': { name: 'Social Media Tools', path: '/social-media-tools' },
    'finance-tools': { name: 'Finance Tools', path: '/finance-tools' },
    'seo-tools': { name: 'SEO Tools', path: '/ai-tools' },
    'developer-tools': { name: 'Developer Tools', path: '/ai-tools' },
  };

  const cat = categoryMap[tool.category];
  return [
    { name: 'Home', path: '/' },
    ...(cat ? [cat] : []),
    { name: tool.name, path: tool.path },
  ];
}

// ═══════════════════════════════════════════════════════════════════
// BLOG → RELATED TOOLS
// Find tools mentioned or relevant to blog content
// ═══════════════════════════════════════════════════════════════════

export function getBlogRelatedTools(post: BlogPost, limit = 6): LinkItem[] {
  const postText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
  const results: LinkItem[] = [];

  for (const tool of ALL_TOOLS) {
    const toolText = `${tool.name} ${tool.seoDescription || ''} ${tool.keywords.join(' ')}`.toLowerCase();
    const relevance = tool.keywords.filter((kw) => postText.includes(kw.toLowerCase())).length;

    if (relevance > 0) {
      results.push({
        path: tool.path,
        name: tool.name,
        description: tool.seoDescription?.slice(0, 80),
        type: 'tool',
        priority: relevance,
      });
    }
    if (results.length >= limit) break;
  }

  // Fill with popular tools if not enough
  if (results.length < limit) {
    const popular = ALL_TOOLS
      .sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume)
      .filter((t) => !results.find((r) => r.path === t.path));
    for (const t of popular.slice(0, limit - results.length)) {
      results.push({
        path: t.path,
        name: t.name,
        description: t.seoDescription?.slice(0, 80),
        type: 'tool',
        priority: 1,
      });
    }
  }

  return results.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════
// BLOG → RELATED ARTICLES
// ═══════════════════════════════════════════════════════════════════

export function getBlogRelatedArticles(post: BlogPost, limit = 4): LinkItem[] {
  // 1. Explicitly related posts
  const explicit = post.relatedPosts
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter(Boolean) as BlogPost[];

  const results: LinkItem[] = explicit.slice(0, limit).map((p) => ({
    path: `/blog/${p.slug}`,
    name: p.title,
    description: p.excerpt?.slice(0, 80),
    type: 'blog' as const,
    priority: 10,
  }));

  const seen = new Set(results.map((r) => r.path));

  // 2. Same category posts
  if (results.length < limit) {
    const sameCat = BLOG_POSTS.filter(
      (p) => p.category === post.category && p.id !== post.id && !seen.has(`/blog/${p.slug}`)
    );
    for (const p of sameCat.slice(0, limit - results.length)) {
      seen.add(`/blog/${p.slug}`);
      results.push({
        path: `/blog/${p.slug}`,
        name: p.title,
        description: p.excerpt?.slice(0, 80),
        type: 'blog',
        priority: 5,
      });
    }
  }

  // 3. Tag overlap
  if (results.length < limit) {
    for (const p of BLOG_POSTS) {
      if (seen.has(`/blog/${p.slug}`) || p.id === post.id) continue;
      const overlap = p.tags.filter((t) => post.tags.includes(t)).length;
      if (overlap > 0) {
        seen.add(`/blog/${p.slug}`);
        results.push({
          path: `/blog/${p.slug}`,
          name: p.title,
          description: p.excerpt?.slice(0, 80),
          type: 'blog',
          priority: 3 + overlap,
        });
      }
      if (results.length >= limit) break;
    }
  }

  return results.sort((a, b) => b.priority - a.priority).slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════
// BLOG → BREADCRUMBS
// ═══════════════════════════════════════════════════════════════════

export function getBlogBreadcrumbs(post: BlogPost): Array<{ name: string; path: string }> {
  return [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY → TOOLS
// ═══════════════════════════════════════════════════════════════════

export function getCategoryTools(categoryId: string, limit = 20): LinkItem[] {
  return ALL_TOOLS
    .filter((t) => t.category === categoryId || t.category === `${categoryId}-tools`)
    .sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume)
    .slice(0, limit)
    .map((t) => ({
      path: t.path,
      name: t.name,
      description: t.seoDescription?.slice(0, 80),
      type: 'tool' as const,
      priority: t.estimatedSearchVolume,
    }));
}

// ═══════════════════════════════════════════════════════════════════
// CATEGORY → ARTICLES
// ═══════════════════════════════════════════════════════════════════

export function getCategoryArticles(categoryId: string, limit = 6): LinkItem[] {
  const categoryMap: Record<string, string[]> = {
    'ai-tools': ['ai', 'technology'],
    'image-tools': ['image-editing', 'tutorials'],
    'pdf-tools': ['pdf-tools', 'tutorials'],
    'youtube-tools': ['youtube', 'tutorials'],
    'social-media-tools': ['social-media', 'tutorials'],
    'finance-tools': ['technology'],
    'seo-tools': ['seo', 'tutorials'],
    'developer-tools': ['technology', 'tutorials'],
  };

  const blogCategories = categoryMap[categoryId] || [];

  return BLOG_POSTS
    .filter((p) => blogCategories.includes(p.category))
    .slice(0, limit)
    .map((p) => ({
      path: `/blog/${p.slug}`,
      name: p.title,
      description: p.excerpt?.slice(0, 80),
      type: 'blog' as const,
      priority: 5,
    }));
}

// ═══════════════════════════════════════════════════════════════════
// HOMEPAGE → INTERNAL LINKS
// ═══════════════════════════════════════════════════════════════════

export function getHomepageLinks() {
  const topTools = ALL_TOOLS
    .sort((a, b) => b.estimatedSearchVolume - a.estimatedSearchVolume)
    .slice(0, 12)
    .map((t) => ({
      path: t.path,
      name: t.name,
      description: t.seoDescription?.slice(0, 80),
      type: 'tool' as const,
    }));

  const categories = CATEGORIES.map((c) => ({
    path: `/category/${c.id}`,
    name: c.name,
    description: c.description,
    type: 'category' as const,
  }));

  const trending = ALL_TOOLS
    .filter((t) => t.estimatedSearchVolume > 20000)
    .slice(0, 8)
    .map((t) => ({
      path: t.path,
      name: t.name,
      description: t.seoDescription?.slice(0, 80),
      type: 'tool' as const,
    }));

  const latestBlog = BLOG_POSTS.slice(0, 6).map((p) => ({
    path: `/blog/${p.slug}`,
    name: p.title,
    description: p.excerpt?.slice(0, 80),
    type: 'blog' as const,
  }));

  return { topTools, categories, trending, latestBlog };
}

// ═══════════════════════════════════════════════════════════════════
// FULL INTERNAL LINKS FOR ANY PAGE
// ═══════════════════════════════════════════════════════════════════

export function getInternalLinks(pathname: string): InternalLinksResult {
  const path = pathname.toLowerCase();

  // Tool page
  if (path.startsWith('/tools/')) {
    const slug = path.replace('/tools/', '');
    const tool = ALL_TOOLS.find((t) => t.path === `/tools/${slug}`);
    if (tool) {
      return {
        relatedTools: getRelatedTools(tool),
        relatedArticles: getRelatedArticles(tool),
        relatedCategories: [],
        breadcrumbs: getToolBreadcrumbs(tool),
      };
    }
  }

  // Blog page
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      return {
        relatedTools: getBlogRelatedTools(post),
        relatedArticles: getBlogRelatedArticles(post),
        relatedCategories: [],
        breadcrumbs: getBlogBreadcrumbs(post),
      };
    }
  }

  // Category page
  if (path.startsWith('/category/')) {
    const catId = path.replace('/category/', '');
    return {
      relatedTools: getCategoryTools(catId),
      relatedArticles: getCategoryArticles(catId),
      relatedCategories: CATEGORIES.filter((c) => c.id !== catId).slice(0, 4).map((c) => ({
        path: `/category/${c.id}`,
        name: c.name,
        description: c.description,
        type: 'category' as const,
        priority: 5,
      })),
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/' },
        { name: catId, path: pathname },
      ],
    };
  }

  // Homepage
  return {
    relatedTools: [],
    relatedArticles: [],
    relatedCategories: [],
    breadcrumbs: [{ name: 'Home', path: '/' }],
  };
}
