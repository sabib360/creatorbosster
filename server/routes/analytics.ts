import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../../src/lib/db';

const router = Router();

const trackSchema = z.object({
  pageUrl: z.string().min(1),
  eventType: z.enum(['pageview', 'tool_use', 'click', 'search']),
  metadata: z.string().optional(),
  toolId: z.string().optional(),
});

// ─── POST /api/analytics/track ───────────────────
router.post('/track', async (req: Request, res: Response) => {
  try {
    const data = trackSchema.parse(req.body);
    const entry = await prisma.analytics.create({
      data: {
        ...data,
        ip: req.ip || req.socket.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      },
    });

    // Increment tool usage if applicable
    if (data.toolId && data.eventType === 'tool_use') {
      await prisma.tool.update({ where: { id: data.toolId }, data: { usageCount: { increment: 1 } } });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Validation failed', details: error.issues });
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// ─── GET /api/analytics/dashboard ────────────────
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const [totalViews, totalToolUses, uniquePages, topPages, dailyViews, toolUsage] = await Promise.all([
      prisma.analytics.count({ where: { eventType: 'pageview', createdAt: { gte: since } } }),
      prisma.analytics.count({ where: { eventType: 'tool_use', createdAt: { gte: since } } }),
      prisma.analytics.findMany({ where: { eventType: 'pageview', createdAt: { gte: since } }, select: { pageUrl: true }, distinct: ['pageUrl'] }),
      prisma.analytics.groupBy({ by: ['pageUrl'], where: { eventType: 'pageview', createdAt: { gte: since } }, _count: true, orderBy: { _count: { pageUrl: 'desc' } }, take: 10 }),
      prisma.analytics.findMany({
        where: { eventType: 'pageview', createdAt: { gte: since } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.analytics.groupBy({ by: ['toolId'], where: { eventType: 'tool_use', createdAt: { gte: since }, toolId: { not: null } }, _count: true, orderBy: { _count: { toolId: 'desc' } }, take: 10 }),
    ]);

    // Aggregate daily views
    const dailyMap: Record<string, number> = {};
    dailyViews.forEach((d) => {
      const day = d.createdAt.toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

    res.json({
      summary: {
        totalViews,
        totalToolUses,
        uniquePages: uniquePages.length,
        period: `${days} days`,
      },
      topPages: topPages.map((p) => ({ url: p.pageUrl, views: p._count })),
      dailyViews: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
      toolUsage: toolUsage.map((t) => ({ toolId: t.toolId, count: t._count })),
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
