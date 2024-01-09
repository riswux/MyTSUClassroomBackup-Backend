const express = require("express");
const router = express.Router();
const {
  verifyEmail,
  viewResetPasswordPage,
  changePassword,
} = require("../controller/email.controller");

// Verify Email
router.get("/verify/:token", verifyEmail);

// Change password Email
// TODO : Create route for change passwords
router.get("/resetpassword", viewResetPasswordPage);
router.post("/resetpassword", changePassword);

module.exports = router;
