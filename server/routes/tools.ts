import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const createToolSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1).max(500),
  category: z.string().min(1),
  icon: z.string().optional(),
  component: z.string().optional(),
  path: z.string().startsWith('/tools/'),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(60).optional(),
  seoDesc: z.string().max(160).optional(),
  keywords: z.string().optional(),
  categoryId: z.string().optional(),
});

const updateToolSchema = createToolSchema.partial();

// ─── GET /api/tools ──────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, active, search } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (active !== undefined) where.isActive = active === 'true';
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(tools);
  } catch (error) {
    console.error('Tools list error:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

// ─── GET /api/tools/:slug ────────────────────────
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const tool = await prisma.tool.findUnique({ where: { slug: req.params.slug } });
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tool' });
  }
});

// ─── POST /api/tools ─────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createToolSchema.parse(req.body);
    const tool = await prisma.tool.create({ data });
    res.status(201).json(tool);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    console.error('Tool create error:', error);
    res.status(500).json({ error: 'Failed to create tool' });
  }
});

// ─── PUT /api/tools/:id ──────────────────────────
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = updateToolSchema.parse(req.body);
    const tool = await prisma.tool.update({ where: { id: req.params.id }, data });
    res.json(tool);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to update tool' });
  }
});

// ─── DELETE /api/tools/:id ───────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.tool.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tool' });
  }
});

// ─── POST /api/tools/:id/view ────────────────────
router.post('/:id/view', async (req: Request, res: Response) => {
  try {
    const tool = await prisma.tool.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
    });
    res.json({ views: tool.views });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record view' });
  }
});

// ─── POST /api/tools/:id/use ─────────────────────
router.post('/:id/use', async (req: Request, res: Response) => {
  try {
    const tool = await prisma.tool.update({
      where: { id: req.params.id },
      data: { usageCount: { increment: 1 } },
    });
    res.json({ usageCount: tool.usageCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record usage' });
  }
});

export default router;
