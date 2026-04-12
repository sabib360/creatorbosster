import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Load Firebase config for Admin SDK
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

// Initialize Firestore
let db: any;
try {
  db = getFirestore(firebaseConfig.firestoreDatabaseId || '(default)');
  console.log(`Firestore initialized with database: ${firebaseConfig.firestoreDatabaseId || '(default)'}`);
} catch (error) {
  console.error('Failed to initialize Firestore with specific ID, trying default:', error);
  db = getFirestore();
}

// Verify Firestore connection on startup
(async () => {
  try {
    // Just a read test instead of a write test to be safer
    await db.collection('test_connection').limit(1).get();
    console.log('Successfully connected to Firestore');
  } catch (error) {
    console.error('Firestore connection warning (startup):', error);
  }
})();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CreatorBoost AI Server is running' });
  });

  // Subscription Checkout
  app.post('/api/subscriptions/checkout', async (req, res) => {
    const { planId, billingPeriod, userId, region, paymentMethod, amount } = req.body;
    
    if (!planId || !billingPeriod || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const tran_id = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      console.log(`Initiating checkout for user ${userId}, plan ${planId}, database ${firebaseConfig.firestoreDatabaseId}`);

      // 1. Store pending payment in transaction log
      await db.collection('payments').doc(tran_id).set({
        userId,
        plan_id: planId,
        billingPeriod,
        amount: amount || 0,
        currency: region === 'BD' ? 'BDT' : 'USD',
        method: paymentMethod,
        status: 'pending',
        tran_id,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });

      // 2. Simulate Redirect URL (In production, this would be SSLCommerz/Stripe)
      // We'll redirect to a backend route that simulates the gateway callback
      const checkoutUrl = `/api/payment/simulate-success?tran_id=${tran_id}&userId=${userId}&planId=${planId}`;

      res.json({ 
        success: true,
        message: 'Checkout initiated',
        checkoutUrl
      });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ error: 'Failed to initiate checkout' });
    }
  });

  // Mock Payment Gateway Simulation
  app.get('/api/payment/simulate-success', async (req, res) => {
    const { tran_id, userId, planId } = req.query;

    if (!tran_id || !userId || !planId) {
      return res.redirect('/payment/failed');
    }

    try {
      // 1. Verify transaction (Server-side validation)
      const paymentDoc = await db.collection('payments').doc(tran_id as string).get();
      if (!paymentDoc.exists || paymentDoc.data()?.status !== 'pending') {
        return res.redirect('/payment/failed');
      }

      // 2. Update Payment Status to Success
      await paymentDoc.ref.update({
        status: 'success',
        updatedAt: FieldValue.serverTimestamp()
      });

      // 3. Assign Credits & Update Plan
      const creditsMap: Record<string, number> = {
        'free': 3,
        'premium': 100,
        'pro': 500,
        'agency': 9999
      };

      const credits = creditsMap[planId as string] || 3;

      await db.collection('users').doc(userId as string).update({
        plan_id: planId,
        credits_remaining: credits,
        updatedAt: FieldValue.serverTimestamp()
      });

      // 4. Create Subscription Record
      await db.collection('subscriptions').add({
        userId,
        plan_id: planId,
        status: 'active',
        current_period_start: FieldValue.serverTimestamp(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
        createdAt: FieldValue.serverTimestamp()
      });

      // 5. Redirect to Frontend Success View
      res.redirect(`/?payment=success&tran_id=${tran_id}&plan=${planId}`);
    } catch (error) {
      console.error('Payment simulation error:', error);
      res.redirect('/?payment=failed');
    }
  });

  // Webhook for payment confirmation (IPN)
  app.post('/api/webhooks/payment', async (req, res) => {
    const { tran_id, status, val_id } = req.body;

    try {
      // 1. Verify transaction with gateway (SSLCommerz/Stripe)
      // In production, you'd call the gateway's validation API here
      
      const paymentRef = db.collection('payments').doc(tran_id);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      const paymentData = paymentDoc.data();
      if (paymentData?.status === 'success') {
        return res.json({ message: 'Already processed' });
      }

      if (status === 'VALID' || status === 'success') {
        const { userId, plan_id } = paymentData!;

        // 2. Update Payment Status
        await paymentRef.update({
          status: 'success',
          gateway_txn_id: val_id || tran_id,
          updatedAt: FieldValue.serverTimestamp()
        });

        // 3. Assign Credits & Update Plan
        const creditsMap: Record<string, number> = {
          'free': 3,
          'premium': 100,
          'pro': 500,
          'agency': 9999
        };

        const credits = creditsMap[plan_id] || 3;

        await db.collection('users').doc(userId).update({
          plan_id: plan_id,
          credits_remaining: credits,
          updatedAt: FieldValue.serverTimestamp()
        });

        // 4. Create Subscription Record
        await db.collection('subscriptions').add({
          userId,
          plan_id: plan_id,
          status: 'active',
          current_period_start: FieldValue.serverTimestamp(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: FieldValue.serverTimestamp()
        });

        console.log(`Payment successful for user ${userId}, plan ${plan_id}`);
      } else {
        await paymentRef.update({
          status: 'failed',
          updatedAt: FieldValue.serverTimestamp()
        });
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Credit Check Middleware Helper
  const checkCredits = async (userId: string, requiredCredits: number = 1) => {
    if (userId === 'guest') {
      // For guest users, we trust the client-side credit management for now
      // in the "No-Auth" PLG strategy. We could add IP-based rate limiting here.
      return { allowed: true, currentCredits: 3 }; 
    }

    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) return { allowed: false, error: 'User not found' };
      
      const userData = userDoc.data();
      if ((userData?.credits_remaining || 0) < requiredCredits) {
        return { allowed: false, error: 'Insufficient credits' };
      }
      
      return { allowed: true, currentCredits: userData?.credits_remaining };
    } catch (error) {
      console.error('Credit check error:', error);
      return { allowed: false, error: 'Failed to verify credits' };
    }
  };

  // Credit Consumption Endpoint
  app.post('/api/credits/consume', async (req, res) => {
    const { userId, amount = 1 } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    if (userId === 'guest') {
      return res.json({ success: true, message: 'Guest credit consumed (client-side)' });
    }

    try {
      const creditCheck = await checkCredits(userId, amount);
      if (!creditCheck.allowed) return res.status(403).json({ error: creditCheck.error });

      await db.collection('users').doc(userId).update({
        credits_remaining: FieldValue.increment(-amount),
        updatedAt: FieldValue.serverTimestamp()
      });

      res.json({ success: true, remaining: (creditCheck.currentCredits || 0) - amount });
    } catch (error) {
      console.error('Credit consumption error:', error);
      res.status(500).json({ error: 'Failed to consume credits' });
    }
  });

  // Admin Middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    const { userId } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      
      // Check if user is admin in DB OR is the hardcoded super admin
      if (userData?.role === 'admin' || userData?.email === 'sabibahamed2@gmail.com') {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Admin Endpoints
  app.post('/api/admin/update-credits', isAdmin, async (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || amount === undefined) return res.status(400).json({ error: 'Missing userId or amount' });

    try {
      await db.collection('users').doc(userId).update({
        credits_remaining: FieldValue.increment(amount),
        updatedAt: FieldValue.serverTimestamp()
      });
      res.json({ success: true });
    } catch (error) {
      console.error('Admin update-credits error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/update-plan', isAdmin, async (req, res) => {
    const { userId, planId } = req.body;
    if (!userId || !planId) return res.status(400).json({ error: 'Missing userId or planId' });

    try {
      await db.collection('users').doc(userId).update({
        plan_id: planId,
        updatedAt: FieldValue.serverTimestamp()
      });
      res.json({ success: true });
    } catch (error) {
      console.error('Admin update-plan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
