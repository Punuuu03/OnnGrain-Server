import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  grain_id: { type: String, required: true },
  grain_name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  username: { type: String, required: true },
  address: { type: String, required: true },
  mobile_number: { type: Number, required: true },
  email: { type: String, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  payment_mode: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
