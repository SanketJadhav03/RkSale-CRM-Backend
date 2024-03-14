const Payment_Type = require("./payment_type_model");


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
    store,
    index,
    update,
    deleted,
    show
}