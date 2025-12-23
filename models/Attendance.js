const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-day'],
        default: 'Absent'
    },
    workHours: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
