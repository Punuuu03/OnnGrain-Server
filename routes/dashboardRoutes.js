import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';  // Importing the controller

const router = express.Router();

// Defining the route for the dashboard
router.get('/dashboard', getDashboardData);

export default router;
