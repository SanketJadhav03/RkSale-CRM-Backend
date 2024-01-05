const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const Leads = require("../leads/leads_model");
const ShiftLeadTask = require("./shiftleadtask_model");

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
    const findLeadbyId = await Leads.findByPk(slt_lead_id);
    if (!findLeadbyId) {
      res.json({ message: "Lead not found!", status: 0 });
    }

    let parsedTempEmployee;
    try {
      parsedTempEmployee = JSON.parse(temp_employee);
    } catch (error) {
      console.error("Error parsing temp_employee:", error);
      return res.json({ error: "Invalid temp_employee format" });
    }

    const index = parsedTempEmployee.indexOf(slt_send_by);
    if (index !== -1) {
      parsedTempEmployee[index] = slt_send_to;
    }

    const updateLead = await findLeadbyId.update({
      assigned_by: `[${parsedTempEmployee}]`,
    });

    await ShiftLeadTask.create({
      slt_send_to,
      slt_send_by,
      slt_lead_id,
      slt_reason,
      slt_task_id,
    });
    if (updateLead) {
      return res.json({ message: "Lead shifted succefully!", status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To trasfer data" });
  }
};

const index = async (req, res) => {
  try {
    const { leadOrTask,slt_send_by } = req.body;

    let query = `SELECT tbl_slts.createdAt as created_date,tbl_leads.*,tbl_lead_statuses.*,tbl_sources.*,tbl_slts.*,tbl_customers.*,tbl_cities.*,tbl_customer_groups.*,tbl_references.*,tbl_products.*
    FROM tbl_slts
    `;
    if (leadOrTask === 0) {
      query += `INNER JOIN tbl_leads ON tbl_slts.slt_lead_id = tbl_leads.lead_id 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
      WHERE tbl_slts.slt_send_by= ${slt_send_by};`;
    } else {
      query += `INNER JOIN tbl_tasks ON tbl_slts.slt_task_id = tbl_tasks.task_id WHERE tbl_slts.slt_task_id IS NOT NULL;`;
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
module.exports = {
  transferLead,
  index,
};
