const { Op } = require('sequelize');
const Point = require('./point_model')

const index = async()=>{
console.log("hello");
}

const store = async(req,res)=>{
try {
    const {point_type,point_name} = req.body;
const point = Point.create({
point_type,
point_name
})

if (point){
    res.json({msg:"point Created Successfully !!"})

}else {
    res.json({msg:"failed to Create point !!"})
}
} catch (error) {
    console.log(error);
}
}

const show = async(req,res) =>{
    try {
        const {id} = req.params;
        const point = await Point.findByPk(id);
        if (!point){
            return res.status(404).json({ error: "Point not found" });
    
        }
        res.json(point)
    } catch (error) {
        res.status(500).json({ error: "Error showing Point by id" });
        
    }
}

const update = async(req,res)=>{
    try {
        const { point_id, point_name,point_type } = req.body;
       const existingpoint = await Point.findOne({
        where: {
          point_name: point_name,
          point_id: { [Op.ne]: point_id },
        },  
      });
      if (existingpoint) {
        return res.json({ message: "Point name already exists", status: 0 });
      }
          const point = await Point.findByPk(point_id);
          if (!point) {
         return res.status(404).json({ error: "Point not found" });
     }   
     
        await point.update({
            point_type,
            point_name,
        })
        return res.json({ message: "Point updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Point:", error);
    res.status(500).json({ error: "Error updating Point" });
    }
}

const deleted = async(req,res) =>{
    try {
        const { id } = req.params;
        const point = await Point.findByPk(id);
          if (!point) {
         return res.status(404).json({ error: "Point not found" });
     }   
        await point.destroy();
        return res.json({ message: "Point deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Point:", error);
    res.status(500).json({ error: "Error deleting Point:" });
    }
}

module.exports = {
    index,
    store,
    update,
    show,
    deleted
}