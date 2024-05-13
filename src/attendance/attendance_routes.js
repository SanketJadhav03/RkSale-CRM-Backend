const express = require('express')
const router = express.Router();
const controller = require('./attendance_controller')

router.post('/attendance/intime/store', controller.store)
router.post('/attendance/intime/store/flutter',controller.sotreFlutter)
router.get('/attendance/list', controller.index)
router.get('/attendance/lists', controller.adminindex)
router.post('/attendance/outime/store', controller.store_outime)
router.post('/attendance/outime/store/flutter', controller.store_outimeFlutter)
router.get('/today/attendance/:id', controller.todayattendance)
router.get('/attendence/user/:id', controller.attendancebyuser)
router.post('/attendence/filter', controller.filterData)
router.post('/attendence/present/', controller.getPresentAbsent)
router.get('/attendance/show/:id',controller.show)
router.post('/attendance/show/',controller.showFlutter)
module.exports = router;