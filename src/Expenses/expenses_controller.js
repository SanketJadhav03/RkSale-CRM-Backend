const { Op } = require("sequelize");
const Expenses = require("./expenses_model");
const sequelize = require("../db/db_config");
const url_helper = require("../../url_helper");
const path = require("path");
const fs = require("fs").promises;

const index = async (req, res) => {
  try {
    const expensesDetails = await Expenses.findAll();
    res.json(expensesDetails);
  } catch (error) {
    console.log(error);
  }
};
const store = async (req, res) => {
  try {
    const {
      expenses_date,
      expenses_amount,
      expenses_description,
      expenses_status,
    } = req.body;
    let expenses_image = null;
    if (req.files["expenses_image"] && req.files["expenses_image"][0]) {
      expenses_image = req.files["expenses_image"][0].filename;
    }
    await Expenses.create({
      expenses_date,
      expenses_amount,
      expenses_image,
      expenses_description,
      expenses_status,
    });
    return res
      .status(201)
      .json({ message: "Expenses added successfully", status: 1 });
  } catch (error) {
    console.error("Error adding expenses:", error);
    res.status(500).json({ error: "Error adding expenses" });
  }
};
const show = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expenses.findByPk(id);
    if (!expenses) {
      return res.status(404).json({ error: "Expenses not found" });
    }
    res.json(expenses);
  } catch (error) {
    console.error("Error showing expenses by id:", error);
    res.status(500).json({ error: "Error showing expenses by id" });
  }
};
const updated = async (req, res) => {
  try {
    const {
      expenses_id,
      expenses_date,
      expenses_amount,
      expenses_description,
      expenses_status,
    } = req.body;
    const expenses = await Expenses.findByPk(expenses_id);
    if (!expenses) {
      return res.status(404).json({ error: "Expenses not found" });
    }
    let expenses_image = null;
    if (req.files["expenses_image"] == undefined) {
      expenses_image = employeeStatus.expenses_image;
    } else {
      const imagePath = path.join(
        `${url_helper}/all_images/expenses`,
        employeeStatus.expenses_image
      );
      await fs.unlink(imagePath);
      expenses_image = req.files["expenses_image"][0].filename;
    }

    await expenses.update({
      expenses_date,
      expenses_amount,
      expenses_description,
      expenses_image,
      expenses_status,
    });
    return res.json({ message: "Expenses updated successfully!", status: 1 });
  } catch (error) {
    console.error("Error updating expenses:", error);
    res.status(500).json({ error: "Error updating expenses" });
  }
};
const deleted = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expenses.findByPk(id);
    if (!expenses) {
      return res.status(404).json({ error: "Expenses not found" });
    }

    if (expenses.expenses_image != null) {
      const imagePath = path.join(
        `${url_helper}/all_images/employee`,
        expenses.expenses_image
      );
      await fs.unlink(imagePath);
    }

    await expenses.destroy();
    return res.json({
      message: "Expenses deleted successfully!",
      status: 1,
    });
  } catch (error) {
    console.error("Error deleting expenses:", error);
    res.status(500).json({ error: "Error deleting expenses:" });
  }
};
module.exports = {
  index,
  store,
  show,
  updated,
  deleted,
};
