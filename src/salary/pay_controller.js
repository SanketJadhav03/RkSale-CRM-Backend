const { QueryTypes } = require('sequelize');
const SalaryPay = require('./pay_model');
const sequelize = require('../db/db_config');
const Payment = require('../payment/payment_model');
const Salary = require('./salary_model');

// Controller methods
const calculationSalary = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const query = `SELECT pay_employee_id, 
                      SUM(pay_advance_paid) AS total_advance_paid, 
                      SUM(pay_remaining_paid) AS total_remaining_paid, 
                      SUM(pay_remaining_salary) AS total_remaining_salary
               FROM tbl_pays
               WHERE pay_employee_id = :employee_id
               GROUP BY pay_employee_id`;

    const data = await sequelize.query(query, {
      replacements: { employee_id },
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
    const { pay_salary_id, pay_employee_id, pay_payment_id, pay_month, pay_advance_paid, pay_remaining_paid, pay_remaining_salary } = req.body;

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

    const payment = await Payment.findOne({
      where: {
        payment_id: pay_payment_id
      }
    })

    if (payment) {
      await payment.update({
        payment_amount: pay_remaining_paid
      })
    }
    const salary = await Salary.findOne({
      where: {
        salary_id: newSalaryPay.pay_salary_id
      }
    })
    // return res.json(newSalaryPay.pay_salary_id);
    if (salary) {
      await salary.update({
        salary_status: 2
      })
    }
    console.log(newSalaryPay);
    if (newSalaryPay) {
      return res.json({ message: "Salary paid successfully !", status: 1 })
    } else {
      return res.json({ message: "Something went wrong!", status: 0 })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const view = async (req, res) => {
  try {
    const { id } = req.params;

    // Query the database to get salary and employee information
    const receipts = await sequelize.query(
      `SELECT DISTINCT * FROM tbl_salaries
      INNER JOIN tbl_pays ON tbl_salaries.salary_id = tbl_pays.pay_salary_id
      INNER JOIN users ON tbl_pays.pay_employee_id = users.uid
      WHERE tbl_salaries.salary_id = :Id`,
      {
        model: Salary,
        replacements: {
          Id: id
        }
      }
    );




    // Sending the retrieved data as JSON response
    res.json({ receipts });
  } catch (error) {
    // Error handling
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = {
  calculationSalary,
  store, view
};
