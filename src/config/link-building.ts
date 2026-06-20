/**
 * CreatorBoost AI - Link Building Strategy
 * Comprehensive link building plan with actionable tactics
 */

export interface LinkBuildingOpportunity {
  name: string;
  url: string;
  type: 'guest-post' | 'resource-page' | 'broken-link' | 'directory' | 'community' | 'influencer';
  domainAuthority: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTraffic: string;
  contactEmail?: string;
  notes: string;
}

// ===== GUEST POSTING OPPORTUNITIES =====
export const GUEST_POST_OPPORTUNITIES: LinkBuildingOpportunity[] = [
  {
    name: 'Medium.com',
    url: 'https://medium.com',
    type: 'guest-post',
    domainAuthority: 95,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Write about content creation tools and YouTube growth. Publication partners available.',
  },
  {
    name: 'Dev.to',
    url: 'https://dev.to',
    type: 'guest-post',
    domainAuthority: 70,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Developer-focused articles about web tools and JavaScript.',
  },
  {
    name: 'HackerNoon',
    url: 'https://hackernoon.com',
    type: 'guest-post',
    domainAuthority: 75,
    difficulty: 'medium',
    estimatedTraffic: 'Medium',
    notes: 'Tech articles about AI tools, web development, and startups.',
  },
  {
    name: 'SearchEngineJournal',
    url: 'https://searchenginejournal.com',
    type: 'guest-post',
    domainAuthority: 85,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'SEO tools and content marketing articles. Must be expert-level.',
  },
  {
    name: 'Social Media Examiner',
    url: 'https://socialmediaexaminer.com',
    type: 'guest-post',
    domainAuthority: 80,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'Social media marketing tools and strategies.',
  },
  {
    name: 'Content Marketing Institute',
    url: 'https://contentmarketinginstitute.com',
    type: 'guest-post',
    domainAuthority: 82,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'Content marketing strategy and tools articles.',
  },
  {
    name: 'ProBlogger',
    url: 'https://problogger.com',
    type: 'guest-post',
    domainAuthority: 75,
    difficulty: 'medium',
    estimatedTraffic: 'Medium',
    notes: 'Blogging tools and content creation tips.',
  },
  {
    name: 'Copyblogger',
    url: 'https://copyblogger.com',
    type: 'guest-post',
    domainAuthority: 78,
    difficulty: 'hard',
    estimatedTraffic: 'Medium',
    notes: 'Writing and content marketing articles.',
  },
  {
    name: 'Zapier Blog',
    url: 'https://zapier.com/blog',
    type: 'guest-post',
    domainAuthority: 80,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Productivity tools and automation articles.',
  },
  {
    name: 'Buffer Blog',
    url: 'https://buffer.com/resources',
    type: 'guest-post',
    domainAuthority: 78,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Social media marketing and content strategy.',
  },
  {
    name: 'HubSpot Blog',
    url: 'https://blog.hubspot.com',
    type: 'guest-post',
    domainAuthority: 92,
    difficulty: 'hard',
    estimatedTraffic: 'Very High',
    notes: 'Marketing tools and strategies. Contributor program available.',
  },
  {
    name: 'Neil Patel Blog',
    url: 'https://neilpatel.com/blog',
    type: 'guest-post',
    domainAuthority: 88,
    difficulty: 'hard',
    estimatedTraffic: 'Very High',
    notes: 'Digital marketing and SEO articles.',
  },
  {
    name: 'Ahrefs Blog',
    url: 'https://ahrefs.com/blog',
    type: 'guest-post',
    domainAuthority: 85,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'SEO tools and strategies. Must be data-driven.',
  },
  {
    name: 'Moz Blog',
    url: 'https://moz.com/blog',
    type: 'guest-post',
    domainAuthority: 90,
    difficulty: 'hard',
    estimatedTraffic: 'Very High',
    notes: 'SEO and digital marketing. Contributor guidelines available.',
  },
  {
    name: 'SitePoint',
    url: 'https://sitepoint.com',
    type: 'guest-post',
    domainAuthority: 75,
    difficulty: 'medium',
    estimatedTraffic: 'Medium',
    notes: 'Web development tutorials and tools.',
  },
  {
    name: 'Smashing Magazine',
    url: 'https://smashingmagazine.com',
    type: 'guest-post',
    domainAuthority: 80,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'Web design and development. Must be expert-level.',
  },
  {
    name: 'CSS-Tricks',
    url: 'https://css-tricks.com',
    type: 'guest-post',
    domainAuthority: 78,
    difficulty: 'medium',
    estimatedTraffic: 'Medium',
    notes: 'CSS and web design articles.',
  },
  {
    name: 'IndieHackers',
    url: 'https://indiehackers.com',
    type: 'guest-post',
    domainAuthority: 65,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Indie maker community. Share building process.',
  },
  {
    name: 'Product Hunt',
    url: 'https://producthunt.com',
    type: 'guest-post',
    domainAuthority: 85,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Launch new tools and features. Build community.',
  },
];

