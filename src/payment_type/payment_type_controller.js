const Payment_Type = require("./payment_type_model");

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
        const payment_typeData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { raw: true });

        // Prepare an array of payment_type objects
        const payment_type = payment_typeData.map(row => ({
            payment_type_id: row.payment_type_id,
            payment_type_name: row.payment_type_name,
            payment_type_status: row.payment_type_status,
        }));

        // Use Sequelize bulk insert
        const results = await Payment_Type.bulkCreate(payment_type, {
            updateOnDuplicate: ['payment_type_name', 'payment_type_status']
        });

        res.status(201).json({ message: `${results.length} payment_type added or updated successfully`, status: 1 });
    } catch (error) {
        console.error('Error adding payment_type:', error);
        res.status(500).json({ error: 'Error adding payment_type' });
    }
}
const store = async (req, res) => {
    try {
        const { payment_type_name } = req.body;

        const new_Payment_Type = await Payment_Type.create({
            payment_type_name
        })

        if (new_Payment_Type) {
            res.json({ message: "Payment Type Created SuccessFully", status: 1 })
        }
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Payment Type " })
    }

}

const index = async (req, res) => {

    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const paymet_type = await Payment_Type.findAll({
            limit: limitPerPage,
            offset: offset,
        });

        res.json(paymet_type);
    } catch (error) {
        console.error("Error getting paymet_type:", error);
        res.status(500).json({ error: "Error getting paymet_type" });
    }

}

const update = async (req, res) => {
    try {
        const { payment_type_id, payment_type_name } = req.body;
        const existingPayment_Type = await Payment_Type.findByPk(payment_type_id);
        if (existingPayment_Type) {
            const updated_Payment_Type = await existingPayment_Type.update({
                payment_type_name: payment_type_name
            })
            if (updated_Payment_Type) {
                res.json({ message: "Updated SuccessFully", status: 1 })
            }
        } else {
            res.json({ message: "Payment Type Not Found" })
        }
    } catch (error) {
        console.log("Error For Updating The Updation Of Payment");
    }
}

const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const existin_Payment_Type = await Payment_Type.findByPk(id);
        if (existin_Payment_Type) {
            const status = await existin_Payment_Type.destroy();
            if (status) {
                res.json({ message: "Payment Type Deleted SuccessFully", status: 1 })
            }
        } else {
            res.json({ message: "Payment Type Not Found", status: 0 })
        }
    } catch (error) {

    }

}
const show = async (req, res) => {
    try {
        const { payment_type_id } = req.params;
        const payement_mode = await Payment_Type.findByPk(payment_type_id);
        if (payement_mode) {
            res.json(payement_mode)
        } else {
            res.json({ message: "Payment Type Not Found" })
        }
    } catch (error) {

    }

}
module.exports = {
    upload,
    store,
    index,
    update,
    deleted,
    show
}