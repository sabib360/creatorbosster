# TODO - Content Tools Category (500+ programmatic SEO pages)

## Step 1 — Scalability foundation (DONE/IN PROGRESS)
- [ ] Refactor `src/components/DynamicSEOToolPage.tsx` to remove the hardcoded `switch (variant.toolId)`.
- [ ] Implement `toolId -> ReactComponent` map so new tools can be added without editing logic.



## Step 2 — Programmatic variant generation

- [ ] Replace the static-only approach in `src/config/programmatic-seo.ts` with a data-driven generator:
  - base tool definitions (toolId, component, URL base)
  - niche templates (20 niches)
  - variant fields (title/description/keywords/h1/FAQ/internalLinks)
- [ ] Ensure each generated variant has unique `path` and correct `toolId`.

## Step 3 — SEO sitemap and consistency
- [ ] Update sitemap generation (`src/config/sitemap*.ts`) so all generated variants are included.
- [ ] Verify canonical URL domain consistency between `ToolPage.tsx` and `DynamicSEOToolPage.tsx`.

## Step 4 — Verification
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Manually test several generated niche URLs to confirm:
  - correct SEO metadata
  - correct tool UI renders
  - FAQ + related links render

