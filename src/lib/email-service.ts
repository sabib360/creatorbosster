/**
 * CreatorBoost AI - Email Marketing Service
 * Handles email subscription, sequences, and automation
 */

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  interests: string[];
  subscribedAt: string;
  confirmedAt?: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  lastEmailSent?: string;
  emailsReceived: number;
  openRate: number;
  clickRate: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  category: 'welcome' | 'newsletter' | 'announcement' | 're-engagement' | 'promotion';
  htmlContent: string;
 PlainText: string;
  createdAt: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  event: string;
  conditions: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: string;
  triggerCount: number;
}

export interface AutomationAction {
  type: 'send_email' | 'add_tag' | 'remove_tag' | 'wait' | 'condition';
  templateId?: string;
  tag?: string;
  waitDays?: number;
  condition?: Record<string, any>;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  templateId: string;
  segmentId?: string;
  scheduledAt?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  conditions: SegmentCondition[];
  subscriberCount: number;
  createdAt: string;
}

export interface SegmentCondition {
  field: string;
  operator: 'equals' | 'contains' | 'not_equals' | 'greater_than' | 'less_than';
  value: string;
}

// ===== EMAIL SERVICE CONFIGURATION =====
export const EMAIL_CONFIG = {
  provider: 'brevo' as 'mailchimp' | 'convertkit' | 'brevo',
  apiKey: import.meta.env.VITE_EMAIL_API_KEY || '',
  listId: import.meta.env.VITE_EMAIL_LIST_ID || '',
  senderEmail: 'hello@creatorboostai.xyz',
  senderName: 'CreatorBoost AI',
  replyTo: 'support@creatorboostai.xyz',
  doubleOptIn: true,
  gdprCompliant: true,
};

