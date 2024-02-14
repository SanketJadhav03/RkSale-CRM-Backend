const express = require('express');
const router = express.Router();
const PayController = require('./pay_controller')

router.get('/pay/list', PayController.index);
router.post('/pay/store', PayController.store);


module.exports = router;
