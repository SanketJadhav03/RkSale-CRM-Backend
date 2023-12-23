const express = require('express')
const router = express.Router();
const controller = require('./attendance_controller')

router.post('/attendance/store',controller.store)

router.get('/attendance/list',controller.index)

router.get('/today/attendance',controller.todayattendance)

router.get('/attendence/user/:id',controller.attendancebyuser)

module.exports = router;