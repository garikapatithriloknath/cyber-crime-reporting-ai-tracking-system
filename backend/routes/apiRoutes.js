import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes.js';
import complaintRoutes from './complaintRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

// Base Health Check endpoint
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected / Standby';

  res.status(200).json({
    success: true,
    message: 'Cyber Crime Reporting & AI Tracking System Backend API is active.',
    service: 'cyber-crime-backend',
    version: '1.0.0',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Mount Sub-routers
router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/admin', adminRoutes);

export default router;
