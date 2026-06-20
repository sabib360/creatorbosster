import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const schema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().max(200).optional(),
  avatar: z.string().url().optional(),
  content: z.string().min(1).max(2000),
  rating: z.number().int().min(1).max(5).default(5),
});

// ─── GET /api/testimonials ───────────────────────
router.get('/', async (_req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// ─── POST /api/testimonials ──────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = schema.parse(req.body);
    const testimonial = await prisma.testimonial.create({ data });
    res.status(201).json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// ─── PUT /api/testimonials/:id ───────────────────
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = schema.partial().parse(req.body);
    const testimonial = await prisma.testimonial.update({ where: { id: req.params.id }, data });
    res.json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// ─── DELETE /api/testimonials/:id ────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
