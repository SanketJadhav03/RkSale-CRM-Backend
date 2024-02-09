const { DataTypes } = require("sequelize");
const sequelize = require("../db/db_config"); // Your Sequelize connection

const FollowUp = sequelize.define("tbl_follow_up", {
  follow_up_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  follow_up_send_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  follow_up_lead_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  follow_up_task_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  follow_up_description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  follow_up_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  follow_up_status: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
});

module.exports = FollowUp;
