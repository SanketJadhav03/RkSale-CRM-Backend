const express = require('express')
const router = express.Router();
const roles_controller = require('./roles_controller')

router.get('/roles/list',roles_controller.index);

router.post('/roles/store',roles_controller.store)


module.exports = router;
