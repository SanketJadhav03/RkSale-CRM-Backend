const express = require('express')
const router =express.Router();
const controller = require('./notification_controller')

router.get('/notification/show/:id',controller.index)


module.exports = router;