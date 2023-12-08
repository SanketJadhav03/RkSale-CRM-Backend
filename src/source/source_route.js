const express = require("express")
const router = express.Router();
const sourceController = require("./source_controller")

// get for all cities
router.get("/source/list",sourceController.index)


// post to save data  
router.post("/source/store",sourceController.store)


// get to source by id
router.get("/source/show/:id",sourceController.show)

// put to update data
router.put("/source/update",sourceController.updated)

// delete the data 
router.delete("/source/delete/:id",sourceController.deleted)


module.exports = router;