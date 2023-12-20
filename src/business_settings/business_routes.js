const Business_setting = require('./business_controller')
const express = require('express')
const router = express.Router();

router.post('/business-setting/store',Business_setting.store)

module.exports = router;
