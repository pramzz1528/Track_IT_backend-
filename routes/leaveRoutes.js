const express = require('express');
const { applyLeave, getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(applyLeave)
    .get(getLeaves);

router
    .route('/:id')
    .put(authorize('Admin', 'SuperAdmin'), updateLeaveStatus);

module.exports = router;
