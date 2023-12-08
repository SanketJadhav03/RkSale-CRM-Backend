const { Sequelize } = require("sequelize");
const url_helper = require("../../url_helper");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${url_helper}/db.db`, // Path to your SQLite database file
});

module.exports = sequelize;
