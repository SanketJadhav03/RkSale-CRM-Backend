const express = require('express')
const router = express.Router();
const subcategorycontroller = require('./subcategory_controller')

router.post('/subcategory/store',subcategorycontroller.store)

router.get('/subcategory/list',subcategorycontroller.index)

router.get('/subcategory/show/:id',subcategorycontroller.show)

router.put('/subcategory/update',subcategorycontroller.update)

router.delete('/subcategory/delete/:id',subcategorycontroller.deleted)

module.exports = router;