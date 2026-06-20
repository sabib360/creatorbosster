import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const createCommentSchema = z.object({
  postId: z.string().min(1),
  userId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

// ─── GET /api/comments/:postId ───────────────────
router.get('/:postId', async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.postId, isApproved: true },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// ─── POST /api/comments ──────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = createCommentSchema.parse(req.body);
    const comment = await prisma.comment.create({
      data: { content: data.content, postId: data.postId, userId: data.userId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// ─── PUT /api/comments/:id/approve ───────────────
router.put('/:id/approve', async (req: Request, res: Response) => {
  try {
    const comment = await prisma.comment.update({ where: { id: req.params.id }, data: { isApproved: true } });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});

// ─── DELETE /api/comments/:id ────────────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
