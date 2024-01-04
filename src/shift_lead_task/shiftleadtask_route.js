const express = require("express");
const router = express.Router();
const controller = require("./shiftleadtask_controller");

router.post("/transfer/lead", controller.transferLead);

router.get("/shifted/lead",controller.index);

module.exports = router;
