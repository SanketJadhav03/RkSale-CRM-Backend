const Permission = require('../src/permission/permission_model');
const RoleHasPermission = require('../src/roles/roles_has_permission_model');
const Roles = require('../src/roles/roles_model');
async function initializeDatabase() {
 

    const staticPermissions = [
      {
        permission_name: "Dashboard",
        permission_path: "/dashboard",
        permission_category: "DASHBOARD",
      }
    ];

    await Permission.bulkCreate(staticPermissions);
    console.log("Static permissions inserted successfully.");

    await Roles.create({ role_name: "Admin" });
    const permissionsLists = await Permission.findAll();
    for (const permissionId of permissionsLists) {
      await RoleHasPermission.create({
        rhp_role_id: 1,
        rhp_permission_id: permissionId.permission_id,
      });
    }
    console.log("Initialization successful.");
  }


module.exports = initializeDatabase();