const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Leave = sequelize.define('tbl_leave', {
  leave_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  leave_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leave_reason: {
    type: DataTypes.STRING,

    allowNull: true,
  },

  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },

  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  leave_approved_by: {
    type: DataTypes.STRING,

    allowNull: null,
  },
  leave_reject_reason: {
    type: DataTypes.STRING,

    allowNull: null,
  },
  leave_status: {
    type: DataTypes.STRING,
    allowNull: true,
  },

});

module.exports = Leave;
