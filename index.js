const express = require("express");
const expressApp = express();
const cors = require("cors");
const path = require("path");
const checked = require("./src/db/db_config");
// const checkPermissions = require("./src/auth/permissionMiddleware");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const os = require("os");
// const authenticateToken = require("./src/auth/authMiddleware");
const url_helper = require("./url_helper");
const username = os.userInfo().username;
// expressApp.use(express.static(imagesPath));
expressApp.use(express.json());
expressApp.use(cors());
// create data
checked
  .sync({ force:  false }) // if false then not drop created table else it will drop tables and every time gives new tables 
  .then(() => {
    console.log("Database created!");
  })
  .catch((error) => {
    console.log(error);
  });

// city routes
const city = require("./src/city/city_route");
expressApp.use("/api", city);


// source routes
const source = require("./src/source/source_route");
expressApp.use("/api", source);


// source routes
const branch = require("./src/branch/branch_route");
expressApp.use("/api", branch);


// category routes
const category = require('./src/category/category_routes')
expressApp.use("/api",category)

// product routes 
const product = require('./src/product/product_routes')
expressApp.use("/api",product)

// Reference route
const Reference = require('./src/reference/reference_routes')
expressApp.use("/api",Reference)

// lead status routes 
const leadStatus = require('./src/lead_status/lead_route')
expressApp.use("/api",leadStatus)


// customer route 
const Customer = require('./src/customer/customer_routes')
expressApp.use("/api",Customer)
// ################################ END #####################################################
expressApp.listen(8888, () => {
    console.log(`Server is running on http://localhost:${8888}`);
  });
