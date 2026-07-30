const express = require("express");
const router = express.Router();
const {
  createRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest,
  getMyRequests,
} = require("../controllers/requestController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", protect, getMyRequests);
router.post("/", protect, authorize("receiver"), createRequest);
router.put("/:id/accept", protect, authorize("donor"), acceptRequest);
router.put("/:id/reject", protect, authorize("donor"), rejectRequest);
router.put("/:id/complete", protect, authorize("receiver"), completeRequest);
router.put("/:id/cancel", protect, cancelRequest);

module.exports = router;
