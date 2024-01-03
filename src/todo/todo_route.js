const express = require("express")
const router = express.Router();
const todoController = require("./todo_controller")

// get for all todo
// router.get("/todo/list", todoController.index)
router.get("/todo/list/:id", todoController.index)


// post to save data  
router.post("/todo/store", todoController.store)


// get to todo by id
router.get("/todo/show/:id", todoController.show)

// put to update data
router.put("/todo/update", todoController.updated)

// delete the data 
router.put("/todo/delete", todoController.deleted)


module.exports = router;