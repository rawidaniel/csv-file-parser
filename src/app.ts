import express from 'express';
import authRoutes from './routes/authRoute';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
