const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hr_type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_role_id: {
    type: DataTypes.INTEGER,

    allowNull: false,
  },
  salary: {
    type: DataTypes.INTEGER,

    allowNull: false,
  },
  mobile_no: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  emergency_contact: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  profile_photo: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  aadhar_card: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  pan_card: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  bank_passbook: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,

    allowNull: false,
  },

  status: {
    type: DataTypes.INTEGER,

    allowNull: false,
  },
});

module.exports = User;
