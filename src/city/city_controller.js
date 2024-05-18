
const Customer = require("../customer/customer_model");
const City = require("./city_model")
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
        const cityData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { raw: true });

        // Prepare an array of city objects
        const cities = cityData.map(row => ({
            city_id: row.city_id,
            city_name: row.city_name,
            city_status: row.city_status,
        }));

        // Use Sequelize bulk insert
        const results = await City.bulkCreate(cities, {
            updateOnDuplicate: ['city_name', 'city_status']
        });

        res.status(201).json({ message: `${results.length} cities added or updated successfully`, status: 1 });
    } catch (error) {
        console.error('Error adding cities:', error);
        res.status(500).json({ error: 'Error adding cities' });
    }
}
const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const cities = await City.findAll({
            limit: limitPerPage,
            offset: offset,
        });

        res.json(cities);
    } catch (error) {
        console.error("Error getting cities:", error);
        res.status(500).json({ error: "Error getting cities" });
    }

}
const store = async (req, res) => {
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
        return res.status(201).json({ message: 'City added successfully', status: 1 });
    } catch (error) {
        console.error("Error adding city:", error);
        res.status(500).json({ error: "Error adding city" });
    }
}

const show = async (req, res) => {
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
const updated = async (req, res) => {
    try {
        const { city_id, city_name } = req.body;

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
const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findByPk(id);
        if (!city) {
            return res.status(404).json({ error: "City not found" });
        }
        const cityInCustomer = await Customer.findOne({
            where: { customer_city: id },
        });

        if (cityInCustomer) {
            return res.json({ message: "This record is in use!", status: 0 });
        }
        await city.destroy();
        return res.json({ message: "City deleted successfully!", status: 1 });
    } catch (error) {
        console.error("Error deleting city:", error);
        res.status(500).json({ error: "Error deleting city:" });
    }
}
module.exports = {
    index,
    store,
    show,
    updated,
    deleted, upload
};