const { DataTypes } = require('sequelize');
const sequelize = require("../db/db_config");

const Permission = sequelize.define('tbl_permission', {
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    permission_name: {
        type: DataTypes.STRING,
    },
    permission_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    permission_path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Enables createdAt and updatedAt fields
});

module.exports = Permission;
