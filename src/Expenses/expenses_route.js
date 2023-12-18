const express = require("express");
const router = express.Router();
const expensesController = require("./expenses_controller");
const multer = require("multer");
const url_helper = require("../../url_helper");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${url_helper}/all_images/expenses`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// get for all cities
router.get("/expenses/list", expensesController.index);

// post to save data
router.post(
  "/expenses/store",
  upload.single("expenses_image"),
  expensesController.store
);

// get to expenses by id
router.get("/expenses/show/:id", expensesController.show);

// put to update data
router.put(
  "/expenses/update",
  upload.single("expenses_image"),
  expensesController.updated
);

// delete the data
router.delete("/expenses/delete/:id", expensesController.deleted);

module.exports = router;
