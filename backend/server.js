import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/apiRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Initialize MongoDB Connection
connectDB();

// Global Middlewares
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded evidence statically
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));

// Mount Base API Routes
app.use('/api', apiRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
  res.json({
    message: 'CyberGuard AI - Cyber Crime Reporting & AI Tracking Backend API',
    documentation: '/api/health',
    status: 'online',
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`[CyberGuard API] Server is listening on http://localhost:${config.port} in ${config.nodeEnv} mode`);
});

// Process handling for graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error(`[Fatal Rejection]: ${err.message}`);
});

export default app;
