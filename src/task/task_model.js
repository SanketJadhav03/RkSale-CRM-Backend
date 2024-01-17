const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Task = sequelize.define('tbl_task', {
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  
  task_created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  repeat_every_day:{
type:DataTypes.STRING,
allowNull:true
  },
//   total_cycles:{
// type:DataTypes.STRING,
// allowNull:true
//   },
  status:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  task_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Task;
