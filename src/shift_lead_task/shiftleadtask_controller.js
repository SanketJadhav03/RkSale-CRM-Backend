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
    })
    if (updateLead) {
      return res.json({ message: "Lead shifted succefully!", status: 1 });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To trasfer data" });
  }
};
module.exports = {
  transferLead,
};
