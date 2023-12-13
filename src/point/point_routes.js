const express = require('express')
const router = express.Router();
const point_controller = require('./point_controller')

router.get("/point/list",point_controller.index);

router.post("/point/store",point_controller.store);

router.get("/point/show/:id",point_controller.show);

router.put("/point/update",point_controller.update)

router.delete("/point/delete/:id",point_controller.deleted);


module.exports = router;