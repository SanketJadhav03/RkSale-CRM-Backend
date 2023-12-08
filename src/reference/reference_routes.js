const express = require('express')
const router = express.Router();
const referece_controller = require('./reference_controller');

router.get('/reference/list',referece_controller.index)

router.post('/reference/store',referece_controller.store)

router.get("/reference/show/:id",referece_controller.show)

router.put("/reference/update",referece_controller.update)

router.delete("/reference/delete/:id",referece_controller.deleted)

module.exports = router;