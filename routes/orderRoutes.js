// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const Order = require("../models/order");
const isAdmin = require("../middlewares/admin.middleware")
const user = require("../middlewares/user.middleware")

// use $ and @ instead of - and _
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);


// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Authentication required" });
}

// Route to get an order by its shareable ID (accessible to unauthenticated users)
router.get("/shareable/:shareableID", async (req, res) => {
  try {
    const shareableID = req.params.shareableID;
    const order = await Order.findOne({ shareableID });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes for CRUD operations (restricted to admin users)
// ===============================================================

// Route to create a new order
router.post("/", isAdmin, async (req, res) => {
  try {
    const {
      name,
      details,
      image,
      qty,
      destination,
      status,
      currentWarehouse,
      expectedArrivalTime,
      currentLocation,
      otherInformation,
    } = req.body;

    const shareableID = shortid.generate();
    // Create a new order
    const order = new Order({
      shareableID,
      name,
      details,
      image,
      qty,
      destination,
      status,
      currentWarehouse,
      expectedArrivalTime,
      currentLocation,
      otherInformation,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all orders
router.get("/", isAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get("/:id", isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order by ID
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = req.body;

    // Find the order by ID and update it
    const order = await Order.findByIdAndUpdate(orderId, updatedOrder, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order by ID
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
