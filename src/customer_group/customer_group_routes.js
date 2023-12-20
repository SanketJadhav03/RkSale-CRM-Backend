const router = require("express").Router();
const controller = require("./customer_group_controller");

// GET all customer groups
router.get("/all_customer_groups", controller.allCustomerGroups);


// get customer groups
router.get("/customer_group/list", controller.index);

// POST create a new customer group
router.post("/customer_group/store", controller.store);

// GET a specific customer group by ID
router.get("/customer_group/show/:id", controller.show);

// PUT update a specific customer group by ID
router.put("/customer_group/update", controller.update);

// DELETE delete a specific customer group by ID
router.delete("/customer_group/delete/:id", controller.deleted);

module.exports = router;
