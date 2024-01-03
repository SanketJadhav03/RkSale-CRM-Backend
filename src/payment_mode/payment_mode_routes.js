const express = require('express')
const router = express.Router();

const controller = require('./payment_controller')

router.post('/payment_mode/store', controller.store)
router.get('/payment_mode/list', controller.index)
router.get('/payment_mode/show/:id', controller.show)
router.put('/payment_mode/update', controller.update)
router.delete('/payment_mode/delete/:id', controller.deleted)

module.exports = router;