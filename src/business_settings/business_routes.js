const Business_setting = require('./business_controller')
const express = require('express')
const router = express.Router();

router.post('/business-setting/store', Business_setting.store)
router.get('/business-setting/list', Business_setting.index)
router.get('/business-setting/show/:id', Business_setting.show)

router.put('/business-setting/update', Business_setting.update)
router.delete("/business-setting/delete/:id", Business_setting.deleted)
module.exports = router;
