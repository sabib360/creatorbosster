---
description: Scan all tool pages in CreatorBoost AI and generate a content quality report
---

# Audit Tool Pages

Scan all tool components in `src/components/tools/` and generate a report on content quality, word counts, and FAQ presence.

## Usage

Run this command when:
- Planning content enrichment for tool pages
- Checking which tools need FAQ sections
- Identifying tools with low word counts
- Verifying content consistency across tools

## Procedure

### 1. Create the scan script

Create a temporary Node.js script `scan-tools.cjs` in the project root:

```javascript
const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'components', 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

const results = [];

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract text content from JSX
  // Remove imports, exports, and code blocks
  const textContent = content
    .replace(/import\s+.*?from\s+['"]*?['"];?\s*/g, '')
    .replace(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}\s*$/g, '')
    .replace(/<[^>]+>/g, ' ')  // Remove HTML/JSX tags
    .replace(/\{[^}]+\}/g, ' ')  // Remove JS expressions
    .replace(/\/\/.*$/gm, '')  // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim();
  
  // Count words
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Check for FAQ section
  const hasFAQ = content.includes('FAQ') || 
                 content.includes('frequently asked') || 
                 content.includes('Frequently Asked');
  
  // Check for standard sections
  const hasIntro = content.includes('What is') || 
                   content.includes('About') ||
                   content.includes('介绍');
  const hasHowTo = content.includes('How to Use') || 
                   content.includes('How To Use') ||
                   content.includes('使用方法');
  const hasUseCases = content.includes('Use Cases') || 
                      content.includes('Use cases') ||
                      content.includes('应用场景');
  
  // Get component name
  const componentName = file.replace('.tsx', '');
  
  results.push({
    file,
    componentName,
    wordCount,
    hasFAQ,
    hasIntro,
    hasHowTo,
    hasUseCases,
    contentLength: content.length
  });
}

// Sort by word count ascending
results.sort((a, b) => a.wordCount - b.wordCount);

// Generate report
console.log('=== Tool Page Content Audit Report ===\n');
console.log(`Total tools scanned: ${results.length}`);
console.log(`Total words: ${results.reduce((sum, r) => sum + r.wordCount, 0)}`);
console.log(`Average words per tool: ${Math.round(results.reduce((sum, r) => sum + r.wordCount, 0) / results.length)}`);
console.log('');

// Summary statistics
const toolsWithFAQ = results.filter(r => r.hasFAQ).length;
const toolsWithAllSections = results.filter(r => r.hasIntro && r.hasHowTo && r.hasUseCases && r.hasFAQ).length;
console.log(`Tools with FAQ: ${toolsWithFAQ}/${results.length}`);
console.log(`Tools with all standard sections: ${toolsWithAllSections}/${results.length}`);
console.log('');

// Tools needing attention (low word count or missing sections)
console.log('=== Tools Needing Attention ===\n');
const needsAttention = results.filter(r => r.wordCount < 150 || !r.hasFAQ);
for (const tool of needsAttention) {
  const issues = [];
  if (tool.wordCount < 150) issues.push(`${tool.wordCount} words`);
  if (!tool.hasFAQ) issues.push('no FAQ');
  if (!tool.hasIntro) issues.push('no intro');
  if (!tool.hasHowTo) issues.push('no how-to');
  if (!tool.hasUseCases) issues.push('no use cases');
  
  console.log(`${tool.componentName}: ${issues.join(', ')}`);
}
console.log('');

// Full report
console.log('=== Full Report ===\n');
console.log('Component Name | Words | FAQ | Intro | How-To | Use Cases');
console.log('---------------|-------|-----|-------|--------|----------');
for (const tool of results) {
  console.log(
    `${tool.componentName.padEnd(20)} | ${String(tool.wordCount).padStart(5)} | ${tool.hasFAQ ? '✓' : '✗'} | ${tool.hasIntro ? '✓' : '✗'} | ${tool.hasHowTo ? '✓' : '✗'} | ${tool.hasUseCases ? '✓' : '✗'}`
  );
}

// Export results for further processing
const reportPath = path.join(__dirname, 'tool-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\nDetailed report saved to: ${reportPath}`);
```

### 2. Run the scan script

```bash
node scan-tools.cjs
```

### 3. Review the output

The script generates:
- Summary statistics (total tools, word counts, FAQ presence)
- List of tools needing attention (low word count or missing sections)
- Full table of all tools with their status
- JSON report file for programmatic access

### 4. Clean up

After reviewing the report, delete the temporary script:
```bash
rm scan-tools.cjs
```

## Output format

The report includes:
- **Summary**: Total tools, total words, average words per tool
- **FAQ statistics**: How many tools have FAQ sections
- **Section coverage**: How many tools have all standard sections
- **Tools needing attention**: List of tools with issues
- **Full table**: All tools with word count and section presence

## Use cases

1. **Content enrichment planning**: Identify which tools need the most work
2. **Quality assurance**: Verify all tools have consistent sections
3. **SEO audit**: Check which tools lack FAQ sections for rich snippets
4. **Progress tracking**: Monitor enrichment progress over time

## Evidence

- Session `ses_124ee33bcffextJdwkG2VZ9lY8`: Created and ran this exact scan script
- The scan identified 10 tools with the lowest word counts for enrichment
- 34 of 44 tools still need content enrichment based on audit results
