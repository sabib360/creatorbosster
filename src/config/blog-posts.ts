/**
 * Blog posts configuration and metadata
 * SEO-optimized content structure for Creator Booster
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  keywords: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  author: string;
  publishDate: string;
  updateDate: string;
  featured?: boolean;
  category: 'tutorial' | 'guide' | 'tips' | 'case-study' | 'news';
  readingTime: number;
  image: string;
  author_image?: string;
  internalLinks: Array<{ text: string; url: string }>;
  externalLinks: Array<{ text: string; url: string }>;
  faq?: Array<{ question: string; answer: string }>;
}

// SEO Blog Post Calendar (First 30 Days)
export const BLOG_POSTS_Q1: BlogPost[] = [
  {
    id: 'viral-youtube-titles-guide',
    slug: 'how-to-create-viral-youtube-titles',
    title: 'How to Create Viral YouTube Titles - Complete Guide 2024',
    metaDescription: 'Learn proven strategies to write viral YouTube titles that increase CTR and views. Step-by-step guide with 50+ title examples and formulas.',
    excerpt: 'Discover the science behind viral YouTube titles. Learn psychology-backed formulas that boost CTR by 300%.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['viral YouTube titles', 'YouTube title ideas', 'YouTube SEO tips'],
    primaryKeyword: 'viral YouTube titles',
    secondaryKeywords: ['YouTube title generator', 'clickbait titles', 'YouTube algorithm'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-15',
    updateDate: '2024-01-15',
    featured: true,
    category: 'guide',
    readingTime: 12,
    image: '/blog/viral-youtube-titles.jpg',
    internalLinks: [
      { text: 'Try our AI title generator', url: '/#generator' },
      { text: 'YouTube thumbnail design guide', url: '/blog/youtube-thumbnail-design-guide' },
    ],
    externalLinks: [
      { text: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com/' },
      { text: 'Google Search Trends', url: 'https://trends.google.com/' },
    ],
    faq: [
      {
        question: 'What makes a YouTube title go viral?',
        answer: 'Viral titles use curiosity gaps, numbers, emotional triggers, and clear value propositions. They\'re 50-60 characters and include the primary keyword.',
      },
      {
        question: 'Should I use clickbait titles?',
        answer: 'Use "curiosity gaps" instead of false promises. Deliver on your title\'s promise to maintain viewer trust and reduce bounce rates.',
      },
      {
        question: 'How often should I update my titles?',
        answer: 'You can\'t change published titles without losing YouTube history. Plan titles carefully before uploading.',
      },
    ],
  },

  {
    id: 'thumbnail-design-guide',
    slug: 'youtube-thumbnail-design-guide',
    title: 'YouTube Thumbnail Design Guide - Best Practices for Higher CTR',
    metaDescription: 'Professional YouTube thumbnail design tips. Learn color psychology, text placement, contrast & psychology to increase CTR by 200%+.',
    excerpt: 'Master thumbnail design with proven best practices used by top YouTubers.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube thumbnail design', 'best thumbnail maker', 'thumbnail tips'],
    primaryKeyword: 'YouTube thumbnail design',
    secondaryKeywords: ['thumbnail maker', 'YouTube CTR', 'thumbnail best practices'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-17',
    updateDate: '2024-01-17',
    featured: true,
    category: 'guide',
    readingTime: 11,
    image: '/blog/thumbnail-design.jpg',
    internalLinks: [
      { text: 'Create thumbnails with AI', url: '/#generator' },
      { text: 'Increase YouTube CTR guide', url: '/blog/how-to-increase-youtube-ctr' },
    ],
    externalLinks: [],
    faq: [
      {
        question: 'What\'s the best thumbnail size for YouTube?',
        answer: '1280 x 720 pixels (16:9 aspect ratio). YouTube displays it at different sizes, so test across devices.',
      },
      {
        question: 'Why are my thumbnails small/blurry?',
        answer: 'Your source image is too small. Always start with high-resolution images and export at 1280x720px minimum.',
      },
    ],
  },

  {
    id: 'best-free-youtube-seo-tools',
    slug: 'best-free-youtube-seo-tools',
    title: '10 Best Free YouTube SEO Tools for Content Creators in 2024',
    metaDescription: 'Complete list of free YouTube SEO tools for keyword research, analytics, and optimization. No credit card required.',
    excerpt: 'Professional-grade YouTube SEO tools that won\'t cost you a penny.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['free YouTube SEO tools', 'YouTube analytics tools', 'keyword research YouTube'],
    primaryKeyword: 'free YouTube SEO tools',
    secondaryKeywords: ['YouTube SEO tools', 'YouTube analytics', 'keyword research'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-19',
    updateDate: '2024-01-19',
    featured: true,
    category: 'guide',
    readingTime: 10,
    image: '/blog/seo-tools.jpg',
    internalLinks: [
      { text: 'Creator Booster - Free AI Tool', url: '/#generator' },
    ],
    externalLinks: [
      { text: 'Google Keyword Planner', url: 'https://ads.google.com/intl/en_us/home/tools/keyword-planner/' },
      { text: 'Ubersuggest', url: 'https://neilpatel.com/ubersuggest/' },
    ],
    faq: [],
  },

  {
    id: 'increase-youtube-ctr',
    slug: 'how-to-increase-youtube-ctr',
    title: 'How to Increase YouTube CTR: 10 Proven Strategies That Work',
    metaDescription: 'Increase YouTube CTR with tested strategies. Understand click-through rates, benchmarks, and optimization techniques.',
    excerpt: 'Simple techniques used by top creators to boost their YouTube CTR to 10%+.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['increase YouTube CTR', 'click-through rate YouTube', 'YouTube metrics'],
    primaryKeyword: 'increase YouTube CTR',
    secondaryKeywords: ['YouTube CTR', 'average YouTube CTR', 'CTR optimization'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-21',
    updateDate: '2024-01-21',
    featured: false,
    category: 'tips',
    readingTime: 9,
    image: '/blog/increase-ctr.jpg',
    internalLinks: [
      { text: 'YouTube Thumbnail Design Guide', url: '/blog/youtube-thumbnail-design-guide' },
      { text: 'Viral Titles Guide', url: '/blog/how-to-create-viral-youtube-titles' },
    ],
    externalLinks: [],
    faq: [],
  },

  {
    id: 'youtube-algorithm-2024',
    slug: 'youtube-algorithm-explained-2024',
    title: 'YouTube Algorithm Explained: How to Rank Higher in 2024',
    metaDescription: 'Understand how YouTube algorithm works in 2024. Learn ranking factors, recommendations, and optimization strategies.',
    excerpt: 'Decode the YouTube algorithm and get your videos recommended to millions.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube algorithm', 'how does YouTube algorithm work', 'YouTube ranking factors'],
    primaryKeyword: 'YouTube algorithm',
    secondaryKeywords: ['YouTube recommendation algorithm', 'how YouTube works'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-23',
    updateDate: '2024-01-23',
    featured: true,
    category: 'guide',
    readingTime: 13,
    image: '/blog/youtube-algorithm.jpg',
    internalLinks: [],
    externalLinks: [
      { text: 'YouTube Official Blog', url: 'https://blog.youtube/' },
    ],
    faq: [],
  },

  {
    id: 'youtube-title-ideas-100',
    slug: '100-youtube-title-ideas-that-get-more-views',
    title: '100+ YouTube Title Ideas That Get More Views & Clicks',
    metaDescription: 'Swipe-and-use YouTube title ideas proven to increase views. Categories include gaming, vlogs, tutorials, and more.',
    excerpt: 'Copy-paste ready YouTube titles organized by category that actually work.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube title ideas', 'good YouTube titles', 'creative video titles'],
    primaryKeyword: 'YouTube title ideas',
    secondaryKeywords: ['video title ideas', 'YouTube video titles', 'best YouTube titles'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-25',
    updateDate: '2024-01-25',
    featured: false,
    category: 'tips',
    readingTime: 8,
    image: '/blog/title-ideas.jpg',
    internalLinks: [
      { text: 'AI Title Generator', url: '/#generator' },
      { text: 'Viral Titles Guide', url: '/blog/how-to-create-viral-youtube-titles' },
    ],
    externalLinks: [],
    faq: [],
  },

  {
    id: 'youtube-description-best-practices',
    slug: 'youtube-description-best-practices',
    title: 'YouTube Description Best Practices - Complete Tutorial 2024',
    metaDescription: 'Learn to write optimized YouTube descriptions for SEO. Includes templates, tips, and examples.',
    excerpt: 'Master YouTube descriptions to boost rankings and engagement.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube description', 'YouTube description template', 'how to write YouTube description'],
    primaryKeyword: 'YouTube description',
    secondaryKeywords: ['YouTube description tips', 'YouTube SEO description', 'description tags YouTube'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-27',
    updateDate: '2024-01-27',
    featured: false,
    category: 'tutorial',
    readingTime: 7,
    image: '/blog/description.jpg',
    internalLinks: [],
    externalLinks: [],
    faq: [],
  },

  {
    id: 'how-to-make-money-youtube',
    slug: 'how-to-make-money-on-youtube',
    title: 'How to Make Money on YouTube: Complete Monetization Guide',
    metaDescription: 'Earn money on YouTube with ads, sponsorships, and products. Learn requirements, rates, and best practices.',
    excerpt: 'Multiple ways to monetize your YouTube channel without huge subscriber counts.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['how to make money on YouTube', 'YouTube monetization', 'make money on YouTube'],
    primaryKeyword: 'how to make money on YouTube',
    secondaryKeywords: ['YouTube money', 'YouTube earnings', 'YouTube income'],
    author: 'Creator Booster Team',
    publishDate: '2024-01-29',
    updateDate: '2024-01-29',
    featured: false,
    category: 'guide',
    readingTime: 12,
    image: '/blog/make-money.jpg',
    internalLinks: [],
    externalLinks: [
      { text: 'YouTube Partner Program', url: 'https://www.youtube.com/howyoutubeworks/policies/monetization-policies/' },
    ],
    faq: [],
  },

  {
    id: 'grow-youtube-channel-10k',
    slug: 'how-to-grow-youtube-channel-from-zero-to-10k',
    title: 'Small YouTuber Growth Strategy: From 0 to 10K Subscribers',
    metaDescription: 'Step-by-step guide to grow YouTube channel from zero to 10K subscribers. Proven strategies for small creators.',
    excerpt: 'The exact playbook used to grow channels from nothing to 10K subscribers.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['grow YouTube channel', 'how to get subscribers on YouTube', 'small YouTuber growth'],
    primaryKeyword: 'grow YouTube channel',
    secondaryKeywords: ['how to grow YouTube', 'YouTube growth strategy', 'get subscribers on YouTube'],
    author: 'Creator Booster Team',
    publishDate: '2024-02-01',
    updateDate: '2024-02-01',
    featured: false,
    category: 'guide',
    readingTime: 14,
    image: '/blog/grow-channel.jpg',
    internalLinks: [],
    externalLinks: [],
    faq: [],
  },

  {
    id: 'youtube-tags-keywords-ab-test',
    slug: 'youtube-tags-vs-keywords-ab-test-results',
    title: 'YouTube Tags vs Keywords: What Really Impacts Rankings?',
    metaDescription: 'A/B test results: YouTube tags vs keywords impact on rankings. Data-driven findings and recommendations.',
    excerpt: 'Discover which matters more for YouTube SEO based on actual data.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube tags', 'YouTube tags vs keywords', 'YouTube tag optimization'],
    primaryKeyword: 'YouTube tags',
    secondaryKeywords: ['YouTube tags tips', 'how to use YouTube tags', 'YouTube SEO tags'],
    author: 'Creator Booster Team',
    publishDate: '2024-02-03',
    updateDate: '2024-02-03',
    featured: false,
    category: 'case-study',
    readingTime: 8,
    image: '/blog/tags-keywords.jpg',
    internalLinks: [],
    externalLinks: [],
    faq: [],
  },

  {
    id: 'case-study-10k-subscribers',
    slug: 'case-study-how-i-grew-youtube-channel-to-10k-subscribers',
    title: 'Case Study: How I Grew a YouTube Channel to 10K Subscribers',
    metaDescription: 'Real case study with numbers: strategy, timeline, and results of growing a YouTube channel to 10K subscribers.',
    excerpt: 'Behind-the-scenes case study showing exactly how we grew a channel.',
    content: 'CONTENT_PLACEHOLDER',
    keywords: ['YouTube growth case study', 'how to get 10k subscribers', 'YouTube case study'],
    primaryKeyword: 'YouTube growth case study',
    secondaryKeywords: ['channel growth strategy', 'YouTube success story'],
    author: 'Creator Booster Team',
    publishDate: '2024-02-05',
    updateDate: '2024-02-05',
    featured: true,
    category: 'case-study',
    readingTime: 10,
    image: '/blog/case-study.jpg',
    internalLinks: [],
    externalLinks: [],
    faq: [],
  },
];

/**
 * Quarterly Blog Plan
 * Month 1: Foundation (10 articles)
 * Month 2: Growth (10 articles)
 * Month 3: Authority (10 articles)
 */
export const QUARTERLY_BLOG_PLAN = {
  month1: {
    theme: 'Foundation - Core YouTube Skills',
    postCount: 10,
    targetTraffic: '50-200 visitors',
    targetKeywords: 'Low-mid competition, high intent',
  },
  month2: {
    theme: 'Growth - Advanced Strategies',
    postCount: 10,
    targetTraffic: '500-2000 visitors',
    targetKeywords: 'Medium competition, informational',
  },
  month3: {
    theme: 'Authority - Case Studies & Tools',
    postCount: 10,
    targetTraffic: '2K-5K visitors',
    targetKeywords: 'High competition, commercial intent',
  },
};

export default BLOG_POSTS_Q1;
