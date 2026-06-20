/**
 * CreatorBoost AI - Performance Tracking & KPIs
 * Define metrics, targets, and tracking methods
 */

export interface KPI {
  name: string;
  category: string;
  currentValue: number | string;
  target3Month: number | string;
  target6Month: number | string;
  target12Month: number | string;
  unit: string;
  tool: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

// ===== TRAFFIC KPIs =====
export const TRAFFIC_KPIS: KPI[] = [
  {
    name: 'Organic Sessions',
    category: 'Traffic',
    currentValue: 10000,
    target3Month: 50000,
    target6Month: 150000,
    target12Month: 500000,
    unit: 'sessions/month',
    tool: 'Google Analytics 4',
    frequency: 'daily',
  },
  {
    name: 'Organic Users',
    category: 'Traffic',
    currentValue: 8000,
    target3Month: 40000,
    target6Month: 120000,
    target12Month: 400000,
    unit: 'users/month',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Page Views',
    category: 'Traffic',
    currentValue: 25000,
    target3Month: 120000,
    target6Month: 400000,
    target12Month: 1200000,
    unit: 'views/month',
    tool: 'Google Analytics 4',
    frequency: 'daily',
  },
  {
    name: 'Unique Visitors',
    category: 'Traffic',
    currentValue: 8000,
    target3Month: 40000,
    target6Month: 120000,
    target12Month: 400000,
    unit: 'visitors/month',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Direct Traffic',
    category: 'Traffic',
    currentValue: 2000,
    target3Month: 8000,
    target6Month: 25000,
    target12Month: 80000,
    unit: 'visits/month',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Referral Traffic',
    category: 'Traffic',
    currentValue: 1000,
    target3Month: 5000,
    target6Month: 15000,
    target12Month: 50000,
    unit: 'visits/month',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
];

// ===== RANKING KPIs =====
export const RANKING_KPIS: KPI[] = [
  {
    name: 'Keywords in Top 10',
    category: 'Rankings',
    currentValue: 5,
    target3Month: 25,
    target6Month: 75,
    target12Month: 200,
    unit: 'keywords',
    tool: 'Google Search Console',
    frequency: 'weekly',
  },
  {
    name: 'Keywords in Top 20',
    category: 'Rankings',
    currentValue: 15,
    target3Month: 60,
    target6Month: 150,
    target12Month: 400,
    unit: 'keywords',
    tool: 'Google Search Console',
    frequency: 'weekly',
  },
  {
    name: 'Average Position',
    category: 'Rankings',
    currentValue: 25,
    target3Month: 18,
    target6Month: 12,
    target12Month: 8,
    unit: 'position',
    tool: 'Google Search Console',
    frequency: 'weekly',
  },
  {
    name: 'Organic CTR',
    category: 'Rankings',
    currentValue: 2.5,
    target3Month: 3.5,
    target6Month: 4.5,
    target12Month: 5.5,
    unit: '%',
    tool: 'Google Search Console',
    frequency: 'weekly',
  },
  {
    name: 'Impressions',
    category: 'Rankings',
    currentValue: 50000,
    target3Month: 200000,
    target6Month: 600000,
    target12Month: 2000000,
    unit: 'impressions/month',
    tool: 'Google Search Console',
    frequency: 'weekly',
  },
  {
    name: 'Indexed Pages',
    category: 'Rankings',
    currentValue: 80,
    target3Month: 200,
    target6Month: 400,
    target12Month: 600,
    unit: 'pages',
    tool: 'Google Search Console',
    frequency: 'monthly',
  },
];

// ===== AUTHORITY KPIs =====
export const AUTHORITY_KPIS: KPI[] = [
  {
    name: 'Domain Authority',
    category: 'Authority',
    currentValue: 15,
    target3Month: 25,
    target6Month: 35,
    target12Month: 45,
    unit: 'score',
    tool: 'Moz/Ahrefs',
    frequency: 'monthly',
  },
  {
    name: 'Referring Domains',
    category: 'Authority',
    currentValue: 50,
    target3Month: 200,
    target6Month: 500,
    target12Month: 1200,
    unit: 'domains',
    tool: 'Ahrefs',
    frequency: 'monthly',
  },
  {
    name: 'Total Backlinks',
    category: 'Authority',
    currentValue: 200,
    target3Month: 800,
    target6Month: 2500,
    target12Month: 6000,
    unit: 'backlinks',
    tool: 'Ahrefs',
    frequency: 'monthly',
  },
  {
    name: 'Brand Mentions',
    category: 'Authority',
    currentValue: 10,
    target3Month: 50,
    target6Month: 150,
    target12Month: 400,
    unit: 'mentions/month',
    tool: 'Google Alerts',
    frequency: 'weekly',
  },
  {
    name: 'Social Followers (Total)',
    category: 'Authority',
    currentValue: 500,
    target3Month: 3000,
    target6Month: 10000,
    target12Month: 30000,
    unit: 'followers',
    tool: 'Platform Analytics',
    frequency: 'monthly',
  },
];

// ===== ENGAGEMENT KPIs =====
export const ENGAGEMENT_KPIS: KPI[] = [
  {
    name: 'Bounce Rate',
    category: 'Engagement',
    currentValue: 65,
    target3Month: 55,
    target6Month: 48,
    target12Month: 42,
    unit: '%',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Average Time on Page',
    category: 'Engagement',
    currentValue: 1.5,
    target3Month: 2.5,
    target6Month: 3.5,
    target12Month: 4.5,
    unit: 'minutes',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Pages per Session',
    category: 'Engagement',
    currentValue: 1.8,
    target3Month: 2.2,
    target6Month: 2.8,
    target12Month: 3.2,
    unit: 'pages',
    tool: 'Google Analytics 4',
    frequency: 'weekly',
  },
  {
    name: 'Tool Usage Rate',
    category: 'Engagement',
    currentValue: 45,
    target3Month: 55,
    target6Month: 62,
    target12Month: 68,
    unit: '%',
    tool: 'Custom Analytics',
    frequency: 'daily',
  },
  {
    name: 'Newsletter Subscribers',
    category: 'Engagement',
    currentValue: 200,
    target3Month: 1500,
    target6Month: 5000,
    target12Month: 15000,
    unit: 'subscribers',
    tool: 'Email Platform',
    frequency: 'weekly',
  },
  {
    name: 'Email Open Rate',
    category: 'Engagement',
    currentValue: 25,
    target3Month: 30,
    target6Month: 35,
    target12Month: 38,
    unit: '%',
    tool: 'Email Platform',
    frequency: 'weekly',
  },
];

// ===== CONVERSION KPIs =====
export const CONVERSION_KPIS: KPI[] = [
  {
    name: 'Tool Conversions',
    category: 'Conversion',
    currentValue: 500,
    target3Month: 3000,
    target6Month: 10000,
    target12Month: 30000,
    unit: 'uses/month',
    tool: 'Custom Analytics',
    frequency: 'daily',
  },
  {
    name: 'Free to Paid Conversion',
    category: 'Conversion',
    currentValue: 0.5,
    target3Month: 1.5,
    target6Month: 2.5,
    target12Month: 3.5,
    unit: '%',
    tool: 'Custom Analytics',
    frequency: 'monthly',
  },
  {
    name: 'Revenue per Visitor',
    category: 'Conversion',
    currentValue: 0.02,
    target3Month: 0.05,
    target6Month: 0.08,
    target12Month: 0.12,
    unit: '$',
    tool: 'Custom Analytics',
    frequency: 'monthly',
  },
  {
    name: 'Monthly Revenue',
    category: 'Conversion',
    currentValue: 200,
    target3Month: 2500,
    target6Month: 12000,
    target12Month: 60000,
    unit: '$',
    tool: 'Payment Processor',
    frequency: 'monthly',
  },
  {
    name: 'Cost per Acquisition',
    category: 'Conversion',
    currentValue: 5.0,
    target3Month: 3.5,
    target6Month: 2.5,
    target12Month: 1.5,
    unit: '$',
    tool: 'Custom Analytics',
    frequency: 'monthly',
  },
  {
    name: 'Customer Lifetime Value',
    category: 'Conversion',
    currentValue: 50,
    target3Month: 75,
    target6Month: 100,
    target12Month: 150,
    unit: '$',
    tool: 'Custom Analytics',
    frequency: 'monthly',
  },
];

// ===== CONTENT KPIs =====
export const CONTENT_KPIS: KPI[] = [
  {
    name: 'Blog Posts Published',
    category: 'Content',
    currentValue: 50,
    target3Month: 86,
    target6Month: 122,
    target12Month: 194,
    unit: 'posts',
    tool: 'CMS',
    frequency: 'monthly',
  },
  {
    name: 'Tool Pages Published',
    category: 'Content',
    currentValue: 50,
    target3Month: 56,
    target6Month: 62,
    target12Month: 75,
    unit: 'pages',
    tool: 'CMS',
    frequency: 'monthly',
  },
  {
    name: 'YouTube Videos Published',
    category: 'Content',
    currentValue: 0,
    target3Month: 12,
    target6Month: 24,
    target12Month: 48,
    unit: 'videos',
    tool: 'YouTube Studio',
    frequency: 'monthly',
  },
  {
    name: 'Social Posts Published',
    category: 'Content',
    currentValue: 0,
    target3Month: 90,
    target6Month: 180,
    target12Month: 365,
    unit: 'posts',
    tool: 'Social Platform',
    frequency: 'monthly',
  },
  {
    name: 'Email Newsletters Sent',
    category: 'Content',
    currentValue: 0,
    target3Month: 12,
    target6Month: 24,
    target12Month: 52,
    unit: 'emails',
    tool: 'Email Platform',
    frequency: 'monthly',
  },
];

// ===== WEEKLY REPORTING TEMPLATE =====
export const WEEKLY_REPORT_TEMPLATE = `
# CreatorBoost AI - Weekly SEO Report

**Report Date:** [Date]
**Report Period:** [Start Date] - [End Date]

---

## Executive Summary
- Organic Sessions: [X] ([Y%] change WoW)
- Keywords in Top 10: [X] ([Y] new)
- New Backlinks: [X]
- Tool Usage: [X] ([Y%] change)

---

## Traffic Overview
| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Organic Sessions | | | |
| Organic Users | | | |
| Page Views | | | |
| Bounce Rate | | | |
| Avg. Time on Page | | | |

---

## Top Performing Pages
| Page | Sessions | Bounce Rate | Avg. Time |
|------|----------|-------------|-----------|
| 1. | | | |
| 2. | | | |
| 3. | | | |

---

## Keyword Rankings
| Keyword | Position | Change | Volume |
|---------|----------|--------|--------|
| | | | |

---

## Content Published
- Blog Posts: [X]
- Tool Updates: [X]
- YouTube Videos: [X]
- Social Posts: [X]

---

## Link Building
- Outreach Emails Sent: [X]
- Guest Posts Published: [X]
- New Backlinks: [X]
- New Referring Domains: [X]

---

## Key Actions Taken
1. [Action]
2. [Action]
3. [Action]

---

## Next Week Priorities
1. [Priority]
2. [Priority]
3. [Priority]

---

## Notes
[Any additional observations or insights]
`;

// ===== MONTHLY REPORTING TEMPLATE =====
export const MONTHLY_REPORT_TEMPLATE = `
# CreatorBoost AI - Monthly SEO Report

**Report Month:** [Month Year]
**Report Date:** [Date]

---

## KPI Dashboard

### Traffic
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Organic Sessions | | | |
| Organic Users | | | |
| Page Views | | | |
| Direct Traffic | | | |
| Referral Traffic | | | |

### Rankings
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Keywords Top 10 | | | |
| Keywords Top 20 | | | |
| Average Position | | | |
| Organic CTR | | | |
| Indexed Pages | | | |

### Authority
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Domain Authority | | | |
| Referring Domains | | | |
| Total Backlinks | | | |
| Brand Mentions | | | |

### Engagement
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bounce Rate | | | |
| Avg. Time on Page | | | |
| Pages per Session | | | |
| Tool Usage Rate | | | |
| Newsletter Subs | | | |

### Conversion
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Tool Conversions | | | |
| Revenue per Visitor | | | |
| Monthly Revenue | | | |
| CPA | | | |
| CLV | | | |

---

## Content Performance

### Blog Posts
- Published: [X]
- Total Organic Sessions: [X]
- Top Performing: [Title]

### Tool Usage
- Total Tool Uses: [X]
- Top Tool: [Tool Name]
- Conversion Rate: [X%]

### YouTube
- Videos Published: [X]
- Total Views: [X]
- Subscribers Gained: [X]

---

## Link Building Summary
- Guest Posts Published: [X]
- New Backlinks: [X]
- New Referring Domains: [X]
- Top New Backlink: [Source]

---

## Competitor Updates
- [Competitor]: [Notable change]
- [Competitor]: [Notable change]

---

## Key Wins
1. [Win]
2. [Win]
3. [Win]

---

## Challenges
1. [Challenge]
2. [Challenge]

---

## Next Month Priorities
1. [Priority]
2. [Priority]
3. [Priority]
`;

// ===== ALERT THRESHOLDS =====
export const ALERT_THRESHOLDS = {
  trafficDrop: { percentage: -20, frequency: 'daily' },
  rankingDrop: { positions: 5, frequency: 'weekly' },
  bounceRateIncrease: { percentage: 10, frequency: 'weekly' },
  conversionDrop: { percentage: -15, frequency: 'weekly' },
  backlinkLoss: { count: 5, frequency: 'weekly' },
};

// ===== UTILITY FUNCTIONS =====
export function getAllKPIs(): KPI[] {
  return [
    ...TRAFFIC_KPIS,
    ...RANKING_KPIS,
    ...AUTHORITY_KPIS,
    ...ENGAGEMENT_KPIS,
    ...CONVERSION_KPIS,
    ...CONTENT_KPIS,
  ];
}

export function getKPIsByCategory(category: string): KPI[] {
  return getAllKPIs().filter(kpi => kpi.category === category);
}

export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}

export function getKPIStatus(current: number, target: number): 'ahead' | 'on-track' | 'behind' {
  const progress = (current / target) * 100;
  if (progress >= 110) return 'ahead';
  if (progress >= 80) return 'on-track';
  return 'behind';
}
