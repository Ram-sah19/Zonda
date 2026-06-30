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

    if (!user) {
      console.log(`[Auth] Login failed: User account not found for email "${email}"`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      console.log(`[Auth] Login failed: Suspended user account for email "${email}"`);
      return res.status(403).json({ message: "Your account has been suspended by an administrator." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[Auth] Login failed: Password mismatch for email "${email}"`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(`[Auth] Login successful for user: "${email}"`);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      adminRole: user.adminRole,
      sellerStatus: user.sellerStatus,
      isDeliveryPartner: user.isDeliveryPartner,
      deliveryPartnerStatus: user.deliveryPartnerStatus,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      message: "Server error during login", 
      error: error.message, 
      stack: error.stack 
    });
  }
};

// @desc    Register a new administrator account
// @route   POST /api/auth/signup-admin
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all required registration fields" });
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
      return res.status(400).json({ message: "An account already exists with this email" });
    }

    // Assign Super Admin if first admin; otherwise default to Support
    const adminCount = await User.countDocuments({ isAdmin: true });
    const assignedRole = adminCount === 0 ? "Super Admin" : "Support";

    // Create admin
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: true,
      adminRole: assignedRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        adminRole: user.adminRole,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin details" });
    }
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ 
      message: "Server error during admin registration", 
      error: error.message 
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

// @desc    Become a seller (Deprecated - buyer accounts cannot convert)
// @route   PUT /api/auth/become-seller
// @access  Private
const becomeSeller = async (req, res) => {
  return res.status(400).json({
    message: "Buyer accounts cannot be converted to seller accounts. Please register a separate seller account."
  });
};

// @desc    Register a new seller account
// @route   POST /api/auth/signup-seller
// @access  Public
const registerSeller = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      businessName,
      businessContact,
      businessAddress,
      taxId,
      bankInfo, // { accountNumber, ifscCode, bankName }
      idVerification // { docType, docNumber, docUrl }
    } = req.body;

    // Simple validation
    if (!name || !email || !password || !businessName || !businessContact || !businessAddress || !taxId) {
      return res.status(400).json({ message: "Please fill in all required registration fields" });
    }

    if (!bankInfo || !bankInfo.accountNumber || !bankInfo.ifscCode || !bankInfo.bankName) {
      return res.status(400).json({ message: "Please provide complete bank details" });
    }

    if (!idVerification || !idVerification.docType || !idVerification.docNumber) {
      return res.status(400).json({ message: "Please provide complete identity verification information" });
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
      return res.status(400).json({ message: "An account already exists with this email" });
    }

    // Create seller
    const user = await User.create({
      name,
      email,
      password,
      isSeller: true,
      sellerDetails: {
        businessName,
        businessContact,
        businessAddress,
        taxId,
        bankInfo: {
          accountNumber: bankInfo.accountNumber,
          ifscCode: bankInfo.ifscCode,
          bankName: bankInfo.bankName
        },
        idVerification: {
          docType: idVerification.docType,
          docNumber: idVerification.docNumber,
          docUrl: idVerification.docUrl || ""
        }
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
        sellerDetails: user.sellerDetails,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid seller details" });
    }
  } catch (error) {
    console.error("Seller Registration Error:", error);
    res.status(500).json({ 
      message: "Server error during seller registration", 
      error: error.message 
    });
  }
};

// @desc    Register a new delivery partner account
// @route   POST /api/auth/signup-delivery
// @access  Public
const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      docType,
      docNumber,
    } = req.body;

    if (!name || !email || !password || !vehicleType || !vehicleNumber || !licenseNumber || !docType || !docNumber) {
      return res.status(400).json({ message: "Please fill in all required registration fields" });
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
      return res.status(400).json({ message: "An account already exists with this email" });
    }

    // Create delivery partner
    const user = await User.create({
      name,
      email,
      password,
      isDeliveryPartner: true,
      deliveryPartnerStatus: "Pending", // Requires admin approval
      deliveryPartnerDetails: {
        vehicleType,
        vehicleNumber,
        licenseNumber,
        idDocuments: {
          docType,
          docNumber
        },
        earnings: { daily: 0, weekly: 0, monthly: 0 },
        isAvailable: true,
        location: { lat: 12.9716, lng: 77.5946 }
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isDeliveryPartner: user.isDeliveryPartner,
        deliveryPartnerStatus: user.deliveryPartnerStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid registration details" });
    }
  } catch (error) {
    console.error("Delivery Partner Registration Error:", error);
    res.status(500).json({ 
      message: "Server error during delivery partner registration", 
      error: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  becomeSeller,
  registerSeller,
  registerAdmin,
  registerDeliveryPartner,
};
