const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");
const productController = require("../../datasources/product");
const paymentController = require("../../datasources/payment");

const Query = {
  users: userController.findAll,
  user: userController.findByName,
  products: productController.findAll,
  product: productController.findOne,
  ownItems: productController.findOwnItems,
  admins: adminController.findAll,
  admin: adminController.findByName,
  payments: paymentController.findAll,
};

module.exports = Query;
