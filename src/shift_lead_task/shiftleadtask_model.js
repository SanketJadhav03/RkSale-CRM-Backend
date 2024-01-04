const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Shift = sequelize.define('tbl_slt', {
  slt_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  slt_send_to: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slt_send_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slt_lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  slt_task_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  slt_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slt_status: {
    type: DataTypes.INTEGER,
    defaultValue:1,
    allowNull: true,
  },
});

module.exports = Shift;
