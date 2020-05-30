const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");
const productController = require("../../datasources/product");

const Query = {
  users: userController.findAll,
  user: userController.findByName,
  products: productController.findAll,
  product: productController.findOne,
  admins: adminController.findAll,
  admin: adminController.findByName,
};

module.exports = Query;
