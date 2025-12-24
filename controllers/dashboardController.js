const Attendance = require("../models/Attendance");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await Attendance.find({
      date: { $gte: today },
    });

    const completed = records.filter(r => r.checkOutTime).length;
    const active = records.filter(r => r.checkInTime && !r.checkOutTime).length;

    res.json({
      completed,
      active,
      hours: "0h 0m",
      productivity: completed ? Math.min(100, completed * 10) : 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Dashboard stats error" });
  }
};