const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Reference = sequelize.define('tbl_reference', {
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  reference_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reference_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Reference;
