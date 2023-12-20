const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const SubCategory = sequelize.define('tbl_subcategory', {
  subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  subcategory_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_id:{
type:DataTypes.INTEGER,
allowNull:false,
  },
  subcategory_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = SubCategory;
