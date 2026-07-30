const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    restaurantName: { type: String, required: true, trim: true },
    licenseNumber: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    documents: [{ type: String }], // file paths / URLs
    verified: { type: Boolean, default: false },
    totalDonations: { type: Number, default: 0 },
    totalMealsSaved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
