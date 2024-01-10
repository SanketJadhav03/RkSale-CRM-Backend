const { Op, Model } = require("sequelize");
const sequelize = require("../db/db_config");
const Task = require("../task/task_model");
const Leads = require("../leads/leads_model");
const Customer = require("../customer/customer_model");
const Attendance = require("../attendance/attendance_model");

const index = async (req, res) => {
  try {
    // Fetch counts using Sequelize's aggregation functions
    const taskCount = await Task.count();
    const leadCount = await Leads.count();
    const customerCount = await Customer.count();
    const attendanceCount = await Attendance.count();

    // Send the counts as a response
    res.json({
      taskCount,
      leadCount,
      customerCount,
      attendanceCount,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};

module.exports = {
  index,
};
