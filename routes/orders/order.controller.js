const shortid = require("shortid");
const asyncHandler = require("express-async-handler");
const Order = require("../../schemas/Order.schema");

// use $ and @ instead of - and _
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);

// Get an order by its shareable ID (accessible to unauthenticated users)
const getOrderByShareable = asyncHandler(async (req, res) => {
  const shareableID = req.params.shareableID;
  const order = await Order.findOne({ shareableID });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Create a new order
const postAnOrder = asyncHandler(async (req, res) => {
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
  if (!name || !details || !image || !qty || !status) {
    res.status(403);
    throw new Erro("Please provide all required information");
  }
  const shareableID = shortid.generate();
  // Create a new order
  const order = await Order.create({
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

  res.status(201).json(order);
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get order by ID
const getAnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

// Update order by ID
const updateAnOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = req.body;

  // Find the order by ID
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await Order.updateOne({ _id: orderId }, { $set: updatedOrder });
  res.json({ success: true });
});

// Delete order by ID
const deleteAnOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = req.body;

  // Find the order by ID
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await Order.deleteOne({ _id: orderId });
  res.json({ success: true });
});

// Delete all orders
const deleteAllOrders = asyncHandler(async (req, res) => {
  await Order.deleteMany({});
  res.status(200).json({ message: "All orders deleted" });
});

module.exports = {
  getAllOrders,
  getAnOrder,
  updateAnOrder,
  deleteAnOrder,
  getOrderByShareable,
  deleteAllOrders,
  postAnOrder,
};
