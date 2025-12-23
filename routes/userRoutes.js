// const express = require("express");
// const router = express.Router();

// const {
//   getPendingUsers,
//   approveUser
// } = require("../controllers/userController");

// const { protect, authorize } = require("../middleware/authMiddleware");

// router.get(
//   "/pending",
//   protect,
//   authorize("superadmin", "hr", "manager", "dm"),
//   getPendingUsers
// );

// router.post(
//   "/approve",
//   protect,
//   authorize("superadmin", "hr", "manager", "dm"),
//   approveUser
// );



// module.exports = router;



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