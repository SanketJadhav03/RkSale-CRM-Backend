const express = require('express')
const router = express.Router();
const controller = require('./leave_controller')

router.post('/leave/store', controller.store)

router.get('/leave/list', controller.index)


module.exports = router;