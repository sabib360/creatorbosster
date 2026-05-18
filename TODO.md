# TODO - Add all trending features + SEO tool pages

## Step 1: Confirm SEO architecture
- [x] Inspect `src/components/DynamicSEOToolPage.tsx`, `src/config/programmatic-seo.ts`, sitemap generator, and tools registry
- [ ] Refactor so SEO can render any tool that exists (no hardcoded switch-only)


## Step 2: Add missing tool components
- [ ] Create tools under `src/components/tools/` for each missing item in the user list
  - AI: Image Upscaler, Headshot Generator, Resume/CV Builder, Caption Generator
  - Social: Instagram Story/Reel Size Converter, TikTok Video Downloader (no watermark), Twitter/X Banner Maker, LinkedIn Banner Creator
  - Finance: VAT Calculator (UK + Dubai 5%), GST Calculator (Australia), Invoice Generator (PDF export), Salary Tax Calculator by country
  - Content: Blog Title Generator, YouTube SEO Title/Description Writer, Plagiarism Checker, Word Counter / Readability Scorer

## Step 3: Wire routes in `src/App.tsx`
- [ ] Add `Route path="/tools/<slug>" element={<ToolPage><Component/></ToolPage>}` for every new tool

## Step 4: Add tiles to category pages
- [ ] Update `src/components/AITools.tsx`, `src/components/SocialMediaTools.tsx`, `src/components/FinanceTools.tsx` so new tools appear

## Step 5: Programmatic SEO + “Free” keywords + Arabic option
- [ ] Ensure each tool page has correct Helmet tags + canonical URL
- [ ] Add Arabic mode/labels for Dubai-related finance tools

## Step 6: Build & verify
- [ ] Run `npm run build` and fix any TS/router issues
- [ ] Smoke-test key routes in dev server

