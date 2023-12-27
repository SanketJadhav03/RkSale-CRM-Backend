const jwt = require("jsonwebtoken");
const User = require("./User_model");
const RoleHasPermission = require("../roles/role_has_permission_model");
const DB = require("../db/db_config");
const url = require('url');
const sequelize = require("../db/db_config");

const checkPermissions = async (request, response, next) => {
    const urlPath = request.originalUrl;
    const finalURL = url.parse(urlPath).pathname;

    const authorizationHeader = request.headers.authorization;
console.log(authorizationHeader);
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return response.status(401).json({ msg: "Invalid Token" });
    }

    const token = authorizationHeader.split(" ")[1];

    jwt.verify(token, "replace-with-a-strong-secret-key", async (err, decoded) => {
        if (err) {
            return response.status(401).json({ msg: "Invalid token 2" });
            console.log("invalid token 2");
        }
        console.log(decoded.email);

const userDetails = await User.findOne({
    where: {
        email: decoded.email,
        uid: decoded.userId
    }
  });   
  
  console.log(userDetails.user_role_id);
  if (userDetails.email === "admin") {
    next();
    return;
  }

  console.log(userDetails.user_role_id);
  
  // GETTING PERMISSIONS LIST
  const checkPermissionsFromDB = async (userDetails, permissionPath) => {
    try {
      const [results, metadata] = await sequelize.query(`
        SELECT * FROM role_has_permissions
        INNER JOIN permissions ON permissions.permission_id = role_has_permissions.rhp_permission_id
        WHERE role_has_permissions.rhp_role_id = :roleId
        AND permissions.permission_path = :permissionPath
      `, {
        replacements: { roleId: userDetails.user_role_id, permissionPath },
        type: sequelize.QueryTypes.SELECT,
      });
  
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  // Usage
  try {
    const rows = await checkPermissionsFromDB(userDetails, finalURL);
    if (rows.length > 0) {
      console.log("has permission");
      next();
    } else {
      console.log(finalURL);
      console.log("has no permission");
      return response.status(401).json({ msg: "Unauthorized" });
    }
  } catch (error) {
    return response.status(500).json({ msg: "Internal Server Error" });
  }
  
          // Usage
          try {
            const rows = await checkPermissionsFromDB(userDetails.user_role_id, finalURL);
            if (rows.length > 0) {
              console.log("has permission");
              next();
            } else {
              console.log(finalURL);
              console.log("has no permission");
              return response.status(401).json({ msg: "Unauthorized" });
            }
          } catch (error) {
            return response.status(500).json({ msg: "Internal Server Error" });
          }
          
    });
};

module.exports = checkPermissions;
