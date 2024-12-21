// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      unique: true,
      required: true,
      default: () => `user-${Math.floor(Math.random() * 100000)}`,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String, // Email is not unique here
      required: true,
      lowercase: true,
    },
    mobile_number: {
      type: Number,
      unique: true, // Ensure mobile_number remains unique
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);