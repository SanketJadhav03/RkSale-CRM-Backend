const express = require("express");
const router = express.Router();
const controller = require("./follow_up_controller");

router.post("/follow_up/lead", controller.addFollowUp);

router.post("/follow_up/list",controller.index);

module.exports = router;
