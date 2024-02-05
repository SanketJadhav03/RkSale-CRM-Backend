const { Op, Sequelize } = require("sequelize");
const Salary = require("./salary_model");
const sequelize = require("../db/db_config");


const store = async (req, res) => {
    try {
        const salaryData = req.body; // Assuming req.body is an array of salary objects
    
        // Assuming you have a model for Salary using Mongoose
        const newSalaries = [];
        
        for (const salaryItem of salaryData) {
            const newSalary = await Salary.create(salaryItem);
            newSalaries.push(newSalary);
        }
    
        if (newSalaries) {
            res.json({ message: "Salaries Generated Successfully" });
        } else {
            res.json({ message: "Failed To Generate Salaries" });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Failed To Store Salaries" });
    }
}

const filterTransaction = async (req, res) => {
    try {
      const selectedMonth = req.body.month; // Assuming 'month' is sent in the request body
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, selectedMonth - 1, 1);
      const endOfMonth = new Date(currentYear, selectedMonth, 0);
  
      const query = `
        SELECT s.*, u.name, u.salary
        FROM tbl_salaries s
        JOIN users u ON u.uid = s.salary_receiver_id
        WHERE s.createdAt >= :startOfMonth AND s.createdAt <= :endOfMonth
      `;
  
      const filteredSalaries = await sequelize.query(query, {
        replacements: { startOfMonth, endOfMonth },
        type: sequelize.QueryTypes.SELECT,
      });
  
      res.json(filteredSalaries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = {
    store,
    filterTransaction
}