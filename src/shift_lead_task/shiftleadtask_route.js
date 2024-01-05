const express = require("express");
const router = express.Router();
const controller = require("./shiftleadtask_controller");

router.post("/transfer/lead", controller.transferLead);

router.post("/shifted/lead",controller.index);

module.exports = router;
