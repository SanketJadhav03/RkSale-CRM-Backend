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
      permission_path: 1,
      permission_category: "DASHBOARD",
    },
    {
      permission_name: "user-dashboard",
      permission_path: 2,
      permission_category: "DASHBOARD",
    },
    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "LEAD",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "LEAD",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "LEAD",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
      permission_category: "LEAD",
    },


    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "TASK",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "TASK",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "TASK",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
      permission_category: "TASK",
    },


    {
      permission_name: "Settings",
      permission_path: 0,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Category",
      permission_path: 1,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "City ",
      permission_path: 2,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Source ",
      permission_path: 3,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Reference ",
      permission_path: 4,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Product ",
      permission_path: 5,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Paymenttype  ",
      permission_path: 6,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Paymentmode  ",
      permission_path: 7,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Shift ",
      permission_path: 8,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Leads Status",
      permission_path: 9,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Expencess Type ",
      permission_path: 10,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Tags",
      permission_path: 11,
      permission_category: "SETTINGS",
    },
    {
      permission_name: "Message",
      permission_path: 12,
      permission_category: "SETTINGS",
    }, {
      permission_name: "Customer Group",
      permission_path: 13,
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


    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
      permission_category: "CUSTOMER",
    },

    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
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
      permission_name: "List",
      permission_path: 1,
      permission_category: "LEAVE",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "LEAVE",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "LEAVE",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
      permission_category: "LEAVE",
    },

    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "ROLES",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "ROLES",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "ROLES",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
      permission_category: "ROLES",
    },
    {
      permission_name: "SalaryGeneration",
      permission_path: "/salary-generation",
      permission_category: "SALARYGENERATION",
    },


    {
      permission_name: "List",
      permission_path: 1,
      permission_category: "PAYMENT",
    },
    {
      permission_name: "Create",
      permission_path: 2,
      permission_category: "PAYMENT",
    },
    {
      permission_name: "Update",
      permission_path: 3,
      permission_category: "PAYMENT",
    },
    {
      permission_name: "Delete",
      permission_path: 4,
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
