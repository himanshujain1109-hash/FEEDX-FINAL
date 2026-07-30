const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Other" }, // e.g. Rice, Bread, Curry, Bakery
    description: { type: String, default: "" },
    quantity: { type: Number, required: true },
    unit: {
      type: String,
      enum: ["kg", "plates", "packets", "liters", "pieces"],
      default: "plates",
    },
    foodType: { type: String, enum: ["veg", "non-veg"], required: true },
    photo: { type: String, default: "" },
    preparedTime: { type: Date, required: true },
    expiryTime: { type: Date, required: true },
    pickupStart: { type: Date, required: true },
    pickupEnd: { type: Date, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    address: { type: String, default: "" },
    status: {
      type: String,
      enum: ["available", "requested", "reserved", "picked", "completed", "expired", "cancelled"],
      default: "available",
    },
  },
  { timestamps: true }
);

foodSchema.index({ location: "2dsphere" });

// A simple freshness score: fraction of shelf life remaining, from prepared -> expiry
foodSchema.methods.freshnessScore = function () {
  const now = Date.now();
  const total = new Date(this.expiryTime).getTime() - new Date(this.preparedTime).getTime();
  const remaining = new Date(this.expiryTime).getTime() - now;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, remaining / total));
};

module.exports = mongoose.model("Food", foodSchema);
