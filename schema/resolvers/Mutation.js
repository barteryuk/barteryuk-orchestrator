const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");

const Mutation = {
  addUser: userController.create,
  updateUser: userController.put,
  deleteUser: userController.delete,
  login: userController.login,

  addAdmin: adminController.create,
  updateAdmin: adminController.put,
  deleteAdmin: adminController.delete,
  loginAdmin: adminController.login,
};

module.exports = Mutation;
