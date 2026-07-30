const Notification = require("../models/Notification");

// io is attached to the app in server.js (app.set("io", io))
const notify = async (req, { receiver, title, message, type, relatedFood, relatedRequest }) => {
  const notification = await Notification.create({
    receiver,
    title,
    message,
    type,
    relatedFood,
    relatedRequest,
  });

  const io = req.app.get("io");
  if (io) {
    io.to(receiver.toString()).emit("notification", notification);
  }

  return notification;
};

module.exports = notify;
