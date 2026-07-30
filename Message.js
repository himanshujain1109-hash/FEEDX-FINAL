const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");
const Food = require("../models/Food");
const Request = require("../models/Request");
const notify = require("../utils/notify");

// @desc    Dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
const getDashboard = async (req, res, next) => {
  try {
    const [totalRestaurants, verifiedRestaurants, totalNgos, verifiedNgos, totalFoodListings, completedRequests, pendingRequests] =
      await Promise.all([
        Restaurant.countDocuments(),
        Restaurant.countDocuments({ verified: true }),
        Ngo.countDocuments(),
        Ngo.countDocuments({ verified: true }),
        Food.countDocuments(),
        Request.countDocuments({ status: "completed" }),
        Request.countDocuments({ status: "pending" }),
      ]);

    const mealsAgg = await Food.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalMeals: { $sum: "$quantity" } } },
    ]);
    const totalMealsSaved = mealsAgg[0]?.totalMeals || 0;

    res.json({
      success: true,
      stats: {
        totalRestaurants,
        verifiedRestaurants,
        totalNgos,
        verifiedNgos,
        totalFoodListings,
        completedRequests,
        pendingRequests,
        totalMealsSaved,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List restaurants (optionally filter by verified status)
// @route   GET /api/admin/restaurants
// @access  Private (admin)
const listRestaurants = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.verified !== undefined) filter.verified = req.query.verified === "true";
    const restaurants = await Restaurant.find(filter).populate("user", "name email phone address createdAt");
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    next(error);
  }
};

// @desc    List NGOs (optionally filter by verified status)
// @route   GET /api/admin/ngos
// @access  Private (admin)
const listNgos = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.verified !== undefined) filter.verified = req.query.verified === "true";
    const ngos = await Ngo.find(filter).populate("user", "name email phone address createdAt");
    res.json({ success: true, count: ngos.length, ngos });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify (approve) a restaurant
// @route   PUT /api/admin/restaurants/:id/verify
// @access  Private (admin)
const verifyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });

    restaurant.verified = true;
    await restaurant.save();
    await User.findByIdAndUpdate(restaurant.user, { verified: true });

    await notify(req, {
      receiver: restaurant.user,
      title: "Account verified",
      message: `${restaurant.restaurantName} has been verified. You can now list surplus food.`,
      type: "system",
    });

    res.json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify (approve) an NGO
// @route   PUT /api/admin/ngos/:id/verify
// @access  Private (admin)
const verifyNgo = async (req, res, next) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

    ngo.verified = true;
    await ngo.save();
    await User.findByIdAndUpdate(ngo.user, { verified: true });

    await notify(req, {
      receiver: ngo.user,
      title: "Account verified",
      message: `${ngo.organizationName} has been verified. You can now request food donations.`,
      type: "system",
    });

    res.json({ success: true, ngo });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate / remove a user (fake accounts, complaints, etc.)
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isActive = false;
    await user.save();

    res.json({ success: true, message: "User deactivated" });
  } catch (error) {
    next(error);
  }
};

// @desc    Live view of all active donations (requested / accepted / picked)
// @route   GET /api/admin/live-donations
// @access  Private (admin)
const getLiveDonations = async (req, res, next) => {
  try {
    const requests = await Request.find({ status: { $in: ["pending", "accepted"] } })
      .populate("food")
      .populate("ngo", "organizationName")
      .populate("restaurant", "restaurantName")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  listRestaurants,
  listNgos,
  verifyRestaurant,
  verifyNgo,
  deactivateUser,
  getLiveDonations,
};
