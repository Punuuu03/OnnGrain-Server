import Order from '../models/Order.js';
import nodemailer from 'nodemailer';

// Create an order
// import Order from '../models/Order.js';
import Grain from '../models/Grain.js'; // Import Grain model
// import nodemailer from 'nodemailer';

// Create an order
export const createOrder = async (req, res) => {
  const {
    grain_id,
    grain_name,
    price,
    stock,
    username,
    address,
    mobile_number,
    email,
    quantity,
    payment_mode,
  } = req.body;

  const total = price * parseInt(quantity, 10);

  try {
    // Fetch the grain from the database
    const grain = await Grain.findOne({ grain_id });
    if (!grain) return res.status(404).json({ message: 'Grain not found' });

    // Check if stock is sufficient
    if (grain.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Reduce the stock by the ordered quantity
    grain.stock -= quantity;

    // Save the updated stock back to the database
    await grain.save();

    // Create a new order
    const newOrder = new Order({
      grain_id,
      grain_name,
      price,
      stock, // Updated stock after the reduction
      username,
      address,
      mobile_number,
      email,
      quantity,
      total,
      payment_mode,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
      updatedStock: grain.stock, // Provide updated stock in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin can confirm/reject)
export const updateOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    // Send email to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mohitepunam29@gmail.com', // Admin's email ID
        pass: 'dfaa vpvw hacm gkub',
      },
    });

    const mailOptions = {
      from: 'mohitepunam@example.com',
      to: order.email,
      subject: `Your order status is ${status}`,
      text: `Hello ${order.username},\n\nYour order for ${order.grain_name} has been ${status}.`,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Order ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
