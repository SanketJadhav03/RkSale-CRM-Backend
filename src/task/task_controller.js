const { QueryTypes } = require("sequelize");
const sequelize = require("../db/db_config");
const Task = require("./task_model");
const fs = require("fs");
const path = require("path");
const Notifaction = require("../notification/notification_model");
const Customer = require("../customer/customer_model");
const Product = require("../product/product_model");
const xlsx = require('xlsx');
const upload = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No file uploaded', status: 0 });
    }

    const file = req.files.file;

    // Use xlsx to read the Excel or CSV file
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetNameList = workbook.SheetNames;
    // return res.status(201).json(workbook);
    const taskData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], { raw: true });
    // return res.status(201).json(taskData);
    // Prepare an array of city objects
    const tasks = taskData.map(row => ({
      task_id: row.task_id,
      task_created_by: row.task_created_by,
      customer: row.customer,
      product: row.product,
      value: row.value,

      today_date: new Date(),
      minimum_due_date: new Date(),
      ref_by: row.ref_by,
      image: row.image,
      maximum_due_date: new Date(),
      source: row.source,
      priority: row.priority,
      description: row.description,
      assigned_by: row.assigned_by,
      tags: row.tags,
      repeat_every_day: row.repeat_every_day,
      status: row.status,
      task_status: row.task_status,
      createdAt: new Date(),
      updatedAt: new Date(),
      // return res.status(201).json(taskData);
    }));
    // return res.status(201).json(tasks);

    // Use Sequelize bulk insert
    const results = await Task.bulkCreate(tasks, {
      updateOnDuplicate: ['task_created_by', 'customer', 'product', 'value', 'today_date', 'minimum_due_date', 'ref_by',
        'image', 'maximum_due_date', 'source', 'priority', 'description', 'assigned_by', 'tags', 'repeat_every_day', 'status', 'task_status']
    });

    return res.status(201).json({ message: `${results.length} Task added or updated successfully`, status: 1 });
    // return res.json({ message: "task added successfully!", status: 1 });
  } catch (error) {
    console.error('Error adding Task:', error);
    res.status(500).json({ message: 'Error adding Task', status: 0 });
  }
}
const store = async (req, res) => {
  try {
    const {
      task_created_by,
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
      total_cycles,
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
          "public/images/task",
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
    const newtask = await Task.create({
      task_created_by: task_created_by,
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
      total_cycles: total_cycles,
      status: status,
      image: `[${imageFilenames}]`,
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
          assigned_data_id: newtask.task_id,
          notification_description: `Task Assigned Of ${productdata.product_name},${customerData.customer_name}`,
          notification_type: 3,
        });
      })
    );
    req.app.io.emit('fetchNotifications');

    return res.json({ message: "Task added successfully!", status: 1 });
  } catch (error) {
    console.log(error);
  }
};

