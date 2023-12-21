const Business_setting = require('./business_controller')
const express = require('express')
const router = express.Router();

router.post('/business-setting/store',Business_setting.store)
router.get('/business-setting/list',Business_setting.index)

module.exports = router;
