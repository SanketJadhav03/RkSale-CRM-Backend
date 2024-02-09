const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const FollowUp = require("./follow_up_model");
const path = require("path");
const index = async (req, res) => {
  try {
    const { leadOrTask, follow_up_send_by } = req.body;
    let query = ``;
    if (leadOrTask == 0) {
      query += `
      SELECT tbl_follow_ups.createdAt as created_date,tbl_leads.*,tbl_lead_statuses.*,tbl_sources.*,tbl_follow_ups.*,tbl_customers.*,tbl_cities.*,tbl_customer_groups.*,tbl_references.*,tbl_products.*
    FROM tbl_follow_ups
      INNER JOIN tbl_leads ON tbl_follow_ups.follow_up_lead_id = tbl_leads.lead_id 
      INNER JOIN tbl_customers ON tbl_leads.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_customer_groups ON tbl_customers.customer_group = tbl_customer_groups.customer_group_id
      INNER JOIN tbl_products ON tbl_leads.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_leads.ref_by = tbl_references.reference_id
      INNER JOIN tbl_sources ON tbl_leads.source = tbl_sources.source_id
      INNER JOIN tbl_lead_statuses ON tbl_leads.status = tbl_lead_statuses.lead_status_id
      WHERE tbl_follow_ups.follow_up_lead_id= ${follow_up_send_by};`;
    } else {
      query += `
      SELECT tbl_follow_ups.createdAt as created_date,tbl_tasks.*,tbl_follow_ups.*,tbl_customers.*,tbl_products.*,tbl_references.*,tbl_lead_statuses.*,tbl_sources.*
    FROM tbl_follow_ups
      INNER JOIN tbl_tasks ON tbl_follow_ups.follow_up_task_id = tbl_tasks.task_id 
      INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
      INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
      INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
      INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
      WHERE tbl_follow_ups.follow_up_task_id= ${follow_up_send_by};`;
    }
    const data = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      model: FollowUp, // Specify the model for Sequelize to map the result to
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Get follow up data" });
  }
};
const addFollowUp = async (req, res) => {
  try {
    const {
      follow_up_description,
      follow_up_lead_id,
      follow_up_send_by,
      follow_up_task_id,
    } = req.body;

    let followUpImageFilename = "";

    // Check if file is uploaded
    if (req.files && req.files.follow_up_image) {
      const rootPath = process.cwd();

      const file = req.files.follow_up_image;

      const validateAndMove = (file) => {
        if (!file) {
          console.log("File is null");
          return null;
        }

        if (!file.name) {
          throw new Error("Invalid file object");
        }

        return new Promise((resolve, reject) => {
          const uploadPath = path.join(
            rootPath,
            "public/images/follow-ups",
            file.name
          );
          file.mv(uploadPath, (err) => {
            if (err) {
              console.error("Error moving file:", err);
              reject(err);
            }
            resolve(file.name);
          });
        });
      };

      // Validate and move the image
      followUpImageFilename = await validateAndMove(file);
    }

    // Create the follow-up entry
    const insertData = await FollowUp.create({
      follow_up_description,
      follow_up_lead_id,
      follow_up_send_by,
      follow_up_task_id,
      follow_up_image: followUpImageFilename,
    });

    if (insertData) {
      return res.json({ message: "Follow Up added Successfully!", status: 1 });
    } else {
      return res.json({ message: "Something went wrong!", status: 0 });
    }
  } catch (error) {
    console.log("Error creating follow up:", error);
    return res.status(500).json({ error: "Error creating followup" });
  }
};

module.exports = {
  addFollowUp,
  index,
};
