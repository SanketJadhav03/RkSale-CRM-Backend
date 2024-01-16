const controller = require('./message_controller');
const express = require('express')
const router = express.Router();

router.post('/message/store',controller.store)
router.get('/message/list',controller.list)
router.put('/message/update',controller.update)
router.delete('/message/delete/:id',controller.deleted)
router.post('/send-msg',controller.sendmsg)


module.exports = router;
 
