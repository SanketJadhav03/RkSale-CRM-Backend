const fs = require("fs").promises;
const path = require("path");
const url_helper = require("../url_helper");

const employee = path.join(`${url_helper}/all_images`, "employee");

// Create the "employee" directory
fs.mkdir(employee, { recursive: true })
  .then(() => {
    console.log(`Directory ${employee} created successfully.`);
  })
  .catch((error) => {
    console.error(`Error creating directory: ${error}`);
  });

