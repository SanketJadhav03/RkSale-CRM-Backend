const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Notifaction = sequelize.define('tbl_notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lead_id: {
    type: DataTypes.INTEGER,
    defaultValue:0,
    allowNull: false,
  },
  task_id: {
    type: DataTypes.INTEGER,
    defaultValue:0,
    allowNull: false,
  },
 customer_notification:{
    type:DataTypes.INTEGER,
    defaultValue:1,
    allowNull:false
 },

 status:{
    type:DataTypes.INTEGER,
    allowNull:true,
    defaultValue:1,
 }
});

module.exports = Notifaction;