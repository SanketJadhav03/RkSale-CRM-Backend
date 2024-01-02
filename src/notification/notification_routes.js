const express = require('express')
const router =express.Router();
const controller = require('./notification_controller')

router.get('/notification/show/:id',controller.index)
router.get('/notification/single/show/:id',controller.showFullData)
router.get('/notification/status/change/:id',controller.statuschange)
router.get('/notification/readed/:id',controller.showreaded)
router.post('/notification/delete/',controller.deleted)


module.exports = router;