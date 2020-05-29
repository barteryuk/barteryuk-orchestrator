const userController = require("../../datasources/user");

const Mutation = {
  addUser: userController.create,
  updateUser: userController.put,
  deleteUser: userController.delete,
  login: userController.login,
};

module.exports = Mutation;
