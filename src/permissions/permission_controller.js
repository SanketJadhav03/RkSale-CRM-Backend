
const Permission = require('./permission_model');
const staticPermissions = [
    { permission_name: 'Dashboard', permission_path: "/dashboard", permission_category: "DASHBOARD" },


    { permission_name: 'Purchase List', permission_path: '/api/purchase/list', permission_category: "PURCHASE" },
    { permission_name: 'Purchase Create', permission_path: '/api/purchase/store', permission_category: "PURCHASE" },
    { permission_name: 'Purchase Show', permission_path: '/api/purchase/show', permission_category: "PURCHASE" },
    { permission_name: 'Purchase Edit', permission_path: '/api/purchase/update', permission_category: "PURCHASE" },

    { permission_name: 'Products List', permission_path: '/api/product-list', permission_category: "PRODUCT" },

    { permission_name: 'Barcode Print', permission_path: '/api/barcode-print-store', permission_category: "BARCODE" },

    { permission_name: 'Customers List', permission_path: '/api/customer/list', permission_category: "CUSTOMER" },
    { permission_name: 'Customers Create', permission_path: '/api/customer/store', permission_category: "CUSTOMER" },
    { permission_name: 'Customers Edit', permission_path: '/api/customer/update', permission_category: "CUSTOMER" },
    { permission_name: 'Customers Delete', permission_path: '/api/customer/delete', permission_category: "CUSTOMER" },

    { permission_name: 'Suppliers List', permission_path: '/api/supplier/list', permission_category: "SUPPLIER" },
    { permission_name: 'Suppliers Create', permission_path: '/api/supplier/store', permission_category: "SUPPLIER" },
    { permission_name: 'Suppliers Edit', permission_path: '/api/supplier/update', permission_category: "SUPPLIER" },
    { permission_name: 'Suppliers Delete', permission_path: '/api/supplier/delete', permission_category: "SUPPLIER" },

    { permission_name: 'Category List', permission_path: '/api/category/list', permission_category: "CATEGORY" },
    { permission_name: 'Category Create', permission_path: '/api/category/store', permission_category: "CATEGORY" },
    { permission_name: 'Category Show', permission_path: '/api/category/show', permission_category: "CATEGORY" },
    { permission_name: 'Category Update', permission_path: '/api/category/update', permission_category: "CATEGORY" },
    { permission_name: 'Category Delete', permission_path: '/api/category/delete', permission_category: "CATEGORY" },

    { permission_name: 'Brands List', permission_path: '/api/brand/list', permission_category: "BRAND" },
    { permission_name: 'Brands Create', permission_path: '/api/brand/store', permission_category: "BRAND" },
    { permission_name: 'Brand', permission_path: '/api/brand/show', permission_category: "BRAND" },
    { permission_name: 'Brand', permission_path: '/api/brand/delete', permission_category: "BRAND" },

    { permission_name: 'Tax', permission_path: '/api/tax-list', permission_category: "TAX" },

    { permission_name: 'Unit', permission_path: '/api/unit-list', permission_category: "UNIT" },

    { permission_name: 'Expenses Type', permission_path: '/api/expenses-list', permission_category: "EXPENSES_TYPE" },

    { permission_name: 'Payment Mode List', permission_path: '/api/payment_mode/list', permission_category: "PAYMENT_MODE" },
    { permission_name: 'Payment Mode Create', permission_path: '/api/payment_mode/store', permission_category: "PAYMENT_MODE" },
    { permission_name: 'Payment Mode Edit', permission_path: '/api/payment_mode/edit', permission_category: "PAYMENT_MODE" },
    { permission_name: 'Payment Mode Delete', permission_path: '/api/payment_mode/delete', permission_category: "PAYMENT_MODE" },

   
    { permission_name: 'Customers Groups List', permission_path: '/api/customer_group/list', permission_category: "CUSTOMER_GROUP" },
    { permission_name: 'Customers Groups Store', permission_path: '/api/customer_group/store', permission_category: "CUSTOMER_GROUP" },
    { permission_name: 'Customers Groups Update', permission_path: '/api/customer_group/update', permission_category: "CUSTOMER_GROUP" },
    { permission_name: 'Customers Groups Show', permission_path: '/api/customer_group/show', permission_category: "CUSTOMER_GROUP" },
    { permissin_name: 'Customers Group Delete', permission_path: "/api/customer_group/delete", permission_category: "CUSTOMER_GROUP" },



    { permission_name: 'Payment List', permission_path: '/api/party_payment/list', permission_category: "PAYMENT" },
    { permission_name: 'Payment Create', permission_path: '/api/party_payment/store', permission_category: "PAYMENT" },
    { permission_name: 'Payment Edit', permission_path: '/api/party_payment/update', permission_category: "PAYMENT" },
    { permission_name: 'Payment Delete', permission_path: '/api/party_payment/delete', permission_category: "PAYMENT" },

    { permission_name: 'Receipt List', permission_path: '/api/receipt/list', permission_category: "RECEIPT" },
    { permission_name: 'Receipt Create', permission_path: '/api/receipt/store', permission_category: "RECEIPT" },
    { permission_name: 'Receipt Edit', permission_path: '/api/receipt/update', permission_category: "RECEIPT" },

];

// Define an async function to insert static permissions
async function insertStaticPermissions(req, res) {
    try {
        // Use the bulkCreate method to insert the static permissions
        await Permission.bulkCreate(staticPermissions);
        console.log('Static permissions inserted successfully.');
        return res.json({ status: "Done" })
    } catch (error) {
        console.error('Error inserting static permissions:', error);
        res.json({ status: "Failed" })
    }
}
// Create a new permission
async function createPermission(req, res) {
    try {
        const { name } = req.body;
        const permission = await Permission.create({ name });
        res.status(201).json(permission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create the permission' });
    }
}

// Get all permissions
async function getAllPermissions(req, res) {
    try {
        const permissions = await Permission.findAll();
        res.status(200).json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

// Get a single permission by ID
async function getPermissionById(req, res) {
    try {
        const permissionId = req.params.id;
        const permission = await Permission.findByPk(permissionId);
        if (permission) {
            res.status(200).json(permission);
        } else {
            res.status(404).json({ error: 'Permission not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to retrieve the permission' });
    }
}

// Update a permission by ID
async function updatePermission(req, res) {
    try {
        const permissionId = req.params.id;
        const { name } = req.body;
        const permission = await Permission.findByPk(permissionId);
        
        if (permission) {
            permission.name = name;
            await permission.save();
            res.status(200).json(permission);
        } else {
            res.status(404).json({ error: 'Permission not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to update the permission' });
    }
}

// Delete a permission by ID
async function deletePermission(req, res) {
    try {
        const permissionId = req.params.id;
        const permission = await Permission.findByPk(permissionId);
        if (permission) {
            await permission.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Permission not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete the permission' });
    }
}

module.exports = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
    insertStaticPermissions
};
