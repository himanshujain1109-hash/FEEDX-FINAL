const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const Ngo = require("../models/Ngo");
const notify = require("../utils/notify");
const { distanceInKm } = require("../utils/geo");

// @desc    Create a food listing (donor only)
// @route   POST /api/food
// @access  Private (donor)
const createFood = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant profile not found" });
    }
    if (!restaurant.verified) {
      return res.status(403).json({ success: false, message: "Your restaurant is not verified yet. Please wait for admin approval." });
    }

    const {
      title,
      category,
      description,
      quantity,
      unit,
      foodType,
      preparedTime,
      expiryTime,
      pickupStart,
      pickupEnd,
      longitude,
      latitude,
      address,
    } = req.body;

    if (!title || !quantity || !foodType || !preparedTime || !expiryTime || !pickupStart || !pickupEnd) {
      return res.status(400).json({ success: false, message: "Please fill all required food details" });
    }

    if (new Date(expiryTime) <= new Date(preparedTime)) {
      return res.status(400).json({ success: false, message: "expiryTime must be after preparedTime" });
    }

    const food = await Food.create({
      restaurant: restaurant._id,
      donor: req.user._id,
      title,
      category,
      description,
      quantity,
      unit,
      foodType,
      photo: req.file ? `/uploads/${req.file.filename}` : "",
      preparedTime,
      expiryTime,
      pickupStart,
      pickupEnd,
      address,
      location: {
        type: "Point",
        coordinates: [Number(longitude) || 0, Number(latitude) || 0],
      },
    });

    // Notify nearby NGOs (within 10km) that fresh food is available
    if (longitude && latitude) {
      const nearbyNgos = await Ngo.find({ verified: true }).populate("user", "location");
      for (const ngo of nearbyNgos) {
        const coords = ngo.user?.location?.coordinates;
        if (coords && coords[0] !== 0 && coords[1] !== 0) {
          const dist = distanceInKm([Number(longitude), Number(latitude)], coords);
          if (dist <= 10) {
            await notify(req, {
              receiver: ngo.user._id,
              title: "Fresh food available nearby",
              message: `${restaurant.restaurantName} just listed "${title}" (${quantity} ${unit}), ${dist.toFixed(1)} km away.`,
              type: "new_food",
              relatedFood: food._id,
            });
          }
        }
      }
    }

    res.status(201).json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food listings with optional filters (category, veg, distance, search)
// @route   GET /api/food
// @access  Public
const getFoods = async (req, res, next) => {
  try {
    const { status, category, foodType, search, longitude, latitude, maxDistanceKm } = req.query;

    const query = {};
    if (status) query.status = status;
    else query.status = "available";
    if (category) query.category = category;
    if (foodType) query.foodType = foodType;
    if (search) query.title = { $regex: search, $options: "i" };

    let foods = await Food.find(query)
      .populate("restaurant", "restaurantName verified")
      .populate("donor", "name phone")
      .sort({ createdAt: -1 })
      .lean();

    // Attach distance + freshness if user location provided
    if (longitude && latitude) {
      foods = foods
        .map((f) => {
          const dist = distanceInKm([Number(longitude), Number(latitude)], f.location.coordinates);
          return { ...f, distanceKm: Number(dist.toFixed(2)) };
        })
        .filter((f) => (maxDistanceKm ? f.distanceKm <= Number(maxDistanceKm) : true))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food listing
// @route   GET /api/food/:id
// @access  Public
const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("restaurant", "restaurantName verified")
      .populate("donor", "name phone address");

    if (!food) {
      return res.status(404).json({ success: false, message: "Food listing not found" });
    }

    res.json({ success: true, food, freshness: food.freshnessScore() });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a food listing (owner donor only)
// @route   PUT /api/food/:id
// @access  Private (donor)
const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food listing not found" });

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only edit your own listings" });
    }

    const allowedFields = [
      "title", "category", "description", "quantity", "unit", "foodType",
      "preparedTime", "expiryTime", "pickupStart", "pickupEnd", "address", "status",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) food[field] = req.body[field];
    });

    if (req.file) food.photo = `/uploads/${req.file.filename}`;

    await food.save();
    res.json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a food listing (owner donor only)
// @route   DELETE /api/food/:id
// @access  Private (donor)
const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food listing not found" });

    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own listings" });
    }

    await food.deleteOne();
    res.json({ success: true, message: "Food listing deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food listings created by the logged-in donor
// @route   GET /api/food/my/listings
// @access  Private (donor)
const getMyFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    next(error);
  }
};

module.exports = { createFood, getFoods, getFoodById, updateFood, deleteFood, getMyFoods };
