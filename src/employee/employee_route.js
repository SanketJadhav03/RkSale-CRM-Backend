const router = require("express").Router();
const controller = require("./employee_controller");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `public/allimages`);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// GET all employees
// router.get("/employee/list", controller.index);

// POST create a new employee with multiple image upload
router.post(
  "/employee/store",
  // upload.fields([
  //   { name: "employee_aadhar", maxCount: 1 },
  //   { name: "employee_pan", maxCount: 1 },
  //   { name: "employee_profile", maxCount: 1 },
  //   { name: "employee_qr_code", maxCount: 1 },
  // ]),
  controller.store
);

// // GET a specific employee by ID
// router.get("/employee/show/:id", controller.show);

// // PUT update a specific employee by ID with multiple image upload
// router.put(
 
//   controller.updated
// );

// // DELETE delete a specific employee by ID
// router.delete("/employee/delete/:id", controller.deleted);

module.exports = router;
