const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Attendance = sequelize.define('tbl_attendance', {
  attendance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attendance_date: {
    type: DataTypes.DATE,
    
    allowNull: true,
  },
  in_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  in_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  in_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  out_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  out_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  out_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  attendance_status:{
    type:DataTypes.INTEGER,
    defaultValue:1,
    allowNull:true

  }
});

module.exports = Attendance;
