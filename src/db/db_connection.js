const sqlite3 = require("sqlite3").verbose();
const url_helper = require("../../url_helper");

// Create a new SQLite database connection
const DB = new sqlite3.Database(`${url_helper}/db.db`);

module.exports = DB;
