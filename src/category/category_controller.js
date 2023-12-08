const { Op } = require('sequelize');
const Category = require('../category/category_model');

const index = async(req,res) =>{
try{
const Categories = await Category.findAll();
res.json(Categories)
}catch(e){
    console.error("Error getting Category:", error);
    res.status(500).json({ error: "Error getting Category" });
}
}

const store = async(req,res)=>{
    try {
        const { category_name } = req.body;
        const existingCity = await Category.findOne({
            where: {
              category_name: category_name,
            },
          });
      
          if (existingCity) {
            return res.json({ message: "Category name already exists", status: 0 });
          }
        await Category.create({
            category_name
        });
        return res.status(201).json({ message: 'Category added successfully', status: 1});
    } catch (error) {
        console.error("Error adding Category:", error);
    res.status(500).json({ error: "Error adding Category" });
    }
}

const show = async(req,res) =>{
try {
    const {id} = req.params;
    const category = await Category.findByPk(id);
    if (!Category){
        return res.status(404).json({ error: "Category not found" });

    }
    res.json(category)
} catch (error) {
    res.status(500).json({ error: "Error showing category by id" });
    
}
}

const update = async(req,res)=>{
    try {
        const { category_id, category_name } = req.body;
       const existingcategory = await Category.findOne({
        where: {
          category_name: category_name,
          category_id: { [Op.ne]: category_id },
        },  
      });
      if (existingcategory) {
        return res.json({ message: "Category name already exists", status: 0 });
      }
          const cat = await Category.findByPk(category_id);
          if (!cat) {
         return res.status(404).json({ error: "Category not found" });
     }   
     
        await cat.update({
            category_name,
        })
        return res.json({ message: "Category updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Category:", error);
    res.status(500).json({ error: "Error updating Category" });
    }
}

const deleted = async(req,res)=>{
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
          if (!category) {
         return res.status(404).json({ error: "Category not found" });
     }   
        await category.destroy();
        return res.json({ message: "Category deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Category:", error);
    res.status(500).json({ error: "Error deleting Category:" });
    }
}

module.exports ={
    index,
    store,
    show,
    update,
    deleted
}