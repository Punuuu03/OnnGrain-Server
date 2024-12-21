import express from 'express';
import Grain from '../models/Grain.js';
import Order from '../models/Order.js';

export const getDashboardData = async (req, res) => {
  try {
    // Get the start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59)

    // Calculate total sales for the current day (sum of quantity for all orders today)
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSell: { $sum: '$total' },
        },
      },
    ]);

     // Calculate total orders (count of all orders)
     const totalOrders = await Order.countDocuments();

    // Calculate total grains (count of unique grains)
    const totalGrains = await Grain.countDocuments();

    // Get sales data for all orders for the current day, grouped by `grain_id` and `grain_name`
    const allSales = await Order.aggregate([
      {
        $match: {
          date: {
            $gte: startOfDay, // Orders from the start of the day
            $lte: endOfDay,   // Orders until the end of the day
          },
        },
      },
      {
        $group: {
          _id: {
            grain_id: '$grain_id', // Group by grain_id
            grain_name: '$grain_name', // Include grain_name in the group
          },
          totalQuantity: { $sum: '$quantity' }, // Sum the quantities for each group
        },
      },
      {
        $project: {
          grain_id: '$_id.grain_id', // Access grain_id from the group
          grain_name: '$_id.grain_name', // Access grain_name from the group
          totalQuantity: 1, // Include the summed quantity
        },
      },
    ]);

    // Return the data as response
    res.json({
      totalSell: totalSales[0]?.totalSell || 0,
      totalOrders,
      totalGrains,
      salesData: allSales,
    });
  } catch (err) {
    console.error('Error fetching admin data:', err);
    res.status(500).send('Server Error');
  }
};
