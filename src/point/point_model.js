const { DataTypes } = require('sequelize');
const sequelize = require("../db/db_config");

const Point = sequelize.define('tbl_permission', {
    point_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    point_type: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    point_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true, // Enables createdAt and updatedAt fields
});

module.exports = Point;
