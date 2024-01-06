const FollowUp = require("./follow_up_model");

const addFollowUp = async (req,res) => {
  try {
    res.json(await FollowUp.findAll())
  } catch (error) {
    console.log("Error creating follow up!");
    return resizeBy.json({error:"Error creating followup"});
  }
};

module.exports = {
  addFollowUp,
};
