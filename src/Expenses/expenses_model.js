const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const Expenses = sequelize.define("tbl_expenses", {
  expenses_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  expenses_date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expenses_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expenses_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expenses_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expenses_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  expenses_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Expenses;
