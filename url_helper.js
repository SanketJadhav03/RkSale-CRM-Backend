const fs = require("fs");
const path = require("path");
const os = require("os");
const folderName = "RkSalesCrm";
const username = os.userInfo().username;
const folderPath = path.join(os.homedir(), "AppData", "Roaming", folderName);
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
  console.log(`Folder '${folderName}' created in ${folderPath}`);
} else {
  console.log(`Folder '${folderName}' already exists in ${folderPath}`);
}
module.exports = folderPath;
