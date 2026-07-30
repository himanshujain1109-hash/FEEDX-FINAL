const Ngo = require("../models/Ngo");
const Food = require("../models/Food");

// @desc    Public, real-time platform numbers shown on the landing page
//          (no login required — this is what powers "meals rescued" /
//          "verified organizations" instead of hardcoded placeholder values).
// @route   GET /api/stats/public
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const [verifiedNgos, mealsAgg] = await Promise.all([
      Ngo.countDocuments({ verified: true }),
      Food.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, totalMeals: { $sum: "$quantity" } } },
      ]),
    ]);

    const totalMealsSaved = mealsAgg[0]?.totalMeals || 0;

    res.json({
      success: true,
      stats: {
        totalMealsSaved,
        verifiedNgos,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicStats };
