const controller = require('./message_controller');
const express = require('express')
const router = express.Router();

router.post('/message/store',controller.store)
router.get('/message/list',controller.list)


module.exports = router;
 
