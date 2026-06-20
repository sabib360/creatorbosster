---
name: enrich-tool-page
description: Add standardized content sections (intro, how-to, use cases, FAQ) to CreatorBoost AI tool pages with unique SEO metadata
---

# Enrich Tool Page

Add original, site-specific content sections to a CreatorBoost AI tool page component.

## When to use

- Tool page has fewer than 200 words of surrounding content
- Tool page lacks FAQ section
- Tool page needs SEO metadata improvement
- User requests content enrichment for specific tool pages

## Prerequisites

- Tool component exists in `src/components/tools/`
- Tool is already routed in `src/App.tsx`
- Tool has entry in `src/config/tools-registry.ts`

## Procedure

### 1. Read the existing tool component

Read the tool file to understand its current structure, imports, and functionality.

### 2. Identify insertion point

Most tool components follow this structure:
```
<div> (or ToolPage wrapper)
  <h1> Tool title </h1>
  <p> Subtitle/description </p>
  
  {/* INSERT CONTENT SECTIONS HERE */}
  
  <div> Upload/interactive area </div>
  <div> Results area </div>
</div>
```

Insert content sections between the header/subtitle and the interactive widget.

### 3. Write four standardized sections

Each section must use **unique, non-duplicated sentences** — no two tool pages should share the same phrasing.

#### Section 1: Intro (2-3 sentences)
- Explain what the tool does in plain language
- Identify who needs it (target user)
- Mention one key benefit or differentiator

Example pattern:
```tsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold text-white">What is [Tool Name]?</h2>
  <p className="text-slate-300 leading-relaxed">
    [2-3 sentences explaining the tool, its purpose, and who benefits from it.]
  </p>
</section>
```

#### Section 2: How to Use (4-6 numbered steps)
- Each step is one clear action
- Steps follow the natural user flow
- Include specific UI elements (buttons, dropdowns) by name

Example pattern:
```tsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold text-white">How to Use [Tool Name]</h2>
  <ol className="list-decimal list-inside space-y-3 text-slate-300">
    <li>[Step 1 — typically upload/select input]</li>
    <li>[Step 2 — configure options]</li>
    <li>[Step 3 — process/convert]</li>
    <li>[Step 4 — download result]</li>
  </ol>
</section>
```

#### Section 3: Common Use Cases (3-4 bullet scenarios)
- Each bullet is a realistic situation
- Use action verbs (e.g., "Prepare", "Convert", "Create")
- Target different user types when possible

Example pattern:
```tsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold text-white">Common Use Cases</h2>
  <ul className="list-disc list-inside space-y-2 text-slate-300">
    <li>[Use case 1 — specific scenario with context]</li>
    <li>[Use case 2 — different user/situation]</li>
    <li>[Use case 3 — another realistic scenario]</li>
    <li>[Use case 4 — edge case or advanced use]</li>
  </ul>
</section>
```

#### Section 4: FAQ (4 unique Q&A pairs)
- Questions reflect real user concerns
- Answers are specific to this tool (not generic)
- Include technical details when relevant

Example pattern:
```tsx
<section className="space-y-4">
  <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
  <div className="space-y-4">
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-2">[Question 1?]</h3>
      <p className="text-slate-300">[Specific answer]</p>
    </div>
    {/* Repeat for 3 more Q&A pairs */}
  </div>
</section>
```

### 4. Add SEO metadata

Add or update the component's SEO metadata with unique, long-tail targeting:

```tsx
// At the top of the component, before the return statement
const SEO_TITLE = "Free [Tool Name] Online — [Benefit] | CreatorBoost AI";
const SEO_DESCRIPTION = "[2-3 sentences describing the tool with specific features, targeting phrases like 'free [tool name] online no signup'].";
```

If the component uses `ToolPage` wrapper, pass these as props:
```tsx
<ToolPage title={SEO_TITLE} description={SEO_DESCRIPTION} faqItems={[...]}>
```

### 5. Ensure no sentence duplication

After writing, verify that none of the new sentences appear in other tool pages. Each tool page must have completely unique phrasing.

### 6. Verify the build

Run type checking and linting:
```bash
npx tsc --noEmit 2>&1
npm run lint 2>&1
```

Fix any errors before considering the task complete.

## Styling conventions

- Background: `bg-slate-800/50 border border-slate-700 rounded-lg` for cards
- Text colors: `text-white` for headings, `text-slate-300` for body text
- Headings: `text-2xl font-bold text-white`
- Links: `text-primary-400 hover:text-primary-300`
- Use Tailwind classes consistent with existing tool pages

## Stopping condition

Task is complete when:
1. All four sections are added to the tool component
2. SEO metadata is unique and targets long-tail keywords
3. No sentences are duplicated from other tool pages
4. `npx tsc --noEmit` passes with no errors
5. `npm run lint` passes with no errors

## Evidence

- Session `ses_124ee33bcffextJdwkG2VZ9lY8`: 10 tool pages enriched with this exact pattern
- 34 of 44 tool pages still need this enrichment
- Only 3 tools originally had FAQs (age-calculator, json-formatter, pdf-to-word)
