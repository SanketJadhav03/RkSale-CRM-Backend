const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const SalaryPay = sequelize.define('tbl_pay', {
  pay_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  pay_salary_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pay_employee_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pay_payment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pay_month: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pay_advance_paid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pay_remaining_paid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pay_remaining_salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pay_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true,
  },
});

module.exports = SalaryPay;
