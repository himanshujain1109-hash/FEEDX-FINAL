const crypto = require("crypto");
const Request = require("../models/Request");
const Food = require("../models/Food");
const Ngo = require("../models/Ngo");
const Restaurant = require("../models/Restaurant");
const Message = require("../models/Message");
const notify = require("../utils/notify");

// Drops an automated timeline message into the request's chat (e.g. "Food is
// out for delivery") and pushes it live to both participants, the same way a
// delivery app posts a status update inside the order chat.
const postSystemMessage = async (req, request, text) => {
  const message = await Message.create({
    request: request._id,
    sender: null,
    senderRole: "system",
    system: true,
    text,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(request.donorUser.toString()).emit("chat_message", { requestId: request._id, message });
    io.to(request.receiverUser.toString()).emit("chat_message", { requestId: request._id, message });
    io.to(request.donorUser.toString()).emit("request_updated", { requestId: request._id, status: request.status });
    io.to(request.receiverUser.toString()).emit("request_updated", { requestId: request._id, status: request.status });
  }

  return message;
};

// @desc    NGO requests a food listing
// @route   POST /api/requests
// @access  Private (receiver)
const createRequest = async (req, res, next) => {
  try {
    const { foodId, remarks } = req.body;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ success: false, message: "Food listing not found" });
    if (food.status !== "available") {
      return res.status(400).json({ success: false, message: "This food is no longer available" });
    }

    const ngo = await Ngo.findOne({ user: req.user._id });
    if (!ngo) return res.status(404).json({ success: false, message: "NGO profile not found" });
    if (!ngo.verified) {
      return res.status(403).json({ success: false, message: "Your organization is not verified yet. Please wait for admin approval." });
    }

    const existing = await Request.findOne({ food: foodId, ngo: ngo._id, status: { $in: ["pending", "accepted"] } });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already have an active request for this food" });
    }

    const request = await Request.create({
      food: food._id,
      ngo: ngo._id,
      receiverUser: req.user._id,
      restaurant: food.restaurant,
      donorUser: food.donor,
      remarks,
    });

    food.status = "requested";
    await food.save();

    await notify(req, {
      receiver: food.donor,
      title: "New pickup request",
      message: `${ngo.organizationName} requested "${food.title}".`,
      type: "new_request",
      relatedFood: food._id,
      relatedRequest: request._id,
    });

    res.status(201).json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor accepts a request
// @route   PUT /api/requests/:id/accept
// @access  Private (donor)
const acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.donorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your request to manage" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    request.status = "accepted";
    request.pickupTime = req.body.pickupTime || request.food.pickupStart;
    request.qrCode = crypto.randomBytes(6).toString("hex").toUpperCase();
    await request.save();

    const food = await Food.findById(request.food._id);
    food.status = "reserved";
    await food.save();

    // Reject any other pending requests for the same food
    const otherRequests = await Request.find({ food: food._id, status: "pending", _id: { $ne: request._id } });
    for (const other of otherRequests) {
      other.status = "rejected";
      other.remarks = "Food was reserved by another organization";
      await other.save();
      await notify(req, {
        receiver: other.receiverUser,
        title: "Request no longer available",
        message: `"${food.title}" was reserved by another organization.`,
        type: "request_rejected",
        relatedFood: food._id,
        relatedRequest: other._id,
      });
    }

    await notify(req, {
      receiver: request.receiverUser,
      title: "Pickup approved",
      message: `Your request for "${food.title}" was accepted. Confirmation code: ${request.qrCode}`,
      type: "request_accepted",
      relatedFood: food._id,
      relatedRequest: request._id,
    });

    await postSystemMessage(req, request, `Request accepted. Confirmation code: ${request.qrCode}`);

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor marks a request as out for delivery/pickup
// @route   PUT /api/requests/:id/picked
// @access  Private (donor)
const markPicked = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.donorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your request to manage" });
    }
    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Request must be accepted before marking it out for pickup" });
    }

    request.status = "picked";
    await request.save();

    await notify(req, {
      receiver: request.receiverUser,
      title: "Food is out for delivery",
      message: `"${request.food.title}" is on its way for pickup.`,
      type: "request_updated",
      relatedFood: request.food._id,
      relatedRequest: request._id,
    });

    await postSystemMessage(req, request, "Food is out for delivery / pickup.");

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor rejects a request
// @route   PUT /api/requests/:id/reject
// @access  Private (donor)
const rejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.donorUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your request to manage" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    request.status = "rejected";
    request.remarks = req.body.remarks || "Rejected by donor";
    await request.save();

    const food = await Food.findById(request.food._id);
    // Reopen the food listing if no other active requests remain
    const stillActive = await Request.exists({ food: food._id, status: { $in: ["pending", "accepted"] } });
    if (!stillActive) {
      food.status = "available";
      await food.save();
    }

    await notify(req, {
      receiver: request.receiverUser,
      title: "Request declined",
      message: `Your request for "${food.title}" was declined.`,
      type: "request_rejected",
      relatedFood: food._id,
      relatedRequest: request._id,
    });

    await postSystemMessage(req, request, `Request declined: ${request.remarks}`);

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO confirms pickup using the QR / confirmation code
// @route   PUT /api/requests/:id/complete
// @access  Private (receiver)
const completeRequest = async (req, res, next) => {
  try {
    const { code } = req.body;
    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.receiverUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not your request to manage" });
    }
    if (request.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Request must be accepted before it can be completed" });
    }
    if (code && code.toUpperCase() !== request.qrCode) {
      return res.status(400).json({ success: false, message: "Invalid confirmation code" });
    }

    request.status = "completed";
    await request.save();

    const food = await Food.findById(request.food._id);
    food.status = "completed";
    await food.save();

    // Update stats
    const restaurant = await Restaurant.findById(request.restaurant);
    restaurant.totalDonations += 1;
    restaurant.totalMealsSaved += food.quantity;
    await restaurant.save();

    const ngo = await Ngo.findById(request.ngo);
    ngo.totalReceived += 1;
    ngo.totalPeopleFed += food.quantity;
    await ngo.save();

    await notify(req, {
      receiver: request.donorUser,
      title: "Donation completed",
      message: `Pickup for "${food.title}" was confirmed. Thank you for your donation!`,
      type: "pickup_confirmed",
      relatedFood: food._id,
      relatedRequest: request._id,
    });

    await postSystemMessage(req, request, "Picked up! Donation completed. 🎉");

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a request (either party, only while pending/accepted)
// @route   PUT /api/requests/:id/cancel
// @access  Private
const cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate("food");
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const isOwner =
      request.donorUser.toString() === req.user._id.toString() ||
      request.receiverUser.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ success: false, message: "Not your request" });

    if (!["pending", "accepted"].includes(request.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${request.status} request` });
    }

    request.status = "cancelled";
    await request.save();

    const food = await Food.findById(request.food._id);
    food.status = "available";
    await food.save();

    await postSystemMessage(req, request, "This request was cancelled.");

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests relevant to the logged-in user (as donor or receiver)
// @route   GET /api/requests
// @access  Private
const getMyRequests = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "donor" ? { donorUser: req.user._id } : { receiverUser: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    const requests = await Request.find(filter)
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
  createRequest,
  acceptRequest,
  markPicked,
  rejectRequest,
  completeRequest,
  cancelRequest,
  getMyRequests,
};
