// const Attendance = require('../models/Attendance');

// // @desc    Check In
// // @route   POST /api/attendance/checkin
// // @access  Private
// exports.checkIn = async (req, res, next) => {
//     try {
//         let userId = req.user.id;

//         // Allow Admin/SuperAdmin to check in for others
//         if ((req.user.role === 'Admin' || req.user.role === 'SuperAdmin') && req.body.userId) {
//             userId = req.body.userId;
//         }

//         // Check if already checked in today
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);

//         const existingAttendance = await Attendance.findOne({
//             user: userId,
//             date: { $gte: startOfDay }
//         });

//         if (existingAttendance) {
//             return res.status(400).json({ success: false, error: 'Already checked in today' });
//         }

//         const attendance = await Attendance.create({
//             user: userId,
//             checkInTime: Date.now(),
//             status: 'Present'
//         });

//         res.status(201).json({
//             success: true,
//             data: attendance
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// // @desc    Check Out
// // @route   PUT /api/attendance/checkout
// // @access  Private
// exports.checkOut = async (req, res, next) => {
//     try {
//         const startOfDay = new Date();
//         startOfDay.setHours(0, 0, 0, 0);

//         const attendance = await Attendance.findOne({
//             user: req.user.id,
//             date: { $gte: startOfDay }
//         });

//         if (!attendance) {
//             return res.status(400).json({ success: false, error: 'You have not checked in today' });
//         }

//         if (attendance.checkOutTime) {
//             return res.status(400).json({ success: false, error: 'Already checked out today' });
//         }

//         const checkOutTime = Date.now();
//         const checkInTime = new Date(attendance.checkInTime);
//         const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // hours

//         attendance.checkOutTime = checkOutTime;
//         attendance.workHours = workHours.toFixed(2);

//         await attendance.save();

//         res.status(200).json({
//             success: true,
//             data: attendance
//         });
//     } catch (err) {
//         next(err);
//     }
// };

// // @desc    Get attendance history (self or all if Admin)
// // @route   GET /api/attendance
// // @access  Private
// exports.getAttendance = async (req, res, next) => {
//     try {
//         let query;

//         if (req.user.role === 'Admin' || req.user.role === 'SuperAdmin') {
//             query = Attendance.find().populate('user', 'name email');
//         } else {
//             query = Attendance.find({ user: req.user.id });
//         }

//         const attendance = await query;

//         res.status(200).json({
//             success: true,
//             count: attendance.length,
//             data: attendance
//         });
//     } catch (err) {
//         next(err);
//     }
// };









const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkInTime: {
      type: Date,
    },

    checkOutTime: {
      type: Date,
    },

    breakMinutes: {
      type: Number,
      default: 0,
    },

    onBreak: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);