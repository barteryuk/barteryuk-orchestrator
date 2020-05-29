const userController = require("../../datasources/user");
const adminController = require("../../datasources/admin");

const Query = {
  users: userController.findAll,
  user: userController.findByName,

  admins: adminController.findAll,
  admin: adminController.findByName,
};

module.exports = Query;
