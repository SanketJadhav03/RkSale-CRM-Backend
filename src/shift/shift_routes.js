const express = require('express')
const router = express.Router();
const controller = require('./shift_controller')

router.post('/shift/store',controller.store)

router.get('/shift/list',controller.index)

router.get('/shift/show/:id',controller.show)

router.put('/shift/update',controller.update)

router.delete('/shift/delete/:id',controller.deleted)




module.exports = router;