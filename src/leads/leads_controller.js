const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const Leads = require("./leads_model");
const path = require("path");
const fs = require("fs");
const Notifaction = require("../notification/notification_model");
const Product = require("../product/product_model");
const Customer = require("../customer/customer_model");

const store = async (req, res) => {
  try {
    const {
      customer,
      lead_created_by,
      total_cycles,
      product,
      value,
      today_date,
      minimum_due_date,
      ref_by,
      maximum_due_date,
      source,
      priority,
      description,
      repeat_every_day,
      assigned_by,
      tags,
      status,
    } = req.body;

    let imageFilenames = [];

    if (req.files !== null) {
      const rootPath = process.cwd();

      // Function to validate and move each image
      const validateAndMove = (file) => {
        if (!file) {
          // Skip the file if it's null
          console.log("File is null");
          return null;
        }

        if (!file.name) {
          return res.status(400).json({ error: "Invalid file object" });
        }

        const uploadPath = path.join(
          rootPath,
          "public/images/leads",
          file.name
        );

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

      // Validate and move each image
      if (Array.isArray(req.files["image[]"])) {
        // Validate and move each image
        imageFilenames = req.files["image[]"].map((image) =>
          validateAndMove(image)
        );
      } else {
        // Only one image is coming
        const singleImage = req.files["image[]"];
        imageFilenames.push(validateAndMove(singleImage));
      }
    }

    const assignedByArray = JSON.parse(assigned_by);

    const newLead = await Leads.create({
      lead_created_by: lead_created_by,
      total_cycles: total_cycles,
      customer: customer ? customer : null,
      product: product ? product : null,
      value: value ? value : null,
      today_date: today_date ? today_date : null,
      minimum_due_date: minimum_due_date ? minimum_due_date : null,
      ref_by: ref_by ? ref_by : null,
      maximum_due_date: maximum_due_date ? maximum_due_date : null,
      source: source ? source : null,
      priority: priority ? priority : null,
      description: description ? description : null,
      assigned_by: assigned_by ? assigned_by : null,
      tags: tags ? tags : null,
      repeat_every_day: repeat_every_day,
      status: status ? status : null,
      image: `[${imageFilenames}]`, // Use array of image filenames
    });

    const productdata = await Product.findOne({
      where: {
        product_id: product
      }
    })


    const customerData = await Customer.findOne({
      where: {
        customer_id: customer
      }
    })
    await Promise.all(
      assignedByArray.map(async (assignedUserId) => {
        await Notifaction.create({
          user_id: assignedUserId,
          assigned_data_id: newLead.lead_id,
          notification_description: `lead Assigned of ${productdata.product_name}, ${customerData.customer_name}`,
          notification_type: 2,
        });
      })
    );
    return res.json({ message: "Lead added successfully!", status: 1 });
  } catch (error) {
    console.log(error);
    return res.json({ error: "Failed To Create Lead !!" });
  }
};

const index = async (req, res) => {
  try {
    const data = await sequelize.query(
      `SELECT * FROM tbl_leads 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN users ON tbl_leads.lead_created_by = users.uid
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
      `,
      {
        type: QueryTypes.SELECT,
        model: Leads, // Specify the model for Sequelize to map the result to
      }
    );
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get Leads" });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sequelize.query(
      `SELECT * FROM tbl_leads 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
    WHERE tbl_leads.lead_id = :id
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
      lead_id,
      lead_created_by,
      total_cycles,
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
      repeat_every_day,
      assigned_by,
      tags,
      status,
    } = req.body;
    const existinglead = await Leads.findByPk(lead_id);
    if (!existinglead) {
      return res.status(404).json({ message: "Lead Not Found" });
    }

    let imageFilenames = [];
    if (req.files != null) {
      const rootPath = process.cwd();

      // Function to validate and move each image
      const validateAndMove = (file) => {
        if (!file) {
          // Skip the file if it's null
          console.log("File is null");
          return null;
        }

        if (!file.name) {
          return res.status(400).json({ error: "Invalid file object" });
        }

        const uploadPath = path.join(
          rootPath,
          "public/images/leads",
          file.name
        );

        file.mv(uploadPath, (err) => {
          if (err) {
            console.error("Error moving file:", err);
            return res.status(500).json({ error: "Error uploading file" });
          }
        });

        return file.name; // Return the filename for use in the database
      };

      // Validate and move each image
      if (Array.isArray(req.files["image[]"])) {
        // Validate and move each image
        imageFilenames = req.files["image[]"].map((image) =>
          validateAndMove(image)
        );
      } else {
        // Only one image is coming
        const singleImage = req.files["image[]"];
        imageFilenames.push(validateAndMove(singleImage));
      }
    }
    if (Array.isArray(existinglead.image)) {
      // If existinglead.image is an array of strings
      existinglead.image.forEach((imageName) => {
        imageFilenames.push(imageName.replace(/[\[\]]/g, ""));
      });
    } else {
      if (existinglead.image !== "[]") {
        imageFilenames.push(existinglead.image.replace(/[\[\]]/g, ""));
      }
    }

    const updatedlead = await existinglead.update({
      lead_created_by: lead_created_by,
      total_cycles: total_cycles,
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
      repeat_every_day: repeat_every_day,
      assigned_by: assigned_by,
      tags: tags,
      status: status,
      image: req.files != null ? `[${imageFilenames}]` : existinglead.image,
    });

    if (updatedlead) {
      res.json({ message: "Lead Updated SuccessFully", status: 1 });
    } else {
      res.json({ message: "Lead Updated Failed" });
    }
  } catch (error) {
    console.log(error);
  }
};
const filterData = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      customer_name,
      assigned_by,
      lead_id,
      status_name,
    } = req.body;
    let sql = `SELECT * FROM tbl_leads 
    INNER JOIN users ON tbl_leads.lead_created_by = users.uid
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
      WHERE today_date >= :startDate AND today_date <= :endDate`;

    const replacements = {
      startDate: start_date,
      endDate: end_date,
    };

    if (customer_name > 0) {
      sql += ` AND tbl_leads.customer = :customer_name`;
      replacements.customer_name = customer_name;
    }
    if (status_name > 0) {
      sql += ` AND tbl_leads.status = :status_name`;
      replacements.status_name = status_name;
    }
    if (lead_id > 0) {
      sql += ` AND tbl_leads.lead_id = :Lead_id`;
      replacements.Lead_id = lead_id;
    }
    if (assigned_by > 0) {
      sql += ` AND FIND_IN_SET(${assigned_by}, REPLACE(REPLACE(assigned_by, '[', ''), ']', ''))`;
      replacements.assigned_by = assigned_by;
    }
    sql += ` ORDER BY tbl_leads.createdAt DESC`;
    const data = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      model: Leads,
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
