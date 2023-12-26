const jwt = require("jsonwebtoken")
const User = require("./User_model")
const RoleHasPermission = require("../roles/role_has_permission_model")
const DB = require("../db/db_connection")
const url = require('url');

const checkPermissions = async (request, response, next) => {
    const urlPath = request.originalUrl;
    const finalURL = url.parse(urlPath).pathname

    const token = request.headers.authorization.split(" ")[1]
    if (token) {
        jwt.verify(token, "secret_key", async (err, decoded) => {
            if (err) {
                return response.json({ msg: "Invalid secret" })
            }
            const userDetails = await User.findOne({
                where: {
                    email: decoded.email
                }
            })

            if (userDetails.email == "admin") {
                next();
                return
            }
            // GETTING PERMISSIONS LIST
            DB.serialize(() => {
                DB.all(`SELECT * FROM role_has_permissions
                    INNER JOIN permissions on permissions.permission_id = role_has_permissions.rhp_permission_id
                    WHERE role_has_permissions.rhp_role_id = "${userDetails.user_role_id}" AND
                     permissions.permission_path = "${finalURL}"
                `, (err, rows) => {
                    if (rows.length > 0) {
                        console.log("has permission");
                        next();
                    }
                    else {
                        console.log(finalURL);
                        console.log("has no permission");
                        return response.status(401).json({ msg: "Unauthorized" });
                    }
                })
            })
        })
    }
    else {
        return response.json({ msg: "Invalid token" })
    }

}

module.exports = checkPermissions