const Role = require('./role_model');
const RoleHasPermission = require('./role_has_permission_model');

const sequelize = require('../db/db_config');
const { QueryTypes } = require('sequelize');

// Create a new role
async function createRole(req, res) {
  try {
    const { role_name, permissionsLists } = req.body;
    const role = await Role.create({ role_name });
    for (const permissionId of permissionsLists) {
      await RoleHasPermission.create({
        rhp_role_id: role.role_id,
        rhp_permission_id: permissionId
      });
    }
    return res.json({ code: 1 });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, code: 123 });
  }
}

// Update an existing role
async function updateRole(req, res) {
  try {
    const { role_name, permissionList, role_id } = req.body;
    const role = await Role.findByPk(role_id);

    // Update role name
    role.role_name = role_name;
    await role.save();

    // Delete old permissions
    await RoleHasPermission.destroy({
      where: {
        rhp_role_id: role_id
      }
    });


    // Create new permissions
    for (const permissionId of permissionList) {

      // console.log(permissionId);

      try {
        await RoleHasPermission.create({
          rhp_role_id: role_id,
          rhp_permission_id: permissionId
        });
      } catch (err) {
        console.error("Error creating permission:", err);
      }

    }


    res.json({ message: "Role Updated Successfully !!", status: 1 });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error });
  }
}


// Get all roles
async function getAllRoles(req, res) {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

// Get a single role by ID
const getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    console.log(roleId);

    const rolesAndPermissionsData = await sequelize.query(
      "SELECT * FROM role_has_permissions " +
      "INNER JOIN permissions ON role_has_permissions.rhp_permission_id = permissions.permission_id " +
      "WHERE rhp_role_id = :roleId",
      {
        replacements: { roleId },
        type: QueryTypes.SELECT,
      }
    );

    res.json({ rolesAndPermissionsData });
  } catch (error) {
    console.error(error);
    res.json({ error });
  }
};


// Delete a role by ID
async function deleteRole(req, res) {
  try {
    const roleId = req.params.id;
    const role = await Role.findByPk(roleId);
    if (role) {
      await role.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete the role' });
  }
}


module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  // getPermissionsList
};
