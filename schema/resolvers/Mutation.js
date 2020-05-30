const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");

const Mutation = {

  // USER
  addUser: userController.create,
  updateUser: userController.put,
  deleteUser: userController.delete,
  login: userController.login,
  updateRating: userController.updateRating,

  // ADMIN
  addAdmin: adminController.create,
  updateAdmin: adminController.put,
  deleteAdmin: adminController.delete,
  loginAdmin: adminController.login,

  // PRODUCT

  
};

module.exports = Mutation;
