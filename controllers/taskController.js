const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        let query;

        // If admin, can see all tasks. If employee, can see assigned tasks
        if (req.user.role === 'Admin' || req.user.role === 'SuperAdmin') {
            query = Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name');
        } else {
            query = Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email').populate('createdBy', 'name');
        }

        const tasks = await query;

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email').populate('createdBy', 'name');

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }


        // Verify access logic (Admin or Assigned User)
        // Note: assignedTo is populated, so we access _id
        if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin' && task.assignedTo._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to access this task' });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin/Manager usually, allowing both for now)
exports.createTask = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Access check logic: Only Admin, SuperAdmin, or the Assigned User can update
        // We need to check if assignedTo is an ID (if not populated) or Object (if populated).
        // findById does NOT populate unless asked, so task.assignedTo is likely an ObjectId here.
        const assignedToId = task.assignedTo.toString();

        if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin' && assignedToId !== req.user.id) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
