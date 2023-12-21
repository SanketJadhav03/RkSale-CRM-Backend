const express = require('express');
const router = express.Router();
const roleController = require('./role_controller');

// Create a new role
router.post('/role/store', roleController.createRole);

// Get all roles
router.get('/role/list', roleController.getAllRoles);

// Get a single role by ID
router.get('/role/show/:id', roleController.getRoleById);

// Update a role by ID
router.put('/role/update', roleController.updateRole);

// GET PERMISSIONS LIST BY ROLE ID
router.get("/get/permissions/:role_id", roleController.getPermissionsList)


// Delete a role by ID
router.delete('/role/delete/:id', roleController.deleteRole);
module.exports = router;