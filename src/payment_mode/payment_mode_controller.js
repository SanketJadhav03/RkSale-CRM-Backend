const Payment_Mode = require("./payment_mode_model");

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
        const payment_modeData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { raw: true });

        // Prepare an array of payment_mode objects
        const payment_mode = payment_modeData.map(row => ({
            payment_mode_id: row.payment_mode_id,
            payment_mode_name: row.payment_mode_name,
            payment_mode_status: row.payment_mode_status,
        }));

        // Use Sequelize bulk insert
        const results = await Payment_Mode.bulkCreate(payment_mode, {
            updateOnDuplicate: ['payment_mode_name', 'payment_mode_status']
        });

        res.status(201).json({ message: `${results.length} payment_mode added or updated successfully`, status: 1 });
    } catch (error) {
        console.error('Error adding payment_mode:', error);
        res.status(500).json({ error: 'Error adding payment_mode' });
    }
}
const store = async (req, res) => {
    try {
        const { payment_mode_name } = req.body;

        const new_Payment_Mode = await Payment_Mode.create({
            payment_mode_name
        })

        if (new_Payment_Mode) {
            res.json({ message: "Payment Mode Created SuccessFully", status: 1 })
        }
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Payment Mode " })
    }

}

const index = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the page number from the query parameters or default to page 1
        const limitPerPage = 30;
        const offset = (page - 1) * limitPerPage;

        const payment_type = await Payment_Mode.findAll({
            limit: limitPerPage,
            offset: offset,
        });

        res.json(payment_type);
    } catch (error) {
        console.error("Error getting payment_type:", error);
        res.status(500).json({ error: "Error getting payment_type" });
    }
}

const update = async (req, res) => {
    try {
        const { payment_mode_id, payment_mode_name } = req.body;
        const existingpayment_mode = await Payment_Mode.findByPk(payment_mode_id);
        if (existingpayment_mode) {
            const updated_payment_mode = await existingpayment_mode.update({
                payment_mode_name: payment_mode_name
            })
            if (updated_payment_mode) {
                res.json({ message: "Updated SuccessFully", status: 1 })
            }
        } else {
            res.json({ message: "Payment Mode Not Found" })
        }
    } catch (error) {
        console.log("Error For Updating The Updation Of Payment");
    }
}

const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const existin_payment_mode = await Payment_Mode.findByPk(id);
        if (existin_payment_mode) {
            const status = await existin_payment_mode.destroy();
            if (status) {
                res.json({ message: "Payment Mode Deleted Successfully !", status: 1 })
            }
        } else {
            res.json({ message: "Payment Mode Not Found", status: 0 })
        }
    } catch (error) {

    }

}
const show = async (req, res) => {
    try {
        const { payment_mode_id } = req.params;
        const payement_mode = await Payment_Mode.findByPk(payment_mode_id);
        if (payement_mode) {
            res.json(payement_mode)
        } else {
            res.json({ message: "Payment Mode Not Found" })
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