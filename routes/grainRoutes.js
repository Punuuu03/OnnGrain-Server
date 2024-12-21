import express from 'express';
import { addGrain, editGrain, displayGrains, deleteGrain } from '../controllers/grainController.js';

const router = express.Router();

// Routes
router.post('/', addGrain);
router.put('/:grain_id', editGrain); // Corrected: Grain ID passed in URL
router.get('/', displayGrains);
router.delete('/:grain_id', deleteGrain);


export default router;
