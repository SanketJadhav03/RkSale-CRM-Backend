const express = require("express")
const router = express.Router();
const leadController = require("./lead_controller")

// get for all cities
router.get("/lead/list",leadController.index)


// post to save data  
router.post("/lead/store",leadController.store)


// get to lead by id
router.get("/lead/show/:id",leadController.show)

// put to update data
router.put("/lead/update",leadController.updated)

// delete the data 
router.delete("/lead/delete/:id",leadController.deleted)


module.exports = router;