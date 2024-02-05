const { QueryTypes } = require("sequelize");
const Payment = require("./payment_model");
const sequelize = require("../db/db_config");

const store = async (req, res) => {
    try {
        const {
            payment_send_user,
            payment_date,
            user_type,
            payment_receiver,
            payment_mode,
            payment_type,
            payment_amount,
            payment_remark
        } = req.body;
        const payment = await Payment.create({
            payment_send_user,
            payment_date,
            user_type,
            payment_receiver,
            payment_mode,
            payment_type,
            payment_amount,
            payment_remark
        })
        if (payment) {
            res.json({ message: "Payment Is Successful", status: 1 })
        } else {
            res.json({ message: "Payment Is Failed" })
        }

    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Store Payment" })
    }

}

const index = async (req, res) => {
    try {
        const data = await sequelize.query(
            `SELECT * 
        FROM tbl_payments 
        INNER JOIN tbl_payment_modes ON tbl_payments.payment_mode = tbl_payment_modes.payment_mode_id
        INNER JOIN users AS sender ON tbl_payments.payment_send_user = sender.uid
        INNER JOIN users AS receiver ON tbl_payments.payment_receiver = receiver.uid
        INNER JOIN tbl_payment_types ON tbl_payments.payment_type = tbl_payment_types.payment_type_id 
   
        `,
            {
                type: QueryTypes.SELECT,
                model: Payment, // Specify the model for Sequelize to map the result to
            }
        );
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Get Payments" })
    }
}

const update = async (req, res) => {
    try {
        const {
            payment_id,
            payment_send_user,
            payment_date,
            user_type,
            payment_receiver,
            payment_mode,
            payment_type,
            payment_amount,
            payment_remark
        } = req.body

        const existingPayment = await Payment.findByPk(payment_id);
        if (existingPayment) {

            const status = await existingPayment.update({
                payment_send_user: payment_send_user,
                payment_date: payment_date,
                user_type: user_type,
                payment_receiver: payment_receiver,
                payment_mode: payment_mode,
                payment_type: payment_type,
                payment_amount: payment_amount,
                payment_remark: payment_remark
            })
            if (status) {
                res.json("Payment Updated SuccessFully")
            } else {
                res.json("Payment Updation Failed")

            }
        } else {
            res.json({ message: "Payment Not Found" })
        }
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Update  " })
    }
}

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await sequelize.query(
            `SELECT * 
            FROM tbl_payments 
            INNER JOIN tbl_payment_modes ON tbl_payments.payment_mode = tbl_payment_modes.payment_mode_id
            INNER JOIN users AS sender ON tbl_payments.payment_send_user = sender.uid
            INNER JOIN users AS receiver ON tbl_payments.payment_receiver = receiver.uid
            INNER JOIN tbl_payment_types ON tbl_payments.payment_type = tbl_payment_types.payment_type_id 
            WHERE tbl_payments.payment_id = :id
       
            `,

            {   
              type: QueryTypes.SELECT,
              replacements: { id },

            }
        );
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({ error: "Failed To Get Payments" })
    }
}

const advance = async (req, res) => {
    try {
      const { id } = req.params;
  
      const $data = await sequelize.query(
        `
        SELECT * 
        FROM tbl_payments 
        WHERE tbl_payments.payment_type = 1
        AND tbl_payments.some_other_column = :id
        `,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        }
      );
  
      res.json({ data: $data });
    } catch (error) {
      console.error(error);
      res.json({ message: "Failed To Get Advance" });
    }
  };


module.exports = {
    store,
    index,
    update,
    show,
    advance
}   