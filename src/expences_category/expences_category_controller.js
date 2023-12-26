const { Op } = require('sequelize');
const Expences_Category = require('../expences_category/expences_category_model');

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const Expences_Categorys = await Expences_Category.findAll({
          limit: limitPerPage,
          offset: offset,
        });
      
        res.json(Expences_Categorys);
      } catch (error) {
        console.error("Error getting Expences_Categorys:", error);
        res.status(500).json({ error: "Error getting Expences_Categorys" });
      }
      
}

const store = async (req, res) => {
    try {
        const { expences_category_name, expences_category_description } = req.body;
        const existingexpences_category_name = await Expences_Category.findOne({
            where: {
                expences_category_name: expences_category_name,
                expences_category_description: expences_category_description,
            },
        });

        if (existingexpences_category_name) {
            return res.json({ message: "Expences_Category name already exists", status: 0 });
        }
        await Expences_Category.create({
            expences_category_name,
            expences_category_description
        });
        return res.status(201).json({ message: 'Expences_Category added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding Expences_Category:", error);
        res.status(500).json({ error: "Error adding Expences_Category" });
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const Expences_Categorys = await Expences_Category.findByPk(id);
        if (!Expences_Category) {
            return res.status(404).json({ error: "Expences_Category not found" });

        }
        res.json(Expences_Categorys)
    } catch (error) {
        res.status(500).json({ error: "Error showing Expences_Category by id" });

    }
}

const update = async (req, res) => {
    try {
        const { expences_category_id, expences_category_name, expences_category_description } = req.body;
        const existingExpences_Categorys = await Expences_Category.findOne({
            where: {
                expences_category_name: expences_category_name,
                expences_category_description: expences_category_description,
                expences_category_id: { [Op.ne]: expences_category_id },
            },
        });
        if (existingExpences_Categorys) {
            return res.json({ message: "Expences_Category name already exists", status: 0 });
        }
        const cat = await Expences_Category.findByPk(expences_category_id);
        if (!cat) {
            return res.status(404).json({ error: "Expences_Category not found" });
        }

        await cat.update({
            expences_category_name,
            expences_category_description,
        })
        return res.json({ message: "Expences_Category updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Expences_Category:", error);
        res.status(500).json({ error: "Error updating Expences_Category" });
    }
}

const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Expences_Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Expences_Category not found" });
        }
        await category.destroy();
        return res.json({ message: "Expences_Category deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Expences_Category:", error);
        res.status(500).json({ error: "Error deleting Expences_Category:" });
    }
}

module.exports = {
    index,
    store,
    show,
    update,
    deleted
}