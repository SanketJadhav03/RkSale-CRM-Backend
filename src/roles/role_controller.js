const Role = require('./role_model');
const RoleHasPermission = require('./role_has_permission_model');
const DB = require('../db/db_connection');

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
        role.role_name = role_name
        await role.save();
        // foo
        const oldPermissionsList = await RoleHasPermission.findAll({
            where: {
                rhp_role_id: role_id
            }
        })

        // DELETE THE OLD DATA
        for (const permissionId of oldPermissionsList) {
            try {
                await RoleHasPermission.destroy({
                    where: {
                        rhp_id: permissionId.rhp_id
                    }
                });
            } catch (error) {
                console.error("Error deleting record:", error);
            }
        }

        // CREATE NEW DATA
        for (const permissionId of permissionList) {
            if (permissionId.checked == true) {
                try {
                    await RoleHasPermission.create({
                        rhp_role_id: role.role_id,
                        rhp_permission_id: permissionId.permission_id
                    });
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        console.log("data created");
    } catch (error) {
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
async function getRoleById(req, res) {
    try {
        const roleId = req.params.id;
        const role = await Role.findByPk(roleId);
        DB.serialize(() => {
            DB.all(`SELECT * FROM role_has_permissions
            INNER JOIN permissions ON role_has_permissions.rhp_permission_id = permissions.permission_id
            WHERE rhp_role_id=${roleId}`, (err, rows) => {
                res.json({ rolesAndPermissionsData: rows, roless: role })
            })
        })
    } catch (error) {
        console.error(error);
        res.json({ error });
    }
}


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

// Get Permissions List
async function getPermissionsList(req, res) {
    const { role_id } = req.params
    DB.serialize(() => {
        DB.all(`
        SELECT * FROM role_has_permissions
        INNER JOIN permissions on permissions.permission_id = role_has_permissions.rhp_permission_id
        WHERE role_has_permissions.rhp_role_id = "${role_id}"
        `, (err, rows) => res.json(rows))
    })
}
module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
    getPermissionsList
};
