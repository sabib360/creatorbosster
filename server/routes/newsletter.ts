import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
});

// ─── POST /api/newsletter/subscribe ──────────────
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const data = subscribeSchema.parse(req.body);
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { isActive: true, name: data.name },
      create: { email: data.email, name: data.name },
    });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid email address' });
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// ─── POST /api/newsletter/unsubscribe ────────────
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    await prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: false } });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid email' });
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// ─── GET /api/newsletter/subscribers ─────────────
router.get('/subscribers', async (_req: Request, res: Response) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      orderBy: { subscribedAt: 'desc' },
    });
    res.json({ count: subscribers.length, subscribers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

export default router;
