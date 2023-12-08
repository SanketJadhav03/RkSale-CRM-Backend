
const { Op } = require("sequelize");
const LeadStatus = require("./lead_model")

const index = async(req,res)=>{
    try{
        const leadstatus = await LeadStatus.findAll();
        res.json(leadstatus);
    }catch(error){
        console.log(error);
    }
}
const store = async(req,res)=>{
    try {
        const { lead_name } = req.body;
        const existingLeadStatus = await LeadStatus.findOne({
            where: {
              lead_name: lead_name,
            },
          });
      
          if (existingLeadStatus) {
            return res.json({ message: "LeadStatus name already exists", status: 0 });
          }
        await LeadStatus.create({
            lead_name
        });
        return res.status(201).json({ message: 'LeadStatus added successfully', status: 1});
    } catch (error) {
        console.error("Error adding leadStatus:", error);
    res.status(500).json({ error: "Error adding leadStatus" });
    }
}   
const show = async(req,res)=>{
    try {
        const { id } = req.params;
        const leadStatus = await LeadStatus.findByPk(id);
        if (!leadStatus) {
          return res.status(404).json({ error: "LeadStatus not found" });
        }
        res.json(leadStatus);
    } catch (error) {
        console.error("Error showing leadStatus by id:", error);
    res.status(500).json({ error: "Error showing leadStatus by id" });
    }
} 
const updated = async(req,res)=>{
    try {
        const { lead_id, lead_name } = req.body;
       const existingLeadStatus = await LeadStatus.findOne({
        where: {
          lead_name: lead_name,
          lead_id: { [Op.ne]: lead_id },
        },  
      });
      if (existingLeadStatus) {
        return res.json({ message: "LeadStatus name already exists", status: 0 });
      }
          const leadStatus = await LeadStatus.findByPk(lead_id);
          if (!leadStatus) {
         return res.status(404).json({ error: "LeadStatus not found" });
     }   
     
        await leadStatus.update({
            lead_name,
        })
        return res.json({ message: "LeadStatus updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating leadStatus:", error);
    res.status(500).json({ error: "Error updating leadStatus" });
    }
} 
const deleted = async(req,res)=>{
    try {
        const { id } = req.params;
        const leadStatus = await LeadStatus.findByPk(id);
          if (!leadStatus) {
         return res.status(404).json({ error: "LeadStatus not found" });
     }   
        await leadStatus.destroy();
        return res.json({ message: "LeadStatus deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting leadStatus:", error);
    res.status(500).json({ error: "Error deleting leadStatus:" });
    }
} 
module.exports={
    index,
    store,
    show,
    updated,
    deleted
};