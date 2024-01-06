const express = require("express");
const router = express.Router();
const controller = require("./follow_up_controller");

router.get("/follow_up/lead", controller.addFollowUp);


module.exports = router;
