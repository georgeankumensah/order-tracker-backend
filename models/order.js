const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  statusTitle: String,
  arrivalDate: Date,
  departureDate: Date,
});

const orderSchema = new mongoose.Schema({
  shareableID: String, // Unique identifier for sharing
  name: String,
  id: String,
  details: String,
  image: String,
  qty: Number,
  destination: {
    to: String,
    from: String,
  },
  status: [statusSchema],
  currentWarehouse: String,
  currentLocation: { 
    warehouseName: String, // Represents the current warehouse's name
    arrivalDate: Date,
    departureDate: Date,
  },
  otherInformation: {
    // Add other fields as needed
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
