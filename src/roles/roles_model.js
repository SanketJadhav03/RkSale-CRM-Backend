// # in working don't push
const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Roles = sequelize.define('tbl_roles', {
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
   role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  guard_name:{
    type:DataTypes.STRING,
    allowNull:false,
    defaultValue:"web"
  },
  user_access:{
    type:DataTypes.INTEGER,
    allowNull:false,
    defaultValue:0
  }


});

module.exports = Roles;
