const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config");

const Business_setting = sequelize.define(
  "tbl_business_setting",
  {
    business_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    business_logo: {
      type: DataTypes.STRING,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_company_phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_company_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_billing_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_state_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_pincode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    business_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_gst_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_industry_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    business_registration_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // This sets the default value to 1
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Business_setting;
