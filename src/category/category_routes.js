const express = require('express');
const router = express.Router();
const category_controller = require('./category_controller');

router.get('/category/list',category_controller.index)

router.post('/category/store',category_controller.store)

router.get("/category/show/:id",category_controller.show)

router.put("/category/update",category_controller.update)

router.delete("/category/delete/:id",category_controller.deleted)


module.exports= router;