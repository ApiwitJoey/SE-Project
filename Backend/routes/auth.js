const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  updateMe,
  logout,
  banUser,
  unbanUser,
  forgotPassword,
  resetPassword,
  validateOtp
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/getme", protect, getMe);
router.put("/getme", protect, updateMe); 
router.put("/ban/:id", protect, authorize("admin"), banUser);
router.put("/unban/:id", protect, authorize("admin"), unbanUser);
router.get("/logout", logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/validate-otp/:resettoken',validateOtp)

module.exports = router;
