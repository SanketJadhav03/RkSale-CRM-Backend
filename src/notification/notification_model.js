const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Notifaction = sequelize.define('tbl_notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assigned_data_id:{
type:DataTypes.INTEGER,
allowNull:true
  },
 notification_description:{
 type:DataTypes.STRING,
 defaultValue:"You Have New Notificaion",
 allowNull:true
 },
 notification_type:{
type:DataTypes.INTEGER,
allowNull:true
 },

 status:{
    type:DataTypes.INTEGER,
    allowNull:true,
    defaultValue:1,
 }
});

module.exports = Notifaction;
