const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const Payment_Mode = sequelize.define("tbl_payment_mode", {
  payment_mode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_mode_name :{
type:DataTypes.STRING,
allowNull:true
  }
  ,
  payment_mode_status: {
    type: DataTypes.INTEGER,
    defaultValue:1,
    allowNull: false,
  },

});

module.exports = Payment_Mode;
