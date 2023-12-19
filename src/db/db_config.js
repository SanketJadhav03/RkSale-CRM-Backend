// const { Sequelize } = require("sequelize");
// const url_helper = require("../../url_helper");

// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: `${url_helper}/db.db`, // Path to your SQLite database file
// });

// module.exports = sequelize;
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost", // Your MySQL host
  port: 3306, // Your MySQL port (default is 3306)
  username: "root", // Your MySQL username
  password: "", // Your MySQL password
  database: "crm_rksales", // Your MySQL database name
});

module.exports = sequelize;
