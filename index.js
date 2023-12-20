const express = require("express");
const expressApp = express();
const cors = require("cors");
const path = require("path");
// const checked = require("./src/db/db_config");
// const checkPermissions = require("./src/auth/permissionMiddleware");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const os = require("os");
// const authenticateToken = require("./src/auth/authMiddleware");
// const url_helper = require("./url_helper");
const username = os.userInfo().username;

const imagesPath = `C:\\Users\\${username}\\AppData\\Roaming\\RkSalesCrm\\all_images`;
expressApp.use(express.static(imagesPath));

expressApp.use(express.json());
expressApp.use(cors());
// create data
// checked
//   .sync({ force: false }) // if false then not drop created table else it will drop tables and every time gives new tables
//   .then(() => {
//     require("./db/create_data");
//     console.log("Database created!");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// city routes
const city = require("./src/city/city_route");
expressApp.use("/back-end", city);

// // permission

// // source routes
const source = require("./src/source/source_route");
expressApp.use("/back-end", source);

// // source routes
const branch = require("./src/branch/branch_route");
expressApp.use("/back-end", branch);

// category routes
const category = require("./src/category/category_routes");
expressApp.use("/back-end", category);

// product routes
const product = require("./src/product/product_routes");
expressApp.use("/back-end", product);

// Reference route
const Reference = require("./src/reference/reference_routes");
expressApp.use("/back-end", Reference);

// lead status routes
const leadStatus = require("./src/lead_status/lead_route");
expressApp.use("/back-end", leadStatus);

// roles routes
const roles = require("./src/roles/roles_routes");
expressApp.use("/back-end", roles);

// point routes
// const point = require("./src/point/point_routes");
// expressApp.use("/back-end", point);

// customer route
const Customer = require("./src/customer/customer_routes");
expressApp.use("/back-end", Customer);

// employee route
// const Employee = require("./src/employee/employee_route");
// expressApp.use("/back-end", Employee);
// ################################ END #####################################################
const port = process.env.PORT || 8880;
expressApp.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
