const { Op } = require("sequelize");
const Customer = require("../customer/customer_model");
const CustomerGroup = require("./customer_group_model");
const allCustomerGroups = async(req, res) => {
  try {
    const customerGroup = await CustomerGroup.findAll();
    res.json(customerGroup);
  } catch (error) {
    console.error("Error fetching Customer Groups:", error);
    res.status(500).json({ error: "Error fetching Customer Groups" });
  }
}
const index = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const offset = (page - 1) * limit;
    const customerGroups = await CustomerGroup.findAll({
      limit: limit,
      offset: offset,
    });
    res.json(customerGroups);
  } catch (error) {
    console.error("Error fetching Customer Groups:", error);
    res.status(500).json({ error: "Error fetching Customer Groups" });
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
      isSynced:updatedIsSynced 
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
      where: { customer_group_type: id },
    });

    if (customersInGroup) {
      return res.json({ message: "This record is in use!", status: 1 });
    }

    await customerGroup.destroy();
    return res.json({
      message: "Customer Group deleted successfully",
      status: 0,
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
