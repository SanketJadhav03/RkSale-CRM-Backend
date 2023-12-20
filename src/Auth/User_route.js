const express = require("express")
const router = express.Router();
const userController = require("./User_controller")

// get for all cities
router.get("/user/list", userController.index)
// get for all cities
router.post("/user/login", userController.login)



// post to save data  
router.post("/user/store", userController.store)



// put to update data
router.put("/user/update", userController.updated)



module.exports = router;