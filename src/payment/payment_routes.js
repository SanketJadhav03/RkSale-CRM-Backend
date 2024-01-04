const express = require('express')
const router = express.Router();
const controller = require('./payment_controller')

router.post('/payment/store',controller.store);

module.exports = router;