const router = require("express").Router();
const controller = require("./employee_controller");

router.post("/employee/store", controller.store);
router.get("/employee/list",controller.index)
router.get('/employee/show/:id',controller.show)
router.delete('/employee/delete/:id',controller.deleted)

module.exports = router;
