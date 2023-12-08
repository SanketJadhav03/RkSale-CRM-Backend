const Reference = require('./reference_model');
const { Op, Model } = require('sequelize');

const index = async(req,res)=>{
    try{
        const reference = await Reference.findAll();
        res.json(reference)
        }catch(e){
            console.error("Error getting Reference:", error);
            res.status(500).json({ error: "Error getting Reference" });
        }
}


const store = async(req,res)=>{
    try {
        const { reference_name } = req.body;
        const exisitngReference = await Reference.findOne({
            where: {
              reference_name: reference_name,
            },
          });
      
          if (exisitngReference) {
            return res.json({ message: "Reference name already exists", status: 0 });
          }
        await Reference.create({
            reference_name
        });
        return res.status(201).json({ message: 'Reference added successfully', status: 1});
    } catch (error) {
        console.error("Error adding Reference:", error);
    res.status(500).json({ error: "Error adding Reference" });
    }
}

const show = async(req,res) =>{
    try {
        const {id} = req.params;
        const reference = await Reference.findByPk(id);
        if (!reference){
            return res.status(404).json({ error: "Reference not found" });
    
        }
        res.json(reference)
    } catch (error) {
        res.status(500).json({ error: "Error showing Reference by id" });
        
    }
    }


    const update = async(req,res)=>{
        try {
            const { reference_id, reference_name } = req.body;
           const existingreference = await Reference.findOne({
            where: {
              reference_name: reference_name,
              reference_id: { [Op.ne]: reference_id },
            },  
          });
          if (existingreference) {
            return res.json({ message: "reference name already exists", status: 0 });
          }
              const ref = await Reference.findByPk(reference_id);
              if (!ref) {
             return res.status(404).json({ error: "reference not found" });
         }   
         
            await ref.update({
                reference_name,
            })
            return res.json({ message: "Reference updated successfully!", status: 1 });
        } catch (error) {
            console.error("Error updating Reference:", error);
        res.status(500).json({ error: "Error updating Reference" });
        }
    }

    const deleted = async(req,res)=>{
        try {
            const { id } = req.params;
            const reference = await Reference.findByPk(id);
              if (!reference) {
             return res.status(404).json({ error: "reference not found" });
         }   
            await reference.destroy();
            return res.json({ message: "Reference deleted successfully!", status: 1 });
        } catch (error) {
            console.error("Error deleting Reference:", error);
        res.status(500).json({ error: "Error deleting Reference:" });
        }
    }
    
module.exports = {
    index,
    store,
    show,
    update,
    deleted

}