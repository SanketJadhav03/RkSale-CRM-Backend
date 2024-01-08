const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Salary = sequelize.define('tbl_salary', {
  salary_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  salary_generator_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salary_receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salary_date : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_start_date : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_end_date : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_amount : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_absent_days : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_present_days : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_total_days : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  salary_incentive : {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salary_payment_id : {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salary_status : {
    type: DataTypes.INTEGER,
    defaultValue:1,
    allowNull: true,
  },





});

module.exports = Salary;
