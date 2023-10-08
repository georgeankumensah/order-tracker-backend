// routes/adminRoutes.js

const Order = require("../../schemas/Order.schema");
const User = require("../../schemas/User.schema");
const asyncHandler = require("express-async-handler");

// // fetch user
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.session.user);
});

// // Admin registration route (for initial setup)
// // only a super admin can add an a new admin
// // Route to register an admin
const register = asyncHandler(async (req, res) => {
  const { username, password, isAdmin,isSuperAdmin } = req.body;

  if (!username || !password || typeof password !== "boolean") {
    res.status(403);
    throw new Error("Please provide all valid credentials");
  }

  // Check if username exists
  const exists = await User.findOne({ username: username });
if (exists) {
	res.status(403);
	throw new Error("A user with this username already exists");
}

// Create a new admin user
const user = await User.create({ username, password, isAdmin, isSuperAdmin });

// Save the user to the database
await user.save();

  // Return the user
    return res.status(200).json(user);
});

// // Admin login route
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(403);
    throw new Error("Enter a username and password");
  }
  let user = await User.findOne({ username, password });
  if (!user) {
    res.status(403);
    throw new Error("Invalid user credentials");
  }
  req.session.user = user;
  res.status(200).json(user);
});

// // Admin logout route
const logout = asyncHandler(async (req, res) => {
  await req.session.destroy();
  res.status(200).json({ success: true });
});

// // delete an admin
const deleteAnAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  const admin = await User.findOne({ _id: adminId, isAdmin: true });
  if (!admin) {
    res.status(404);
    throw new Error("The provided admin account does not exist");
  }

  // Remove admin or (superAdmin) status
  await Order.updateOne(
    { _id: adminId },
    { $set: { isAdmin: false, isSuperAdmin: false } }
  );
  res.status(200).json({ success: true });
});

// get all admins
const getAllAdmins = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: true });
  res.status(200).json(users);
});

const updateAnAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  const { username, password, isAdmin, isSuperAdmin } = req.body;
  if (!username || !password) {
    res.status(403);
    throw new Error("Please provide all needed information");
  }
  // Find and update the admin user by ID
  const adminUser = await User.findById(adminId);
  if (!adminUser) {
    return res.status(404).json({ error: "Admin user not found" });
  }

  // Update the admin user's details
  await User.updateOne(
    { _id: adminId },
    { $set: { username, password, isSuperAdmin } }
  );

  res.json({ success: true });
});

module.exports = {
  login,
  logout,
  getUser,
  deleteAnAdmin,
  getAllAdmins,
  register,
  updateAnAdmin,
};
