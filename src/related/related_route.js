const express = require("express")
const router = express.Router();
const relatedController = require("./related_controller")

// get for all related
router.get("/related/list", relatedController.index)


// post to save data  
router.post("/related/store", relatedController.store)


// get to related by id
router.get("/related/show/:id", relatedController.show)

// put to update data
router.put("/related/update", relatedController.updated)

// delete the data 
router.delete("/related/delete/:id", relatedController.deleted)


module.exports = router;