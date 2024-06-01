const express = require("express");
const router = express.Router();
const controller = require("./shiftleadtask_controller");

router.post("/transfer/lead", controller.transferLead);

router.post("/shifted/lead", controller.index);

router.post("/slt/details", controller.getDetails);

// router.post("/slt/details/flutter", controller.getDetailsFlutter);



module.exports = router;