// ===== EMAIL SEQUENCE (Welcome Series) =====
export const WELCOME_SEQUENCE = [
  {
    id: 'welcome-1',
    day: 0,
    subject: 'Welcome to CreatorBoost AI! Here are your free tools 🎉',
    previewText: 'Your toolkit for content creation starts here',
    content: `
# Welcome to CreatorBoost AI! 👋

Hi {{name | default: 'there'}},

Welcome to the CreatorBoost AI community! We're thrilled to have you on board.

CreatorBoost AI is your all-in-one toolkit for content creation, featuring **50+ free tools** that run entirely in your browser — no uploads, no sign-up required.

## Your Top 10 Most Popular Tools

Here are the tools our users love most:

1. **[YouTube Title Generator](/tools/youtube-title-generator)** — Generate catchy, SEO-optimized titles in seconds
2. **[Image Compressor](/tools/image-compressor)** — Reduce image size without losing quality
3. **[PDF Merger](/tools/pdf-merger)** — Combine multiple PDFs into one
4. **[Background Remover](/tools/ai-bg-remover)** — AI-powered background removal
5. **[QR Code Generator](/tools/qr-code-generator)** — Create QR codes with custom colors
6. **[YouTube Thumbnail Downloader](/tools/youtube-thumbnail-downloader)** — Download any video's thumbnail
7. **[Password Generator](/tools/password-generator)** — Generate strong, secure passwords
8. **[JSON Formatter](/tools/json-formatter)** — Format and validate JSON code
9. **[BMI Calculator](/tools/bmi-calculator)** — Calculate your Body Mass Index
10. **[Unit Converter](/tools/unit-converter)** — Convert between 8 unit categories

## Quick Start Guide

1. **Bookmark our tools page** — Visit [creatorboostai.xyz/tools](/tools) for instant access
2. **Try our YouTube tools** — If you're a creator, start with our YouTube toolkit
3. **Subscribe to our newsletter** — You're already here! We'll send you weekly tips

## What to Expect

Every week, you'll receive:
- 🎯 **Tool of the Week** — Deep dive into one of our tools
- 📚 **Top Blog Posts** — Our best articles on content creation
- 💡 **Quick Tips** — Actionable advice you can use immediately
- 🔄 **Tool Updates** — New features and improvements

Have questions? Reply to this email — we read every response!

Best,
The CreatorBoost AI Team

P.S. Check out our [AI Background Remover](/tools/ai-bg-remover) — it's one of our most popular tools and completely free!
`,
  },
  {
    id: 'welcome-2',
    day: 2,
    subject: '5 YouTube SEO tips that actually work in 2026',
    previewText: 'Boost your video rankings with these proven strategies',
    content: `
# 5 YouTube SEO Tips That Actually Work 🎬

Hi {{name | default: 'there'}},

Now that you know your way around CreatorBoost AI, let's talk about growing on YouTube.

YouTube SEO is how people find your videos. Here are 5 tips that actually work:

## 1. Optimize Your Title

Your title is the #1 factor in whether someone clicks. Include your primary keyword within the first 60 characters.

**Example:**
- ❌ "My thoughts on productivity"
- ✅ "10 Productivity Tips That Changed My Life (2026)"

Use our **[YouTube Title Generator](/tools/youtube-title-generator)** to create optimized titles instantly.

## 2. Write Detailed Descriptions

YouTube uses descriptions to understand your content. Write 200-500 words with keywords naturally included.

Use our **[YouTube Description Generator](/tools/youtube-description-generator)** for help.

## 3. Use Strategic Tags

Tags help YouTube understand your video's context. Mix broad and specific tags.

Generate 40+ optimized tags with our **[YouTube Tag Generator](/tools/youtube-tag-generator)**.

## 4. Design Thumbnails That Convert

Custom thumbnails get 2-5x more clicks than auto-generated ones. Use high-contrast colors, readable text, and expressive faces.

## 5. Track Your Performance

Use our **[YouTube SEO Checker](/tools/youtube-seo-checker)** to analyze your video's optimization and get improvement suggestions.

## Success Story

One of our users, @TechCreatorMike, increased his CTR from 3% to 8% after optimizing his titles and thumbnails using our tools. His monthly views went from 50K to 150K in just 3 months!

Want to learn more? Check out our blog: **[YouTube SEO: Complete Guide to Ranking #1](/blog/youtube-seo-complete-guide-ranking-1)**

See you in the next email!

Best,
The CreatorBoost AI Team
`,
  },
  {
    id: 'welcome-3',
    day: 4,
    subject: '7 content creation shortcuts you need to know',
    previewText: 'Save hours every week with these proven shortcuts',
    content: `
# 7 Content Creation Shortcuts ⚡

Hi {{name | default: 'there'}},

Content creation doesn't have to be time-consuming. Here are 7 shortcuts that save our users hours every week:

## 1. Use AI for First Drafts

Let AI generate your first draft, then add your voice and expertise. Our **[AI Document Summarizer](/tools/ai-document-summarizer)** can help you extract key points from research.

## 2. Repurpose One Piece of Content

Turn a blog post into:
- A YouTube video
- 5 social media posts
- An email newsletter
- An infographic

Use our **[Content Calendar Generator](/tools/content-calendar)** to plan your repurposing.

## 3. Batch Create Thumbnails

Create 5-10 thumbnails in one sitting using our **[AI Thumbnail Generator](/tools/ai-thumbnail-generator)**. Consistency is key.

## 4. Automate Repetitive Tasks

Use our tools to automate:
- Image compression before upload
- PDF merging for documents
- QR code generation for print materials

## 5. Use Templates

Don't start from scratch. Use templates for:
- Blog outlines — **[Blog Outline Generator](/tools/blog-outline-generator)**
- Social posts — **[Social Post Generator](/tools/social-post-generator)**
- Email subject lines — **[Email Subject Line Generator](/tools/email-subject-generator)**

## 6. Write Headlines That Click

Use our **[Blog Title Generator](/tools/blog-title-generator)** to create compelling headlines that get clicks.

## 7. Optimize Before Publishing

Always check:
- Grammar — **[Grammar Checker](/tools/grammar-checker)**
- SEO — **[Meta Description Generator](/tools/meta-description-generator)**
- Readability — **[Word Counter](/tools/word-counter)**

## Free Resource

Download our **Content Creator's Cheat Sheet** — a one-page reference for all the shortcuts above.

**[Download Free Cheat Sheet →](/resources/content-creator-cheat-sheet)**

Keep creating!

Best,
The CreatorBoost AI Team
`,
  },
  {
    id: 'welcome-4',
    day: 7,
    subject: 'How to use AI to 10x your content creation',
    previewText: 'The complete guide to AI-powered content creation',
    content: `
# How to Use AI to 10x Your Content Creation 🤖

Hi {{name | default: 'there'}},

AI is transforming content creation. Here's how to use it effectively:

## The AI Content Workflow

1. **Research** — Use AI to find trending topics and keywords
2. **Outline** — Generate comprehensive outlines with our **[Blog Outline Generator](/tools/blog-outline-generator)**
3. **Draft** — Let AI create your first draft
4. **Edit** — Add your voice, experience, and personality
5. **Optimize** — Use AI tools to polish and optimize

## AI Tools for Every Task

### Writing
- **[Blog Title Generator](/tools/blog-title-generator)** — Create compelling headlines
- **[Content Paraphraser](/tools/content-paraphraser)** — Rewrite in different tones
- **[Grammar Checker](/tools/grammar-checker)** — Polish your writing

### Visual Content
- **[AI Thumbnail Generator](/tools/ai-thumbnail-generator)** — Create professional thumbnails
- **[AI Text to Image](/tools/ai-text-to-image)** — Generate images from descriptions
- **[AI Background Remover](/tools/ai-bg-remover)** — Remove backgrounds instantly

### Video
- **[YouTube Title Generator](/tools/youtube-title-generator)** — Optimize video titles
- **[YouTube Script Writer](/tools/youtube-script-writer)** — Write complete scripts
- **[YouTube SEO Checker](/tools/youtube-seo-checker)** — Analyze video SEO

## Before/After Example

**Without AI:**
- Research: 2 hours
- Writing: 3 hours
- Editing: 1 hour
- Total: 6 hours

**With AI:**
- Research: 15 minutes
- AI Draft: 10 minutes
- Editing: 1 hour
- Total: 1.5 hours

That's a **75% time reduction** while maintaining quality!

## Best Practices

1. **Always edit AI output** — Add your unique voice
2. **Fact-check everything** — AI can make mistakes
3. **Use AI as a starting point** — Not the final product
4. **Experiment with prompts** — Better prompts = better output
5. **Combine AI with your expertise** — Your experience is irreplaceable

## Try It Now

Pick one AI tool from our [tools page](/tools) and try it on your next project. You'll be amazed at how much time you save.

Keep creating!

Best,
The CreatorBoost AI Team
`,
  },
  {
    id: 'welcome-5',
    day: 10,
    subject: 'How to make money online (without a huge audience)',
    previewText: '7 proven monetization strategies that work today',
    content: `
# How to Make Money Online 💰

Hi {{name | default: 'there'}},

You don't need millions of followers to earn money online. Here are 7 proven strategies:

## 1. Affiliate Marketing

Recommend products you use and earn commission. Start with:
- Amazon Associates (4-10% commission)
- ShareASale (varies by merchant)
- Your niche-specific affiliate programs

**Tip:** Use our tools to create content that drives affiliate sales.

## 2. Sell Digital Products

Create and sell:
- Templates
- E-books
- Online courses
- Stock photos

**Tools to help:** Our [Image Compressor](/tools/image-compressor) and [PDF Merger](/tools/pdf-merger) are perfect for creating professional digital products.

## 3. Offer Services

Use your skills to offer:
- Freelance work
- Consulting
- Coaching
- Design services

## 4. Build an Email List

Email marketing has the highest ROI of any channel ($36 for every $1 spent).

**Start here:** Our **[Email Subject Line Generator](/tools/email-subject-generator)** helps you create emails people actually open.

## 5. Create YouTube Content

YouTube can earn money through:
- AdSense (1,000 subscribers + 4,000 watch hours)
- Sponsorships
- Affiliate links
- Merchandise

**Tools to help:** Our complete [YouTube toolkit](/tools) helps you optimize every video.

## 6. Sell Templates

Create and sell:
- Canva templates
- Notion templates
- Spreadsheet templates
- Design assets

## 7. Teach What You Know

Create courses on platforms like:
- Teachable
- Udemy
- Skillshare
- Your own website

## Success Stories

- @DesignPro earns $3,000/month selling Canva templates
- @TechReviewer earns $5,000/month from affiliate marketing
- @FitnessCoach earns $2,000/month from online courses

## Next Steps

1. Pick ONE strategy from this list
2. Set up the infrastructure (tools, platforms)
3. Create content consistently for 90 days
4. Track your results and optimize

Need help? Check out our blog: **[How to Make Money on YouTube Without 1000 Subscribers](/blog/make-money-youtube-without-1000-subscribers)**

Best,
The CreatorBoost AI Team
`,
  },
  {
    id: 'welcome-6',
    day: 14,
    subject: 'Free resources inside (exclusive for subscribers)',
    previewText: 'Download our free guides, checklists, and templates',
    content: `
# Free Resources Just For You 📚

Hi {{name | default: 'there'}},

As a valued subscriber, here are exclusive free resources:

## Free Download: Content Creator's Toolkit

A comprehensive PDF guide covering:
- YouTube growth strategies
- SEO optimization techniques
- Content calendar templates
- Social media best practices

**[Download Free Toolkit →](/resources/content-creator-toolkit)**

## Free Checklists

### YouTube Optimization Checklist
- ✅ Title with primary keyword
- ✅ 200+ word description
- ✅ 15-20 relevant tags
- ✅ Custom thumbnail
- ✅ End screen and cards
- ✅ Engagement prompts

**[Download YouTube Checklist →](/resources/youtube-checklist)**

### SEO Checklist
- ✅ Keyword in title (first 60 chars)
- ✅ Meta description (150-160 chars)
- ✅ H2/H3 headings with keywords
- ✅ Internal links (3-5 per article)
- ✅ Image alt tags
- ✅ Schema markup

**[Download SEO Checklist →](/resources/seo-checklist)**

## Free Templates

### Blog Post Outline Template

    # Title (Primary Keyword)
    ## Introduction (Hook + Context)
    ## H2 Section 1 (Secondary Keyword)
    ### H3 Subsection
    ## H2 Section 2
    ## H2 Section 3
    ## Conclusion (Summary + CTA)
    ## FAQ (3-5 Questions)

### Social Media Content Calendar

    Monday: Tool Tip
    Tuesday: Industry News
    Wednesday: Blog Post Promotion
    Thursday: Behind-the-Scenes
    Friday: User Spotlight
    Saturday: Fun/Engaging Content
    Sunday: Week Ahead Preview

## Join Our Community

Connect with other creators in our community:
- Share your wins
- Ask questions
- Get feedback
- Collaborate

**[Join Community →](/community)**

Keep creating!

Best,
The CreatorBoost AI Team
`,
  },
  {
    id: 'welcome-7',
    day: 21,
    subject: 'Quick survey: What tools do you want next?',
    previewText: 'Help us build the tools you need most',
    content: `
# Help Us Build What You Need 🛠️

Hi {{name | default: 'there'}},

We're constantly improving CreatorBoost AI, and we want YOUR input.

## Quick Survey (2 minutes)

Help us prioritize what to build next:

**What tools would you find most useful?**
- [ ] Advanced video editing tools
- [ ] More AI-powered writing tools
- [ ] Social media scheduling
- [ ] Email marketing tools
- [ ] Analytics and reporting
- [ ] More PDF tools
- [ ] Image editing enhancements
- [ ] Other: ___________

**[Take Full Survey →](/survey)**

## Share Your Success Story

Have you achieved something using our tools? We'd love to feature you!

- Grew your YouTube channel?
- Created a successful blog?
- Built a profitable online business?
- Improved your workflow?

**[Share Your Story →](/share-story)**

## Refer a Friend

Love CreatorBoost AI? Share it with friends and you'll both get:
- Early access to new tools
- Exclusive content
- Priority support

**[Refer a Friend →](/refer)**

## What's Coming Next

Based on your feedback, we're working on:
- 🎬 Advanced video editing tools
- 🤖 More AI-powered features
- 📊 Better analytics
- 🎨 Enhanced design tools

Stay tuned for updates!

Thanks for being part of our community!

Best,
The CreatorBoost AI Team

P.S. Reply to this email with any suggestions — we read every response!
`,
  },
];

