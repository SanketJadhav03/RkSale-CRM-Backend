const express = require('express')
const router = express.Router();
const controller = require('./leads_controller')

router.post('/leads/store',controller.store)

module.exports = router;