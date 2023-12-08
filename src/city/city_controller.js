
const { Op } = require("sequelize");
const City = require("./city_model")

const index = async(req,res)=>{
    try{
        const cities = await City.findAll();
        res.json(cities);
    }catch(error){
        console.log(error);
    }
}
const store = async(req,res)=>{
    try {
        const { city_name } = req.body;
        const existingCity = await City.findOne({
            where: {
              city_name: city_name,
            },
          });
      
          if (existingCity) {
            return res.json({ message: "City name already exists", status: 0 });
          }
        await City.create({
            city_name
        });
        return res.status(201).json({ message: 'City added successfully', status: 1});
    } catch (error) {
        console.error("Error adding city:", error);
    res.status(500).json({ error: "Error adding city" });
    }
}   
const show = async(req,res)=>{
    try {
        const { id } = req.params;
        const city = await City.findByPk(id);
        if (!city) {
          return res.status(404).json({ error: "City not found" });
        }
        res.json(city);
    } catch (error) {
        console.error("Error showing city by id:", error);
    res.status(500).json({ error: "Error showing city by id" });
    }
} 
const updated = async(req,res)=>{
    try {
        const { city_id, city_name } = req.body;
       const existingCity = await City.findOne({
        where: {
          city_name: city_name,
          city_id: { [Op.ne]: city_id },
        },  
      });
      if (existingCity) {
        return res.json({ message: "City name already exists", status: 0 });
      }
          const city = await City.findByPk(city_id);
          if (!city) {
         return res.status(404).json({ error: "City not found" });
     }   
     
        await city.update({
            city_name,
        })
        return res.json({ message: "City updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating city:", error);
    res.status(500).json({ error: "Error updating city" });
    }
} 
const deleted = async(req,res)=>{
    try {
        const { id } = req.body;
        const city = await City.findByPk(id);
          if (!city) {
         return res.status(404).json({ error: "City not found" });
     }   
        await city.destroy();
        return res.json({ message: "City deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting city:", error);
    res.status(500).json({ error: "Error deleting city:" });
    }
} 
module.exports={
    index,
    store,
    show,
    updated,
    deleted
};