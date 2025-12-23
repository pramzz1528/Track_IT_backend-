// const User = require("../models/User"); // ✅ REQUIRED

// // GET /api/auth/pending
// exports.getPendingUsers = async (req, res) => {
//   try {
//     const users = await User.find({ isApproved: false });

//     return res.status(200).json({
//       success: true,
//       count: users.length,
//       users,
//     });
//   } catch (error) {
//     console.error("Pending users error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch pending users",
//     });
//   }
// };

// // POST /api/auth/approve
// exports.approveUser = async (req, res) => {
//   try {
//     const { userId, role } = req.body;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "userId is required",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.isApproved = true;
//     user.role = role || "Employee";
//     user.approvedAt = new Date();

//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "User approved successfully",
//       user,
//     });
//   } catch (error) {
//     console.error("Approve error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to approve user",
//     });
//   }
// };








const User = require("../models/User");

// GET /api/users/pending
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Pending users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending users",
    });
  }
};

// POST /api/users/approve
exports.approveUser = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ FIX: normalize role to match enum
    const normalizedRole = (role || "employee").toLowerCase();

    user.isApproved = true;
    user.role = normalizedRole;
    user.approvedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
    });
  } catch (error) {
    console.error("Approve error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve user",
    });
  }





  const express = require("express");
const router = express.Router();

const {
  getPendingUsers,
  approveUser
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/pending",
  protect,
  authorize("superadmin", "hr", "manager", "dm"),
  getPendingUsers
);

router.post(
  "/approve",
  protect,
  authorize("superadmin", "hr", "manager", "dm"),
  approveUser
);

module.exports = router;
};