const FollowUp = require("./follow_up_model");
const index = async (req, res) => {
  try {
    await FollowUp.findAll();
  } catch (error) {}
};
const addFollowUp = async (req, res) => {
  try {
    const {
      follow_up_description,
      follow_up_lead_id,
      follow_up_send_by,
      follow_up_task_id,
    } = req.body;
    const insertData = await FollowUp.create({
      follow_up_description,
      follow_up_lead_id,
      follow_up_send_by,
      follow_up_task_id,
    });
    if (insertData) {
      return res.json({ message: "Follow Up added Successfully!", status: 1 });
    } else {
      return res.json({ message: "Something went wrong!", status: 0 });
    }
  } catch (error) {
    console.log("Error creating follow up!");
    return resizeBy.json({ error: "Error creating followup" });
  }
};

module.exports = {
  addFollowUp,
  index,
};
