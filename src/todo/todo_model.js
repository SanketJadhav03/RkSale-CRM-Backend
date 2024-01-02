const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Todo = sequelize.define('tbl_todos', {
  todo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  todo_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  todo_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  todo_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = Todo;
