const express = require("express");
const router = express.Router();
const {
  getDashboard,
  listRestaurants,
  listNgos,
  verifyRestaurant,
  verifyNgo,
  deactivateUser,
  getLiveDonations,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/restaurants", listRestaurants);
router.get("/ngos", listNgos);
router.get("/live-donations", getLiveDonations);
router.put("/restaurants/:id/verify", verifyRestaurant);
router.put("/ngos/:id/verify", verifyNgo);
router.delete("/users/:id", deactivateUser);

module.exports = router;
