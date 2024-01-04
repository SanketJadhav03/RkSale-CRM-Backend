const Leads = require("../leads/leads_model");
const Shift = require("./shiftleadtask_model");

const transferLead = async (req, res) => {
  try {
    const { slt_send_to, slt_send_by, slt_lead_id, slt_reason, slt_task_id } =
      req.body;
    const findLeadbyId = await Leads.findByPk(slt_lead_id);
    if (!findLeadbyId) {
      res.json({ message: "Lead not found!", status: 0 });
    }

    // const updateLead = await findLeadbyId.update({
    //     assigned_by:slt_send_to
    // })

    res.json({ data: req.body, lead: findLeadbyId });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To trasfer data" });
  }
};
module.exports = {
  transferLead,
};
