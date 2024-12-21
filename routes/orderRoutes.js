import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/status', updateOrderStatus);
// router.get('/:grain_id', getGrainById);

export default router;
