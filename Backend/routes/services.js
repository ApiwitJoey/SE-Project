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
const { targetAreas, massageTypes } = require("../models/ServiceType");


// Protect is used to check if the user is logged in
// authorize checks if the user has the required role
router.get("/:id", getService);
router.get("/", getServices);
router.post(
  "/", [
    protect,
    authorize("admin", "user"),
    check("targetArea")
      .isIn(targetAreas)
      .withMessage(`Target area must be one of: ${targetAreas.join(", ")}`),
    check("massageType")
      .isIn(massageTypes)
      .withMessage(`Massage type must be one of: ${massageTypes.join(", ")}`),
  ], 
  createService); // from shops first
router.put(
  "/:id", 
  [
  protect,
  authorize("admin", "user"),
  check("targetArea")
    .optional() // ไม่บังคับกรอก แต่ถ้ากรอกต้องถูกต้อง
    .isIn(targetAreas)
    .withMessage(`Target area must be one of: ${targetAreas.join(", ")}`),
  check("massageType")
    .optional() // ไม่บังคับกรอก แต่ถ้ากรอกต้องถูกต้อง
    .isIn(massageTypes)
    .withMessage(`Massage type must be one of: ${massageTypes.join(", ")}`),
  ],
  updateService);
router.delete("/:id", protect, authorize("admin", "user"), deleteService);

module.exports = router;
