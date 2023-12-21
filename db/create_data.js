const User = require("../src/Auth/User_model");
const Permission = require("../src/permissions/permission_model");
const RoleHasPermission = require("../src/roles/role_has_permission_model");
const bcrypt = require("bcrypt");
const Role = require("../src/roles/role_model");
async function initializeDatabase() {
  const hashedPassword = await bcrypt.hash("super@ajspire.com", 10);
  await User.create({
    name: "Super Admin",
    mobile_no: "9595775123",
    password: hashedPassword,
    email: "super@ajspire.com",
    id: 1,
  });
  const staticPermissions = [
    {
      permission_name: "dashboard",
      permission_path: "/dashboard",
      permission_category: "DASHBOARD",
    },
    {
      permission_name: "category",
      permission_path: "/category",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "brand",
      permission_path: "/brand",
      permission_category: "BRAND",
    },
    {
      permission_name: "sidebar",
      permission_path: "/sidebar",
      permission_category: "SIDEBAR",
    },
  ];

  await Permission.bulkCreate(staticPermissions);
  console.log("Static permissions inserted successfully.");

  await Role.create({ role_name: "Admin" });
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
