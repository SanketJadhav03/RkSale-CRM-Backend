const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Shift = sequelize.define('tbl_shift', {
  shift_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  shift_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shift_intime: {
    type: DataTypes.TIME,
    
    allowNull: true,
  },
  shift_outime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  shift_status:{
    type:DataTypes.INTEGER,
    defaultValue:1,
    allowNull:true

  }
});

module.exports = Shift;
