const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const Leads = require("../leads/leads_model");
const ShiftLeadTask = require("./shiftleadtask_model");
const Task = require("../task/task_model");
const Notifaction = require("../notification/notification_model");
const User = require("../Auth/User_model");

const transferLead = async (req, res) => {
  try {
    const {
      slt_send_to,
      slt_send_by,
      slt_lead_id,
      slt_reason,
      slt_task_id,
      temp_employee,
    } = req.body;

    let parsedTempEmployee;
    try {
      parsedTempEmployee = JSON.parse(temp_employee);
    } catch (error) {
      console.error("Error parsing temp_employee:", error);
      return res.json({ error: "Invalid temp_employee format" });
    }

    const index = parsedTempEmployee.indexOf(parseInt(slt_send_by));
    if (index !== -1) {
      parsedTempEmployee[index] = slt_send_to;
    }

    const shiftLeadtask = await ShiftLeadTask.create({
      slt_send_to,
      slt_send_by,
      slt_lead_id: slt_lead_id ? slt_lead_id : 0,
      slt_reason,
      slt_task_id: slt_task_id ? slt_task_id : 0,
    });
    if (!shiftLeadtask) {
      res.json({
        error: "Error creating shiftlead and task!"
      })
    }
    if (slt_lead_id == "") {
      const findTaskbyId = await Task.findByPk(slt_task_id);
      if (!findTaskbyId) {
        res.json({ message: "Task not found!", status: 0 });
      }

      const updateLead = await findTaskbyId.update({
        assigned_by: `[${parsedTempEmployee}]`,
      });
      const user = await User.findByPk(parseInt(slt_send_by));
      const notificationn = await Notifaction.findOne({
        where: {
          user_id: parseInt(slt_send_by)
        }
      })
      await notificationn.destroy();
      const user2 = await User.findByPk(slt_send_to);
      const admins = await User.findAll({
        where: {
          u_type: 1
        }
      })

      admins.forEach(async (admin) => {
        await Notifaction.create({
          user_id: admin.uid, // Assuming admin has an 'id' property
          assigned_data_id: slt_task_id,
          notification_type: 2,
          notification_description: `Task Shifted from ${user.name} to ${user2.name}`,
        });
      });

      await Notifaction.create({
        user_id: parseInt(slt_send_to),
        assigned_data_id: slt_task_id,
        notification_type: 3,
        notification_description: `Task Shifted from ${user.name} to ${user2.name}`,
      });
      if (updateLead) {
        return res.json({ message: "Task shifted succefully!", status: 1 });
      }
    } else {
      const findLeadbyId = await Leads.findByPk(slt_lead_id);
      if (!findLeadbyId) {
        res.json({ message: "Lead not found!", status: 0 });
      }

      const user = await User.findByPk(parseInt(slt_send_by));
      const notificationn = await Notifaction.findOne({
        where: {
          user_id: parseInt(slt_send_by)
        }
      })
      const user2 = await User.findByPk(slt_send_to);
      await notificationn.destroy();

      const admins = await User.findAll({
        where: {
          u_type: 1
        }
      })

      admins.forEach(async (admin) => {
        await Notifaction.create({
          user_id: admin.uid, // Assuming admin has an 'id' property
          assigned_data_id: slt_lead_id,
          notification_type: 2,
          notification_description: `Lead Shifted from ${user.name} to ${user2.name}`,
        });
      });

      await Notifaction.create({
        user_id: parseInt(slt_send_to),
        assigned_data_id: slt_lead_id,
        notification_type: 2,
        notification_description: ` Lead Shifted By ${user.name}`,
      });
      const updateLead = await findLeadbyId.update({
        assigned_by: `[${parsedTempEmployee}]`,
      });
      if (updateLead) {
        return res.json({ message: "Leads shifted succefully!", status: 1 });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Failed To trasfer data", error });
  }
};

const index = async (req, res) => {
  try {
    const { leadOrTask, slt_send_by, assigned_by } = req.body;
    let query = ``;
    if (leadOrTask == 0) {
      query += `
      SELECT tbl_slts.createdAt as created_date,tbl_leads.*,tbl_lead_statuses.*,tbl_sources.*,tbl_slts.*,tbl_customers.*,tbl_cities.*,tbl_customer_groups.*,tbl_references.*,tbl_products.*
    FROM tbl_slts
      INNER JOIN tbl_leads ON tbl_slts.slt_lead_id = tbl_leads.lead_id 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
      WHERE tbl_slts.slt_send_by= ${slt_send_by};`;
    } else {
      query += `
      SELECT tbl_slts.createdAt as created_date,tbl_tasks.*,tbl_slts.*,tbl_customers.*,tbl_products.*,tbl_references.*,tbl_lead_statuses.*,tbl_sources.*
    FROM tbl_slts
      INNER JOIN tbl_tasks ON tbl_slts.slt_task_id = tbl_tasks.task_id 
      INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
      INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
      INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
      INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
      WHERE tbl_slts.slt_send_by= ${slt_send_by};`;
    }
    if (assigned_by > 0) {
      sql += ` AND FIND_IN_SET(${assigned_by}, REPLACE(REPLACE(assigned_by, '[', ''), ']', ''))`;
      replacements.assigned_by = assigned_by;
    }
    const data = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      model: Leads, // Specify the model for Sequelize to map the result to
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get Shift data" });
  }
};

const getDetails = async (req, res) => {
  try {
    const { start_date, end_date, assigned_by } = req.body;
    let query1 = `SELECT slts.*,
    send_to_user.name AS send_to_name,
    send_by_user.name AS send_by_name
FROM tbl_slts AS slts
INNER JOIN users AS send_to_user ON slts.slt_send_to = send_to_user.uid
INNER JOIN users AS send_by_user ON slts.slt_send_by = send_by_user.uid
WHERE slts.slt_task_id = 0
AND slts.createdAt >= '${start_date}' AND slts.createdAt <= '${end_date}'`;
    if (assigned_by > 0) {
      query1 += ` AND (slts.slt_send_to = '${assigned_by}' OR slts.slt_send_by = '${assigned_by}')`;
    }

    query1 += ` LIMIT 10`;
    let query2 = `SELECT slts.*,
    send_to_user.name AS send_to_name,
    send_by_user.name AS send_by_name
FROM tbl_slts AS slts
INNER JOIN users AS send_to_user ON slts.slt_send_to = send_to_user.uid
INNER JOIN users AS send_by_user ON slts.slt_send_by = send_by_user.uid
WHERE slts.slt_lead_id = 0
AND slts.createdAt >= '${start_date}' AND slts.createdAt <= '${end_date}'`;

    if (assigned_by > 0) {
      query2 += ` AND (slts.slt_send_to = '${assigned_by}' OR slts.slt_send_by = '${assigned_by}')`;
    }

    query2 += ` LIMIT 10`;
    const LeadsData = await sequelize.query(query1, {
      type: QueryTypes.SELECT,
      model: Leads, // Specify the model for Sequelize to map the result to
    });
    const TaskData = await sequelize.query(query2, {
      type: QueryTypes.SELECT,
      model: Task, // Specify the model for Sequelize to map the result to
    });
    res.json({ leads: LeadsData, task: TaskData });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get Shift data" });
  }
};

module.exports = {
  transferLead,
  index,
  getDetails,
};
