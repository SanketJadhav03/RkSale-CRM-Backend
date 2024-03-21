const express = require("express")
const router = express.Router();
const userController = require("./User_controller")

// get for all cities
router.get("/user/list", userController.index)
router.get("/user/show/:id", userController.show)
// get for all cities
router.post("/user/login", userController.login)



// post to save data  
router.post("/user/store", userController.store)



// put to update data
router.put("/user/update", userController.updated)
// put to update data
router.get("/user/delete/:id/:status", userController.deleted)
// for updating pass
router.post("/user/update/pass", userController.updatePass)



module.exports = router;