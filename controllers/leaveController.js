const Leave = require('../models/Leave');

// @desc    Apply for Leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const leave = await Leave.create(req.body);

        res.status(201).json({
            success: true,
            data: leave
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Leaves (Self or All for Admin)
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'Admin' || req.user.role === 'SuperAdmin') {
            query = Leave.find().populate('user', 'name email');
        } else {
            query = Leave.find({ user: req.user.id });
        }

        const leaves = await query;

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update Leave Status (Admin/Manager)
// @route   PUT /api/leaves/:id
// @access  Private (Admin only)
exports.updateLeaveStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ success: false, error: 'Leave application not found' });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({
            success: true,
            data: leave
        });
    } catch (err) {
        next(err);
    }
};
