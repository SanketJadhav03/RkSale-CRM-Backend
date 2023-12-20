const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Expences_Category = sequelize.define('tbl_expences_category', {
  expences_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  expences_category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expences_category_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expences_category_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Expences_Category;
