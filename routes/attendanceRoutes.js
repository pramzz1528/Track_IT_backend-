
// const express = require("express");
// const router = express.Router();
// const { protect, authorize } = require("../middleware/authMiddleware");
// const Attendance = require("../models/Attendance");

// // GET ALL ATTENDANCE (HR / ADMIN)
// router.get(
//   "/",
//   protect,
//   authorize("superadmin", "hr", "manager"),
//   async (req, res) => {
//     try {
//       const records = await Attendance.find()
//         .populate("user", "name email role")
//         .sort({ date: -1 });

//       res.json(records);
//     } catch (err) {
//       res.status(500).json({ message: "Attendance fetch failed" });
//     }
//   }
// );

// module.exports = router;











const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/checkin", protect, (req, res) => {
  res.json({ message: "Check-in recorded" });
});

router.post("/checkout", protect, (req, res) => {
  res.json({ message: "Check-out recorded" });
});

module.exports = router;