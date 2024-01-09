const express = require("express");
const router = express.Router();
const multer = require("multer");
const avatarConfig = require("../configs/avatar.config");
const uploadAvatar = multer({ storage: avatarConfig });
const {
  registerUser,
  getUser,
  loginUser,
  logoutProfile,
  acceptDefaultUser,
  editProfile,
  changePassword,
  deleteUser,
} = require("../controller/user.controller");

const { validateAdminToken } = require("../helper/jwt.helper");
const { forgotPassword } = require("../controller/email.controller");

// Register user
router.post("/register", uploadAvatar.single("avatar"), registerUser);

// Get user
router.get("/user", getUser);

// Edit password
router.put("/change-password", changePassword);

// Edit user
router.put("/profile", uploadAvatar.single("avatar"), editProfile);

// Login user
router.post("/login", loginUser);

// Logout user
router.post("/logout", logoutProfile);

// Accept default user
router.post("/acceptuser", validateAdminToken, acceptDefaultUser);

// Delete user
router.delete("/delete-user", validateAdminToken, deleteUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

module.exports = router;
