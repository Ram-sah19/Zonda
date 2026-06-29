const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create user (password will be hashed automatically by userSchema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ 
      message: "Server error during registration", 
      error: error.message, 
      stack: error.stack 
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      message: "Server error during login", 
      error: error.message, 
      stack: error.stack 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user was populated by authMiddleware
    res.json(req.user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
};

// @desc    Become a seller
// @route   PUT /api/auth/become-seller
// @access  Private
const becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isSeller = true;
    await user.save();
    
    res.json({
      message: "You are now registered as a Seller!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller
      }
    });
  } catch (error) {
    console.error("Become Seller Error:", error);
    res.status(500).json({ message: "Server error becoming a seller", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  becomeSeller,
};
