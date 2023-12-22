const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const User = sequelize.define("users", {
  uid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  u_type: {
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
  password: {
    type: DataTypes.STRING,

    allowNull: true,
  },

  aadhar_no: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  aadhar_photo: {
    type: DataTypes.STRING,

    allowNull: true,
  },
  pan_no: {
    type: DataTypes.STRING,

    allowNull: true,
  },

  pan_photo: {
    type: DataTypes.STRING,
    allowNull: true

  },
  bank_passbook_photo: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  date_of_joining: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  last_experience: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  last_working_company: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  last_company_salary: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  shift_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  user_upi: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue:1,
    allowNull: true,
  },
});

module.exports = User;
