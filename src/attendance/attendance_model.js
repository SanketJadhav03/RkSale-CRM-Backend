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
    type: DataTypes.DATEONLY,

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
  attendance_in_latitude: {
    type: DataTypes.STRING,

    allowNull: null,
  },
  attendance_in_longitude: {
    type: DataTypes.STRING,

    allowNull: null,
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
  attendance_out_latitude: {
    type: DataTypes.STRING,

    allowNull: null,
  },
  attendance_out_longitude: {
    type: DataTypes.STRING,

    allowNull: null,
  },
  out_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attendance_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true

  }
});

module.exports = Attendance;
