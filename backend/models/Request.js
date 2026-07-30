const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo", required: true },
    receiverUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    donorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "picked", "completed", "cancelled"],
      default: "pending",
    },
    pickupTime: { type: Date },
    remarks: { type: String, default: "" },
    qrCode: { type: String, default: "" }, // confirmation code shown/scanned at pickup
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
