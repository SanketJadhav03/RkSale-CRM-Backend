// # in working don't push
const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Employee = sequelize.define('tbl_employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_eid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_branch: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employee_role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee_adhar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employee_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Employee;
