/**
 * CreatorBoost AI - Content Optimization Checklist
 * Checklist for every piece of content before publishing
 */

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  priority: 'required' | 'recommended' | 'optional';
  description: string;
}

export const CONTENT_CHECKLIST: ChecklistItem[] = [
  // ===== TITLE & META =====
  {
    id: 'title-1',
    category: 'Title & Meta',
    item: 'Primary keyword in title (first 60 characters)',
    priority: 'required',
    description: 'Include your primary keyword within the first 60 characters of the title tag.',
  },
  {
    id: 'title-2',
    category: 'Title & Meta',
    item: 'Title is compelling and click-worthy',
    priority: 'required',
    description: 'Use power words, numbers, or curiosity to make titles attractive.',
  },
  {
    id: 'title-3',
    category: 'Title & Meta',
    item: 'Meta description 150-160 characters',
    priority: 'required',
    description: 'Write a concise meta description that includes the primary keyword and a CTA.',
  },
  {
    id: 'title-4',
    category: 'Title & Meta',
    item: 'URL slug is short and keyword-rich',
    priority: 'required',
    description: 'Use hyphens, include primary keyword, keep under 60 characters.',
  },
  {
    id: 'title-5',
    category: 'Title & Meta',
    item: 'Unique title across the site',
    priority: 'required',
    description: 'Every page must have a unique title tag.',
  },

  // ===== CONTENT STRUCTURE =====
  {
    id: 'structure-1',
    category: 'Content Structure',
    item: 'H1 tag contains primary keyword',
    priority: 'required',
    description: 'The main heading should include your primary keyword.',
  },
  {
    id: 'structure-2',
    category: 'Content Structure',
    item: 'Primary keyword in first 100 words',
    priority: 'required',
    description: 'Include the primary keyword naturally within the first 100 words.',
  },
  {
    id: 'structure-3',
    category: 'Content Structure',
    item: 'H2 tags with secondary keywords (3-5)',
    priority: 'required',
    description: 'Use H2 headings that include secondary keywords naturally.',
  },
  {
    id: 'structure-4',
    category: 'Content Structure',
    item: 'H3 tags for sub-sections',
    priority: 'recommended',
    description: 'Use H3 tags to break down H2 sections for better readability.',
  },
  {
    id: 'structure-5',
    category: 'Content Structure',
    item: 'Content length 1,500-2,500 words',
    priority: 'required',
    description: 'Longer content tends to rank better. Aim for comprehensive coverage.',
  },
  {
    id: 'structure-6',
    category: 'Content Structure',
    item: 'Short paragraphs (2-3 sentences)',
    priority: 'required',
    description: 'Short paragraphs improve readability, especially on mobile.',
  },
  {
    id: 'structure-7',
    category: 'Content Structure',
    item: 'Bullet points and numbered lists',
    priority: 'recommended',
    description: 'Lists improve scannability and can appear as featured snippets.',
  },

  // ===== KEYWORD OPTIMIZATION =====
  {
    id: 'keyword-1',
    category: 'Keyword Optimization',
    item: 'Primary keyword density 1-2%',
    priority: 'required',
    description: 'Use the primary keyword naturally without stuffing.',
  },
  {
    id: 'keyword-2',
    category: 'Keyword Optimization',
    item: 'Secondary keywords naturally included',
    priority: 'required',
    description: 'Weave secondary keywords throughout the content naturally.',
  },
  {
    id: 'keyword-3',
    category: 'Keyword Optimization',
    item: 'LSI keywords scattered throughout',
    priority: 'recommended',
    description: 'Include semantically related terms to help search engines understand context.',
  },
  {
    id: 'keyword-4',
    category: 'Keyword Optimization',
    item: 'No keyword stuffing',
    priority: 'required',
    description: 'Avoid excessive keyword repetition that feels unnatural.',
  },

  // ===== INTERNAL LINKING =====
  {
    id: 'internal-1',
    category: 'Internal Linking',
    item: '3-5 internal links per article',
    priority: 'required',
    description: 'Link to relevant tool pages and related blog posts.',
  },
  {
    id: 'internal-2',
    category: 'Internal Linking',
    item: 'Links to relevant tool pages',
    priority: 'required',
    description: 'Link to your tool pages when they are relevant to the content.',
  },
  {
    id: 'internal-3',
    category: 'Internal Linking',
    item: 'Descriptive anchor text',
    priority: 'required',
    description: 'Use descriptive anchor text that tells users and search engines what the linked page is about.',
  },

  // ===== EXTERNAL LINKING =====
  {
    id: 'external-1',
    category: 'External Linking',
    item: '1-2 external links to authoritative sources',
    priority: 'recommended',
    description: 'Link to high-authority sites to support your claims and build trust.',
  },
  {
    id: 'external-2',
    category: 'External Linking',
    item: 'Links open in new tab',
    priority: 'recommended',
    description: 'External links should open in a new tab to keep users on your site.',
  },

  // ===== IMAGES =====
  {
    id: 'image-1',
    category: 'Images',
    item: 'At least 2-3 images per article',
    priority: 'required',
    description: 'Visual content improves engagement and time on page.',
  },
  {
    id: 'image-2',
    category: 'Images',
    item: 'Images compressed for fast loading',
    priority: 'required',
    description: 'Use WebP format and compress to under 100KB per image.',
  },
  {
    id: 'image-3',
    category: 'Images',
    item: 'Alt tags with descriptive text',
    priority: 'required',
    description: 'Alt tags help search engines understand image content and improve accessibility.',
  },
  {
    id: 'image-4',
    category: 'Images',
    item: 'Image file names include keywords',
    priority: 'recommended',
    description: 'Use descriptive file names like "youtube-thumbnail-guide.jpg".',
  },

  // ===== TECHNICAL SEO =====
  {
    id: 'technical-1',
    category: 'Technical SEO',
    item: 'Schema markup (Article, FAQ)',
    priority: 'required',
    description: 'Add structured data for articles and FAQ sections.',
  },
  {
    id: 'technical-2',
    category: 'Technical SEO',
    item: 'Mobile responsive design',
    priority: 'required',
    description: 'Ensure content looks great on all device sizes.',
  },
  {
    id: 'technical-3',
    category: 'Technical SEO',
    item: 'Page load under 3 seconds',
    priority: 'required',
    description: 'Optimize images, code, and server response for fast loading.',
  },
  {
    id: 'technical-4',
    category: 'Technical SEO',
    item: 'Proper heading hierarchy',
    priority: 'required',
    description: 'Use H1 > H2 > H3 hierarchy without skipping levels.',
  },

  // ===== ENGAGEMENT =====
  {
    id: 'engagement-1',
    category: 'Engagement',
    item: 'Clear call-to-action',
    priority: 'required',
    description: 'Every article should have a clear next step for readers.',
  },
  {
    id: 'engagement-2',
    category: 'Engagement',
    item: 'Social sharing buttons',
    priority: 'recommended',
    description: 'Make it easy for readers to share your content.',
  },
  {
    id: 'engagement-3',
    category: 'Engagement',
    item: 'Related posts section',
    priority: 'recommended',
    description: 'Show related articles to keep users engaged.',
  },
  {
    id: 'engagement-4',
    category: 'Engagement',
    item: 'FAQ section with schema',
    priority: 'recommended',
    description: 'Add FAQ sections that can appear as rich snippets.',
  },
];

