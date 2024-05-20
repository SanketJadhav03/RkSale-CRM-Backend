const express = require('express');
const router = express.Router();
const PayController = require('./pay_controller')

router.get('/pay/calculation/:employee_id', PayController.calculationSalary);
router.post('/pay/store', PayController.store);
router.get('/slip/view/:id', PayController.view)

module.exports = router;
