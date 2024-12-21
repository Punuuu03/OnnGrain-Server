import Grain from '../models/Grain.js';
import path from 'path';
import fs from 'fs';

// Add Grain without Image Upload
export const addGrain = async (req, res) => {
  const { grain_id, grain_name, stock, price } = req.body;

  // Validation: Ensure all required fields are present
  if (!grain_id || !grain_name || !stock || !price) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new grain without an image field
    const newGrain = new Grain({ grain_id, grain_name, stock, price });
    await newGrain.save();
    res.status(201).json({ message: 'Grain added successfully', grain: newGrain });
  } catch (error) {
    console.error('Error saving grain:', error);
    res.status(500).json({ message: 'Error adding grain', error });
  }
};



// Edit Grain
// Edit Grain
export const editGrain = async (req, res) => {
  const { grain_id } = req.params;
  const { stock, price } = req.body;

  try {
    // Find grain in the database
    const grain = await Grain.findOne({ grain_id });
    if (!grain) return res.status(404).json({ message: 'Grain not found' });

    // Add entered stock value to existing stock in the database
    const stockValue = parseInt(stock || '0', 10); // Use 0 if stock is not provided
    grain.stock = (grain.stock || 0) + stockValue;

    // Update price if provided
    if (price !== undefined && price !== '') {
      grain.price = price;
    }

    // Save changes to the database
    await grain.save();
    res.json({ message: 'Grain updated successfully', grain });
  } catch (error) {
    res.status(500).json({ message: 'Error editing grain', error });
  }
};

// Display Grains
export const displayGrains = async (req, res) => {
  try {
    const grains = await Grain.find();
    res.json(grains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grains', error });
  }
};

// Delete Grain
export const deleteGrain = async (req, res) => {
  const { grain_id } = req.params;
  try {
    const grain = await Grain.findOneAndDelete({ grain_id });
    if (!grain) return res.status(404).json({ message: 'Grain not found' });

    // Delete associated image
    if (grain.grain_img) {
      const imagePath = path.join(process.cwd(), grain.grain_img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Grain deleted successfully', grain });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grain', error });
  }
};
