import express from 'express';
import Grain from '../models/Grain.js';
import Order from '../models/Order.js';
import { startOfDay, endOfDay } from 'date-fns';

export const getDashboardData = async (req, res) => {
  try {
    // Calculate total sales (sum of quantity for all orders)
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSell: { $sum: '$quantity' },
        },
      },
    ]);

    // Calculate total orders (count of all orders)
    const totalOrders = await Order.countDocuments();

    // Calculate total grains (count of all grains)
    const totalGrains = await Grain.countDocuments();

    // Get daily grain sales for the current day
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Lookup to get all grains
    const grains = await Grain.find({});

    // Get sales data for the current day, including grain details
    const dailySales = await Order.aggregate([
      {
        $match: {
          order_date: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $group: {
          _id: '$grain_id',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'grains',
          localField: '_id',
          foreignField: '_id',
          as: 'grainInfo',
        },
      },
      { $unwind: '$grainInfo' },
      {
        $project: {
          grain_id: '$_id',
          totalQuantity: 1,
          grain_name: '$grainInfo.grain_name',
        },
      },
    ]);

    // Create a map of grain sales by grain ID
    const salesMap = dailySales.reduce((acc, grainSale) => {
      acc[grainSale.grain_id] = grainSale.totalQuantity;
      return acc;
    }, {});

    // Prepare the response with all grains and their respective sales quantity
    const grainsWithSales = grains.map(grain => {
      const quantitySold = salesMap[grain._id] || 0;
      return {
        grain_id: grain._id,
        grain_name: grain.grain_name,
        totalQuantity: quantitySold,
      };
    });

    // Return the data as response
    res.json({
      totalSell: totalSales[0]?.totalSell || 0,
      totalOrders,
      totalGrains,
      salesData: grainsWithSales,
    });
  } catch (err) {
    console.error('Error fetching admin data:', err);
    res.status(500).send('Server Error');
  }
};
