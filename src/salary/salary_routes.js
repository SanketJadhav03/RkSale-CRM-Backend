const express = require('express')
const router = express.Router();
const controller = require('./salary_controller')


router.post('/salary/store', controller.store)
router.post('/salary/filter', controller.filterTranscation)
router.get('/salary/show/:id', controller.singleview)

router.post('/salary/store', controller.store)


module.exports = router;