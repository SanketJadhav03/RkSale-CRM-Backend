const express = require("express");
const expressApp = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const axios = require('axios')
const fileUpload = require("express-fileupload");
const checked = require("./src/db/db_config");
const checkPermissions = require("./src/Auth/permissionMiddleware");

expressApp.use(express.json());
expressApp.use(cors());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.use(express.static(path.join(__dirname, "public/images")));
expressApp.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, //10 MB limit, adjust as needed
  })
);
// create data
checked
  .sync({ force: false }) // if false then not drop created table else it will drop tables and every time gives new tables


  .then(() => {
    require("./db/create_data");
    console.log("Database created!");
  })
  .catch((error) => {
    console.log(error);
  });





checked
  .sync({ alter: false }) // if false then not drop created table else it will drop tables and every time gives new tables
  .then(() => {
    require("./db/create_data");
    console.log("Database created!");
  })
  .catch((error) => {
    console.log(error);
  });

// user routes
const user = require("./src/Auth/User_route");
expressApp.use("/back-end", user);
// city routes
const city = require("./src/city/city_route");
expressApp.use("/back-end", city);

// // source routes
const source = require("./src/source/source_route");
expressApp.use("/back-end", source);
// // source routes
const leave = require("./src/Leave/leave_routes");
expressApp.use("/back-end", leave);

// category routes
const category = require("./src/category/category_routes");
expressApp.use("/back-end", category);

// shift lead and task routes
const shiftLeadTask = require("./src/shift_lead_task/shiftleadtask_route");
expressApp.use("/back-end", shiftLeadTask);

// follow up routes
const FollowUp = require("./src/follow_up/follow_up_route");
expressApp.use("/back-end", FollowUp);

// product routes
const product = require("./src/product/product_routes");
expressApp.use("/back-end", product);

const customer_group = require("./src/customer_group/customer_group_routes");
expressApp.use("/back-end", customer_group);

// Reference route
const Reference = require("./src/reference/reference_routes");
expressApp.use("/back-end", Reference);

// lead status routes
const leadStatus = require("./src/lead_status/lead_route");
expressApp.use("/back-end", leadStatus);
// Expences_Category  routes
const Expences_Category = require("./src/expences_category/expences_category_routes");
expressApp.use("/back-end", Expences_Category);
// Related  routes
const related = require("./src/related/related_route");
expressApp.use("/back-end", related);
// Tag  routes
const tags = require("./src/tags/tags_route");
expressApp.use("/back-end", tags);
// Tag  routes
const industry = require("./src/Indusrty/Indusrty_route");
expressApp.use("/back-end", industry);
// business setting  routes
const business_setting = require("./src/business_settings/business_routes");
expressApp.use("/back-end", business_setting);
// payment_type  routes
const payment_type = require("./src/payment_type/payment_type_routes");
expressApp.use("/back-end", payment_type);

// roles routes
const roles = require("./src/roles/role_routes");
expressApp.use("/back-end", roles);
// point routes

// ROLES & PERMISSIONS ROUTE


const permissions = require("./src/permissions/permission_route");
expressApp.use("/back-end", permissions);

// customer route
const Customer = require("./src/customer/customer_routes");
expressApp.use("/back-end", Customer);

// employee route
// const Employee = require("./src/employee/employee_route");
// expressApp.use("/back-end", Employee);

const SubCategory = require("./src/subcategory/subcategory_routes");
expressApp.use("/back-end", SubCategory);

const Leads = require("./src/leads/leads_routes");
expressApp.use("/back-end", Leads);

// Task Routes
const task = require("./src/task/task_routes");
expressApp.use("/back-end", task);

// Shift Routes
const shift = require("./src/shift/shift_routes");
expressApp.use("/back-end", shift);

// Attendance Routes
const attendance = require("./src/attendance/attendance_routes");
expressApp.use("/back-end", attendance);
// todo Routes
const todo = require("./src/todo/todo_route");
expressApp.use("/back-end", todo);

const notification = require("./src/notification/notification_routes");
expressApp.use("/back-end", notification);

const payment_mode = require("./src/payment_mode/payment_mode_routes");
expressApp.use("/back-end", payment_mode);

const payment = require("./src/payment/payment_routes");
expressApp.use("/back-end", payment);

const salary = require("./src/salary/salary_routes");
expressApp.use("/back-end", salary);


const dashboard = require("./src/dashboard/dashboard_route");
expressApp.use("/back-end", dashboard);


const message = require('./src/message/message_routes')
expressApp.use("/back-end", message)


// ################################ END #####################################################
const port = process.env.PORT || 8880;
expressApp.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
