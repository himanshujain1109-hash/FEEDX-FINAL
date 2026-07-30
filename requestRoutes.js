const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    // sender is omitted for automated system/timeline messages (e.g. "Food is out for delivery")
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    senderRole: { type: String, enum: ["donor", "receiver", "system"], default: "system" },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    // system: true marks a timeline/status update rendered inline in the chat
    // (e.g. "Food is out for pickup", "Picked up") instead of a message a person typed.
    system: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ request: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
