// # in working don't push
const express = require("express")
const router = express.Router();
const employeeController = require("./employee_controller")

// get for all cities
router.get("/employee/list",employeeController.index)


// post to save data  
router.post("/employee/store",employeeController.store)


// get to employee by id
router.get("/employee/show/:id",employeeController.show)

// put to update data
router.put("/employee/update",employeeController.updated)

// delete the data 
router.delete("/employee/delete/:id",employeeController.deleted)


module.exports = router;