const express = require('express')
const router = express.Router();
const product_controller = require('./product_controller')

router.get('/product/list' ,product_controller.index)

router.post('/product/store',product_controller.store)

router.get("/product/show/:id",product_controller.show)

router.put("/product/update",product_controller.update)

router.delete("/product/delete/:id",product_controller.deleted)


module.exports = router;