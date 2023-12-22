const controller = require('./task_controller')
const express = require('express')
const router =express.Router();

router.post('/task/store',controller.store)

router.get('/task/list',controller.index)

router.get('/task/show/:id',controller.show)

module.exports = router;