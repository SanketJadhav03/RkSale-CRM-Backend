const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config");

const RoleHasPermission = sequelize.define(
    "tbl_role_has_permission",
    {
        rhp_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        rhp_role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
      
    },
    {
        timestamps: true, // Include timestamps (createdAt and updatedAt)
    }
);

module.exports = RoleHasPermission;
