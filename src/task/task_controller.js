const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const Task = require("./task_model");
const fs = require("fs");
const path = require("path");
const Notifaction = require("../notification/notification_model");

const store = async (req, res) => {
  try {
    const {
      customer,
      product,
      value,
      today_date,
      minimum_due_date,
      ref_by,
      maximum_due_date,
      source,
      priority,
      description,
      assigned_by,
      tags,
      repeat_every_day,
      status,
    } = req.body;
    const rootPath = process.cwd();

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

      return file.name; // Return the filename for use in the database
    };
    const image = req.files.image;
    const imagepath = validateAndMove(
      image,
      path.join(
        rootPath,
        "public/images/task",
        "crm" + "-" + (image ? image.name : null)
      )
    );

    const newtask = await Task.create({
      customer: customer,
      product: product,
      value: value,
      today_date: today_date,
      minimum_due_date: minimum_due_date,
      ref_by: ref_by,
      maximum_due_date: maximum_due_date,
      source: source,
      priority: priority,
      description: description,
      assigned_by: assigned_by,
      tags: tags,
      repeat_every_day: repeat_every_day,
      status: status,
      image: imagepath,
    });
    await Notifaction.create({
      customer_id: customer,
      lead_id: 0,
      task_id: newtask.task_id,
      customer_notification: 1,
      notification_type: 2,
    });

    return res.json({ message: "Lead added successfully!", status: 1 });
  } catch (error) {
    console.log(error);
  }
};

const index = async (req, res) => {
  try {
    const data = await sequelize.query(
      `SELECT * FROM tbl_tasks 
        INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
        INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
        INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
        INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
        INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
        `,
      {
        type: QueryTypes.SELECT,
        model: Task, // Specify the model for Sequelize to map the result to
      }
    );
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sequelize.query(
      `SELECT * FROM tbl_tasks 
        INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
        INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
        INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
        INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
        INNER JOIN tbl_lead_statuses ON tbl_task.status = tbl_lead_statuses.lead_status_id
        WHERE tbl_tasks.task_id = :id
        `,

      {
        replacements: { id },
        type: QueryTypes.SELECT, // Specify the model for Sequelize to map the result to
      }
    );

    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Show By Id " });
  }
};

const update = async (req, res) => {
  try {
    const {
      task_id,
      customer,
      product,
      value,
      today_date,
      minimum_due_date,
      ref_by,
      maximum_due_date,
      source,
      priority,
      description,
      assigned_by,
      tags,
      repeat_every_day,
      status,
    } = req.body;
    const existingtask = await Task.findByPk(task_id);
    if (!existingtask) {
      return res.status(404).json({ message: "Lead Not Found" });
    }

    // res.json(existinglead)
    // Check if a new file is provided in the request
    if (req.files && req.files.image) {
      const uploadedFile = req.files.image;
      const filePath = `public/images/task/${"crm-" + existingtask.image}`;

      // Remove the existing file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting existing file:", err);
        }
      });

      // Save the new file
      uploadedFile.mv(
        `public/images/task/${"crm-" + uploadedFile.name}`,
        (err) => {
          if (err) {
            console.error("Error saving new file:", err);
          }
        }
      );
    }

    const updatedtask = await existingtask.update({
      customer: customer,
      product: product,
      value: value,
      today_date: today_date,
      minimum_due_date: minimum_due_date,
      ref_by: ref_by,
      maximum_due_date: maximum_due_date,
      source: source,
      priority: priority,
      description: description,
      assigned_by: assigned_by,
      tags: tags,
      status: status,
      file:
        req.files && req.files.image
          ? req.files.image.name
          : existinglead.image,
    });

    if (updatedtask) {
      return res.json({ message: "Lead added successfully!", status: 1 });
    } else {
      res.json({ message: "Task Updated Failed", status: 0 });
    }
  } catch (error) {
    console.log(error);
  }
};

const filterData = async (req, res) => {
  try {
    const { start_date, end_date, customer_name, assigned_by } = req.body;
    let sql = `SELECT * 
    FROM tbl_tasks 
    INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
    INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
    INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
    INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
    INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
    WHERE today_date >= :startDate AND today_date <= :endDate`;
    const replacements = {
      startDate: start_date,
      endDate: end_date,
    };
    if (customer_name > 0) {
      sql += ` AND tbl_tasks.customer = :customer_name`;
      replacements.customer_name = customer_name;
    }
    if (assigned_by > 0) {
      sql += ` AND FIND_IN_SET(${assigned_by}, REPLACE(REPLACE(assigned_by, '[', ''), ']', ''))`;
      replacements.assigned_by = assigned_by;
    }
    const data = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      model: Task,
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  store,
  index,
  show,
  update,
  filterData,
};
