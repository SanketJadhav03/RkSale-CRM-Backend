const express = require('express');
const router = express.Router();
const permissionController = require('./permission_controller');

// Create a new permission
router.post('/permissions', permissionController.createPermission);

// Get all permissions
router.get('/permissions', permissionController.getAllPermissions);

// Get a single permission by ID
router.get('/permissions/:id', permissionController.getPermissionById);

// Update a permission by ID
router.put('/permissions/:id', permissionController.updatePermission);

// Delete a permission by ID
router.delete('/permissions/:id', permissionController.deletePermission);

// Store permissions in bulk
router.get("/ps", permissionController.insertStaticPermissions)

module.exports = router;
