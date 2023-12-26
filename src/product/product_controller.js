const { Op, Model } = require('sequelize');
const Product = require('../product/product_model');

const index = async(req,res)=>{
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const Products = await Product.findAll({
          limit: limitPerPage,
          offset: offset,
        });
      
        res.json(Products);
      } catch (error) {
        console.error("Error getting Products:", error);
        res.status(500).json({ error: "Error getting Products" });
      }
      
}

const store = async(req,res)=>{
    try {
        const { product_name } = req.body;
        const existingproduct = await Product.findOne({
            where: {
              product_name: product_name,
            },
          });
      
          if (existingproduct) {
            return res.json({ message: "Product name already exists", status: 0 });
          }
        await Product.create({
            product_name
        });
        return res.status(201).json({ message: 'Product added successfully', status: 1});
    } catch (error) {
        console.error("Error adding Product:", error);
    res.status(500).json({ error: "Error adding Product" });
    }
}

const show = async(req,res) =>{
try {
    const {id} = req.params;
    const product = await Product.findByPk(id);
    if (!product){
        return res.status(404).json({ error: "Product not found" });

    }
    res.json(product)
} catch (error) {
    res.status(500).json({ error: "Error showing Product by id" });
    
}
}

const update = async(req,res)=>{
    try {
        const { product_id, product_name } = req.body;
       const existingproduct = await Product.findOne({
        where: {
          product_name: product_name,
          product_id: { [Op.ne]: product_id },
        },  
      });
      if (existingproduct) {
        return res.json({ message: "Product name already exists", status: 0 });
      }
          const prod = await Product.findByPk(product_id);
          if (!prod) {
         return res.status(404).json({ error: "Product not found" });
     }   
     
        await prod.update({
            product_name,
        })
        return res.json({ message: "Product updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Product:", error);
    res.status(500).json({ error: "Error updating Product" });
    }
}

const deleted = async(req,res)=>{
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
          if (!product) {
         return res.status(404).json({ error: "Product not found" });
     }   
        await product.destroy();
        return res.json({ message: "Product deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Product:", error);
    res.status(500).json({ error: "Error deleting Product:" });
    }
}

module.exports ={
    index,
    store,
    show,   
    update,
    deleted
}