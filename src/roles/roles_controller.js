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

module.exports = {
    index,
    store
}