const Flutterstore = async (req, res) => {
  try {

    const {
      task_created_by,
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
      tags,
      repeat_every_day,
      total_cycles,
      status,
    } = req.body;

      let {assigned_by} = req.body

    let imageFilenames = [];

    if (req.files && req.files.img !== null) {
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
          "public/images/task",
          "CRM"+file.name
    
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
    if (Array.isArray(assigned_by) || typeof assigned_by === 'object') {
      // If it's an array or object, concatenate it with an empty array to create a new array with the original string value as its only element
      assigned_by = [assigned_by + ''];
  }
  
  
    const assignedByArray = JSON.parse(assigned_by);
    const assignedByArray2 = Array.isArray(assigned_by) ? assigned_by.map(Number) : [parseInt(assigned_by)];

    // Convert the array to a JSON string
    const assignedByJsonString = JSON.stringify(assignedByArray2);

    const tagsByArray = Array.isArray(tags) ? tags.map(Number) : [parseInt(tags)];

    // Convert the array to a JSON string
    const tagsByJsonString = JSON.stringify(tagsByArray);

    const newtask = await Task.create({
      task_created_by: task_created_by,
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
      assigned_by:assignedByJsonString,
      tags: tagsByJsonString,
      repeat_every_day: repeat_every_day,
      total_cycles: total_cycles,
      status: status,
      image: `[${imageFilenames}]`,
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
      Array.isArray(assignedByArray)
        ? assignedByArray.map(async (assignedUserId) => {
            await Notifaction.create({
              user_id: assignedUserId,
              assigned_data_id: newtask.task_id,
              notification_description: `Task Assigned Of ${productdata.product_name},${customerData.customer_name}`,
              notification_type: 3,
            });
          })
        : [assignedByArray].map(async (assignedUserId) => {
            await Notifaction.create({
              user_id: assignedUserId,
              assigned_data_id: newtask.task_id,
              notification_description: `Task Assigned Of ${productdata.product_name},${customerData.customer_name}`,
              notification_type: 3,
            });
          })
    );
    
    req.app.io.emit('fetchNotifications');

    return res.status(200).json({ message: "Task added successfully!", status: 1 });
  } catch (error) {
    console.log(error);
  }
};
const index = async (req, res) => {
  try {
    const data = await sequelize.query(
      `SELECT * FROM tbl_tasks 
        INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
        INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
        INNER JOIN users ON tbl_tasks.task_created_by = users.uid
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
        INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
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

const showFlutter = async (req, res) => {
  try {
    const { id } = req.body;
    const data = await sequelize.query(
      `SELECT * FROM tbl_tasks 
        INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
        INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
        INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
        INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
        INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
        WHERE tbl_tasks.task_id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT, // Specify the model for Sequelize to map the result to
      }
    );

    // Check if data is not empty
    if (data.length > 0) {
      res.json(data[0]); // Return the first (and only) object directly
    } else {
      res.json({}); // Return an empty object if no data found
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed To Show By Id" });
  }
};


const update = async (req, res) => {
  try {
    const {
      task_id,
      task_created_by,
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
      total_cycles,
      status,
    } = req.body;
    const existingtask = await Task.findByPk(task_id);
    if (!existingtask) {
      return res.status(404).json({ message: "Task Not Found" });
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

        const uploadPath = path.join(rootPath, "public/images/task", file.name);

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
    if (Array.isArray(existingtask.image)) {
      // If existingtask.image is an array of strings
      existingtask.image.forEach((imageName) => {
        imageFilenames.push(imageName.replace(/[\[\]]/g, ""));
      });
    } else {
      if (existingtask.image !== "[]") {
        imageFilenames.push(existingtask.image.replace(/[\[\]]/g, ""));
      }
    }

    const updatedtask = await existingtask.update({
      task_created_by: task_created_by,
      customer: customer,
      product: product,
      value: value,
      today_date: today_date,
      minimum_due_date: minimum_due_date,
      ref_by: ref_by,
      maximum_due_date: maximum_due_date,
      source: source,
      priority: priority,
      repeat_every_day: repeat_every_day,
      total_cycles: total_cycles,
      description: description,
      assigned_by: assigned_by,
      tags: tags,
      status: status,
      image: req.files != null ? `[${imageFilenames}]` : existingtask.image,
    });

    if (updatedtask) {
      return res.json({ message: "Task updated successfully!", status: 1 });
    } else {
      res.json({ message: "Task Updated Failed", status: 0 });
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
      task_id,
      status_name,
    } = req.body;
    let sql = `SELECT * 
    FROM tbl_tasks 
    INNER JOIN users ON tbl_tasks.task_created_by = users.uid
    INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
    INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
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
    if (status_name > 0) {
      sql += ` AND tbl_tasks.status = :status_name`;
      replacements.status_name = status_name;
    }
    if (assigned_by > 0) {
      sql += ` AND FIND_IN_SET(${assigned_by}, REPLACE(REPLACE(assigned_by, '[', ''), ']', ''))`;
      replacements.assigned_by = assigned_by;
    }
    if (task_id > 0) {
      sql += ` AND tbl_tasks.task_id = :Task_id`;
      replacements.Task_id = task_id;
    }
    sql += ` ORDER BY tbl_tasks.createdAt DESC`;
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
const flutterFilter = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      customer_name,
      assigned_by,
      task_id,
      status_name,
    } = req.body;
 

    let sql = `
      SELECT * 
      FROM tbl_tasks 
      INNER JOIN users ON tbl_tasks.task_created_by = users.uid
      INNER JOIN tbl_customers ON tbl_tasks.customer = tbl_customers.customer_id
      INNER JOIN tbl_cities ON tbl_customers.customer_city = tbl_cities.city_id
      INNER JOIN tbl_products ON tbl_tasks.product = tbl_products.product_id
      INNER JOIN tbl_references ON tbl_tasks.ref_by = tbl_references.reference_id
      INNER JOIN tbl_lead_statuses ON tbl_tasks.status = tbl_lead_statuses.lead_status_id
      INNER JOIN tbl_sources ON tbl_tasks.source = tbl_sources.source_id
      WHERE tbl_tasks.task_status = 1
    `;

    if (assigned_by)
      {
        sql += ` AND FIND_IN_SET(:assigned_by, REPLACE(REPLACE(assigned_by, '[', ''), ']', ''))`;
        replacements.assigned_by = assigned_by;

      }
    const replacements = {
    };

    if (customer_name) {
      sql += ` AND tbl_tasks.customer = :customer_name`;
      replacements.customer_name = customer_name;
    }
    if (status_name) {
      sql += ` AND tbl_tasks.status = :status_name`;
      replacements.status_name = status_name;
    }
    if (start_date && end_date) {
      sql += ` AND DATE(tbl_tasks.today_date) >= :start_date AND DATE(tbl_tasks.today_date) <= :end_date`;
      replacements.start_date = start_date;
      replacements.end_date = end_date;
    }
    if (task_id) {
      sql += ` AND tbl_tasks.task_id = :task_id`;
      replacements.task_id = task_id;
    }

    sql += ` ORDER BY tbl_tasks.createdAt DESC`;

    const data = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      model: Task,
    });

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};

module.exports = {
  upload,
  store,
  index,
  show,
  update,
  filterData,
  flutterFilter,
  showFlutter,
  Flutterstore
};
