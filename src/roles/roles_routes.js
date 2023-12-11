const express = require('express')
const router = express.Router();
const roles_controller = require('./roles_controller')

router.get('/roles/list',roles_controller.store);

router.post('/roles/has/permission',roles_controller.create)


module.exports = router;
