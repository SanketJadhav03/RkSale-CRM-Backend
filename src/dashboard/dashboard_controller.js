const { Op, Model } = require("sequelize");
const sequelize = require("../db/db_config");
const Task = require("../task/task_model");
const Leads = require("../leads/leads_model");
const Customer = require("../customer/customer_model");
const Attendance = require("../attendance/attendance_model");

const index = async (req, res) => {
  try {
    // Extract start and end dates from the request
    const startDate = req.body.start_date; // Change this based on your request structure
    const endDate = req.body.end_date;     // Change this based on your request structure

    // Fetch counts using Sequelize's aggregation functions
    // const taskCount = await Task.count();
    // const leadCount = await Leads.count();
    // Fetch counts using Sequelize's aggregation functions
    const taskCount = await Task.count({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')],
        },
      },
    });

    const leadCount = await Leads.count({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')],
        },
      },
    });

    const customerCount = await Customer.count({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')],
        },
      },
    });

    const attendanceCount = await Attendance.count({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')],
        },
      },
    });
    // Define lead status values
    const leadStatusValues = [1, 2, 3, 4, 5];
    // Count leads for each status value
    // Count leads for each status value within the specified date range
    const leadStatusCounts = {};
    for (const status of leadStatusValues) {
      leadStatusCounts[`leadStatus${status}`] = await Leads.count({
        where: {
          status,
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')], // Include the full end day
          },
        },
      });
    }
    // Count leads for each status value
    const taskStatusCounts = {};
    for (const status of leadStatusValues) {
      taskStatusCounts[`taskStatus${status}`] = await Task.count({
        where: {
          status,
          createdAt: {
            [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59.999Z')], // Include the full end day
          },

        }
      });
    }

    // const customerCount = await Customer.count();
    // const attendanceCount = await Attendance.count();

    // Send the counts as a response
    res.json({
      leadStatusCounts,
      taskStatusCounts,
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
