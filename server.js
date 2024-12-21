import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';  // Ensure your routes are ESM-compatible
import dotenv from 'dotenv';
import grainRoutes from './routes/grainRoutes.js';
import path from 'path';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();



// Middlewares
app.use(express.json());  // For parsing application/json
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/grains', grainRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin',dashboardRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
  });

// Server listening
const PORT = process.env.PORT || 5000; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
