const express = require('express')
const router = express.Router();
const customer_controller = require('./customer_controller');
const checkPermissions = require('../Auth/permissionMiddleware');


router.get('/customer/list',checkPermissions,customer_controller.index)

router.post('/customer/store',customer_controller.store)

router.get("/customer/show/:id",customer_controller.show)

router.put("/customer/update",customer_controller.update)

router.delete("/customer/delete/:id",customer_controller.deleted)

module.exports = router;