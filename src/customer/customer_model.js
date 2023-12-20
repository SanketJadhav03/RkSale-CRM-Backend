const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Customer = sequelize.define('tbl_customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_whatsapp_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customer_city: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_alternative_no: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customer_birth_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_marriage_annieversary_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  customer_organization_name:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  customer_designation:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  customer_address:{
    type:DataTypes.STRING,
    allowNull:true
  },
  customer_group:{
    type:DataTypes.STRING,
    allowNull:true
  },
  cusotmer_status:{
    type:DataTypes.STRING,
    allowNull:false,
    defaultValue:1
  }
});

module.exports = Customer;
