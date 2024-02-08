const express = require('express')
const router = express.Router();
const controller = require('./leave_controller')

router.post('/leave/store', controller.store)
router.put('/leave/update', controller.updated)

router.post('/leave/list', controller.index);
router.get('/leave/show/:id', controller.singleview);

router.get('/leave/user/:id', controller.userleave);

// router.get('/leave/list', controller.index)


module.exports = router;