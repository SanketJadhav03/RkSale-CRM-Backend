const { DataTypes } = require('sequelize');
const sequelize = require('../db/db_config'); // Your Sequelize connection

const Payment = sequelize.define('tbl_payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  payment_send_user: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  payment_date: {
    type: DataTypes.STRING,

    allowNull: true,
  },

  user_type: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  payment_receiver: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_mode: {
    type: DataTypes.INTEGER,

    allowNull: null,
  },
  payment_type: {
    type: DataTypes.INTEGER,
    allowNull: null,
  },
  payment_amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 1,
    allowNull: true,
  },

});

module.exports = Payment;
