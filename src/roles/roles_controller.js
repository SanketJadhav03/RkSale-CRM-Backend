const { Op } = require("sequelize");
const Roles = require("./roles_model")
const Permission = require('../permission/permission_model')
const RoleHasPermission = require('./roles_has_permission_model')

const index = async(req,res) =>{

    const GetallRoles = await Roles.findAll();
    res.status(200).json(GetallRoles);
}

const store = async(req,res)=>{
    try {
        const { role_name, permissionsLists } = req.body;
        const role = await Roles.create({ role_name });
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

const update  = async(req,res)=>{
    try {
        const { role_name, permissionList, role_id } = req.body;
        const role = await Roles.findByPk(role_id);
        role.role_name = role_name
        await role.save();
        // foo
        const oldPermissionsList = await RoleHasPermission.findAll({
            where: {
                rhp_role_id: role_id
            }
        })
res.json(oldPermissionsList)
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

module.exports = {
    index,
    store,
    update
}