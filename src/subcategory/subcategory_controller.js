const SubCategory = require('./subcategory_model')
const Category = require('../category/category_model');
const { Sequelize, QueryTypes, Op } = require('sequelize');
const sequelize = require('../db/db_config');
const store = async (req, res) => {
    try {
        const { subcategory_name, category_id } = req.body;

        const newSubcategory = await SubCategory.create({
            subcategory_name,
            category_id
        })

        res.status(200).json(newSubcategory)
    }
    catch (e) {
        console.log(e);
    }


}

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const result = await sequelize.query(
          'SELECT * FROM tbl_subcategories INNER JOIN tbl_categories ON tbl_subcategories.category_id = tbl_categories.category_id LIMIT :limit OFFSET :offset',
          {
            type: QueryTypes.SELECT,
            model: SubCategory, // Specify the model for Sequelize to map the result to
            replacements: { limit: limitPerPage, offset: offset },
          }
        );
      
        res.json(result);
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Error retrieving data' });
      }
      
};

const show = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sequelize.query(
            `SELECT * FROM tbl_subcategories 
             INNER JOIN tbl_categories ON tbl_subcategories.category_id = tbl_categories.category_id
             WHERE tbl_subcategories.subcategory_id = :id`,
            {
                replacements: { id },
                type: QueryTypes.SELECT,
            }
        );

        res.json(result)
    } catch (error) {
        console.log(error);
    }
}

const update = async (req, res) => {
    try {
        const { subcategory_name, category_id, subcategory_id } = req.body;
        console.log(subcategory_id);
        const existingSubcategory = await SubCategory.findOne({
            where: {
                subcategory_id: { [Op.ne]: subcategory_id },
            },
        });
        if (!existingSubcategory) {
            return res.json({ message: "Subcategory Not Found !" })
        } else {
            await existingSubcategory.update({
                subcategory_name,
                category_id,
                subcategory_id

            })
        }
        return res.json({ message: "Subcategory updated successfully!", status: 1 });
    } catch (error) {
        console.log(error);
    }
}

const deleted = async(req,res) =>{
    try {
        const { id } = req.params;
        const SubcategoryStatus = await SubCategory.findByPk(id);
          if (!SubcategoryStatus) {
         return res.status(404).json({ error: "Subcategory not found" });
     }   
        await SubcategoryStatus.destroy();
        return res.json({ message: "Subcategory deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Subcategory:", error);
    res.status(500).json({ error: "Error deleting Subcategory:" });
    }
}

module.exports = {
    store,
    index,
    show,
    update,
    deleted
}