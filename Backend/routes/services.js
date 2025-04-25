const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

const {
  getService,
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/services");


// Protect is used to check if the user is logged in
// authorize checks if the user has the required role
router.get("/:id", getService);
router.get("/", getServices);
router.post("/", protect, authorize("admin", "user"), createService); // from shops first
router.put("/:id", protect, authorize("admin", "user"), updateService);
router.delete("/:id", protect, authorize("admin", "user"), deleteService);

module.exports = router;
