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
        res.json({ error: "Failed To Store Payment Mode " })
    }

}

const index = async (req, res) => {
    try {
        const Payment_Types = await Payment_Type.findAll();
        res.json(Payment_Types)
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Show Payment Mode " })
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
            res.json({ message: "Payment Mode Not Found" })
        }
    } catch (error) {
        console.log("Error For Updating The Updation Of Payment");
    }
}

const deleted = async (req, res) => {
    try {
        const { payment_type_id } = req.params;
        const existin_Payment_Type = await Payment_Type.findByPk(payment_type_id);
        if (existin_Payment_Type) {
            const status = await existin_Payment_Type.destroy();
            if (status) {
                res.json({ message: "Deleted SuccessFully" })
            }
        } else {
            res.json({ message: "Payment Mode Not Found" })
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
            res.json({ message: "Payment Mode Not Found" })
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