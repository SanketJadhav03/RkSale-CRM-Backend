const express = require("express")
const router = express.Router();
const industryController = require("./Indusrty_controller")

// get for all cities
router.get("/industry/list", industryController.index)


// // post to save data  
// router.post("/ciindustryty/store", industryController.store)


// // get to city by id
// router.get("/industry/show/:id", industryController.show)

// // put to update data
// router.put("/industry/update", industryController.updated)

// // delete the data 
// router.delete("/industry/delete/:id", industryController.deleted)


module.exports = router;