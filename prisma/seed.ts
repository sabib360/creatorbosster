import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Categories ──────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'image-tools' }, update: {}, create: { name: 'Image Tools', slug: 'image-tools', description: 'Compress, resize, crop, and convert images', icon: 'image' } }),
    prisma.category.upsert({ where: { slug: 'pdf-tools' }, update: {}, create: { name: 'PDF Tools', slug: 'pdf-tools', description: 'Merge, split, convert, and edit PDFs', icon: 'file-text' } }),
    prisma.category.upsert({ where: { slug: 'ai-tools' }, update: {}, create: { name: 'AI Tools', slug: 'ai-tools', description: 'AI-powered content creation and analysis', icon: 'brain' } }),
    prisma.category.upsert({ where: { slug: 'finance-tools' }, update: {}, create: { name: 'Finance Tools', slug: 'finance-tools', description: 'Calculators, budget planners, and converters', icon: 'calculator' } }),
    prisma.category.upsert({ where: { slug: 'social-media-tools' }, update: {}, create: { name: 'Social Media Tools', slug: 'social-media-tools', description: 'Hashtags, captions, content ideas, and more', icon: 'hash' } }),
    prisma.category.upsert({ where: { slug: 'developer-tools' }, update: {}, create: { name: 'Developer Tools', slug: 'developer-tools', description: 'JSON formatters, encoders, and utilities', icon: 'code' } }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // ─── Tools ───────────────────────────────────
  const tools = [
    { name: 'Image Compressor', slug: 'image-compressor', description: 'Reduce image file size without losing quality', category: 'Image Tools', path: '/tools/image-compressor', component: 'ImageCompressor', seoTitle: 'Free Image Compressor Online', seoDesc: 'Compress images online for free without quality loss.', keywords: 'image compressor, compress image, reduce file size' },
    { name: 'Image Resizer', slug: 'image-resizer', description: 'Change image dimensions instantly', category: 'Image Tools', path: '/tools/image-resizer', component: 'ImageResizer', seoTitle: 'Free Image Resizer Online', seoDesc: 'Resize images to any dimension online for free.', keywords: 'image resizer, resize image, change image size' },
    { name: 'PDF Merger', slug: 'pdf-merger', description: 'Combine multiple PDF files into one', category: 'PDF Tools', path: '/tools/pdf-merger', component: 'PDFMerger', seoTitle: 'Free PDF Merger Online', seoDesc: 'Merge multiple PDF files into one document for free.', keywords: 'pdf merger, merge pdf, combine pdf' },
    { name: 'PDF Compressor', slug: 'pdf-compressor', description: 'Reduce PDF file size without losing quality', category: 'PDF Tools', path: '/tools/pdf-compressor', component: 'PDFCompressor', seoTitle: 'Free PDF Compressor Online', seoDesc: 'Compress PDF files online without quality loss.', keywords: 'pdf compressor, reduce pdf size, compress pdf' },
    { name: 'AI Thumbnail Generator', slug: 'ai-thumbnail-generator', description: 'Generate stunning YouTube thumbnails with AI', category: 'AI Tools', path: '/tools/ai-thumbnail-generator', component: 'AIThumbnailGenerator', seoTitle: 'Free AI Thumbnail Generator', seoDesc: 'Generate YouTube thumbnails with AI in seconds.', keywords: 'ai thumbnail generator, youtube thumbnail, thumbnail maker' },
    { name: 'Background Remover', slug: 'background-remover', description: 'Remove image backgrounds automatically', category: 'AI Tools', path: '/tools/background-remover', component: 'BackgroundRemover', seoTitle: 'Free Background Remover Online', seoDesc: 'Remove image backgrounds instantly with AI.', keywords: 'background remover, remove background, transparent background' },
    { name: 'Loan EMI Calculator', slug: 'loan-emi-calculator', description: 'Calculate monthly loan EMI payments', category: 'Finance Tools', path: '/tools/loan-emi-calculator', component: 'LoanEMICalculator', seoTitle: 'Free Loan EMI Calculator', seoDesc: 'Calculate loan EMI instantly with our free calculator.', keywords: 'emi calculator, loan calculator, home loan emi' },
    { name: 'Hashtag Generator', slug: 'hashtag-generator', description: 'Generate trending hashtags for social media', category: 'Social Media Tools', path: '/tools/hashtag-generator', component: 'HashtagGenerator', seoTitle: 'Free Hashtag Generator', seoDesc: 'Generate trending hashtags for Instagram and TikTok.', keywords: 'hashtag generator, instagram hashtags, tiktok hashtags' },
    { name: 'QR Code Generator', slug: 'qr-code-generator', description: 'Create custom QR codes for any purpose', category: 'Social Media Tools', path: '/tools/qr-code-generator', component: 'QRCodeGenerator', seoTitle: 'Free QR Code Generator', seoDesc: 'Create custom QR codes online for free.', keywords: 'qr code generator, create qr code, qr code maker' },
    { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and minify JSON', category: 'Developer Tools', path: '/tools/json-formatter', component: 'JSONFormatter', seoTitle: 'Free JSON Formatter Online', seoDesc: 'Format and validate JSON instantly.', keywords: 'json formatter, json validator, json beautifier' },
  ];

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool,
    });
  }
  console.log(`✅ Created ${tools.length} tools`);

  // ─── Users ───────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@creatorboostai.xyz' },
    update: {},
    create: { name: 'Admin', email: 'admin@creatorboostai.xyz', password: '$2b$10$placeholder_hash', role: 'admin' },
  });
  console.log('✅ Created admin user');

  // ─── Blog Posts ──────────────────────────────
  const blogPosts = [
    {
      title: 'How to Compress Images Without Losing Quality',
      slug: 'how-to-compress-images-without-losing-quality',
      content: `<h2>Why Image Compression Matters</h2><p>Every second your webpage takes to load, you lose approximately 7% of conversions. Images are typically the largest files on a page, often accounting for 50-75% of total page weight.</p><h2>Understanding Compression Types</h2><p>There are two fundamental approaches: lossy compression removes some image data permanently, while lossless compression reduces file size without removing any data.</p><h2>Choosing the Right Format</h2><p>WebP offers 25-35% smaller files than JPEG at equivalent quality. JPEG remains the safest choice for universal compatibility.</p>`,
      excerpt: 'Learn the best techniques to compress images for web, email, and social media without visible quality loss.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-06-15'),
      readTime: '6 min read',
      seoTitle: 'How to Compress Images Without Losing Quality',
      seoDesc: 'Learn to compress images online without losing quality. Free tools and tips included.',
    },
    {
      title: 'How to Merge PDF Files Online for Free',
      slug: 'how-to-merge-pdf-files-free-online',
      content: `<h2>Why You Need to Merge PDFs</h2><p>Whether you're compiling a business proposal or organizing research papers, merging PDFs is a common task.</p><h2>Step-by-Step Guide</h2><p>Open a free PDF merger tool, upload your files, arrange the order, and click merge. The process takes seconds.</p>`,
      excerpt: 'Combine multiple PDF documents into one file using free online tools.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-06-12'),
      readTime: '5 min read',
    },
    {
      title: 'How to Create a QR Code for Your Business',
      slug: 'how-to-create-qr-code-for-business',
      content: `<h2>Why QR Codes Matter</h2><p>QR codes bridge the physical-digital gap with zero friction. A customer scans and lands exactly where you want them.</p><h2>Types of QR Codes</h2><p>URL codes link to websites, WiFi codes share network credentials, vCard codes share contact info, and email codes pre-fill messages.</p>`,
      excerpt: 'Step-by-step guide to creating professional QR codes for menus, business cards, and marketing.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-06-10'),
      readTime: '5 min read',
    },
    {
      title: 'Top 5 Tips to Grow Your YouTube Channel in 2026',
      slug: 'youtube-growth-tips-2026',
      content: `<h2>Tip 1: Consistency is Key</h2><p>Upload on a regular schedule. Your audience needs to know when to expect new content.</p><h2>Tip 2: Optimize Your Thumbnails</h2><p>Thumbnails are the first thing viewers see. Use bold text, bright colors, and expressive faces.</p>`,
      excerpt: 'Proven strategies to grow your YouTube channel and increase subscribers in 2026.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-04-10'),
      readTime: '4 min read',
    },
    {
      title: 'The Ultimate Guide to YouTube Thumbnails',
      slug: 'youtube-thumbnails-guide',
      content: `<h2>Why Thumbnails Matter</h2><p>YouTube reports that 90% of the best-performing videos have custom thumbnails. Your thumbnail is your video's billboard.</p><h2>Design Principles</h2><p>Use high contrast, readable text, and expressive faces. Keep it simple — three elements maximum.</p>`,
      excerpt: 'Design YouTube thumbnails that drive views with these proven techniques.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-04-09'),
      readTime: '5 min read',
    },
    {
      title: 'The Future of Content Creation with AI',
      slug: 'future-content-creation-ai',
      content: `<h2>AI is Transforming Content Creation</h2><p>From generating thumbnails to writing descriptions, AI tools are becoming essential for content creators.</p><h2>What AI Can Do</h2><p>AI can analyze trends, generate ideas, create visuals, and optimize content for search engines.</p>`,
      excerpt: 'How artificial intelligence is reshaping the content creation landscape.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-04-08'),
      readTime: '4 min read',
    },
    {
      title: 'YouTube Algorithm Changes 2026',
      slug: 'youtube-algorithm-2026-update',
      content: `<h2>What Changed</h2><p>YouTube's 2026 algorithm update emphasizes viewer satisfaction over raw watch time. Retention and engagement matter more than ever.</p><h2>How to Adapt</h2><p>Focus on creating content that keeps viewers watching, not just clicking. Quality over quantity.</p>`,
      excerpt: 'Understanding the latest YouTube algorithm changes and how to adapt your strategy.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-04-07'),
      readTime: '4 min read',
    },
    {
      title: 'Best Free Image Resizer Tools in 2026',
      slug: 'best-free-image-resizer-tools-2026',
      content: `<h2>Why You Need an Image Resizer</h2><p>Different platforms require different image dimensions. Instagram needs 1080x1080, YouTube needs 1920x1080, and Twitter needs 1200x675.</p><h2>Top Free Tools</h2><p>CreatorBoost AI, Canva, and Pixlr offer free image resizing with no watermarks.</p>`,
      excerpt: 'Compare the best free image resizer tools for social media, web, and print.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-06-01'),
      readTime: '5 min read',
    },
    {
      title: 'How to Write YouTube Descriptions That Rank',
      slug: 'youtube-descriptions-that-rank',
      content: `<h2>The Power of Descriptions</h2><p>YouTube descriptions help the algorithm understand your content and help viewers find your videos through search.</p><h2>Writing Tips</h2><p>Include keywords naturally, add timestamps, link to related content, and always include a call to action.</p>`,
      excerpt: 'Craft SEO-optimized YouTube descriptions that improve your video rankings.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-05-20'),
      readTime: '4 min read',
    },
    {
      title: '5 Video Editing Tips That Increase Watch Time',
      slug: 'video-editing-tips-fast-results',
      content: `<h2>Tip 1: Cut the Intro Short</h2><p>Get to the point within the first 15 seconds. Viewers decide to stay or leave almost immediately.</p><h2>Tip 2: Use Pattern Interrupts</h2><p>Change camera angles, add B-roll, or use graphics every 30-60 seconds to maintain attention.</p>`,
      excerpt: 'Professional editing techniques that boost retention and watch time.',
      author: 'CreatorBoost AI',
      status: 'published',
      publishedAt: new Date('2026-04-05'),
      readTime: '4 min read',
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, userId: admin.id },
    });
  }
  console.log(`✅ Created ${blogPosts.length} blog posts`);

  // ─── Testimonials ────────────────────────────
  const testimonials = [
    { name: 'Sarah Johnson', role: 'YouTube Creator', content: 'CreatorBoost AI has completely transformed my workflow. The thumbnail generator saves me hours every week.', rating: 5 },
    { name: 'Mike Chen', role: 'Freelance Designer', content: 'The image compression tool is incredible. I use it daily for client work and the quality is always perfect.', rating: 5 },
    { name: 'Priya Patel', role: 'Small Business Owner', content: 'I love that everything is free and works in the browser. No downloads, no signups, just results.', rating: 5 },
    { name: 'Alex Rivera', role: 'Content Strategist', content: 'The hashtag generator helped me increase my Instagram reach by 300%. Highly recommend for social media managers.', rating: 5 },
    { name: 'Emma Wilson', role: 'Blogger', content: 'The PDF merger and compressor tools are lifesavers. I use them for every blog post that includes downloadable resources.', rating: 4 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ Created ${testimonials.length} testimonials`);

  // ─── Newsletter Subscribers ───────────────────
  const subscribers = [
    { email: 'subscriber1@example.com', name: 'John Doe' },
    { email: 'subscriber2@example.com', name: 'Jane Smith' },
    { email: 'subscriber3@example.com', name: 'Bob Wilson' },
  ];

  for (const s of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: s.email },
      update: {},
      create: s,
    });
  }
  console.log(`✅ Created ${subscribers.length} newsletter subscribers`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
