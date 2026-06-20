import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

// ─── Validation Schemas ──────────────────────────
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  author: z.string().min(1).max(100),
  featuredImage: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
  seoKeywords: z.string().optional(),
});

const updatePostSchema = createPostSchema.partial();

// ─── GET /api/blog ───────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', status, category, tag, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { slug: tag } };
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { excerpt: { contains: String(search) } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true, tags: true, _count: { select: { comments: true } } },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.blogPost.count({ where }),
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Blog list error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// ─── GET /api/blog/:slug ─────────────────────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { category: true, tags: true, comments: { where: { isApproved: true }, include: { user: true } } },
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Increment views
    await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

    res.json(post);
  } catch (error) {
    console.error('Blog get error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// ─── POST /api/blog ──────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createPostSchema.parse(req.body);

    // Auto-generate read time (approx 200 words/min)
    const wordCount = data.content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        author: data.author,
        featuredImage: data.featuredImage,
        status: data.status,
        readTime,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        seoKeywords: data.seoKeywords,
        publishedAt: data.status === 'published' ? new Date() : null,
        ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
        ...(data.tags && {
          tags: { connectOrCreate: data.tags.map((t) => ({ where: { slug: t.toLowerCase().replace(/\s+/g, '-') }, create: { name: t, slug: t.toLowerCase().replace(/\s+/g, '-') } })) },
        }),
      },
      include: { category: true, tags: true },
    });

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    console.error('Blog create error:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// ─── PUT /api/blog/:id ───────────────────────────
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = updatePostSchema.parse(req.body);

    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.status === 'published' && { publishedAt: new Date() }),
        ...(data.tags && {
          tags: { set: [], connectOrCreate: data.tags.map((t) => ({ where: { slug: t.toLowerCase().replace(/\s+/g, '-') }, create: { name: t, slug: t.toLowerCase().replace(/\s+/g, '-') } })) },
        }),
      },
      include: { category: true, tags: true },
    });

    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    console.error('Blog update error:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// ─── DELETE /api/blog/:id ────────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Blog delete error:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// ─── POST /api/blog/:id/like ─────────────────────
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: { likes: { increment: 1 } },
    });
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
});

export default router;
