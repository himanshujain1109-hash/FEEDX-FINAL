const Request = require("../models/Request");
const Message = require("../models/Message");

// Confirms the logged-in user is either the donor or the receiver on this request,
// and returns the request plus which side the user is on.
const loadRequestForUser = async (req) => {
  const request = await Request.findById(req.params.id);
  if (!request) return { error: { status: 404, message: "Request not found" } };

  const isDonor = request.donorUser.toString() === req.user._id.toString();
  const isReceiver = request.receiverUser.toString() === req.user._id.toString();

  if (!isDonor && !isReceiver) {
    return { error: { status: 403, message: "Not part of this conversation" } };
  }

  return { request, viewerRole: isDonor ? "donor" : "receiver" };
};

// @desc    Get the chat history for a request (donor <-> receiver)
// @route   GET /api/requests/:id/messages
// @access  Private (donor or receiver on that request)
const getMessages = async (req, res, next) => {
  try {
    const { request, error } = await loadRequestForUser(req);
    if (error) return res.status(error.status).json({ success: false, message: error.message });

    const messages = await Message.find({ request: request._id })
      .sort({ createdAt: 1 })
      .populate("sender", "name role");

    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a chat message tied to a request
// @route   POST /api/requests/:id/messages
// @access  Private (donor or receiver on that request)
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }

    const { request, viewerRole, error } = await loadRequestForUser(req);
    if (error) return res.status(error.status).json({ success: false, message: error.message });

    const message = await Message.create({
      request: request._id,
      sender: req.user._id,
      senderRole: viewerRole,
      text: text.trim(),
    });

    const populated = await message.populate("sender", "name role");

    const io = req.app.get("io");
    if (io) {
      // Push to both participants so whichever side has the chat open updates instantly.
      io.to(request.donorUser.toString()).emit("chat_message", { requestId: request._id, message: populated });
      io.to(request.receiverUser.toString()).emit("chat_message", { requestId: request._id, message: populated });
    }

    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages, sendMessage };
