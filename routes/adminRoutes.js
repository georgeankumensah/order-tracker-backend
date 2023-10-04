// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../models/order');
const User = require('../models/user');
const userMiddleware = require("../middlewares/user.middleware") 

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}


// fetch user
router.get("/user",userMiddleware, async (req,res)=>{
  try {
    res.status(200).json(req.session.user)
  } catch (error) {
    return res.status(403).json({error : "user not found"});
  }
})

// Admin registration route (for initial setup)
// only an admin can add an a new admin
// Route to register an admin
router.post('/register', isAuthenticated, async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Check if the requesting user is a super admin
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    // Create a new admin user
    const user = new User({ username, password, isAdmin });

    // registration logic
    await user.save();
    return res.status(201).json(user)

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  req.session.user = req.user;
  res.json(req.user);
});

// delete an admin
// Route to delete an admin
router.delete('/admins/:id', isAuthenticated, async (req, res) => {
  try {
    const adminId = req.params.id;

    // Check if the requesting user is a super admin
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    // Find and delete the admin user by ID
    // ... (deletion logic)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

    // get all admins
    router.get('/admins',isAdmin, async (req, res) => {

      try {
          const users = await User.find({isAdmin:true});
          res.json(users);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  });

// Route to update an admin user by ID
router.put('/admins/:id', isAuthenticated, async (req, res) => {
  try {
    const adminId = req.params.id;
    const { username, password, isAdmin } = req.body;

    // Check if the requesting user is a super admin
    if (!req.user || !req.user.isSuperAdmin) {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    // Find and update the admin user by ID
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Update the admin user's details
    adminUser.username = username;
    adminUser.password = password;
    adminUser.isAdmin = isAdmin;

    await adminUser.save();
    res.json(adminUser);
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

// delete all orders
router.delete('/orders',isAdmin,async (req,res)=>{
  try {
    await Order.deleteMany({});
    res.status(200).json({message:"All orders deleted"})
  } catch (error) {
    res.send(400).json({error:error.message})
    
  }
})





module.exports = router;
