const express = require('express')
const router = express.Router();
const roles_controller = require('./roles_controller')

router.get('/roles/list', roles_controller.index);

router.get('/roles/create', roles_controller.create)
router.post('/roles/store', roles_controller.store)

router.put('/roles/update', roles_controller.update)


module.exports = router;
