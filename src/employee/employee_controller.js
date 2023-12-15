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
      Inner join tbl_roles on tbl_roles.role_id = tbl_employees.employee_role
      Inner join tbl_branches on tbl_branches.branch_id = tbl_employees.employee_branch
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
      employee_branch,
      employee_hr_access,
      employee_emergency,
      employee_address,
      employee_role,
    } = req.body;
    const existingEmployee = await Employee.findOne({
      where: {
        employee_name: employee_name,
      },
    });

    if (existingEmployee) {
      return res.json({ message: "Employee name already exists", status: 0 });
    }
    let employee_profile = null;
    if (req.files["employee_profile"] && req.files["employee_profile"][0]) {
      employee_profile = req.files["employee_profile"][0].filename;
    }

    let employee_aadhar = null;
    if (req.files["employee_aadhar"] && req.files["employee_aadhar"][0]) {
      employee_aadhar = req.files["employee_aadhar"][0].filename;
    }
    let employee_pan = null;
    if (req.files["employee_pan"] && req.files["employee_pan"][0]) {
      employee_pan = req.files["employee_pan"][0].filename;
    }

    let employee_qr_code = null;
    if (req.files["employee_qr_code"] && req.files["employee_qr_code"][0]) {
      employee_qr_code = req.files["employee_qr_code"][0].filename;
    }

    await Employee.create({
      employee_name,
      employee_eid,
      employee_mobile,
      employee_salary,
      employee_email,
      employee_password,
      employee_branch,
      employee_hr_access,
      employee_emergency,
      employee_address,
      employee_role,
      employee_aadhar,
      employee_profile,
      employee_pan,
      employee_qr_code,
    });
    return res
      .status(201)
      .json({ message: "Employee added successfully", status: 1 });
  } catch (error) {
    console.error("Error adding leadStatus:", error);
    res.status(500).json({ error: "Error adding leadStatus" });
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
      employee_branch,
      employee_hr_access,
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
      employee_branch,
      employee_hr_access,
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
    if (!employeeStatus) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (employeeStatus.employee_aadhar != null) {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_aadhar
      );
      await fs.unlink(imagePath);
    }
    if (employeeStatus.employee_qr_code != null) {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_qr_code
      );
      await fs.unlink(imagePath);
    }
    if (employeeStatus.employee_profile != null) {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_profile
      );
      await fs.unlink(imagePath);
    }
    if (employeeStatus.employee_pan != null) {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        employeeStatus.employee_pan
      );
      await fs.unlink(imagePath);
    }

    await employeeStatus.destroy();
    return res.json({ message: "Employee deleted successfully!", status: 1 });
  } catch (error) {
    console.error("Error deleting Employee:", error);
    res.status(500).json({ error: "Error deleting Employee:" });
  }
};
module.exports = {
  index,
  store,
  show,
  updated,
  deleted,
};
