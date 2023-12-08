
const { Op } = require("sequelize");
const Branch = require("./branch_model")

const index = async(req,res)=>{
    try{
        const branchstatus = await Branch.findAll();
        res.json(branchstatus);
    }catch(error){
        console.log(error);
    }
}
const store = async(req,res)=>{
    try {
        const { branch_name } = req.body;
        const existingBranch = await Branch.findOne({
            where: {
              branch_name: branch_name,
            },
          });
      
          if (existingBranch) {
            return res.json({ message: "Branch name already exists", status: 0 });
          }
        await Branch.create({
            branch_name
        });
        return res.status(201).json({ message: 'Branch added successfully', status: 1});
    } catch (error) {
        console.error("Error adding branch:", error);
    res.status(500).json({ error: "Error adding branch" });
    }
}   
const show = async(req,res)=>{
    try {
        const { id } = req.params;
        const branch = await Branch.findByPk(id);
        if (!branch) {
          return res.status(404).json({ error: "Branch not found" });
        }
        res.json(branch);
    } catch (error) {
        console.error("Error showing branch by id:", error);
    res.status(500).json({ error: "Error showing branch by id" });
    }
} 
const updated = async(req,res)=>{
    try {
        const { branch_id, branch_name } = req.body;
       const existingBranch = await Branch.findOne({
        where: {
          branch_name: branch_name,
          branch_id: { [Op.ne]: branch_id },
        },  
      });
      if (existingBranch) {
        return res.json({ message: "Branch name already exists", status: 0 });
      }
          const branch = await Branch.findByPk(branch_id);
          if (!branch) {
         return res.status(404).json({ error: "Branch not found" });
     }   
     
        await branch.update({
            branch_name,
        })
        return res.json({ message: "Branch updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating branch:", error);
    res.status(500).json({ error: "Error updating branch" });
    }
} 
const deleted = async(req,res)=>{
    try {
        const { id } = req.params;
        const branch = await Branch.findByPk(id);
          if (!branch) {
         return res.status(404).json({ error: "Branch not found" });
     }   
        await branch.destroy();
        return res.json({ message: "Branch deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting branch:", error);
    res.status(500).json({ error: "Error deleting branch:" });
    }
} 
module.exports={
    index,
    store,
    show,
    updated,
    deleted
};