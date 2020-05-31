const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");
const mailController = require("../../datasources/mail");

const Mutation = {
  // USER
  addUser: userController.create,
  updateUser: userController.put,
  deleteUser: userController.delete,
  login: userController.login,

  // RATING
  updateRating: userController.updateRating,

  // STATUS (BANNED)
  updateStatus: userController.updateStatus,

  // NOTIFICATION
  sendMail: mailController.sendMail,

  // ADMIN
  addAdmin: adminController.create,
  updateAdmin: adminController.put,
  deleteAdmin: adminController.delete,
  loginAdmin: adminController.login,

  // PRODUCT
};

module.exports = Mutation;
