---
name: create-tool-component
description: Create a new tool component for CreatorBoost AI with full integration into App.tsx, tools-registry.ts, and category listing
---

# Create Tool Component

Create a new client-side tool component for CreatorBoost AI with complete integration.

## When to use

- User requests a new tool for the platform
- Adding functionality to existing tool categories (Image Tools, PDF Tools, etc.)
- Creating tools from scratch based on user specifications

## Prerequisites

- Understanding of the tool's functionality and target users
- Knowledge of which category the tool belongs to

## Procedure

### 1. Create the tool component file

Create a new file in `src/components/tools/[ToolName].tsx`.

**Component structure pattern:**

```tsx
import { useState, useRef } from 'react';
import { Upload, Download, X, [ToolIcon], AlertCircle } from 'lucide-react';
// Import any needed libraries (e.g., pdf-lib, JSZip)

export default function ToolName() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool-specific state
  const [options, setOptions] = useState({ /* default options */ });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Tool-specific processing logic
      // For PDF tools: use pdf-lib
      // For image tools: use Canvas API
      // For other tools: use appropriate Web APIs
      
      // Example for PDF processing:
      // const arrayBuffer = await selectedFile.arrayBuffer();
      // const pdfDoc = await PDFDocument.load(arrayBuffer);
      // ... processing ...
      // const pdfBytes = await pdfDoc.save();
      // const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      // setProcessedUrl(URL.createObjectURL(blob));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = `processed-${selectedFile?.name || 'file'}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-black uppercase tracking-widest text-white">
          [Tool Name]
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          [Brief description of what the tool does]
        </p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="[appropriate file types]"
          onChange={handleFileSelect}
        />
        <Upload className="w-12 h-12 mx-auto text-slate-500 mb-4" />
        <p className="text-slate-400">
          {selectedFile ? selectedFile.name : 'Drag & drop or click to upload'}
        </p>
        {selectedFile && (
          <p className="text-sm text-slate-500 mt-2">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Options (if applicable) */}
      {/* <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          [Option Label]
        </label>
        <select
          value={options.someOption}
          onChange={(e) => setOptions({ ...options, someOption: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </div> */}

      {/* Process Button */}
      <button
        onClick={processFile}
        disabled={!selectedFile || loading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            [Process Button Text]
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {processedUrl && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Processing complete</span>
            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          {/* Preview (if applicable) */}
          {/* <img src={processedUrl} alt="Processed" className="max-w-full rounded-lg" /> */}
        </div>
      )}

      {/* Content Sections (from enrich-tool-page skill) */}
      {/* Add intro, how-to, use cases, FAQ sections here */}
    </div>
  );
}
```

### 2. Add import and route in App.tsx

**Step 2a: Add import**

Find the imports section near the top of `src/App.tsx` and add:
```tsx
import ToolName from './components/tools/ToolName';
```

**Step 2b: Add route**

Find the routes section (typically in a `<Routes>` or `<Switch>` block) and add:
```tsx
<Route path="/tools/tool-name" element={<ToolPage><ToolName /></ToolPage>} />
```

If the tool has FAQ items, pass them:
```tsx
<Route path="/tools/tool-name" element={
  <ToolPage faqItems={[
    { q: 'Question 1?', a: 'Answer 1' },
    { q: 'Question 2?', a: 'Answer 2' },
  ]}>
    <ToolName />
  </ToolPage>
} />
```

### 3. Add entry to tools-registry.ts

Open `src/config/tools-registry.ts` and add an entry to the appropriate category:

```tsx
{
  name: 'Tool Name',
  path: 'tool-name',
  description: 'Brief description for SEO',
  icon: 'ToolIcon',
  category: 'category-name',
  isQuickWin: true, // or false if not a quick win
},
```

Categories include:
- `image-tools` — Image processing tools
- `pdf-tools` — PDF processing tools
- `seo-tools` — SEO and metadata tools
- `developer-tools` — Code and developer utilities
- `text-tools` — Text processing tools
- `social-media-tools` — Social media utilities

### 4. Update category listing (if applicable)

If the tool belongs to a category with a dedicated listing page (e.g., `ImageTools.tsx`, `PDFTools.tsx`), add an entry:

```tsx
{
  name: 'Tool Name',
  path: 'tool-name',
  description: 'Brief description',
  icon: ToolIcon,
}
```

### 5. Add SEO content (using enrich-tool-page skill)

Follow the `enrich-tool-page` skill to add:
- Intro section (2-3 sentences)
- How to Use section (4-6 steps)
- Common Use Cases section (3-4 bullets)
- FAQ section (4 Q&A pairs)

### 6. Verify the build

Run type checking and linting:
```bash
npx tsc --noEmit 2>&1
npm run lint 2>&1
```

Fix any errors before considering the task complete.

## Styling conventions

- Background: `bg-slate-950` for page background
- Cards: `bg-slate-800/50 border border-slate-700 rounded-lg`
- Text colors: `text-white` for headings, `text-slate-300` for body, `text-slate-400` for muted
- Primary accent: `primary-500`, `primary-600`, `primary-700`
- Icons: Lucide React icons
- Animations: Framer Motion fade-in
- Wrapper: `<ToolPage>` component adds breadcrumb + container

## File size guidelines

- Component file: 200-400 lines (including content sections)
- Keep processing logic separate from UI when possible
- Use helper functions for complex operations

## Stopping condition

Task is complete when:
1. Tool component file is created in `src/components/tools/`
2. Import and route are added to `src/App.tsx`
3. Entry is added to `src/config/tools-registry.ts`
4. Category listing is updated (if applicable)
5. Content sections are added (intro, how-to, use cases, FAQ)
6. `npx tsc --noEmit` passes with no errors
7. `npm run lint` passes with no errors

## Evidence

- Session `ses_1211b53c7ffeTkQ3p58GAeRneY`: Created 8 image tools + 5 PDF tools using this pattern
- MEMORY.md documents the "Tool page creation checklist" with these exact steps
- 44 total tool pages exist, demonstrating the pattern at scale
