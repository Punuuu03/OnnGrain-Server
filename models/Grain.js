import mongoose from 'mongoose';

const grainSchema = new mongoose.Schema({
  grain_id: { type: Number, required: true, unique: true },
  grain_name: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: String, required: true },
  date: { type: Date, default: Date.now },
});


const Grain = mongoose.model('Grain', grainSchema);

export default Grain;