// ===== RESOURCE PAGE OPPORTUNITIES =====
export const RESOURCE_PAGES: LinkBuildingOpportunity[] = [
  {
    name: 'HubSpot Marketing Resources',
    url: 'https://www.hubspot.com/marketing-tools',
    type: 'resource-page',
    domainAuthority: 92,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'Submit free tools for inclusion in their marketing tools list.',
  },
  {
    name: ' Neil Patel SEO Tools List',
    url: 'https://neilpatel.com/seo-tools/',
    type: 'resource-page',
    domainAuthority: 88,
    difficulty: 'hard',
    estimatedTraffic: 'High',
    notes: 'Comprehensive SEO tools list. Submit for inclusion.',
  },
  {
    name: 'Buffer Social Media Tools',
    url: 'https://buffer.com/resources/social-media-tools',
    type: 'resource-page',
    domainAuthority: 78,
    difficulty: 'medium',
    estimatedTraffic: 'Medium',
    notes: 'Social media tools resource page.',
  },
  {
    name: 'Zapier App Directory',
    url: 'https://zapier.com/apps',
    type: 'resource-page',
    domainAuthority: 80,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'List tools in Zapier directory for integration traffic.',
  },
  {
    name: 'AlternativeTo',
    url: 'https://alternativeto.net',
    type: 'resource-page',
    domainAuthority: 75,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'List as alternative to Smallpdf, Canva, etc.',
  },
  {
    name: 'Product Hunt Collections',
    url: 'https://www.producthunt.com/collections',
    type: 'resource-page',
    domainAuthority: 85,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Get included in relevant tool collections.',
  },
  {
    name: 'SaaSHub',
    url: 'https://saashub.com',
    type: 'resource-page',
    domainAuthority: 55,
    difficulty: 'easy',
    estimatedTraffic: 'Low',
    notes: 'List tools for software discovery.',
  },
  {
    name: 'ToolFinder',
    url: 'https://toolfinder.io',
    type: 'resource-page',
    domainAuthority: 45,
    difficulty: 'easy',
    estimatedTraffic: 'Low',
    notes: 'List tools for discovery.',
  },
];

// ===== COMMUNITY OPPORTUNITIES =====
export const COMMUNITY_OPPORTUNITIES: LinkBuildingOpportunity[] = [
  {
    name: 'Reddit r/SEO',
    url: 'https://reddit.com/r/SEO',
    type: 'community',
    domainAuthority: 99,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Share SEO tools and tips. Follow community rules.',
  },
  {
    name: 'Reddit r/YouTube',
    url: 'https://reddit.com/r/YouTube',
    type: 'community',
    domainAuthority: 99,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Share YouTube tools and growth tips.',
  },
  {
    name: 'Reddit r/content_marketing',
    url: 'https://reddit.com/r/content_marketing',
    type: 'community',
    domainAuthority: 99,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Content marketing tools and strategies.',
  },
  {
    name: 'Reddit r/webdev',
    url: 'https://reddit.com/r/webdev',
    type: 'community',
    domainAuthority: 99,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Developer tools and web development.',
  },
  {
    name: 'Reddit r/entrepreneur',
    url: 'https://reddit.com/r/entrepreneur',
    type: 'community',
    domainAuthority: 99,
    difficulty: 'easy',
    estimatedTraffic: 'Medium',
    notes: 'Business tools and productivity.',
  },
  {
    name: 'Quora',
    url: 'https://quora.com',
    type: 'community',
    domainAuthority: 95,
    difficulty: 'easy',
    estimatedTraffic: 'High',
    notes: 'Answer questions about tools, link to relevant tools.',
  },
  {
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    type: 'community',
    domainAuthority: 95,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Answer developer questions, mention tools when relevant.',
  },
  {
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    type: 'community',
    domainAuthority: 90,
    difficulty: 'medium',
    estimatedTraffic: 'High',
    notes: 'Share technical articles and tool launches.',
  },
];

// ===== INFLUENCER OUTREACH =====
export const INFLUENCER_OUTREACH = [
  {
    niche: 'YouTube Growth',
    influencers: [
      { name: 'Think Media', platform: 'YouTube', followers: '2M+', contact: 'thinkmedia.com' },
      { name: 'vidIQ', platform: 'YouTube', followers: '1.5M+', contact: 'vidiq.com' },
      { name: 'Derral Eves', platform: 'YouTube', followers: '500K+', contact: 'derraleves.com' },
      { name: 'Nick Nimmin', platform: 'YouTube', followers: '500K+', contact: 'ninnimmin.com' },
    ],
  },
  {
    niche: 'Content Creation',
    influencers: [
      { name: 'Ali Abdaal', platform: 'YouTube', followers: '5M+', contact: 'aliabdaal.com' },
      { name: 'Pat Flynn', platform: 'YouTube', followers: '1M+', contact: 'patflynn.com' },
      { name: 'Income School', platform: 'YouTube', followers: '500K+', contact: 'incomeschool.com' },
    ],
  },
  {
    niche: 'SEO',
    influencers: [
      { name: 'Neil Patel', platform: 'YouTube', followers: '1M+', contact: 'neilpatel.com' },
      { name: 'Brian Dean', platform: 'YouTube', followers: '500K+', contact: 'backlinko.com' },
      { name: 'Ahrefs', platform: 'YouTube', followers: '500K+', contact: 'ahrefs.com' },
    ],
  },
  {
    niche: 'Web Development',
    influencers: [
      { name: 'Fireship', platform: 'YouTube', followers: '2M+', contact: 'fireship.io' },
      { name: 'Web Dev Simplified', platform: 'YouTube', followers: '1.5M+', contact: 'webdevsimplified.com' },
      { name: 'Traversy Media', platform: 'YouTube', followers: '2M+', contact: 'traversymedia.com' },
    ],
  },
];

