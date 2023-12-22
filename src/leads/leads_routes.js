const express = require('express')
const router = express.Router();
const controller = require('./leads_controller')

router.post('/leads/store',controller.store)

router.get('/leads/list',controller.index)

router.get('/leads/show/:id',controller.show)

router.put('/leads/update/',controller.update)

module.exports = router;