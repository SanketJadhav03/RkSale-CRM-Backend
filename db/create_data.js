const User = require("../src/Auth/User_model");
const Shift = require("../src/shift/shift_model");
const Permission = require("../src/permissions/permission_model");
const RoleHasPermission = require("../src/roles/role_has_permission_model");
const bcrypt = require("bcrypt");
const IndustryType = require("../src/Indusrty/Indusrty_model");

const Role = require("../src/roles/role_model");
async function initializeDatabase() {
  const hashedPassword = await bcrypt.hash("super@ajspire.com", 10);
  await User.create({
    name: "Super Admin",
    u_type: 1,
    user_role_id: 1,
    mobile_no: "9595775123",
    password: hashedPassword,
    email: "super@ajspire.com",
    id: 1,
  });
  await Shift.create({
    shift_name: "FIRST",
    shift_intime: "10:39:00",
    shift_outime: "17:39:00",
    shift_status: 1,
  });


  await IndustryType.bulkCreate([
    {
      industry_type_name: "Food industry",
      industry_type_id: 1,
    },
    {
      industry_type_name: "Construction",
      industry_type_id: 2,
    },
    {
      industry_type_name: "Transport",
      industry_type_id: 3,
    },
    {
      industry_type_name: "Manufacturing",
      industry_type_id: 4,
    },
    {
      industry_type_name: "Agriculture",
      industry_type_id: 5,
    },
    {
      industry_type_name: "Retail",
      industry_type_id: 6,
    },
    {
      industry_type_name: "Mining",
      industry_type_id: 7,
    },
    {
      industry_type_name: "Energy industry",
      industry_type_id: 8,
    },
    {
      industry_type_name: "Entertainment",
      industry_type_id: 9,
    },
    {
      industry_type_name: "Financial services",
      industry_type_id: 10,
    },

    {
      industry_type_name: "Hospitality industry",
      industry_type_id: 11,
    },
    {
      industry_type_name: "Automotive industry",
      industry_type_id: 12,
    },
    {
      industry_type_name: "Media",
      industry_type_id: 13,
    },
    {
      industry_type_name: "Aerospace",
      industry_type_id: 14,
    },
    {
      industry_type_name: "Business",
      industry_type_id: 15,
    },
    {
      industry_type_name: "Metal",
      industry_type_id: 16,
    },
    {
      industry_type_name: "Engineering",
      industry_type_id: 17,
    },
    {
      industry_type_name: "Pharmaceutical industry",
      industry_type_id: 18,
    },
    {
      industry_type_name: "Clothing industry",
      industry_type_id: 19,
    },
    {
      industry_type_name: "Rail transport",
      industry_type_id: 20,
    },
    {
      industry_type_name: "Software industry",
      industry_type_id: 21,
    },
    {
      industry_type_name: "Chemical industry",
      industry_type_id: 22,
    },
  ]);
  const staticPermissions = [
    {
      permission_name: "dashboard",
      permission_path: "/",
      permission_category: "DASHBOARD",
    },
    // {
    //   permission_name: "user-dashboard",
    //   permission_path: "/user-dashboard",
    //   permission_category: "DASHBOARD",
    // },
    {
      permission_name: "lead list",
      permission_path: "/leads-list/:type?/:status?",
      permission_category: "LEAD",
    },
    {
      permission_name: "task list",
      permission_path: "/task-list/:type?/:status?",
      permission_category: "TASK",
    },
    {
      permission_name: "Settings",
      permission_path: "/settings",
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Reports",
      permission_path: "/reports",
      permission_category: "REPORTS",
    },
    {
      permission_name: "Accounts",
      permission_path: "/account",
      permission_category: "ACCOUNTS",
    },
    // {
    //   permission_name: "category list",
    //   permission_path: "/category-list",
    //   permission_category: "CATEGORY",
    // },
    // {
    //   permission_name: "city list",
    //   permission_path: "/city-list",
    //   permission_category: "CITY",
    // },
    // {
    //   permission_name: "source list",
    //   permission_path: "/source-list",
    //   permission_category: "SOURCE",
    // },
    // {
    //   permission_name: "reference list",
    //   permission_path: "/References-list",
    //   permission_category: "REFERENCE",
    // },
    // {
    //   permission_name: "product list",
    //   permission_path: "/product-list",
    //   permission_category: "PRODUCT",
    // },
    // {
    //   permission_name: "paymenttype-list ",
    //   permission_path: "/paymenttype-list",
    //   permission_category: "PAYMENT_TYPE",
    // },
    // {
    //   permission_name: "paymentmode-list ",
    //   permission_path: "/paymentmode-list",
    //   permission_category: "PAYMENT_MODE",
    // },
    // {
    //   permission_name: "shift-list",
    //   permission_path: "/shift-list",
    //   permission_category: "SHIFT",
    // },
    // {
    //   permission_name: "leads_status-list",
    //   permission_path: "/leads_status-list",
    //   permission_category: "LEADS_STATUS",
    // },
    // {
    //   permission_name: "related list",
    //   permission_path: "/related_to-list",
    //   permission_category: "RELATED_TO",
    // },
    // {
    //   permission_name: "tags list",
    //   permission_path: "/tags-list",
    //   permission_category: "TAGS",
    // },
    {
      permission_name: "customer-list",
      permission_path: "/customer-list",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "employee list",
      permission_path: "/users-list",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "attendence",
      permission_path: "/attendence",
      permission_category: "ATTENDENCE",
    },
    // {
    //   permission_name: "attendence admin list",
    //   permission_path: "/attendence-lists/:type?",
    //   permission_category: "ATTENDENCE",
    // },
    // {
    //   permission_name: "attendence-list",
    //   permission_path: "/attendence-list",
    //   permission_category: "ATTENDENCE",
    // },
    {
      permission_name: "Leave-list",
      permission_path: "/leave/:type?",
      permission_category: "LEAVE",
    },

    {
      permission_name: "Roles list",
      permission_path: "/roles-list",
      permission_category: "ROLES",
    },

    {
      permission_name: "SalaryGeneration",
      permission_path: "/salary-generation",
      permission_category: "SALARYGENERATION",
    },


    {
      permission_name: "Payment list",
      permission_path: "/payment",
      permission_category: "PAYMENT",
    },

    {
      permission_name: "TODO list",
      permission_path: "/todo",
      permission_category: "TODO",
    },


    {
      permission_name: "UserProfile",
      permission_path: "/profile",
      permission_category: "USERPROFILE",
    },
    {
      permission_name: "BusinessProfile",
      permission_path: "/business-setting",
      permission_category: "BUSINESSPROFILE",
    },
  ];

  await Permission.bulkCreate(staticPermissions);
  console.log("Static permissions inserted successfully.");
  const role_name = "admin";
  await Role.create({ role_name });
  const permissionsLists = await Permission.findAll();
  for (const permission of permissionsLists) {
    await RoleHasPermission.create({
      rhp_role_id: 1,
      rhp_permission_id: permission.permission_id,
    });
  }

  console.log("Initialization successful.");
}

const findindAlready = async () => {
  try {
    if ((await User.count()) == 0) {
      initializeDatabase();
    } else {
      console.error("Unable to create database");
    }
  } catch (error) {
    console.log("Error");
  }
};
module.exports = findindAlready();
