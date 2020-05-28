const userController = require("../../datasources/user");

const Query = {
  users: userController.findAll,
  user: userController.findByName,
};

module.exports = Query;
