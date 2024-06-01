const Customer = require('./customer_model');
const City = require("../city/city_model")
const { Op, Model } = require('sequelize');
const sequelize = require('../db/db_config');
const xlsx = require('xlsx');
const upload = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No file uploaded', status: 0 });
        }

        const file = req.files.file;

        // Use xlsx to read the Excel or CSV file
        const workbook = xlsx.read(file.data, { type: 'buffer' });
        const sheetNameList = workbook.SheetNames;
        const customerData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { raw: true });
        // Prepare an array of city objects
        // Get the current date
        const currentDate = new Date();

        const customers = customerData.map(row => ({
            customer_id: row.customer_id,
            customer_name: row.customer_name,
            customer_whatsapp_no: row.customer_whatsapp_no,
            customer_city: row.customer_city,
            customer_alternative_no: row.customer_alternative_no,
            customer_email: row.customer_email,
            customer_compnay_name: row.customer_compnay_name,
            customer_designation: row.customer_designation,
            customer_address: row.customer_address,
            customer_group: row.customer_group,
            cusotmer_status: row.cusotmer_status,
            createdAt: currentDate,
            updatedAt: currentDate,
        }));
        // return res.status(201).json(customers);

        // Use Sequelize bulk insert
        const results = await Customer.bulkCreate(customers, {
            updateOnDuplicate: ['customer_name', 'customer_whatsapp_no', 'customer_city', 'customer_alternative_no', 'customer_email', 'customer_compnay_name', 'customer_designation'
                , 'customer_address', 'customer_group',
                'cusotmer_status']
        });

        return res.status(201).json({ message: `${results.length} Customer added or updated successfully`, status: 1 });
        // return res.json({ message: "Lead added successfully!", status: 1 });
    } catch (error) {
        console.error('Error adding Customer:', error);
        res.status(500).json({ message: 'Error adding Customer', status: 0 });
    }
}
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
       
          `,
            {
                model: Customer,
                mapToModel: true, // Map the result to the Customer model
                // replacements: { limit: limitPerPage, offset: offset },
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
    upload, index,
    store,
    show,
    update,
    deleted
}