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
            res.json({ message: "Salaries Generated Successfully" , status:1});
        } else {
            res.json({ message: "Failed To Generate Salaries",status:0 });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Failed To Store Salaries" });
    }
}

const filterTranscation = async (req, res) => {
    try {
        const selectedMonth = req.body.month; // Assuming 'month' is sent in the request body
        // const startOfMonth = new Date(new Date().getFullYear(), selectedMonth - 1, 1);
        // const endOfMonth = new Date(new Date().getFullYear(), selectedMonth, 0);

        const query = `
            SELECT s.*, u.name,u.salary
            FROM tbl_salaries s
            JOIN users u ON u.uid = s.salary_receiver_id
            WHERE s.salary_month = :selectedMonth
        `;

        const filteredSalaries = await sequelize.query(query, {
            replacements: { selectedMonth },
            type: sequelize.QueryTypes.SELECT,
        });

        res.json(filteredSalaries);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
const singleview = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT s.*, u.name, u.salary,p.*
            FROM tbl_salaries s     
            JOIN users u ON u.uid = s.salary_receiver_id
            JOIN tbl_payments p ON p.payment_receiver = s.salary_receiver_id
            WHERE s.salary_id = :id
        `;

        const filteredSalaries = await sequelize.query(query, {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
        });

        res.json(filteredSalaries[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    store,
    filterTranscation, singleview

};