// ===== TOOL PAGE CHECKLIST =====
export const TOOL_PAGE_CHECKLIST: ChecklistItem[] = [
  {
    id: 'tool-seo-1',
    category: 'SEO',
    item: 'Title tag with primary keyword',
    priority: 'required',
    description: 'Include the tool name and main function in the title.',
  },
  {
    id: 'tool-seo-2',
    category: 'SEO',
    item: 'Meta description 150-160 characters',
    priority: 'required',
    description: 'Describe the tool\'s benefit and include a CTA.',
  },
  {
    id: 'tool-seo-3',
    category: 'SEO',
    item: 'H1 with tool name',
    priority: 'required',
    description: 'The main heading should clearly state the tool name.',
  },
  {
    id: 'tool-seo-4',
    category: 'SEO',
    item: 'H2 sections for features and how-to',
    priority: 'required',
    description: 'Organize content with clear H2 sections.',
  },
  {
    id: 'tool-seo-5',
    category: 'SEO',
    item: 'FAQ section with schema markup',
    priority: 'required',
    description: 'Add FAQ questions that users commonly ask about the tool.',
  },
  {
    id: 'tool-ux-1',
    category: 'User Experience',
    item: 'Clear tool description',
    priority: 'required',
    description: 'Explain what the tool does and why users should use it.',
  },
  {
    id: 'tool-ux-2',
    category: 'User Experience',
    item: 'Step-by-step instructions',
    priority: 'required',
    description: 'Provide clear instructions for using the tool.',
  },
  {
    id: 'tool-ux-3',
    category: 'User Experience',
    item: 'Example/demo included',
    priority: 'recommended',
    description: 'Show examples of input and output.',
  },
  {
    id: 'tool-ux-4',
    category: 'User Experience',
    item: 'Error handling messages',
    priority: 'required',
    description: 'Provide clear error messages for invalid inputs.',
  },
  {
    id: 'tool-ux-5',
    category: 'User Experience',
    item: 'Download/share functionality',
    priority: 'recommended',
    description: 'Allow users to download results and share the tool.',
  },
  {
    id: 'tool-conv-1',
    category: 'Conversion',
    item: 'Clear primary CTA',
    priority: 'required',
    description: 'Make the main action button prominent and clear.',
  },
  {
    id: 'tool-conv-2',
    category: 'Conversion',
    item: 'Related tools section',
    priority: 'recommended',
    description: 'Show related tools to increase page views.',
  },
  {
    id: 'tool-conv-3',
    category: 'Conversion',
    item: 'Blog post links',
    priority: 'recommended',
    description: 'Link to relevant blog posts for more information.',
  },
  {
    id: 'tool-conv-4',
    category: 'Conversion',
    item: 'Social proof elements',
    priority: 'optional',
    description: 'Show user counts, ratings, or testimonials.',
  },
];

// ===== CHECKLIST FUNCTIONS =====
export function getChecklistByCategory(category: string): ChecklistItem[] {
  return CONTENT_CHECKLIST.filter(item => item.category === category);
}

export function getRequiredItems(): ChecklistItem[] {
  return CONTENT_CHECKLIST.filter(item => item.priority === 'required');
}

export function getChecklistProgress(completedIds: string[]): number {
  return Math.round((completedIds.length / CONTENT_CHECKLIST.length) * 100);
}

export function generateChecklistReport(completedIds: string[]): string {
  const categories = [...new Set(CONTENT_CHECKLIST.map(item => item.category))];
  let report = '# Content Optimization Checklist Report\n\n';

  for (const category of categories) {
    const items = getChecklistByCategory(category);
    const completed = items.filter(item => completedIds.includes(item.id));
    report += `## ${category} (${completed.length}/${items.length})\n`;
    for (const item of items) {
      const status = completedIds.includes(item.id) ? '✅' : '❌';
      report += `- ${status} ${item.item}\n`;
    }
    report += '\n';
  }

  report += `## Overall Progress: ${getChecklistProgress(completedIds)}%\n`;
  return report;
}
