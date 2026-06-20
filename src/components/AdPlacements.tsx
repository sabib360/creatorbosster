/**
 * Ad Placement Components
 * Defines safe, AdSense-compliant ad positions for every page type.
 * Ads are NOT inserted yet — only containers are created.
 * 
 * AdSense Requirements:
 * - Minimum 300px between ad units
 * - No ads stacked on top of each other
 * - Clear "Advertisement" labels
 * - No ads in misleading positions
 * - Responsive ad units
 */

import AdBanner from './AdBanner';

/* ─── Homepage Ad Placements ─── */

export function HomepageHeroAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Sponsored" />
    </div>
  );
}

export function HomepageMidContentAd() {
  return (
    <div className="my-10">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function HomepageFooterAd() {
  return (
    <div className="my-8 pt-6 border-t border-white/[0.06]">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

/* ─── Tool Page Ad Placements ─── */

export function ToolPageBelowToolAd() {
  return (
    <div className="my-10">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function ToolPageAfterDescriptionAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function ToolPageSidebarAd() {
  return (
    <div className="sticky top-6">
      <AdBanner format="vertical" label="Advertisement" className="hidden lg:block" />
      <AdBanner format="horizontal" label="Advertisement" className="block lg:hidden" />
    </div>
  );
}

/* ─── Blog Ad Placements ─── */

export function BlogListingTopAd() {
  return (
    <div className="mb-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function BlogListingMidAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function BlogListingBottomAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function BlogPostBelowTitleAd() {
  return (
    <div className="mb-8">
      <AdBanner format="horizontal" label="Sponsored" />
    </div>
  );
}

export function BlogPostMidArticleAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function BlogPostEndArticleAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function BlogPostSidebarAd() {
  return (
    <div className="sticky top-6">
      <AdBanner format="vertical" label="Advertisement" className="hidden lg:block" />
      <AdBanner format="horizontal" label="Advertisement" className="block lg:hidden" />
    </div>
  );
}

/* ─── Category Page Ad Placements ─── */

export function CategoryPageTopAd() {
  return (
    <div className="mb-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function CategoryPageMidAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

export function CategoryPageBottomAd() {
  return (
    <div className="my-8">
      <AdBanner format="horizontal" label="Advertisement" />
    </div>
  );
}

/* ─── Generic Ad Slot ─── */

export function AdSlot({
  slot,
  format = 'auto',
  label = 'Advertisement',
  className = ''
}: {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}) {
  return (
    <div className={`my-6 ${className}`}>
      <AdBanner slot={slot} format={format} label={label} />
    </div>
  );
}
