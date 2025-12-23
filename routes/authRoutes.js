const express = require("express");
const router = express.Router();

// Auth controllers
const {
  register,
  login,
  logout,
  getMe,
  updateTheme,
} = require("../controllers/authController");

// User approval controllers (SuperAdmin)
const {
  getPendingUsers,
  approveUser,
} = require("../controllers/userController");

// Middleware
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

/* =========================
   PUBLIC ROUTES
   ========================= */

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Logout user
router.post("/logout", protect, logout);

/* =========================
   PRIVATE ROUTES (Logged-in users)
   ========================= */

// Get current logged-in user
router.get("/me", protect, getMe);

// Update user theme
router.put("/theme", protect, updateTheme);

/* =========================
   SUPER ADMIN ROUTES
   ========================= */

// Get all pending (not approved) users
router.get(
  "/pending",
  protect,
  authorize("SuperAdmin"),
  getPendingUsers
);

// Approve a user
router.post(
  "/approve",
  protect,
  authorize("SuperAdmin"),
  approveUser
);

module.exports = router;
