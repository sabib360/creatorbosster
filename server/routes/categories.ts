import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const schema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { blogPosts: true, tools: true } }, children: true },
      where: { parentId: null },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const cat = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { blogPosts: true, tools: true, children: true },
    });
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = schema.parse(req.body);
    const cat = await prisma.category.create({ data });
    res.status(201).json(cat);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = schema.partial().parse(req.body);
    const cat = await prisma.category.update({ where: { id: req.params.id }, data });
    res.json(cat);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
