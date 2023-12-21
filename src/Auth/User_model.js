const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hr_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salary: {
    type: DataTypes.INTEGER,

    allowNull: true,
  },
  mobile_no: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  emergency_contact: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  profile_photo: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,

    allowNull: false,
  },
  aadhar_card: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  pan_card: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  bank_passbook: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,

    allowNull: false,
  },

  status: {
    type: DataTypes.INTEGER,

    allowNull: true,
  },
});

module.exports = User;
