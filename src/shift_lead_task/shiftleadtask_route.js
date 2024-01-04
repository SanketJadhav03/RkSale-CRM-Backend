const express = require("express");
const router = express.Router();
const controller = require("./shiftleadtask_controller");
router.post("/transfer/lead", controller.transferLead);

module.exports = router;
