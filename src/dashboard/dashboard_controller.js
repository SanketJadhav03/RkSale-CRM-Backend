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
const leave = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limitPerPage = 30;
    const offset = (page - 1) * limitPerPage;

    const { type, start_date, end_date, leave_status, user_id } = req.body;

    let sql = `
          SELECT 
          leaves.createdAt AS leaveCreatedAt,
              leaves.*,
              users_leave.*
          FROM tbl_leaves AS leaves
          INNER JOIN users AS users_leave ON leaves.leave_user_id = users_leave.uid
          WHERE 1=1`;

    const replacements = {};

    if (type > 0) {
      sql += ` AND leaves.leave_id = :Id`;
      replacements.Id = type;
    }

    if (leave_status > 0) {
      sql += ` AND leaves.leave_status = :leave_status`;
      replacements.leave_status = leave_status;
    }

    if (user_id) {
      sql += ` AND leaves.leave_user_id = :user_id`;
      replacements.user_id = user_id;
    }

    const user_leave = await sequelize.query(sql, {
      replacements: replacements,
      type: QueryTypes.SELECT,
    });

    // Fetching approved_by data
    const approved_by = await sequelize.query(
      `SELECT 
              leaves.*,
              users_approve.*
          FROM tbl_leaves AS leaves
          INNER JOIN users AS users_approve ON leaves.leave_approved_by = users_approve.uid
          LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit: limitPerPage, offset: offset },
        type: QueryTypes.SELECT,
      }
    );

    // Merging data based on leave_id using an INNER JOIN
    const mergedData = user_leave.map(leave => {
      const approvedByData = approved_by.find(approved => approved.leave_id === leave.leave_id);
      return { ...leave, approved_by: approvedByData };
    });

    // Handling the case where a join may return null for some columns
    const result = mergedData.map(row => {
      if (row.approved_by === null) {
        row.approved_by = {
          // Default values for joined data columns
          "leave_id": null,
          "leave_user_id": null,
          "leave_reason": null,
          "to_date": null,
          "from_date": null,
          "leave_approved_by": null,
          "leave_reject_reason": null,
          "leave_status": null,
          "createdAt": null,
          "updatedAt": null,
          "uid": null,
          "u_type": null,
          "name": null,
          "address": null,
          "user_role_id": null,
          "salary": null,
          "mobile_no": null,
          "emergency_contact": null,
          "profile_photo": null,
          "email": null,
          "password": null,
          "aadhar_no": null,
          "aadhar_photo": null,
          "pan_no": null,
          "pan_photo": null,
          "bank_passbook_photo": null,
          "date_of_joining": null,
          "last_experience": null,
          "last_working_company": null,
          "last_company_salary": null,
          "shift_id": null,
          "user_upi": null,
          "status": null
        };
      }
      return row;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to get leaves' });
  }
};

module.exports = {
  index, leave
};
