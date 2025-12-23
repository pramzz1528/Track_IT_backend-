const express = require('express');
const { checkIn, checkOut, getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/checkin', checkIn);
router.put('/checkout', checkOut);
router.get('/', getAttendance);

module.exports = router;
