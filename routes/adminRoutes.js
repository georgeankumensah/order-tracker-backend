// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../models/order');
const User = require('../models/user');

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}

// Admin registration route (for initial setup)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, isAdmin: true }); // Set isAdmin to true for admin users
    await User.register(user, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

// delete an admin
router.delete('/remove', async (req, res) => {
    try {
            const user = await User.findOneAndDelete({username: req.params.username});
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


// Admin actions (CRUD operations for orders)
// Example: Create a new order
router.post('/orders', isAdmin, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;
