const { Op } = require("sequelize");
const Roles = require("./roles_model")
const Permission = require('../permission/permission_model')
const RoleHasPermission = require('./roles_has_permission_model')

const index = async (req, res) => {

    const GetallRoles = await Roles.findAll();
    res.status(200).json(GetallRoles);
}
const create = async (req, res) => {
    const category = await Permission.findAll({
        where: {
            permission_category: 'CATEGORY',
        },
    });
    const task = await Permission.findAll({
        where: {
            permission_category: 'TASK',
        },
    });
    const reprot = await Permission.findAll({
        where: {
            permission_category: 'REPORT',
        },
    });
    const leads = await Permission.findAll({
        where: {
            permission_category: 'LEADS',
        },
    });


    const newUser = await Permission.findAll({
        where: {
            permission_category: 'NEWUSER',
        },
    });
    const roles = await Permission.findAll({
        where: {
            permission_category: 'ROLES',
        },
    });
    const point = await Permission.findAll({
        where: {
            permission_category: 'POINT',
        },
    });
    const customer = await Permission.findAll({
        where: {
            permission_category: 'CUSTOMER',
        },
    });
    const source = await Permission.findAll({
        where: {
            permission_category: 'SOURCE',
        },
    });
    const references = await Permission.findAll({
        where: {
            permission_category: 'REFERENCES',
        },
    });
    const city = await Permission.findAll({
        where: {
            permission_category: 'CITY',
        },
    });
    const salary = await Permission.findAll({
        where: {
            permission_category: 'SALARY',
        },
    });
    const product = await Permission.findAll({
        where: {
            permission_category: 'PRODUCT',
        },
    });
    const branch = await Permission.findAll({
        where: {
            permission_category: 'BRANCH',
        },
    });
    const leadsstatus = await Permission.findAll({
        where: {
            permission_category: 'LEADSSTATUS',
        },
    });
    const whatsapp = await Permission.findAll({
        where: {
            permission_category: 'WHATSAPP',
        },
    });
    const accountdepartment = await Permission.findAll({
        where: {
            permission_category: 'ACCOUNTDEPARTMENT',
        },
    });
    res.status(200).json({
        category, task, reprot, leads, newUser,
        roles, point, customer, source, references, city, salary, product
        , branch, leadsstatus, whatsapp, accountdepartment
        ,
    });
}
const store = async (req, res) => {
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

const update = async (req, res) => {
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
    create,
    store,
    update
}