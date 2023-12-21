// # in working don't push
const { Op } = require("sequelize");
const Employee = require("./employee_model");
const sequelize = require("../db/db_config");
const url_helper = require("../../url_helper");
const path = require("path");
const fs = require("fs").promises;

const index = async (req, res) => {
  try {
    const employee = await sequelize.query(
      `select * from tbl_employees 

      `,
      {
        model: Employee,
        mapToModel: true,
      }
    );
    res.json(employee);
  } catch (error) {
    console.log(error);
  }
};
const store = async (req, res) => {
  try {
    const {
      employee_name,
      employee_eid,
      employee_mobile,
      employee_salary,
      employee_email,
      employee_password,
      employee_emergency,
      employee_address,
      employee_role,
    } = req.body;

    const rootPath = process.cwd();

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const employeeProfile = req.files.employee_profile;
    const employeeAdhaar = req.files.employee_aadhar;
    const employeePan = req.files.employee_pan;
    const employeeQrCode = req.files.employee_qr_code;

    const validateAndMove = (file, uploadPath) => {
      if (!file) {
        // Skip the file if it's null
        console.log("File is null");
        return null;
      }

      if (!file.name) {
        return res.status(400).json({ error: "Invalid file object" });
      }

      file.mv(uploadPath, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).json({ error: "Error uploading file" });
        }
        // Do something with the file path, for example, save it in the database
        // ...
      });

      return file.filename; // Return the filename for use in the database
    };

    const employeeAdhaarFilename = validateAndMove(
      employeeAdhaar,
      path.join(
        rootPath,
        "public/images/employee",
"crm"+"-"+ (employeeAdhaar ? employeeAdhaar.name : "")
      )
    );
    const employeeProfileFilename = validateAndMove(
      employeeProfile,
      path.join(
        rootPath,
        "public/images/employee",
        "crm"+"-" + (employeeProfile ? employeeProfile.name : "")
      )
    );
    const employeePanFilename = validateAndMove(
      employeePan,
      path.join(
        rootPath,
        "public/images/employee",
       "crm" +"-" + (employeePan ? employeePan.name : "")
      )
    );
    const employeeQrCodeFilename = validateAndMove(
      employeeQrCode,
      path.join(
        rootPath,
        "public/images/employee",
       "crm" +"-" + (employeeQrCode ? employeeQrCode.name : "")
      )
    );
    // Check if at least one file is present

    const employee = await Employee.create({
      employee_name,
      employee_eid,
      employee_mobile,
      employee_salary,
      employee_email,
      employee_password,
      employee_emergency,
      employee_address,
      employee_role,
      employee_aadhar: req.files.employee_profile.filename,
      employee_profile: employeeAdhaar.name,
      employee_pan: employeePan.name,
      employee_qr_code: employeeQrCode.name,
    });

    return res
      .status(200)
      .json({ data: employee, message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ error: "Error handling file upload" });
  }
};
const show = async (req, res) => {
  try {
    const { id } = req.params;
    const leadStatus = await Employee.findByPk(id);
    if (!leadStatus) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(leadStatus);
  } catch (error) {
    console.error("Error showing leadStatus by id:", error);
    res.status(500).json({ error: "Error showing leadStatus by id" });
  }
};
const updated = async (req, res) => {
  try {
    const {
      employee_id,
      employee_name,
      employee_eid,
      employee_mobile,
      employee_salary,
      employee_email,
      employee_password,
      employee_emergency,
      employee_address,
      employee_role,
    } = req.body;
    const existingEmployee = await Employee.findOne({
      where: {
        employee_eid: employee_eid,
        employee_id: { [Op.ne]: employee_id },
      },
    });
    if (existingEmployee) {
      return res.json({ message: "Employee Eid already exists", status: 0 });
    }
    const employeeStatus = await Employee.findByPk(employee_id);
    if (!employeeStatus) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let employee_profile = null;
    if (req.files["employee_profile"] == undefined) {
      employee_profile = employeeStatus.employee_profile;
    } else {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_profile
      );
      await fs.unlink(imagePath);
      employee_profile = req.files["employee_profile"][0].filename;
    }

    let employee_aadhar = null;
    if (req.files["employee_aadhar"] == undefined) {
      employee_aadhar = employeeStatus.employee_aadhar;
    } else {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_aadhar
      );
      await fs.unlink(imagePath);
      employee_aadhar = req.files["employee_aadhar"][0].filename;
    }
    let employee_pan = null;
    if (req.files["employee_pan"] == undefined) {
      employee_pan = employeeStatus.employee_pan;
    } else {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_pan
      );
      await fs.unlink(imagePath);
      employee_pan = req.files["employee_pan"][0].filename;
    }

    let employee_qr_code = null;
    if (req.files["employee_qr_code"] == undefined) {
      employee_qr_code = employeeStatus.employee_qr_code;
    } else {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_qr_code
      );
      await fs.unlink(imagePath);
      employee_qr_code = req.files["employee_qr_code"][0].filename;
    }

    await employeeStatus.update({
      employee_name,
      employee_eid,
      employee_mobile,
      employee_salary,
      employee_email,
      employee_password,
      employee_emergency,
      employee_address,
      employee_role,
      employee_aadhar,
      employee_profile,
      employee_pan,
      employee_qr_code,
    });
    return res.json({ message: "Employee updated successfully!", status: 1 });
  } catch (error) {
    console.error("Error updating Employee:", error);
    res.status(500).json({ error: "Error updating Employee" });
  }
};
const deleted = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeStatus = await Employee.findByPk(id);
    const deactivatedemployee = await employeeStatus.update({
      employee_status: 2,
    });

    if (deactivatedemployee) {
      res.json({ message: "Employee Deactivated Successfullly" });
    } else {
      res.json({ message: "Employee Deactivation Failed" });
    }
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  index,
  store,
  show,
  updated,
  deleted,
};
