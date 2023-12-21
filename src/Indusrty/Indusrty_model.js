const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Indusrty = sequelize.define('tbl_industry_types', {
  industry_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  industry_type_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry_type_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Indusrty;