// ===== WEEKLY NEWSLETTER TEMPLATE =====
export const NEWSLETTER_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{newsletter_title}}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; }
    .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center; }
    .header h1 { color: white; font-size: 28px; margin: 0; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 14px; }
    .content { padding: 30px; }
    .greeting { color: #e2e8f0; font-size: 18px; margin-bottom: 20px; }
    .section { margin-bottom: 30px; }
    .section-title { color: #6366f1; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 2px solid #334155; padding-bottom: 10px; }
    .tool-card { background-color: #334155; border-radius: 12px; padding: 20px; margin-bottom: 15px; }
    .tool-card h3 { color: #f1f5f9; margin: 0 0 8px; font-size: 18px; }
    .tool-card p { color: #94a3b8; margin: 0 0 15px; font-size: 14px; line-height: 1.5; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; }
    .blog-list { list-style: none; padding: 0; margin: 0; }
    .blog-list li { padding: 12px 0; border-bottom: 1px solid #334155; }
    .blog-list li:last-child { border-bottom: none; }
    .blog-list a { color: #e2e8f0; text-decoration: none; font-weight: 600; }
    .blog-list a:hover { color: #6366f1; }
    .blog-list .meta { color: #64748b; font-size: 12px; margin-top: 4px; }
    .tip { background-color: #1e3a5f; border-left: 4px solid #6366f1; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 15px; }
    .tip p { color: #e2e8f0; margin: 0; font-size: 14px; }
    .footer { background-color: #0f172a; padding: 30px; text-align: center; }
    .footer p { color: #64748b; font-size: 12px; margin: 5px 0; }
    .footer a { color: #6366f1; text-decoration: none; }
    .social { margin: 20px 0; }
    .social a { display: inline-block; margin: 0 10px; color: #64748b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>CreatorBoost AI Weekly</h1>
      <p>Your weekly dose of content creation tips & tools</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hi {{subscriber_name | default: 'there'}},</p>

      <!-- Featured Tool -->
      <div class="section">
        <div class="section-title">🔧 Tool of the Week</div>
        <div class="tool-card">
          <h3>{{featured_tool_name}}</h3>
          <p>{{featured_tool_description}}</p>
          <a href="{{featured_tool_url}}" class="btn">Try It Now →</a>
        </div>
      </div>

      <!-- Top Blog Posts -->
      <div class="section">
        <div class="section-title">📚 Top Blog Posts</div>
        <ul class="blog-list">
          <li>
            <a href="{{blog_post_1_url}}">{{blog_post_1_title}}</a>
            <div class="meta">{{blog_post_1_read_time}} • {{blog_post_1_category}}</div>
          </li>
          <li>
            <a href="{{blog_post_2_url}}">{{blog_post_2_title}}</a>
            <div class="meta">{{blog_post_2_read_time}} • {{blog_post_2_category}}</div>
          </li>
          <li>
            <a href="{{blog_post_3_url}}">{{blog_post_3_title}}</a>
            <div class="meta">{{blog_post_3_read_time}} • {{blog_post_3_category}}</div>
          </li>
        </ul>
      </div>

      <!-- Quick Tips -->
      <div class="section">
        <div class="section-title">💡 Quick Tips</div>
        <div class="tip">
          <p><strong>Tip 1:</strong> {{tip_1}}</p>
        </div>
        <div class="tip">
          <p><strong>Tip 2:</strong> {{tip_2}}</p>
        </div>
        <div class="tip">
          <p><strong>Tip 3:</strong> {{tip_3}}</p>
        </div>
      </div>

      <!-- Tool Update -->
      <div class="section">
        <div class="section-title">🔄 What's New</div>
        <div class="tool-card">
          <h3>{{update_title}}</h3>
          <p>{{update_description}}</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="section" style="text-align: center; padding: 20px 0;">
        <a href="/tools" class="btn" style="font-size: 16px; padding: 15px 30px;">Explore All Tools →</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="social">
        <a href="https://twitter.com/creatorboost">Twitter</a>
        <a href="https://youtube.com/@creatorboost">YouTube</a>
        <a href="https://github.com/creatorboost">GitHub</a>
      </div>
      <p>CreatorBoost AI — Free tools for content creators</p>
      <p><a href="{{unsubscribe_url}}">Unsubscribe</a> • <a href="{{preferences_url}}">Update Preferences</a></p>
      <p>© 2026 CreatorBoost AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// ===== AUTOMATION TRIGGERS =====
export const AUTOMATION_TRIGGERS = [
  {
    id: 'trigger-welcome',
    name: 'Welcome Sequence',
    event: 'subscriber.confirmed',
    conditions: {},
    actions: [
      { type: 'send_email', templateId: 'welcome-1' },
      { type: 'wait', waitDays: 2 },
      { type: 'send_email', templateId: 'welcome-2' },
      { type: 'wait', waitDays: 2 },
      { type: 'send_email', templateId: 'welcome-3' },
      { type: 'wait', waitDays: 3 },
      { type: 'send_email', templateId: 'welcome-4' },
      { type: 'wait', waitDays: 3 },
      { type: 'send_email', templateId: 'welcome-5' },
      { type: 'wait', waitDays: 4 },
      { type: 'send_email', templateId: 'welcome-6' },
      { type: 'wait', waitDays: 7 },
      { type: 'send_email', templateId: 'welcome-7' },
    ],
    isActive: true,
  },
  {
    id: 'trigger-tool-tips',
    name: 'Tool Usage Tips',
    event: 'tool.used',
    conditions: { toolName: 'any' },
    actions: [
      { type: 'wait', waitDays: 1 },
      { type: 'send_email', templateId: 'tool-tips-email' },
    ],
    isActive: true,
  },
  {
    id: 'trigger-inactive',
    name: 'Re-engagement',
    event: 'subscriber.inactive',
    conditions: { inactiveDays: 30 },
    actions: [
      { type: 'send_email', templateId: 're-engagement-email' },
    ],
    isActive: true,
  },
  {
    id: 'trigger-new-tool',
    name: 'New Tool Announcement',
    event: 'tool.launched',
    conditions: {},
    actions: [
      { type: 'send_email', templateId: 'new-tool-announcement' },
    ],
    isActive: true,
  },
  {
    id: 'trigger-blog-published',
    name: 'Blog Notification',
    event: 'blog.published',
    conditions: {},
    actions: [
      { type: 'send_email', templateId: 'blog-notification' },
    ],
    isActive: true,
  },
];

// ===== SEGMENT DEFINITIONS =====
export const SEGMENTS = [
  {
    id: 'segment-youtube',
    name: 'YouTube Creators',
    description: 'Subscribers interested in YouTube tools and growth',
    conditions: [{ field: 'interests', operator: 'contains', value: 'youtube' }],
    subscriberCount: 0,
  },
  {
    id: 'segment-bloggers',
    name: 'Bloggers & Writers',
    description: 'Subscribers interested in blogging and writing tools',
    conditions: [{ field: 'interests', operator: 'contains', value: 'blogging' }],
    subscriberCount: 0,
  },
  {
    id: 'segment-designers',
    name: 'Designers & Creators',
    description: 'Subscribers interested in design and image tools',
    conditions: [{ field: 'interests', operator: 'contains', value: 'design' }],
    subscriberCount: 0,
  },
  {
    id: 'segment-developers',
    name: 'Developers',
    description: 'Subscribers interested in developer tools',
    conditions: [{ field: 'interests', operator: 'contains', value: 'development' }],
    subscriberCount: 0,
  },
  {
    id: 'segment-marketers',
    name: 'Digital Marketers',
    description: 'Subscribers interested in marketing tools',
    conditions: [{ field: 'interests', operator: 'contains', value: 'marketing' }],
    subscriberCount: 0,
  },
  {
    id: 'segment-engaged',
    name: 'Highly Engaged',
    description: 'Subscribers with high open and click rates',
    conditions: [
      { field: 'openRate', operator: 'greater_than', value: '50' },
      { field: 'clickRate', operator: 'greater_than', value: '10' },
    ],
    subscriberCount: 0,
  },
  {
    id: 'segment-new',
    name: 'New Subscribers',
    description: 'Subscribers who joined in the last 30 days',
    conditions: [{ field: 'subscribedAt', operator: 'greater_than', value: '30_days_ago' }],
    subscriberCount: 0,
  },
];

// ===== EMAIL ANALYTICS =====
export interface EmailAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  totalEmailsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  topPerformingEmail: { subject: string; openRate: number };
  topPerformingLink: { url: string; clicks: number };
  subscriberGrowth: { date: string; count: number }[];
  campaignPerformance: { name: string; sent: number; opened: number; clicked: number }[];
}

// ===== EMAIL FORM DATA =====
export interface SubscriptionFormData {
  email: string;
  name?: string;
  interests: string[];
  source: string;
  timestamp: string;
}

// ===== UTILITY FUNCTIONS =====
export function generateSubscriberId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function getWelcomeEmails(): typeof WELCOME_SEQUENCE {
  return WELCOME_SEQUENCE;
}

export function getTemplateById(id: string): typeof WELCOME_SEQUENCE[0] | undefined {
  return WELCOME_SEQUENCE.find(t => t.id === id);
}

export function calculateEmailStats(emails: { opened: boolean; clicked: boolean }[]) {
  const total = emails.length;
  const opened = emails.filter(e => e.opened).length;
  const clicked = emails.filter(e => e.clicked).length;
  return {
    total,
    openRate: total > 0 ? (opened / total) * 100 : 0,
    clickRate: total > 0 ? (clicked / total) * 100 : 0,
  };
}
