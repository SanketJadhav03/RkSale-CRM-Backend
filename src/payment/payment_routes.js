const express = require('express')
const router = express.Router();
const controller = require('./payment_controller')

router.post('/payment/store',controller.store);
router.get('/payment/list',controller.index);
router.put('/payment/update',controller.update);
router.get('/payment/show/:id',controller.show);


module.exports = router;