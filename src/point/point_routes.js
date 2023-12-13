const express = require('express')
const router = express.Router();
const point_controller = require('./point_controller')

router.get("/point/list",point_controller.index);


module.exports = router;