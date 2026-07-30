const express = require("express");
const router = express.Router();
const {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
  getMyFoods,
} = require("../controllers/foodController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getFoods);
router.get("/my/listings", protect, authorize("donor"), getMyFoods);
router.get("/:id", getFoodById);
router.post("/", protect, authorize("donor"), upload.single("photo"), createFood);
router.put("/:id", protect, authorize("donor"), upload.single("photo"), updateFood);
router.delete("/:id", protect, authorize("donor"), deleteFood);

module.exports = router;
