
const { Op } = require("sequelize");
const Source = require("./source_model")

const index = async(req,res)=>{
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const sources = await Source.findAll({
          limit: limitPerPage,
          offset: offset,
        });
      
        res.json(sources);
      } catch (error) {
        console.error("Error getting sources:", error);
        res.status(500).json({ error: "Error getting sources" });
      }
      
}
const store = async(req,res)=>{
    try {
        const { source_name } = req.body;
        const existingSource = await Source.findOne({
            where: {
              source_name: source_name,
            },
          });
      
          if (existingSource) {
            return res.json({ message: "Source name already exists", status: 0 });
          }
        await Source.create({
            source_name
        });
        return res.status(201).json({ message: 'Source added successfully', status: 1});
    } catch (error) {
        console.error("Error adding sourceStatus:", error);
    res.status(500).json({ error: "Error adding sourceStatus" });
    }
}   
const show = async(req,res)=>{
    try {
        const { id } = req.params;
        const sourceStatus = await Source.findByPk(id);
        if (!sourceStatus) {
          return res.status(404).json({ error: "Source not found" });
        }
        res.json(sourceStatus);
    } catch (error) {
        console.error("Error showing sourceStatus by id:", error);
    res.status(500).json({ error: "Error showing sourceStatus by id" });
    }
} 
const updated = async(req,res)=>{
    try {
        const { source_id, source_name } = req.body;
       const existingSource = await Source.findOne({
        where: {
          source_name: source_name,
          source_id: { [Op.ne]: source_id },
        },  
      });
      if (existingSource) {
        return res.json({ message: "Source name already exists", status: 0 });
      }
          const sourceStatus = await Source.findByPk(source_id);
          if (!sourceStatus) {
         return res.status(404).json({ error: "Source not found" });
     }   
     
        await sourceStatus.update({
            source_name,
        })
        return res.json({ message: "Source updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating sourceStatus:", error);
    res.status(500).json({ error: "Error updating sourceStatus" });
    }
} 
const deleted = async(req,res)=>{
    try {
        const { id } = req.params;
        const sourceStatus = await Source.findByPk(id);
          if (!sourceStatus) {
         return res.status(404).json({ error: "Source not found" });
     }   
        await sourceStatus.destroy();
        return res.json({ message: "Source deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting sourceStatus:", error);
    res.status(500).json({ error: "Error deleting sourceStatus:" });
    }
} 
module.exports={
    index,
    store,
    show,
    updated,
    deleted
};