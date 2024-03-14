const Payment_Mode = require("./payment_mode_model");


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
        const payment_modes = await Payment_Mode.findAll();
        res.json(payment_modes)
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Show Payment Mode " })
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
    store,
    index,
    update,
    deleted,
    show
}