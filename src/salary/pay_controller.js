const { QueryTypes } = require('sequelize');
const SalaryPay = require('./pay_model');
const sequelize = require('../db/db_config');

// Controller methods
const index = async (req, res) => {
  try {
    const query = `SELECT pay_salary_id, SUM(pay_advance_paid) AS total_advance_paid, SUM(pay_remaining_paid) AS total_remaining_paid, SUM(pay_remaining_salary) AS total_remaining_salary
    FROM tbl_pays
    GROUP BY pay_salary_id
    `;
    const data = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        model: SalaryPay, 
      });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const store = async (req, res) => {
    try {
      // Extract data from the request body
      const { pay_salary_id,pay_employee_id,pay_payment_id,pay_month, pay_advance_paid, pay_remaining_paid, pay_remaining_salary } = req.body;
  
      // Create a new SalaryPay record
      const newSalaryPay = await SalaryPay.create({
        pay_salary_id,
        pay_advance_paid,
        pay_remaining_paid,
        pay_remaining_salary,
        pay_employee_id,
        pay_payment_id,
        pay_month
      });
      if(newSalaryPay){
        return res.json({message:"Salary paid successfully !",status:1})
    }else{
          return res.json({message:"Something went wrong!",status:0})
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
  index,
  store
};
