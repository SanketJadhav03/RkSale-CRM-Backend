const Customer = require('./customer_model');
const City = require("../city/city_model")
const { Op, Model } = require('sequelize');
const sequelize = require('../db/db_config');

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;
      
        const customers = await sequelize.query(
          `
          SELECT * FROM tbl_customers 
          INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
          INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
          LIMIT :limit
          OFFSET :offset
          `,
          {
            model: Customer,
            mapToModel: true, // Map the result to the Customer model
            replacements: { limit: limitPerPage, offset: offset },
          }
        );
      
        res.json(customers);
      } catch (error) {
        console.error("Error getting customers:", error);
        res.status(500).json({ error: "Error getting customers" });
      }
      
}


const store = async (req, res) => {
    try {

        const {
            customer_name,
            customer_whatsapp_no,
            customer_alternative_no,
            customer_email,
            customer_city,
            customer_group,
            customer_designation,
            customer_address,
            customer_compnay_name
        } = req.body;
        await Customer.create({
            customer_name,
            customer_whatsapp_no,
            customer_alternative_no,
            customer_email,
            customer_city,
            customer_group,
            customer_designation,
            customer_address,
            customer_compnay_name
        });
        return res.status(201).json({ message: 'Customer added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding Customer:", error);
        res.status(500).json({ error: "Error adding Customer" });
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });

        }
        res.json(customer)
    } catch (error) {
        res.status(500).json({ error: "Error showing Customer by id" });

    }
}


const update = async (req, res) => {
    try {
        const { customer_id, customer_name,
            customer_whatsapp_no,
            customer_alternative_no,
            customer_email,
            customer_city,
            customer_group,
            customer_designation,
            customer_address,
            customer_compnay_name

        } = req.body;

        const customer = await Customer.findByPk(customer_id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        await customer.update({
            customer_id, customer_name,
            customer_whatsapp_no,
            customer_alternative_no,
            customer_email,
            customer_city,
            customer_group,
            customer_designation,
            customer_address,
            customer_compnay_name
        })
        return res.json({ message: "Customer updated successfully!", status: 1 });
    } catch (error) {
        console.error("Error updating Customer:", error);
        res.status(500).json({ error: "Error updating Customer" });
    }
}


const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        // return res.json({customer})
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        await customer.destroy();
        return res.json({ message: "Customer deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting Customer :", error);
        res.status(500).json({ error: "Error deleting Customer :" });
    }
}
module.exports = {
    index,
    store,
    show,
    update,
    deleted
}