const User = require("../src/Auth/User_model");
const Permission = require("../src/permissions/permission_model");
const RoleHasPermission = require("../src/roles/role_has_permission_model");
const bcrypt = require("bcrypt");
const IndustryType = require("../src/Indusrty/Indusrty_model");

const Role = require("../src/roles/role_model");
async function initializeDatabase() {
  const hashedPassword = await bcrypt.hash("super@ajspire.com", 10);
  await User.create({
    name: "Super Admin",
    mobile_no: "9595775123",
    password: hashedPassword,
    email: "super@ajspire.com",
    id: 1,
  });
  await IndustryType.bulkCreate([
    {
      industry_type_name: "Food industry",
      industry_type_id: 1,
    },
    {
      industry_type_name: "Construction",
      industry_type_id: 2,
    },
    {
      industry_type_name: "Transport",
      industry_type_id: 3,
    },
    {
      industry_type_name: "Manufacturing",
      industry_type_id: 4,
    },
    {
      industry_type_name: "Agriculture",
      industry_type_id: 5,
    },
    {
      industry_type_name: "Retail",
      industry_type_id: 6,
    },
    {
      industry_type_name: "Mining",
      industry_type_id: 7,
    },
    {
      industry_type_name: "Energy industry",
      industry_type_id: 8,
    },
    {
      industry_type_name: "Entertainment",
      industry_type_id: 9,
    },
    {
      industry_type_name: "Financial services",
      industry_type_id: 10,
    },

    {
      industry_type_name: "Hospitality industry",
      industry_type_id: 11,
    },
    {
      industry_type_name: "Automotive industry",
      industry_type_id: 12,
    },
    {
      industry_type_name: "Media",
      industry_type_id: 13,
    },
    {
      industry_type_name: "Aerospace",
      industry_type_id: 14,
    },
    {
      industry_type_name: "Business",
      industry_type_id: 15,
    },
    {
      industry_type_name: "Metal",
      industry_type_id: 16,
    },
    {
      industry_type_name: "Engineering",
      industry_type_id: 17,
    },
    {
      industry_type_name: "Pharmaceutical industry",
      industry_type_id: 18,
    },
    {
      industry_type_name: "Clothing industry",
      industry_type_id: 19,
    },
    {
      industry_type_name: "Rail transport",
      industry_type_id: 20,
    },
    {
      industry_type_name: "Software industry",
      industry_type_id: 21,
    },
    {
      industry_type_name: "Chemical industry",
      industry_type_id: 22,
    },
  ]);
  const staticPermissions = [
    {
      permission_name: "dashboard",
      permission_path: "/dashboard",
      permission_category: "DASHBOARD",
    },
    {
      permission_name: "category store",
      permission_path: "/back-end/category/store",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "category update",
      permission_path: "/back-end/category/update",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "category list",
      permission_path: "/back-end/category/list",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "category delete",
      permission_path: "/back-end/category/delete",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "category show",
      permission_path: "/back-end/category/show",
      permission_category: "CATEGORY",
    },
    {
      permission_name: "city store",
      permission_path: "/back-end/city/store",
      permission_category: "CITY",
    },
    {
      permission_name: "city list",
      permission_path: "/back-end/city/list",
      permission_category: "CITY",
    },
    {
      permission_name: "city show",
      permission_path: "/back-end/city/show",
      permission_category: "CITY",
    },
    {
      permission_name: "city update",
      permission_path: "/back-end/city/update",
      permission_category: "CITY",
    },
    {
      permission_name: "city delete",
      permission_path: "/back-end/city/delete",
      permission_category: "CITY",
    },
    {
      permission_name: "source store",
      permission_path: "/back-end/source/store",
      permission_category: "SOURCE",
    },
    {
      permission_name: "source list",
      permission_path: "/back-end/source/list",
      permission_category: "SOURCE",
    },
    {
      permission_name: "source show",
      permission_path: "/back-end/source/show",
      permission_category: "SOURCE",
    },
    {
      permission_name: "source update",
      permission_path: "/back-end/source/update",
      permission_category: "SOURCE",
    },
    {
      permission_name: "source delete",
      permission_path: "/back-end/source/delete",
      permission_category: "SOURCE",
    },
    {
      permission_name: "reference store",
      permission_path: "/back-end/reference/store",
      permission_category: "REFERENCE",
    },
    {
      permission_name: "reference list",
      permission_path: "/back-end/reference/list",
      permission_category: "REFERENCE",
    },
    {
      permission_name: "reference show",
      permission_path: "/back-end/reference/show",
      permission_category: "REFERENCE",
    },
    {
      permission_name: "reference update",
      permission_path: "/back-end/reference/update",
      permission_category: "REFERENCE",
    },
    {
      permission_name: "reference delete",
      permission_path: "/back-end/reference/delete",
      permission_category: "REFERENCE",
    },
    {
      permission_name: "product store",
      permission_path: "/back-end/product/store",
      permission_category: "PRODUCT",
    },
    {
      permission_name: "product list",
      permission_path: "/back-end/product/list",
      permission_category: "PRODUCT",
    },
    {
      permission_name: "product show",
      permission_path: "/back-end/product/show",
      permission_category: "PRODUCT",
    },
    {
      permission_name: "product update",
      permission_path: "/back-end/product/update",
      permission_category: "PRODUCT",
    },
    {
      permission_name: "product delete",
      permission_path: "/back-end/product/delete",
      permission_category: "PRODUCT",
    },
    {
      permission_name: "lead store",
      permission_path: "/back-end/lead/store",
      permission_category: "LEAD",
    },
    {
      permission_name: "lead list",
      permission_path: "/back-end/lead/list",
      permission_category: "LEAD",
    },
    {
      permission_name: "lead show",
      permission_path: "/back-end/lead/show",
      permission_category: "LEAD",
    },
    {
      permission_name: "lead update",
      permission_path: "/back-end/lead/update",
      permission_category: "LEAD",
    },
    {
      permission_name: "lead delete",
      permission_path: "/back-end/lead/delete",
      permission_category: "LEAD",
    },
    {
      permission_name: "expences_category store",
      permission_path: "/back-end/expences_category/store",
      permission_category: "EXPENENCES_CATEGORY",
    },
    {
      permission_name: "expences_category list",
      permission_path: "/back-end/expences_category/list",
      permission_category: "EXPENENCES_CATEGORY",
    },
    {
      permission_name: "expences_category show",
      permission_path: "/back-end/expences_category/show",
      permission_category: "EXPENENCES_CATEGORY",
    },
    {
      permission_name: "expences_category update",
      permission_path: "/back-end/expences_category/update",
      permission_category: "EXPENENCES_CATEGORY",
    },
    {
      permission_name: "expences_category delete",
      permission_path: "/back-end/expences_category/delete",
      permission_category: "EXPENENCES_CATEGORY",
    },
    {
      permission_name: "customer_group store",
      permission_path: "/back-end/customer_group/store",
      permission_category: "CUSTOMER_GROUP",
    },
    {
      permission_name: "customer_group list",
      permission_path: "/back-end/customer_group/list",
      permission_category: "CUSTOMER_GROUP",
    },
    {
      permission_name: "customer_group show",
      permission_path: "/back-end/customer_group/show",
      permission_category: "CUSTOMER_GROUP",
    },
    {
      permission_name: "customer_group update",
      permission_path: "/back-end/customer_group/update",
      permission_category: "CUSTOMER_GROUP",
    },
    {
      permission_name: "customer_group delete",
      permission_path: "/back-end/customer_group/delete",
      permission_category: "CUSTOMER_GROUP",
    },
    {
      permission_name: "related store",
      permission_path: "/back-end/related/store",
      permission_category: "RELATED_TO",
    },
    {
      permission_name: "related list",
      permission_path: "/back-end/related/list",
      permission_category: "RELATED_TO",
    },
    {
      permission_name: "related show",
      permission_path: "/back-end/related/show",
      permission_category: "RELATED_TO",
    },
    {
      permission_name: "related update",
      permission_path: "/back-end/related/update",
      permission_category: "RELATED_TO",
    },
    {
      permission_name: "related delete",
      permission_path: "/back-end/related/delete",
      permission_category: "RELATED_TO",
    },
    {
      permission_name: "tags store",
      permission_path: "/back-end/tags/store",
      permission_category: "TAGS",
    },
    {
      permission_name: "tags list",
      permission_path: "/back-end/tags/list",
      permission_category: "TAGS",
    },
    {
      permission_name: "tags show",
      permission_path: "/back-end/tags/show",
      permission_category: "TAGS",
    },
    {
      permission_name: "tags update",
      permission_path: "/back-end/tags/update",
      permission_category: "TAGS",
    },
    {
      permission_name: "tags delete",
      permission_path: "/back-end/tags/delete",
      permission_category: "TAGS",
    },
    {
      permission_name: "employee store",
      permission_path: "/back-end/employee/store",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "employee list",
      permission_path: "/back-end/employee/list",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "employee show",
      permission_path: "/back-end/employee/show",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "employee update",
      permission_path: "/back-end/employee/update",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "employee delete",
      permission_path: "/back-end/employee/delete",
      permission_category: "EMPLOYEE",
    },
    {
      permission_name: "customer store",
      permission_path: "/back-end/customer/store",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "customer list",
      permission_path: "/back-end/customer/list",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "customer show",
      permission_path: "/back-end/customer/show",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "customer update",
      permission_path: "/back-end/customer/update",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "customer delete",
      permission_path: "/back-end/customer/delete",
      permission_category: "CUSTOMER",
    },
    {
      permission_name: "Roles list",
      permission_path: "/back-end/role/list",
      permission_category: "ROLES_LIST",
    },
    {
      permission_name: "Roles store",
      permission_path: "/back-end/role/store",
      permission_category: "ROLES_LIST",
    },
    {
      permission_name: "Roles update",
      permission_path: "/back-end/role/update",
      permission_category: "ROLES_LIST",
    },
    {
      permission_name: "Roles show",
      permission_path: "/back-end/role/show",
      permission_category: "ROLES_LIST",
    },
    {
      permission_name: "Roles delete",
      permission_path: "/back-end/role/delete",
      permission_category: "ROLES_LIST",
    },
    {
      permission_name: "industry store",
      permission_path: "/back-end/industry/store",
      permission_category: "INDUSTRY_TYPE",
    },
    {
      permission_name: "industry list",
      permission_path: "/back-end/industry/list",
      permission_category: "INDUSTRY_TYPE",
    },
    {
      permission_name: "industry show",
      permission_path: "/back-end/industry/show",
      permission_category: "INDUSTRY_TYPE",
    },
    {
      permission_name: "industry update",
      permission_path: "/back-end/industry/update",
      permission_category: "INDUSTRY_TYPE",
    },
    {
      permission_name: "industry delete",
      permission_path: "/back-end/industry/delete",
      permission_category: "INDUSTRY_TYPE",
    },
  ];

  await Permission.bulkCreate(staticPermissions);
  console.log("Static permissions inserted successfully.");

  await Role.create({ role_name: "Admin" });
  const permissionsLists = await Permission.findAll();
  for (const permission of permissionsLists) {
    await RoleHasPermission.create({
      rhp_role_id: 1,
      rhp_permission_id: permission.permission_id,
    });
  }

  console.log("Initialization successful.");
}

const findindAlready = async () => {
  try {
    if ((await User.count()) == 0) {
      initializeDatabase();
    } else {
      console.error("Unable to create database");
    }
  } catch (error) {
    console.log("Error");
  }
};
module.exports = findindAlready();
