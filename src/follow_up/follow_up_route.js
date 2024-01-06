const express = require("express");
const router = express.Router();
const controller = require("./follow_up_controller");

router.post("/follow_up/lead", controller.addFollowUp);

module.exports = router;
