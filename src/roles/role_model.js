const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config");

const Role = sequelize.define(
  "roles",
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt fields
  }
);

module.exports = Role;
