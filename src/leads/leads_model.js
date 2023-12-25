const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Leads = sequelize.define('tbl_leads', {
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  customer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  today_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  minimum_due_date : {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ref_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  maximum_due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  source: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assigned_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tags: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  lead_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Leads;
