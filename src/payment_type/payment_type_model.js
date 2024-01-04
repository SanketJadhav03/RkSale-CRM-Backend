const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const Payment_Type = sequelize.define("tbl_payment_type", {

  payment_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  payment_type_name: {
    type: DataTypes.STRING,
    allowNull: true
  },

  payment_type_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },

});

module.exports = Payment_Type;
