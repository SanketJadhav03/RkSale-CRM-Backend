const express = require('express')
const router = express.Router();

const controller = require('./payment_controller')

router.post('/payment_mode/store',controller.store)
router.post('/payment_mode/list',controller.index)
router.post('/payment_mode/show/:id',controller.show)
router.post('/payment_mode/update',controller.update)
router.post('/payment_mode/delete/:id',controller.deleted)

module.exports = router;