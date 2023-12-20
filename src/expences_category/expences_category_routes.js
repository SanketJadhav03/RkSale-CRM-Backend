const express = require('express');
const router = express.Router();
const expences_category_controller = require('./expences_category_controller');

router.get('/expences_category/list', expences_category_controller.index)

router.post('/expences_category/store', expences_category_controller.store)

router.get("/expences_category/show/:id", expences_category_controller.show)

router.put("/expences_category/update", expences_category_controller.update)

router.delete("/expences_category/delete/:id", expences_category_controller.deleted)


module.exports = router;