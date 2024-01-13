const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Message = sequelize.define('tbl_message', {
  message_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  message_title:{
    type:DataTypes.STRING,
    allowNull:true
  },
  message_description:{
    type:DataTypes.STRING,
    allowNull:true
  },
  message_image:{
type:DataTypes.STRING,
allowNull:true
  },
  message_status:{
    type:DataTypes.INTEGER,
    defaultValue:1,
    allowNull:true
  }


});

module.exports = Message;
