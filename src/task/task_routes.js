const controller = require('./task_controller')
const express = require('express')
const router = express.Router();
router.post("/task/upload", controller.upload)
router.post('/task/store', controller.store)

router.get('/task/list', controller.index)

router.get('/task/show/:id', controller.show)

router.post('/task/show/flutter', controller.showFlutter)

router.put('/task/update', controller.update)


router.post('/task/filter', controller.filterData);

router.post('/task/flutter/filter', controller.flutterFilter)


module.exports = router;