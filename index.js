const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const dotenv = require("dotenv");
const cors = require("cors")

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Define User Model
const User = require("./models/user");

// Configure Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Include admin routes
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes); // Use /admin prefix for admin routes


// Add admin route handlers here (e.g., for user registration, login, and admin actions)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
