const express = require("express");
const router = express.Router();
const dashboard_controller = require("./dashboard_controller");

router.get("/dashboard/total", dashboard_controller.index);


module.exports = router;
