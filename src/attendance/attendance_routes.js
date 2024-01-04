const express = require('express')
const router = express.Router();
const controller = require('./attendance_controller')

router.post('/attendance/intime/store', controller.store)
router.get('/attendance/list', controller.index)
router.get('/attendance/lists', controller.adminindex)
router.post('/attendance/outime/store', controller.store_outime)
router.get('/today/attendance/:id', controller.todayattendance)
router.get('/attendence/user/:id', controller.attendancebyuser)
router.post('/attendence/filter', controller.filterData)
router.get('/attendence/present/:id', controller.getPresentAbsent)
router.get('/attendance/show/:id',controller.show)
module.exports = router;