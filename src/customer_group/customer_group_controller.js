const { Op } = require("sequelize");
const Customer = require("../customer/customer_model");
const CustomerGroup = require("./customer_group_model");
const allCustomerGroups = async (req, res) => {
  try {
    const customerGroup = await CustomerGroup.findAll();
    res.json(customerGroup);
  } catch (error) {
    console.error("Error fetching Customer Groups:", error);
    res.status(500).json({ error: "Error fetching Customer Groups" });
  }
}
// const index = async (req, res) => {
//   try {
//     const page = req.query.page;
//     const limit = req.query.limit;
//     const offset = (page - 1) * limit;
//     const customerGroups = await CustomerGroup.findAll({
//       limit: limit,
//       offset: offset,
//     });
//     res.json(customerGroups);
//   } catch (error) {
//     console.error("Error fetching Customer Groups:", error);
//     res.status(500).json({ error: "Error fetching Customer Groups" });
//   }
// };

const index = async (req, res) => {
  try {
    // Pagination parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log('Page:', page);
    console.log('Limit:', limit);

    // Fetch customer groups with pagination
    const customerGroups = await CustomerGroup.findAll({
      limit: limit,
      offset: offset,
    });

    // Check if customer groups were found
    if (!customerGroups || customerGroups.length === 0) {
      return res.status(404).json({ error: 'No customer groups found' });
    }

    // Log fetched customer groups

    // Return customer groups in the response
    res.json(customerGroups);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching Customer Groups:', error);

    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const store = async (req, res) => {
  try {
    const { customer_group_name } = req.body;
    const existingCustomerGroup = await CustomerGroup.findOne({
      where: {
        customer_group_name: customer_group_name,
      },
    });
    if (existingCustomerGroup) {
      return res.json({ message: "Customer group already exists!", status: 1 });
    }
    await CustomerGroup.create({ customer_group_name });
    return res.json({
      message: "Customer group created successfully!",
      status: 0,
    });
  } catch (error) {
    console.error("Error creating Customer Group:", error);
    res.status(500).json({ error: "Error creating Customer Group" });
  }
};

const show = async (req, res) => {
  try {
    const { id } = req.params;
    const customerGroup = await CustomerGroup.findByPk(id);
    if (!customerGroup) {
      return res.status(404).json({ error: "Customer Group not found" });
    }
    res.json(customerGroup);
  } catch (error) {
    console.error("Error fetching Customer Group:", error);
    res.status(500).json({ error: "Error fetching Customer Group" });
  }
};

const update = async (req, res) => {
  try {
    const { customer_group_name, customer_group_id, isSynced } = req.body;
    const existingCustomerGroup = await CustomerGroup.findOne({
      where: {
        customer_group_name: customer_group_name,
        customer_group_id: { [Op.ne]: customer_group_id },
      },
    });
    if (existingCustomerGroup) {
      return res.json({ message: "Customer group already exists!", status: 1 });
    }
    let updatedIsSynced = isSynced;
    if (isSynced === 2) {
      updatedIsSynced = 3; // Update the variable
    }
    const customerGroup = await CustomerGroup.findByPk(customer_group_id);
    if (!customerGroup) {
      return res.status(404).json({ error: "Customer Group not found" });
    }
    await customerGroup.update({
      customer_group_name,
      isSynced: updatedIsSynced
    });
    return res.json({
      message: "Customer group updated successfully!",
      status: 0,
    });
  } catch (error) {
    console.error("Error updating Customer Group:", error);
    res.status(500).json({ error: "Error updating Customer Group" });
  }
};

const deleted = async (req, res) => {
  try {
    const { id } = req.params;
    const customerGroup = await CustomerGroup.findByPk(id);
    if (!customerGroup) {
      return res.status(404).json({ error: "Customer Group not found" });
    }

    // Assuming Customer has a property called "customer_group_type"
    const customersInGroup = await Customer.findOne({
      where: { customer_group: id },
    });

    if (customersInGroup) {
      return res.json({ message: "This record is in use!", status: 0 });
    }

    await customerGroup.destroy();
    return res.json({
      message: "Customer Group deleted successfully",
      status: 1,
    });
  } catch (error) {
    console.error("Error deleting Customer Group:", error);
    res.status(500).json({ error: "Error deleting Customer Group" });
  }
};

module.exports = {
  index,
  store,
  show,
  update,
  deleted,
  allCustomerGroups,
};
