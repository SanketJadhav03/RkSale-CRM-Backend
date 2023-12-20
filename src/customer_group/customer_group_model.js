const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config");

const CustomerGroup = sequelize.define(
  "tbl_customer_groups",
  {
    customer_group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_group_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_group_status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // This sets the default value to 1
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = CustomerGroup;
