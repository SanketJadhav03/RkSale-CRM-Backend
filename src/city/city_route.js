const express = require("express")
const router = express.Router();
const cityController = require("./city_controller")
const checkPermissions = require('../Auth/permissionMiddleware')

// get for all cities
router.get("/city/list", cityController.index)


// post to save data  
router.post("/city/store", cityController.store)
router.post("/city/upload", cityController.upload)


// get to city by id
router.get("/city/show/:id", cityController.show)

// put to update data
router.put("/city/update", cityController.updated)

// delete the data 
router.delete("/city/delete/:id", cityController.deleted)


module.exports = router;