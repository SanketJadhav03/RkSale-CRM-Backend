const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const LeadStatus = sequelize.define('tbl_lead_statuses', {
  lead_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  lead_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lead_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = LeadStatus;
