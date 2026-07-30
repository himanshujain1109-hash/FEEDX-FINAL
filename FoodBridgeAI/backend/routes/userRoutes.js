const express = require("express");
const router = express.Router();
const { updateProfile, getAnalytics } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.put("/profile", protect, upload.single("photo"), updateProfile);
router.get("/analytics", protect, getAnalytics);

module.exports = router;
