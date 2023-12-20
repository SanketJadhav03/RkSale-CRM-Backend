const express = require("express")
const router = express.Router();
const tagsController = require("./tags_controller")

// get for all tags
router.get("/tags/list", tagsController.index)


// post to save data  
router.post("/tags/store", tagsController.store)


// get to tags by id
router.get("/tags/show/:id", tagsController.show)

// put to update data
router.put("/tags/update", tagsController.updated)

// delete the data 
router.delete("/tags/delete/:id", tagsController.deleted)


module.exports = router;