// ===== OUTREACH TEMPLATES =====
export const OUTREACH_TEMPLATES = {
  guestPost: {
    subject: 'Guest Post Idea: [Topic] for [Site Name]',
    body: `Hi [Name],

I'm [Your Name] from CreatorBoost AI. I've been reading [Site Name] and love your content about [specific topic].

I'd like to contribute a guest post on: "[Proposed Title]"

Here's a brief outline:
1. [Point 1]
2. [Point 2]
3. [Point 3]

The article would be 1,500-2,000 words, original, and not published elsewhere. I can include data and examples from our 50+ free tools.

Would you be interested in this topic? I'm happy to adjust the angle to better fit your audience.

Best regards,
[Your Name]
CreatorBoost AI`,
  },
  resourcePage: {
    subject: 'Resource Addition for [Page Name]',
    body: `Hi [Name],

I noticed your excellent resource page: [Page URL]

I wanted to suggest adding CreatorBoost AI as a resource. We offer 50+ free tools for content creators including:

- Image compression, background removal, and format conversion
- PDF merging, splitting, and conversion tools
- YouTube title, thumbnail, and SEO optimization tools
- Developer tools (JSON formatter, regex tester, etc.)
- AI-powered content creation tools

All tools are 100% free, require no sign-up, and process files in the browser (no uploads to servers).

Would you consider adding us to your resource list?

Best regards,
[Your Name]`,
  },
  brokenLink: {
    subject: 'Broken Link on [Page Name]',
    body: `Hi [Name],

I was reading your article "[Article Title]" and noticed a broken link:

URL: [Broken URL]
Anchor text: [Link text]

This link leads to a 404 page. I have a relevant resource that could replace it:

Our tool: [Your URL]
Description: [Brief description of your tool/content]

Would you like me to provide more details for the replacement?

Best regards,
[Your Name]`,
  },
  influencer: {
    subject: 'Free Tool for Your [Platform] Audience',
    body: `Hi [Name],

I've been following your content on [Platform] and love your [specific content/video].

I built CreatorBoost AI — a free toolkit with 50+ tools for content creators. I think your audience would find these particularly useful:

- YouTube Title Generator (AI-powered)
- YouTube SEO Checker
- Thumbnail Generator
- Background Remover
- PDF Tools

All tools are 100% free, no sign-up required, and process files in the browser.

Would you be interested in trying them out? I'd love to hear your feedback.

Best regards,
[Your Name]`,
  },
};

// ===== LINK BUILDING CALENDAR =====
export const LINK_BUILDING_CALENDAR = {
  weekly: [
    'Send 5 guest post pitches',
    'Respond to 3 HARO queries',
    'Post in 2 Reddit communities',
    'Answer 5 Quora questions',
    'Send 3 resource page outreach emails',
  ],
  monthly: [
    'Publish 2 guest posts',
    'Launch 1 new tool (for press coverage)',
    'Submit to 5 directories',
    'Reach out to 5 influencers',
    'Create 1 link-worthy asset (infographic, tool, study)',
  ],
  quarterly: [
    'Create comprehensive guide (10,000+ words)',
    'Launch major tool update (for Product Hunt)',
    'Host webinar or live event',
    'Publish original research or survey',
    'Review and update link building strategy',
  ],
};

// ===== TRACKING METRICS =====
export const LINK_BUILDING_METRICS = {
  outreach: {
    emailsSent: { monthly: 50, quarterly: 150 },
    responseRate: { target: '15-20%', current: '0%' },
    conversionRate: { target: '5-10%', current: '0%' },
  },
  links: {
    newBacklinks: { monthly: 50, quarterly: 150 },
    referringDomains: { monthly: 20, quarterly: 60 },
    linkQuality: { target: 'DA 30+', current: '0' },
  },
  content: {
    guestPosts: { monthly: 2, quarterly: 6 },
    resourcePageLinks: { monthly: 5, quarterly: 15 },
    directorySubmissions: { monthly: 5, quarterly: 15 },
  },
};
