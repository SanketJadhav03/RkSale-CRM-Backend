const addFollowUp = async (req,res) => {
  try {
    console.log("Hellow");
  } catch (error) {
    console.log("Error creating follow up!");
    return resizeBy.json({error:"Error creating followup"});
  }
};

module.exports = {
  addFollowUp,
};
