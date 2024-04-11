const { Op, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/db_config");
const Task = require("../task/task_model");
const Leads = require("../leads/leads_model");
const Customer = require("../customer/customer_model");
const Attendance = require("../attendance/attendance_model");

const index = async (req, res) => {
  try {
    const userId = req.body.user_id; // Change this based on your request structure


    // Count tasks for the specified user within the date range
    const taskCount = await Task.count({
      where: {
        [Op.and]: [

          userId > 0
            ? Sequelize.literal(`FIND_IN_SET(${userId}, REPLACE(REPLACE(assigned_by, '[', ''), ']', '')) > 0`)
            : {},

        ],
      },
    });




    // Count leads for the specified user within the date range
    const leadCount = await Leads.count({
      where: {
        [Op.and]: [

          userId > 0
            ? Sequelize.literal(`FIND_IN_SET(${userId}, REPLACE(REPLACE(assigned_by, '[', ''), ']', '')) > 0`)
            : {},

        ],
      },
    });

    // Count customers for the specified user within the date range
    const customerCount = await Customer.count({

    });

    // Count attendance for the specified user within the date range
    const attendanceCount = await Attendance.count({
      where: {
        [Op.and]: [
          userId > 0
            ? { user_id: userId }
            : {},

        ],
      },
    });

    // Count leads for each status value for the specified user

    const leadStatusValues = [1, 2, 3, 4, 5];
    const leadStatusCounts = {};
    for (const status of leadStatusValues) {
      leadStatusCounts[`leadStatus${status}`] = await Leads.count({
        where: {
          [Op.and]: [
            userId > 0
              ? Sequelize.literal(`FIND_IN_SET(${userId}, REPLACE(REPLACE(assigned_by, '[', ''), ']', '')) > 0`)
              : {},
            {
              status,

            },
          ],
        },
      });
    }

    // Count tasks for each status value for the specified user
    const taskStatusCounts = {};
    for (const status of leadStatusValues) {
      taskStatusCounts[`taskStatus${status}`] = await Task.count({
        where: {
          [Op.and]: [
            userId > 0
              ? Sequelize.literal(`FIND_IN_SET(${userId}, REPLACE(REPLACE(assigned_by, '[', ''), ']', '')) > 0`)
              : {},
            {
              status,

            },
          ],
        },
      });
    }

    res.json({
      leadStatusCounts,
      taskStatusCounts,
      taskCount,
      leadCount,
      customerCount,
      attendanceCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};


module.exports = {
  index
};
