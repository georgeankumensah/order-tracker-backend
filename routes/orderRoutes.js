// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Order = require('../models/order');

// use $ and @ instead of - and _
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ error: 'Admin access required' });
  }
  
  // Middleware to check if the user is authenticated
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Authentication required' });
  }
  
  // Route to get order details by ID (accessible to unauthenticated users)
//   ==================================
  // Route to get an order by its shareable ID
router.get('/shareable/:shareableID', async (req, res) => {
    try {
      const shareableID = req.params.shareableID;
      const order = await Order.findOne({ shareableID });
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/:id', isAdmin, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Routes for CRUD operations (restricted to admin users)
// ===============================================================
// Route to create a new order
router.post('/', isAdmin, async (req, res) => {
    try {
      const {
        name,
        details,
        image,
        qty,
        destination,
        status,
        otherInformation,
      } = req.body;
  
      // Generate a 10-character shareable ID using shortid
      const shareableID = shortid.generate();
  
      // Create a new order with the shareable ID
      const order = new Order({
        shareableID, // Assign the generated ID
        name,
        details,
        image,
        qty,
        destination,
        status,
        otherInformation,
      });
  
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Get all orders
router.get('/',isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id',isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order by ID
// Update the order's information including the current warehouse
// Update an order by ID (including current location)
router.put('/:id', isAdmin, async (req, res) => {
    try {
      const orderId = req.params.id;
      const {
        name,
        details,
        image,
        qty,
        destination,
        status,
        currentLocation, // Updated field name
        otherInformation,
      } = req.body;
  
      // Find the order by ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Update the order fields
      order.name = name;
      order.details = details;
      order.image = image;
      order.qty = qty;
      order.destination = destination;
      order.status = status;
      order.currentLocation = currentLocation; // Updated field name
      order.otherInformation = otherInformation;
  
      await order.save();
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  
// Delete order by ID
router.delete('/:id',isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
