const { Op } = require("sequelize");
const Roles = require("./roles_model")
const Permission = require('../permission/permission_model')
const RoleHasPermission = require('./roles_has_permission_model')

const create = async(req,res)=>{
   const rhp_role_id = "1";
    await RoleHasPermission.create({
        rhp_role_id
    });
}

const store = async(req,res)=>{
try{



}catch(e){
console.log(e);
}
}

module.exports = {
    create,
    store
}