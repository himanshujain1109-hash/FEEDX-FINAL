const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    organizationName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, default: "" },
    documents: [{ type: String }],
    verified: { type: Boolean, default: false },
    capacity: { type: Number, default: 0 }, // approx people served per day
    totalReceived: { type: Number, default: 0 },
    totalPeopleFed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ngo", ngoSchema);
