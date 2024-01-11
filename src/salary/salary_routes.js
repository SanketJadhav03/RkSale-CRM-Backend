const express = require('express')
const router = express.Router();
const controller = require('./salary_controller')

router.post('/salary/store',controller.store)
router.post('/salary/filter',controller.filterTranscation)

module.exports = router;