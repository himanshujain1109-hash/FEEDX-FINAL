const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["new_food", "new_request", "request_accepted", "request_rejected", "pickup_confirmed", "system"],
      default: "system",
    },
    relatedFood: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
