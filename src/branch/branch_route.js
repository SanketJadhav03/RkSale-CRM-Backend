const express = require("express")
const router = express.Router();
const branchController = require("./branch_controller")

// get for all cities
router.get("/branch/list",branchController.index)


// post to save data  
router.post("/branch/store",branchController.store)


// get to branch by id
router.get("/branch/show/:id",branchController.show)

// put to update data
router.put("/branch/update",branchController.updated)

// delete the data 
router.delete("/branch/delete/:id",branchController.deleted)


module.exports = router;