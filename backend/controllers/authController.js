const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user (donor, receiver, or admin)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      address,
      longitude,
      latitude,
      // donor-only
      restaurantName,
      licenseNumber,
      gstNumber,
      // receiver-only
      organizationName,
      registrationNumber,
      capacity,
    } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    if (!["donor", "receiver"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be 'donor' or 'receiver'" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude) || 0, Number(latitude) || 0],
      },
    });

    if (role === "donor") {
      if (!restaurantName) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: "restaurantName is required for donors" });
      }
      await Restaurant.create({
        user: user._id,
        restaurantName,
        licenseNumber,
        gstNumber,
      });
    }

    if (role === "receiver") {
      if (!organizationName) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: "organizationName is required for receivers" });
      }
      await Ngo.create({
        user: user._id,
        organizationName,
        registrationNumber,
        capacity: capacity || 0,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registered successfully. Your account is pending verification by admin.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "This account has been deactivated" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        photo: user.photo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's full profile (including donor/NGO profile)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === "donor") {
      profile = await Restaurant.findOne({ user: user._id });
    } else if (user.role === "receiver") {
      profile = await Ngo.findOne({ user: user._id });
    }

    res.json({ success: true, user, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
