export const NICHES_20: string[] = [
  'Real Estate',
  'Lawyers',
  'Doctors',
  'Restaurants',
  'Coaches',
  'Agencies',
  'Startups',
  'Ecommerce',
  'SaaS',
  'Construction',
  'Education',
  'Finance & Banking',
  'Marketing Teams',
  'Recruiting & HR',
  'E-commerce Operations',
  'Manufacturing',
  'Nonprofits',
  'Real Estate Agents',
  'Insurance',
  'Community & Events',
];

export const nicheSlug = (niche: string) =>
  niche
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

