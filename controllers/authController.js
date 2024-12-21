// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Register User
export const register = async (req, res) => {
  const { username, email, mobile_number, password } = req.body;

  try {
    const existingUser = await User.findOne({ mobile_number });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this mobile number' });
    }

    const user = new User({ username, email, mobile_number, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Login User
export const login = async (req, res) => {
  const { mobile_number, password } = req.body;

  try {
    const user = await User.findOne({ mobile_number });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        mobile_number: user.mobile_number,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
