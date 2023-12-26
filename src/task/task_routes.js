const controller = require('./task_controller')
const express = require('express')
const router =express.Router();

router.post('/task/store',controller.store)

router.get('/task/list',controller.index)

router.get('/task/show/:id',controller.show)

router.put('/task/update',controller.update)


router.post('/task/filter',controller.filterData);


module.exports = router;