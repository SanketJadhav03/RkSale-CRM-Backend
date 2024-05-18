const express = require('express')
const router = express.Router();

const controller = require('./payment_type_controller')

router.post('/payment_type/store', controller.store)
router.post('/payment_type/upload', controller.upload)
router.get('/payment_type/list', controller.index)
router.get('/payment_type/show/:id', controller.show)
router.put('/payment_type/update', controller.update)
router.delete('/payment_type/delete/:id', controller.deleted)

module.exports = router;