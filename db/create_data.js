const Permission = require('../src/permission/permission_model');
const RoleHasPermission = require('../src/roles/roles_has_permission_model');
const Roles = require('../src/roles/roles_model');
async function initializeDatabase() {
 

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
      }
    ];

      await Permission.bulkCreate(staticPermissions);
      console.log("Static permissions inserted successfully.");

      await Roles.create({ role_name: "Admin" });
      const permissionsLists = await Permission.findAll();
      for (const permission of permissionsLists) {
        await RoleHasPermission.create({
          rhp_role_id: 2,
          rhp_permission_id: permission.permission_id,
        });
      }
      
      console.log("Initialization successful.");
  }


module.exports = initializeDatabase();