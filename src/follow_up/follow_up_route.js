const express = require("express");
const router = express.Router();
const controller = require("./follow_up_controller");

router.post("/follow_up/lead", controller.addFollowUp);

router.post("/follow_up/list", controller.index);
router.post("/follow_up", controller.followup);

module.exports = router;
