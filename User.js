const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, longitude, latitude } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (longitude && latitude) {
      user.location = { type: "Point", coordinates: [Number(longitude), Number(latitude)] };
    }
    if (req.file) user.photo = `/uploads/${req.file.filename}`;

    await user.save();

    // Update role-specific profile fields too, if provided
    if (user.role === "donor" && (req.body.restaurantName || req.body.licenseNumber || req.body.gstNumber)) {
      await Restaurant.findOneAndUpdate(
        { user: user._id },
        {
          ...(req.body.restaurantName && { restaurantName: req.body.restaurantName }),
          ...(req.body.licenseNumber && { licenseNumber: req.body.licenseNumber }),
          ...(req.body.gstNumber && { gstNumber: req.body.gstNumber }),
        }
      );
    }

    if (user.role === "receiver" && (req.body.organizationName || req.body.capacity)) {
      await Ngo.findOneAndUpdate(
        { user: user._id },
        {
          ...(req.body.organizationName && { organizationName: req.body.organizationName }),
          ...(req.body.capacity && { capacity: req.body.capacity }),
        }
      );
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Analytics for the logged-in donor or receiver
// @route   GET /api/users/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    if (req.user.role === "donor") {
      const restaurant = await Restaurant.findOne({ user: req.user._id });
      return res.json({
        success: true,
        analytics: {
          totalDonations: restaurant?.totalDonations || 0,
          totalMealsSaved: restaurant?.totalMealsSaved || 0,
        },
      });
    }

    if (req.user.role === "receiver") {
      const ngo = await Ngo.findOne({ user: req.user._id });
      return res.json({
        success: true,
        analytics: {
          totalReceived: ngo?.totalReceived || 0,
          totalPeopleFed: ngo?.totalPeopleFed || 0,
        },
      });
    }

    res.json({ success: true, analytics: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, getAnalytics };
