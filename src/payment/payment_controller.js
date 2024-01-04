const Payment = require("./payment_model")

const store = async(req,res) =>{
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
        const payment =await Payment.create({
            payment_send_user,
            payment_date,
            user_type,
            payment_receiver,
            payment_mode,
            payment_type,
            payment_amount,
            payment_remark
        })
        if(payment){
            res.json({message:"Payment Is Successful"})
        }else {
            res.json({message:"Payment Is Failed"})
        }

    } catch (error) {
        console.log(error);
        res.json({error:"Failed To Store Payment"})
    }

}

const index = async(req,res)=>{
try {
    const data = await sequelize.query(
        `SELECT * FROM tbl_payments 
        INNER JOIN tbl_payment_modes ON tbl_payments.payment_mode = tbl_payment_modes.payment_mode_id
        INNER JOIN users ON tbl_payments.payment_send_user = users.uid
        INNER JOIN users ON tbl_payments.payment_receiver = users.uid
   
        `,
        {
          type: QueryTypes.SELECT,
          model: Leads, // Specify the model for Sequelize to map the result to
        }
      );
      res.json(data);
} catch (error) {
    console.log(error);
    res.json({error:"Failed To Get Payments"})
}
}

module.exports = {
    store,
    index
}